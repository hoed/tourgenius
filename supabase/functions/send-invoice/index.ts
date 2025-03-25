
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

interface EmailRequest {
  to: string;
  name: string;
  subject: string;
  htmlContent: string;
  pdfAttachment?: string; // Base64 encoded PDF
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    const { to, name, subject, htmlContent, pdfAttachment } = await req.json() as EmailRequest;

    // Configure SMTP client
    const client = new SmtpClient();
    await client.connectTLS({
      hostname: "mail.rumahost.com",
      port: 465,
      username: "hudhoed@rumahost.com",
      password: "hudhoed280980",
    });

    // Prepare attachments if needed
    const attachments = [];
    if (pdfAttachment) {
      attachments.push({
        filename: `invoice-${name.replace(/\s+/g, '-')}.pdf`,
        content: pdfAttachment,
        encoding: "base64",
      });
    }

    // Send email
    const result = await client.send({
      from: "hudhoed@rumahost.com",
      to: to,
      subject: subject,
      html: htmlContent,
      attachments,
    });

    await client.close();

    console.log("Email sent successfully:", result);
    return new Response(JSON.stringify({ success: true, message: "Email sent successfully" }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to send email:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
