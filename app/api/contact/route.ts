import { NextRequest, NextResponse } from "next/server";
import { mailer } from "@/lib/mail";

export const runtime = "nodejs"; // required for Nodemailer on server

export async function POST(req: NextRequest) {
  const data = await req.json(); // directly parse JSON
  const { firstName, lastName, email, phone, subject, message } = data;

  const html = `
    <h2>${subject}</h2>
    <p><strong>Name:</strong> ${firstName} ${lastName}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    <p><strong>Message:</strong></p>
    <p style="white-space:pre-wrap;">${message}</p>
  `;

  try {
    await mailer.sendMail({
      from: process.env.MAIL_FROM ?? `no-reply@northsteadimmigration.com`,
      to: process.env.MAIL_TO,
      subject: subject,
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
