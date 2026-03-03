import { Resend } from 'resend';
import 'dotenv/config';

const resendApiKey = process.env.RESEND_API_KEY;

if (!resendApiKey) {
  console.error('RESEND_API_KEY is not set. Emails will fail to send.');
}

const resend = new Resend(resendApiKey);

export const sendEmail = async ({ from, to, subject, html, attachments }) => {
  try {
    const emailPayload = {
      from,
      to,
      subject,
      html,
    };

    // Add attachments if provided (Resend supports filename/content/path/contentType/cid)
    if (attachments && attachments.length > 0) {
      emailPayload.attachments = attachments;
    }

    const result = await resend.emails.send(emailPayload);

    if (result?.error) {
      console.error('Error sending email via Resend:', result.error);
      throw new Error(result.error.message || 'Failed to send email via Resend');
    }

    return result;
  } catch (error) {
    console.error('error in sending email', error);
    throw error;
  }
};
