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
          name: `${m.firstname || m.firstName || ""} ${
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
        subject: `New Consultation Booking`,
        html: `
          <div style="font-family: sans-serif; background: #f8f9fb; padding: 20px;">
            <h2>New Paid Booking</h2>
            <p><strong>Date/Time:</strong> ${m.whenDate ?? "-"} ${
          m.whenTime ?? ""
        }</p>
            <p><strong>Name:</strong> ${m.firstname ?? "-"} ${
          m.lastname ?? "-"
        }</p>
            <p><strong>Email:</strong> ${m.email ?? receiptEmail ?? "-"}</p>
            <p><strong>Phone:</strong> ${m.phone ?? "-"}</p>
            <p><strong>Notes:</strong> ${m.notes ?? "-"}</p>
            <p><strong>Session ID:</strong> ${fullSession.id}</p>
          </div>`,
      };

      const toCustomer = {
        from: process.env.MAIL_FROM,
        to: m.email,
        subject: "Your booking is confirmed",
        html: `
          <div style="font-family: sans-serif; background: #f5f7fa; padding: 20px;">
            <h1>Your Booking is Confirmed</h1>
            <p>Hi ${m.firstname ?? ""} ${m.lastname ?? ""},</p>
            <p>Thank you for your payment of ${amount} ${currency}. Your consultation booking is confirmed.</p>
            <p><strong>Date:</strong> ${
              m.whenDate ?? "-"
            } <br/> <strong>Time:</strong> ${m.whenTime ?? ""}</p>
          </div>`,
      };

      await mailer.sendMail(toBusiness);
      if (m.email) await mailer.sendMail(toCustomer);
    } catch (emailErr) {
      console.error("📧 Email send failed:", emailErr);
    }
  }

  return NextResponse.json({ received: true });
}
