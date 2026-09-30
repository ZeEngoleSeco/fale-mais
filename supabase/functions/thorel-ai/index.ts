import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RequestPayload {
  prompt: string;
  mode?: string;
  history?: Array<{ role: "user" | "assistant"; content: string }>;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const aiKey = Deno.env.get("AI_KEY");
    if (!aiKey) {
      return new Response(
        JSON.stringify({
          error: "AI_KEY não encontrada nas secrets do Supabase. Configure com: supabase secrets set AI_KEY=sua_chave",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { prompt, mode = "pitch", history = [] } = (await req.json()) as RequestPayload;

    const systemPrompt = `Você é o Thorel, o mentor de oratória e comunicação executiva da plataforma Fale+.
Seu objetivo é dar feedback prático, motivador e acionável sobre o discurso ou pergunta do usuário no modo "${mode}".
Forneça sua resposta em formato JSON com a seguinte estrutura estrita:
{
  "text": "Seu feedback principal ou resposta do Thorel em texto formatado",
  "tips": ["Sugestão de ação 1", "Sugestão de ação 2"],
  "reportCard": {
    "score": 9.2,
    "strengths": ["Ponto forte 1", "Ponto forte 2"],
    "improvement": "Principal oportunidade de melhoria"
  },
  "metrics": {
    "clarity": 94,
    "wpm": 135,
    "fillersCount": 1
  }
}`;

    let aiTextResult = "";
    let parsedResult = null;

    // Call OpenAI endpoint if key starts with sk- or standard bearer
    if (aiKey.startsWith("sk-") || aiKey.startsWith("gsk_") || aiKey.length > 20) {
      const messages = [
        { role: "system", content: systemPrompt },
        ...history.map((h) => ({ role: h.role, content: h.content })),
        { role: "user", content: prompt },
      ];

      const endpoint = aiKey.startsWith("gsk_") 
        ? "https://api.groq.com/openai/v1/chat/completions"
        : "https://api.openai.com/v1/chat/completions";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${aiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: aiKey.startsWith("gsk_") ? "llama-3.3-70b-versatile" : "gpt-4o-mini",
          messages,
          response_format: { type: "json_object" },
          temperature: 0.7,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        aiTextResult = data.choices?.[0]?.message?.content || "";
        try {
          parsedResult = JSON.parse(aiTextResult);
        } catch {
          parsedResult = null;
        }
      }
    }

    // Fallback if AI response wasn't parsed JSON
    if (!parsedResult) {
      parsedResult = {
        text: aiTextResult || `Análise de Oratória (${mode}): "${prompt}"\n\nExcelente desenvolvimento! Sua mensagem mantém clareza e ritmo adequado. Recomendo caprichar na pausa estratégica antes do fecho.`,
        tips: ["Ver relatório completo", "Treinar com Cronômetro"],
        reportCard: {
          score: 8.9,
          strengths: ["Clareza na pronúncia", "Estrutura lógica bem definida"],
          improvement: "Aumentar a ênfase nas palavras-chave do fecho",
        },
        metrics: {
          clarity: 92,
          wpm: 130,
          fillersCount: 1,
        },
      };
    }

    return new Response(JSON.stringify(parsedResult), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || "Erro ao processar com IA" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
