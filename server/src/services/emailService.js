import { sendEmail as sendEmailViaUtility } from '../utils/email.js';

export const sendEmail = async ({ from, to, subject, html, attachments }) => {
  await sendEmailViaUtility({ from, to, subject, html, attachments });
  console.log('✅ Email sent:', subject);
};
