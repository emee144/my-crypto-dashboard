import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,       // your email from .env
    pass: process.env.EMAIL_PASSWORD,   // your password from .env
  },
});
export { transporter };