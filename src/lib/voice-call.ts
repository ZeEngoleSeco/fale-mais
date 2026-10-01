import { supabase } from "@/integrations/supabase/client";
import { getStoredUser, DEFAULT_INITIAL_USER, type UserProfile } from "@/lib/user-store";

export interface VoicePeer {
  id: string;
  name: string;
  initials: string;
  isMuted: boolean;
  isSpeaking: boolean;
  volume: number; // 0 to 100
}

type VoiceStateCallback = (peers: VoicePeer[], isMyMicActive: boolean, myVolume: number) => void;

const ICE_SERVERS: RTCConfiguration = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
    { urls: "stun:stun3.l.google.com:19302" },
    { urls: "stun:stun4.l.google.com:19302" },
  ],
};

class VoiceCallManager {
  private roomId: string | null = null;
  private currentUser: UserProfile = DEFAULT_INITIAL_USER;
  private channel: any = null;

  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private analyser: AnalyserNode | null = null;
  private animFrameId: number | null = null;

  private isMyMicActive = false;
  private isMuted = true;
  private myVolume = 0;
  private isSpeaking = false;

  private peers: Map<string, VoicePeer> = new Map();
  private peerConnections: Map<string, RTCPeerConnection> = new Map();
  private audioElements: Map<string, HTMLAudioElement> = new Map();
  private listeners: Set<VoiceStateCallback> = new Set();

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
    this.leaveRoomVoice(); // Clean previous connection

    this.roomId = roomId;

    // Get currentUser identity
    if (user) {
      this.currentUser = user;
    } else {
      const stored = getStoredUser();
      const { data: authData } = await supabase.auth.getUser();
      if (authData?.user) {
        this.currentUser = {
          ...stored,
          id: authData.user.id,
          name: stored?.name || authData.user.user_metadata?.name || "Usuário",
          initials: stored?.initials || "U",
        } as UserProfile;
      } else if (stored) {
        this.currentUser = stored;
      }
    }

