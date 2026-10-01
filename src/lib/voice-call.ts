// Voice Call Manager using WebAudio API + BroadcastChannel for real-time audio sync
import { getStoredUser, CURRENT_USER, type UserProfile } from "@/lib/user-store";

export interface VoicePeer {
  id: string;
  name: string;
  initials: string;
  isMuted: boolean;
  isSpeaking: boolean;
  volume: number; // 0 to 100
}

type VoiceStateCallback = (peers: VoicePeer[], isMyMicActive: boolean, myVolume: number) => void;

class VoiceCallManager {
  private roomId: string | null = null;
  private currentUser: UserProfile = CURRENT_USER;
  private channel: BroadcastChannel | null = null;
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private analyser: AnalyserNode | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private animFrameId: number | null = null;

  private isMyMicActive = false;
  private isMuted = true;
  private myVolume = 0;
  private isSpeaking = false;

  private peers: Map<string, VoicePeer> = new Map();
  private listeners: Set<VoiceStateCallback> = new Set();
  private audioElements: Map<string, HTMLAudioElement> = new Map();

  public subscribe(cb: VoiceStateCallback): () => void {
    this.listeners.add(cb);
    this.notify();
    return () => this.listeners.delete(cb);
  }

  private notify() {
    const peerList = Array.from(this.peers.values());
    this.listeners.forEach((cb) => cb(peerList, this.isMyMicActive && !this.isMuted, this.myVolume));
  }

  public async joinRoomVoice(roomId: string, user?: UserProfile): Promise<boolean> {
    this.leaveRoomVoice(); // Clean previous if any

    this.roomId = roomId;
    this.currentUser = user || getStoredUser() || CURRENT_USER;

    // Set up BroadcastChannel
    try {
      this.channel = new BroadcastChannel(`fale_mais_voice_${roomId}`);
      this.channel.onmessage = (evt) => this.handleChannelMessage(evt.data);

      // Broadcast JOIN
      this.broadcastMessage({
        type: "PEER_JOIN",
        user: {
          id: this.currentUser.id,
          name: this.currentUser.name,
          initials: this.currentUser.initials,
          isMuted: true,
          isSpeaking: false,
          volume: 0,
        },
      });
    } catch (e) {
      console.warn("BroadcastChannel not supported or error:", e);
    }

    return true;
  }

  public async toggleMicrophone(): Promise<boolean> {
    if (this.isMyMicActive && !this.isMuted) {
      // Mute microphone
      this.muteMicrophone();
      return false;
    } else {
      // Unmute or start microphone
      return await this.unmuteMicrophone();
    }
  }

  public async unmuteMicrophone(): Promise<boolean> {
    try {
      if (!this.mediaStream) {
        this.mediaStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });
      }

      // Enable tracks
      this.mediaStream.getAudioTracks().forEach((t) => (t.enabled = true));
      this.isMyMicActive = true;
      this.isMuted = false;

