// // server/src/services/contactService.js
// import { sendEmail } from "../utils/email.js";

// export async function handleContact({ name, email, subject, message }) {
//   // const to = process.env.CONTACT_TO_EMAIL || process.env.EMAIL_REPLY_TO || process.env.COMPANY_EMAIL || process.env.RESEND_FROM_EMAIL;
//   const finalSubject = subject || `New message from ${name}`;
//   const text = `
// From: ${name} <${email}>
// Message:
// ${message}
//   `;
//       console.console.log('name', name);
//       console.console.log('email', email);
//       console.console.log('subject', subject);
//       console.console.log('message', message);

//   await sendEmail ({
//   from,
//   to,
//   subject,
//   text,
//   html,
//   replyTo
// }) => {
//   try {
//     const response = await resend.emails.send({
//       from,
//       to,
//       subject,
//       text,
//       html,
//       replyTo,
//     });

//     console.log("Email sent:", response);
//     return response;

//   } catch (error) {
//     console.error("Error sending email via Resend:", error);
//     throw error;
//   }
// };
// }
// server/src/services/contactService.js
import { sendEmail } from "../utils/email.js";

export async function handleContact({ name, email, subject, message }) {
  const finalSubject = subject || `New message from ${name}`;

  const text = `
From: ${name} <${email}>

Message:
${message}
  `;

  console.log("name:", name);
  console.log("email:", email);
  console.log("subject:", finalSubject);
  console.log("message:", message);

  await sendEmail({
    from: process.env.EMAIL_FROM || "onboarding@resend.dev",
    to: process.env.CONTACT_TO_EMAIL,   // better than hardcoding gmail
    subject: finalSubject,
    text,
    reply_to: email,                   // ✅ correct key
  });
}