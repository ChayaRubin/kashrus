import nodemailer from 'nodemailer';
import 'dotenv/config';

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // VERY important
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // MUST be app password
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

export const sendEmail = async ({ from, to, subject, html, attachments }) => {
  try {
    const mailOptions = {
      from,
      to,
      subject,
      html
    };

    // Add attachments if provided
    if (attachments && attachments.length > 0) {
      mailOptions.attachments = attachments;
    }

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('error in sending email', error);
    throw error;
  }
};
