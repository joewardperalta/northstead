import { NextRequest, NextResponse } from "next/server";
import { mailer } from "@/lib/mail";

export const runtime = "nodejs"; // required for Nodemailer on server

export async function POST(req: NextRequest) {
  const data = await req.json(); // directly parse JSON
  const { firstname, lastname, email, phone, message } = data;

  const html = `
    <h2>New Contact Submission</h2>
    <p><strong>Name:</strong> ${firstname} ${lastname}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    <p><strong>Message:</strong></p>
    <pre style="white-space:pre-wrap;">${message}</pre>
  `;

  try {
    await mailer.sendMail({
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
