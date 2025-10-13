import nodemailer from "nodemailer";

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  MAIL_FROM,
} = process.env;

export const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT || 587),
  secure: false,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

/**
 * @param {Object} params
 * @param {string} params.to 
 * @param {string} params.link 
 * @returns {Promise<Object>} 
 */
export async function sendVerificationEmail({ to, link }) {
  const info = await transporter.sendMail({
    from: MAIL_FROM || '"APIs && Coffee" <no-reply@api-coffee.dev>',
    to,
    subject: "Verifica tu email",
    html: `
      <p>Hola! Verifica tu email de API's && Coffee:</p>
      <p><a href="${link}" target="_blank" rel="noopener">Verificar cuenta</a></p>
      <p>Si no solictaste verificación de cuenta, puedes ignorar este mensaje.</p>
    `,
  });

  console.log("📧 Email sent:", info.messageId);
  console.log("🔗 Preview URL:", nodemailer.getTestMessageUrl(info));

  return info;
}
