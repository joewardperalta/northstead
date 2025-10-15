import nodemailer from "nodemailer";

export const mailer = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  secure: false, // 465 => true
  auth: {
    user: process.env.SMTP_USER!, // e.g. info@yourdomain.com
    pass: process.env.SMTP_PASS!, // Gmail App Password (no spaces/quotes)
  },
});
