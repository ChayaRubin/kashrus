import nodemailer from 'nodemailer';
import 'dotenv/config';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendEmail = async ({ from, to, subject, html }) => {
  try {
    await transporter.sendMail({ from, to, subject, html });
  } catch (error) {
    console.error('error in sending email', error);
    throw error;
  }
};
