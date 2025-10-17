import { NextResponse } from "next/server";
import Stripe from "stripe";
import { mailer } from "@/lib/mail";
import { dbConnect } from "@/lib/mongoose";
import { Booking } from "@/models/Booking";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

function normalizeDate(d: string | Date) {
  const dt = new Date(d);
  dt.setHours(0, 0, 0, 0);
  return dt;
}

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  if (!sig)
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  const rawBody = await req.text();
  let event: Stripe.Event;

  try {
    event = await stripe.webhooks.constructEventAsync(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Invalid Stripe signature:", err.message);
    } else {
      console.error("Invalid Stripe signature:", err);
    }
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Handle successful checkout
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // Retrieve full session details
    const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ["payment_intent", "customer", "line_items.data.price.product"],
    });

    const m = fullSession.metadata ?? {};
    console.log("📦 Stripe Metadata Received:", m);

    try {
      if (fullSession.payment_status === "paid") {
        await dbConnect();

        // Handle flexible keys from metadata
        const whenDate = m.whenDate || m.date || new Date().toISOString();
        const whenTime = m.whenTime || m.time || m.timeSlot || null;

        // Build the document
        const bookingDoc = {
          date: normalizeDate(whenDate),
          timeSlot: whenTime,
          name: `${m.firstName || m.firstName || ""} ${
            m.lastname || m.lastName || ""
          }`.trim(),
          email: m.email || fullSession.customer_details?.email || "",
          phone: m.phone || "",
          notes: m.notes || "",
          service: m.service || "",
          status: "booked",
          stripeSessionId: fullSession.id,
          paymentStatus: "paid",
        };

        console.log("📝 Booking document to save:", bookingDoc);

        // Save to DB (idempotent)
        const upsertRes = await Booking.updateOne(
          { stripeSessionId: fullSession.id },
          { $setOnInsert: bookingDoc },
          { upsert: true }
        );

        console.log("✅ Booking upsert result:", upsertRes);

        // Fix for older records where timeSlot was null
        if (!upsertRes.upsertedId && whenTime) {
          const patchRes = await Booking.updateOne(
            { stripeSessionId: fullSession.id, timeSlot: null },
            { $set: { timeSlot: whenTime } }
          );
          console.log("🔧 Patched existing booking with timeSlot:", patchRes);
        }
      }
    } catch (saveErr) {
      console.error("❌ Booking save failed:", saveErr);
      // Don’t throw, acknowledge webhook
    }

    // Send notifications (same as before)
    try {
      const amount =
        typeof fullSession.amount_total === "number"
          ? (fullSession.amount_total / 100).toFixed(2)
          : "0.00";
      const currency = (fullSession.currency || "usd").toUpperCase();
      const receiptEmail =
        fullSession.customer_details?.email ??
        (typeof fullSession.customer === "object" && fullSession.customer
          ? (fullSession.customer as Stripe.Customer).email ?? undefined
          : undefined);

      const toBusiness = {
        from: process.env.MAIL_FROM,
        to: process.env.MAIL_TO,
        subject: `New consultation booking`,
        html: `
        <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8f9fb; padding: 30px;">
          <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
            
            <!-- Header -->
            <div style="background-color: #1b365d; padding: 16px 24px;">
              <h2 style="color: #ffffff; margin: 0;">New Paid Booking</h2>
            </div>

            <!-- Content -->
            <div style="padding: 24px;">
              <table style="width: 100%; border-collapse: collapse; font-size: 15px; color: #333;">
                <tr>
                  <td style="padding: 8px 0; width: 150px; font-weight: 600;">Service</td>
                  <td>Consultation</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: 600;">Date / Time</td>
                  <td>${m.whenDate ?? "-"} ${m.whenTime ?? ""}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: 600;">Name</td>
                  <td>${m.firstName ?? "-"} ${m.lastName ?? "-"}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: 600;">Email</td>
                  <td>${m.email ?? receiptEmail ?? "-"}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: 600;">Phone</td>
                  <td>${m.phone ?? "-"}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: 600;">Notes</td>
                  <td>${
                    (m.notes ?? "").toString().replace(/\n/g, "<br/>") || "-"
                  }</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: 600;">Amount</td>
                  <td><strong>${amount} ${currency}</strong></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: 600;">Session ID</td>
                  <td style="word-break: break-all;">${fullSession.id}</td>
                </tr>
              </table>

              <!-- Divider -->
              <hr style="margin: 24px 0; border: none; border-top: 1px solid #e0e0e0;" />

              <p style="color: #555; font-size: 14px;">
                A new client booking has been received via your website.
                <br/>Please verify the payment in your Stripe dashboard.
              </p>

              <a href="https://dashboard.stripe.com/test/payments" 
                style="display:inline-block; padding:10px 18px; margin-top:8px; background-color:#1b365d; color:#ffffff; text-decoration:none; border-radius:6px;">
                View in Stripe
              </a>
            </div>

            <!-- Footer -->
            <div style="background-color:#f3f4f6; padding:16px 24px; text-align:center; font-size:12px; color:#777;">
              NORTHSTEAD IMMIG INC | Booking Notification<br/>
              <span style="font-size:11px;">This is an automated message — please do not reply.</span>
            </div>

          </div>
        </div>`,
      };

      const toCustomer = {
        from: process.env.MAIL_FROM,
        to: m.email,
        subject: "Your booking is confirmed",
        html: `
        <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f5f7fa; padding: 30px;">
          <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); overflow: hidden;">
            <div style="background-color: #1b365d; padding: 20px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 22px;">Your Booking is Confirmed</h1>
            </div>
            <div style="padding: 30px;">
              <p style="font-size: 16px; color: #333; margin: 0 0 16px;">
                Hi <strong>${m.firstName + " " + m.lastName}</strong>,
              </p>
              <p style="font-size: 15px; color: #555; line-height: 1.6;">
                We’re excited to let you know that your booking has been successfully received and your payment of
                <strong>${amount} ${currency}</strong> has been confirmed.
              </p>
              <table style="width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 15px;">
                <tr><td style="padding:8px 0; font-weight:600; color:#333;">Service:</td><td style="padding:8px 0; color:#555;">${"Consultation"}</td></tr>
                <tr><td style="padding:8px 0; font-weight:600; color:#333;">Date / Time:</td><td style="padding:8px 0; color:#555;">${
                  m.whenDate ?? "-"
                } ${m.whenTime ?? ""}</td></tr>
                <tr><td style="padding:8px 0; font-weight:600; color:#333;">Name:</td><td style="padding:8px 0; color:#555;">${
                  m.firstName + " " + m.lastName
                }</td></tr>
                <tr><td style="padding:8px 0; font-weight:600; color:#333;">Email:</td><td style="padding:8px 0; color:#555;">${
                  m.email ?? receiptEmail ?? "-"
                }</td></tr>
                <tr><td style="padding:8px 0; font-weight:600; color:#333;">Phone:</td><td style="padding:8px 0; color:#555;">${
                  m.phone ?? "-"
                }</td></tr>
              </table>

              <p style="font-size: 15px; color: #555; line-height: 1.6; margin-top: 24px;">
                Our team will set up a meeting call using Google Meet, and you will receive an email with the meeting details.
                If you have any questions, you can reply directly to this email or contact us at
                <a href="mailto:info@northsteadimmig.com" style="color: #1b365d; text-decoration: none;">info@northsteadimmig.com</a>.
              </p>
            </div>
            <div style="background-color:#f3f4f6; padding:18px 30px; text-align:center; color:#777; font-size:12px;">
              © ${new Date().getFullYear()} Northstead Immigration Inc. All rights reserved.<br/>
              <span style="font-size:11px;">This is an automated message — please do not reply.</span>
            </div>
          </div>
        </div>
      `,
      };

      await mailer.sendMail(toBusiness);
      if (m.email) await mailer.sendMail(toCustomer);
    } catch (emailErr) {
      console.error("📧 Email send failed:", emailErr);
    }
  }

  return NextResponse.json({ received: true });
}
