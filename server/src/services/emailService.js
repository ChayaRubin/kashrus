import { sendEmail as sendEmailViaUtility } from '../utils/email.js';

export const sendEmail = async ({ from, to, subject, html, attachments, reply_to }) => {
  await sendEmailViaUtility({ from, to, subject, html, attachments, reply_to });
  console.log('✅ Email sent:', subject);
};
