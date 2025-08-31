// server/src/services/contactService.js
import { sendEmail } from "../utils/email.js";

export async function handleContact({ name, email, subject, message }) {
  const to = process.env.COMPANY_EMAIL || process.env.EMAIL_USER;
  const finalSubject = subject || `New message from ${name}`;
  const text = `
From: ${name} <${email}>
Message:
${message}
  `;

  await sendEmail({
    to,
    subject: finalSubject,
    text,
  });
}
