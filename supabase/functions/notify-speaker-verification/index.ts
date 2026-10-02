import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RequestPayload {
  recipients: string[];
  applicant: {
    fullName: string;
    email: string;
    area: string;
    experience: string;
    professionalExp?: string;
    socialLinks?: string;
    previousEvents?: string;
    additionalInfo?: string;
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const gmailUser = Deno.env.get("GMAIL_USER");
    const gmailAppPassword = Deno.env.get("GMAIL_APP_PASSWORD");

    if (!gmailUser || !gmailAppPassword) {
      console.error("Credenciais do Gmail ausentes. Configure: GMAIL_USER e GMAIL_APP_PASSWORD");
      return new Response(
        JSON.stringify({
          error:
            "Credenciais do Gmail não configuradas. Configure com: npx supabase secrets set GMAIL_USER=\"email@gmail.com\" GMAIL_APP_PASSWORD=\"sua_senha_de_app\"",
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json() as RequestPayload;
    const { recipients, applicant } = body;

    if (!recipients || recipients.length === 0) {
      return new Response(
        JSON.stringify({ error: "Nenhum destinatário especificado." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const subject = `[Fale+] Nova Solicitação de Palestrante: ${applicant.fullName}`;

    const htmlContent = `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#f8fafc;border-radius:12px;border:1px solid #e2e8f0;color:#1e293b;">
        <div style="background:linear-gradient(135deg,#7c3aed,#4f46e5,#2563eb);padding:20px;border-radius:8px;text-align:center;margin-bottom:24px;">
          <h1 style="color:#fff;margin:0;font-size:22px;font-weight:800;">Fale+ | Verificação de Palestrante</h1>
          <p style="color:#e0e7ff;margin:6px 0 0 0;font-size:14px;">Nova solicitação pendente para análise da equipe de desenvolvimento</p>
        </div>
        <div style="background:#fff;padding:20px;border-radius:8px;margin-bottom:16px;box-shadow:0 1px 3px rgba(0,0,0,.05);">
          <h2 style="font-size:16px;margin-top:0;margin-bottom:12px;color:#4338ca;border-bottom:1px solid #f1f5f9;padding-bottom:8px;">Dados do Solicitante</h2>
          <p style="margin:6px 0;"><strong>Nome:</strong> ${applicant.fullName}</p>
          <p style="margin:6px 0;"><strong>E-mail:</strong> ${applicant.email}</p>
          <p style="margin:6px 0;"><strong>Área / Tema:</strong> ${applicant.area}</p>
        </div>
        <div style="background:#fff;padding:20px;border-radius:8px;box-shadow:0 1px 3px rgba(0,0,0,.05);">
          <h2 style="font-size:16px;margin-top:0;margin-bottom:12px;color:#4338ca;border-bottom:1px solid #f1f5f9;padding-bottom:8px;">Detalhes da Trajetória</h2>
          <p style="font-weight:bold;margin:8px 0 4px;">Descrição da experiência:</p>
          <div style="background:#f8fafc;padding:10px 14px;border-radius:6px;font-size:14px;line-height:1.5;color:#475569;margin-bottom:12px;">${applicant.experience.replace(/\n/g, "<br/>")}</div>
          ${applicant.professionalExp ? `<p style="font-weight:bold;margin:8px 0 4px;">Experiência profissional:</p><div style="background:#f8fafc;padding:10px 14px;border-radius:6px;font-size:14px;line-height:1.5;color:#475569;margin-bottom:12px;">${applicant.professionalExp.replace(/\n/g, "<br/>")}</div>` : ""}
          ${applicant.socialLinks ? `<p style="font-weight:bold;margin:8px 0 4px;">Links de redes sociais:</p><div style="background:#f8fafc;padding:10px 14px;border-radius:6px;font-size:14px;line-height:1.5;color:#475569;margin-bottom:12px;">${applicant.socialLinks.replace(/\n/g, "<br/>")}</div>` : ""}
          ${applicant.previousEvents ? `<p style="font-weight:bold;margin:8px 0 4px;">Palestras / eventos anteriores:</p><div style="background:#f8fafc;padding:10px 14px;border-radius:6px;font-size:14px;line-height:1.5;color:#475569;margin-bottom:12px;">${applicant.previousEvents.replace(/\n/g, "<br/>")}</div>` : ""}
          ${applicant.additionalInfo ? `<p style="font-weight:bold;margin:8px 0 4px;">Informações adicionais:</p><div style="background:#f8fafc;padding:10px 14px;border-radius:6px;font-size:14px;line-height:1.5;color:#475569;margin-bottom:12px;">${applicant.additionalInfo.replace(/\n/g, "<br/>")}</div>` : ""}
        </div>
        <div style="text-align:center;font-size:12px;color:#94a3b8;margin-top:24px;">
          Mensagem automática gerada pelo sistema Fale+.<br/>
          Você recebeu este e-mail por possuir a patente de Desenvolvedor na plataforma.
        </div>
      </div>`;

    const client = new SmtpClient();
    await client.connectTLS({
      hostname: "smtp.gmail.com",
      port: 465,
      username: gmailUser,
      password: gmailAppPassword,
    });

    for (const to of recipients) {
      await client.send({
        from: `Fale+ Notificações <${gmailUser}>`,
        to,
        subject,
        content: "Você precisa de um cliente de e-mail que suporte HTML para visualizar esta mensagem.",
        html: htmlContent,
      });
      console.log(`Email enviado para: ${to}`);
    }

    await client.close();

    return new Response(
      JSON.stringify({ success: true, sent_to: recipients }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Erro ao enviar email:", error?.message ?? error);
    return new Response(
      JSON.stringify({ error: error?.message ?? "Erro interno ao enviar e-mail via Gmail" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