    try {
      // Connect to Supabase Realtime Broadcast channel
      this.channel = supabase.channel(`voice_room:${roomId}`, {
        config: {
          broadcast: { self: false },
        },
      });

      this.channel
        .on("broadcast", { event: "PEER_JOIN" }, ({ payload }: any) => this.handlePeerJoin(payload))
        .on("broadcast", { event: "PEER_STATUS" }, ({ payload }: any) => this.handlePeerStatus(payload))
        .on("broadcast", { event: "WEBRTC_OFFER" }, ({ payload }: any) => this.handleWebRTCOffer(payload))
        .on("broadcast", { event: "WEBRTC_ANSWER" }, ({ payload }: any) => this.handleWebRTCAnswer(payload))
        .on("broadcast", { event: "WEBRTC_ICE" }, ({ payload }: any) => this.handleWebRTCIce(payload))
        .on("broadcast", { event: "PEER_LEAVE" }, ({ payload }: any) => this.handlePeerLeave(payload))
        .subscribe((status: string) => {
          if (status === "SUBSCRIBED") {
            // Broadcast JOIN to all existing users in the room
            this.broadcastMessage("PEER_JOIN", {
              id: this.currentUser.id,
              name: this.currentUser.name,
              initials: this.currentUser.initials,
              isMuted: this.isMuted,
              isSpeaking: false,
              volume: 0,
            });
          }
        });

      return true;
    } catch (e) {
      console.error("Failed to connect voice channel:", e);
      return false;
    }
  }

  public async toggleMicrophone(): Promise<boolean> {
    if (this.isMyMicActive && !this.isMuted) {
      this.muteMicrophone();
      return false;
    } else {
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

      this.mediaStream.getAudioTracks().forEach((t) => (t.enabled = true));
      this.isMyMicActive = true;
      this.isMuted = false;

      // Add track to all existing RTCPeerConnections
      const audioTrack = this.mediaStream.getAudioTracks()[0];
      if (audioTrack) {
        this.peerConnections.forEach((pc) => {
          const senders = pc.getSenders();
          const audioSender = senders.find((s) => s.track?.kind === "audio");
          if (audioSender) {
            audioSender.replaceTrack(audioTrack);
          } else {
            pc.addTrack(audioTrack, this.mediaStream!);
          }
        });
      }

      // AudioContext Analyser
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

      this.startVolumeMonitoring();
      this.broadcastStatus();
      this.notify();
      return true;
    } catch (err) {
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

    this.broadcastStatus();
    this.notify();
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

      if (wasSpeaking !== this.isSpeaking || volume % 15 === 0) {
        this.broadcastStatus();
      }

      this.notify();
      this.animFrameId = requestAnimationFrame(checkVolume);
    };

    checkVolume();
  }

  private broadcastStatus() {
    this.broadcastMessage("PEER_STATUS", {
      id: this.currentUser.id,
      name: this.currentUser.name,
      initials: this.currentUser.initials,
      isMuted: this.isMuted,
      isSpeaking: this.isSpeaking,
      volume: this.myVolume,
    });
  }

  private broadcastMessage(event: string, payload: any) {
    if (this.channel) {
      this.channel.send({
        type: "broadcast",
        event,
        payload,
      }).catch((e: any) => console.warn("Channel broadcast error:", e));
    }
  }

  private async handlePeerJoin(peer: any) {
    if (!peer || !peer.id || peer.id === this.currentUser.id) return;

    this.peers.set(peer.id, {
      id: peer.id,
      name: peer.name || "Participante",
      initials: peer.initials || "P",
      isMuted: peer.isMuted ?? true,
      isSpeaking: peer.isSpeaking ?? false,
      volume: peer.volume ?? 0,
    });

    // Respond with our status so the newly joined peer knows we are here
    this.broadcastStatus();

    // Create WebRTC connection as initiator if our ID is lexicographically greater
    if (this.currentUser.id > peer.id) {
      await this.initiateWebRTCConnection(peer.id);
    }
    this.notify();
  }

  private handlePeerStatus(peer: any) {
    if (!peer || !peer.id || peer.id === this.currentUser.id) return;

    const existing = this.peers.get(peer.id) || {
      id: peer.id,
      name: peer.name || "Participante",
      initials: peer.initials || "P",
      isMuted: true,
      isSpeaking: false,
      volume: 0,
    };

    existing.isMuted = peer.isMuted;
    existing.isSpeaking = peer.isSpeaking;
    existing.volume = peer.volume;
    this.peers.set(peer.id, existing);
    this.notify();
  }

  private async initiateWebRTCConnection(targetId: string) {
    const pc = this.createRTCPeerConnection(targetId);
    try {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      this.broadcastMessage("WEBRTC_OFFER", {
        targetId,
        senderId: this.currentUser.id,
        sdp: offer,
      });
    } catch (e) {
      console.error("Error creating WebRTC offer:", e);
    }
  }

  private createRTCPeerConnection(peerId: string): RTCPeerConnection {
    if (this.peerConnections.has(peerId)) {
      this.peerConnections.get(peerId)?.close();
    }

    const pc = new RTCPeerConnection(ICE_SERVERS);
    this.peerConnections.set(peerId, pc);

    // Add local tracks if mic is active
    if (this.mediaStream) {
      this.mediaStream.getAudioTracks().forEach((track) => {
        pc.addTrack(track, this.mediaStream!);
      });
    }

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        this.broadcastMessage("WEBRTC_ICE", {
          targetId: peerId,
          senderId: this.currentUser.id,
          candidate: event.candidate,
        });
      }
    };

    pc.ontrack = (event) => {
      const remoteStream = event.streams[0] || new MediaStream([event.track]);
      this.attachRemoteAudioStream(peerId, remoteStream);
    };

    return pc;
  }

  private async handleWebRTCOffer(payload: any) {
    if (payload.targetId !== this.currentUser.id) return;
    const senderId = payload.senderId;
    if (!senderId) return;

    const pc = this.createRTCPeerConnection(senderId);
    try {
      await pc.setRemoteDescription(new RTCSessionDescription(payload.sdp));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      this.broadcastMessage("WEBRTC_ANSWER", {
        targetId: senderId,
        senderId: this.currentUser.id,
        sdp: answer,
      });
    } catch (e) {
      console.error("Error handling WebRTC offer:", e);
    }
  }

  private async handleWebRTCAnswer(payload: any) {
    if (payload.targetId !== this.currentUser.id) return;
    const pc = this.peerConnections.get(payload.senderId);
    if (pc) {
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(payload.sdp));
      } catch (e) {
        console.error("Error setting remote description from answer:", e);
      }
    }
  }

  private async handleWebRTCIce(payload: any) {
    if (payload.targetId !== this.currentUser.id) return;
    const pc = this.peerConnections.get(payload.senderId);
    if (pc && payload.candidate) {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(payload.candidate));
      } catch (e) {
        console.error("Error adding ICE candidate:", e);
      }
    }
  }

  private handlePeerLeave(payload: any) {
    const peerId = typeof payload === "string" ? payload : payload?.id;
    if (!peerId) return;

    this.peers.delete(peerId);

    const pc = this.peerConnections.get(peerId);
    if (pc) {
      pc.close();
      this.peerConnections.delete(peerId);
    }

    const audioEl = this.audioElements.get(peerId);
    if (audioEl) {
      audioEl.pause();
      audioEl.srcObject = null;
      audioEl.remove();
      this.audioElements.delete(peerId);
    }

    this.notify();
  }

  private attachRemoteAudioStream(peerId: string, stream: MediaStream) {
    let audioEl = this.audioElements.get(peerId);
    if (!audioEl) {
      audioEl = document.createElement("audio");
      audioEl.autoplay = true;
      audioEl.style.display = "none";
      document.body.appendChild(audioEl);
      this.audioElements.set(peerId, audioEl);
    }
    audioEl.srcObject = stream;
    audioEl.play().catch(() => {});
  }

  public leaveRoomVoice() {
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
    this.muteMicrophone();

    if (this.channel) {
      this.broadcastMessage("PEER_LEAVE", { id: this.currentUser.id });
      supabase.removeChannel(this.channel);
      this.channel = null;
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((t) => t.stop());
      this.mediaStream = null;
    }
    if (this.audioContext) {
      this.audioContext.close().catch(() => {});
      this.audioContext = null;
    }

    this.peerConnections.forEach((pc) => pc.close());
    this.peerConnections.clear();

    this.audioElements.forEach((el) => {
      el.pause();
      el.srcObject = null;
      el.remove();
    });
    this.audioElements.clear();

    this.peers.clear();
    this.isMyMicActive = false;
    this.isMuted = true;
    this.myVolume = 0;
    this.isSpeaking = false;
    this.roomId = null;
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