      // Setup WebAudio Analyser for real-time voice volume detection
      if (!this.audioContext) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        this.audioContext = new AudioCtx();
      }
      if (this.audioContext.state === "suspended") {
        await this.audioContext.resume();
      }

      const source = this.audioContext.createMediaStreamSource(this.mediaStream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 128;
      source.connect(this.analyser);

      // Setup Audio Recorder to stream voice chunks across tabs/peers
      this.setupAudioStreaming();

      // Start Volume Analyzer loop
      this.startVolumeMonitoring();

      // Broadcast status
      this.broadcastStatus();
      this.notify();
      return true;
    } catch (err: any) {
      console.error("Microphone access error:", err);
      this.isMyMicActive = false;
      this.isMuted = true;
      this.notify();
      return false;
    }
  }

  public muteMicrophone() {
    this.isMuted = true;
    this.myVolume = 0;
    this.isSpeaking = false;

    if (this.mediaStream) {
      this.mediaStream.getAudioTracks().forEach((t) => (t.enabled = false));
    }
    if (this.mediaRecorder && this.mediaRecorder.state !== "inactive") {
      try {
        this.mediaRecorder.stop();
      } catch (e) {}
    }

    this.broadcastStatus();
    this.notify();
  }

  private setupAudioStreaming() {
    if (!this.mediaStream || typeof MediaRecorder === "undefined") return;

    try {
      // Stream audio chunks every 300ms to open channels
      const recorderOptions = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? { mimeType: "audio/webm;codecs=opus" }
        : {};

      this.mediaRecorder = new MediaRecorder(this.mediaStream, recorderOptions);
      this.mediaRecorder.ondataavailable = async (e) => {
        if (e.data.size > 0 && !this.isMuted && this.isSpeaking) {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64Audio = reader.result as string;
            this.broadcastMessage({
              type: "AUDIO_CHUNK",
              userId: this.currentUser.id,
              audioData: base64Audio,
            });
          };
          reader.readAsDataURL(e.data);
        }
      };
      this.mediaRecorder.start(300);
    } catch (e) {
      console.warn("MediaRecorder setup error:", e);
    }
  }

  private startVolumeMonitoring() {
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);

    const dataArray = new Uint8Array(this.analyser ? this.analyser.frequencyBinCount : 0);

    const checkVolume = () => {
      if (!this.isMyMicActive || this.isMuted || !this.analyser) {
        this.myVolume = 0;
        this.isSpeaking = false;
        return;
      }

      this.analyser.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      const average = sum / dataArray.length;
      const volume = Math.min(100, Math.round((average / 128) * 100));

      const wasSpeaking = this.isSpeaking;
      this.myVolume = volume;
      this.isSpeaking = volume > 12;

      if (wasSpeaking !== this.isSpeaking || volume % 10 === 0) {
        this.broadcastStatus();
      }

      this.notify();
      this.animFrameId = requestAnimationFrame(checkVolume);
    };

    checkVolume();
  }

  private broadcastStatus() {
    this.broadcastMessage({
      type: "VOICE_STATUS",
      userId: this.currentUser.id,
      name: this.currentUser.name,
      initials: this.currentUser.initials,
      isMuted: this.isMuted,
      isSpeaking: this.isSpeaking,
      volume: this.myVolume,
    });
  }

  private broadcastMessage(data: any) {
    if (this.channel) {
      try {
        this.channel.postMessage(data);
      } catch (e) {
        console.warn("BroadcastChannel send error:", e);
      }
    }
  }

  private handleChannelMessage(msg: any) {
    if (!msg || !msg.type) return;

    if (msg.type === "PEER_JOIN") {
      const peer = msg.user;
      if (peer && peer.id !== this.currentUser.id) {
        this.peers.set(peer.id, peer);
        // Reply with our status
        this.broadcastStatus();
      }
    } else if (msg.type === "VOICE_STATUS") {
      if (msg.userId !== this.currentUser.id) {
        const existing = this.peers.get(msg.userId) || {
          id: msg.userId,
          name: msg.name || "Participante",
          initials: msg.initials || "P",
          isMuted: true,
          isSpeaking: false,
          volume: 0,
        };
        existing.isMuted = msg.isMuted;
        existing.isSpeaking = msg.isSpeaking;
        existing.volume = msg.volume;
        this.peers.set(msg.userId, existing);
      }
    } else if (msg.type === "PEER_LEAVE") {
      this.peers.delete(msg.userId);
    } else if (msg.type === "AUDIO_CHUNK") {
      if (msg.userId !== this.currentUser.id && msg.audioData) {
        this.playIncomingAudio(msg.userId, msg.audioData);
      }
    }
    this.notify();
  }

  private playIncomingAudio(userId: string, base64Audio: string) {
    try {
      let audioEl = this.audioElements.get(userId);
      if (!audioEl) {
        audioEl = new Audio();
        audioEl.autoplay = true;
        this.audioElements.set(userId, audioEl);
      }
      audioEl.src = base64Audio;
      audioEl.play().catch(() => {});
    } catch (e) {}
  }

  public leaveRoomVoice() {
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
    this.muteMicrophone();

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((t) => t.stop());
      this.mediaStream = null;
    }
    if (this.audioContext) {
      this.audioContext.close().catch(() => {});
      this.audioContext = null;
    }

    if (this.channel) {
      this.broadcastMessage({ type: "PEER_LEAVE", userId: this.currentUser.id });
      this.channel.close();
      this.channel = null;
    }

    this.audioElements.forEach((el) => {
      el.pause();
      el.src = "";
    });
    this.audioElements.clear();
    this.peers.clear();
    this.isMyMicActive = false;
    this.isMuted = true;
    this.myVolume = 0;
    this.isSpeaking = false;
    this.notify();
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getIsSpeaking(): boolean {
    return this.isSpeaking;
  }

  public getMyVolume(): number {
    return this.myVolume;
  }

  public getPeers(): VoicePeer[] {
    return Array.from(this.peers.values());
  }
}

export const voiceCallManager = new VoiceCallManager();
