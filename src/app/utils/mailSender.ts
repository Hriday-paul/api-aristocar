import nodemailer from 'nodemailer';
import config from '../config';

export const sendEmail = async (to: string, subject: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com.',
    port: process.env.EMAIL_ENV === 'production' ? 465 : 587,
    secure: process.env.EMAIL_ENV === 'production',
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: config.nodemailer_host_email,
      pass: config.nodemailer_host_pass,
    },
  });

  await transporter.sendMail({
    from: 'nurmdopu428@gmail.com', // sender address
    to, // list of receivers
    subject,
    text: '', // plain text body
    html, // html body
  });
};
