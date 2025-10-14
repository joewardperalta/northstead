import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs"; // required for Nodemailer on server

export async function POST(req: NextRequest) {
  const data = await req.json(); // directly parse JSON
  const { firstname, lastname, email, phone, message } = data;

  // Send email (Nodemailer via SMTP)
  // Ensure these are set in .env.local
  // SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_TO, MAIL_FROM
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST!,
    port: Number(process.env.SMTP_PORT ?? 465),
    secure: true,
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASS!,
    },
  });

  const html = `
    <h2>New Contact Submission</h2>
    <p><strong>Name:</strong> ${firstname} ${lastname}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    <p><strong>Message:</strong></p>
    <pre style="white-space:pre-wrap;">${message}</pre>
  `;

  try {
    await transporter.sendMail({
      from: process.env.MAIL_FROM ?? `no-reply@northsteadimmigration.com`,
      to: process.env.MAIL_TO,
      subject: `Contact Form: ${firstname} ${lastname}`,
      replyTo: email,
      html,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Mailer error:", err);
    return NextResponse.json(
      { error: "Failed to send. Please try again later." },
      { status: 500 }
    );
  }
}
