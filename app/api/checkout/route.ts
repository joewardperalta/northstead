import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";

type WithStatus = { statusCode?: number };

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const h = headers();
    const origin =
      h.get("origin") ??
      ((process.env.NEXT_PUBLIC_BASE_URL || "").replace(/\/$/, "") ||
        "http://localhost:3000");

    const form = await req.formData();

    // Turn FormData into Record<string, string>
    const data: Record<string, string> = Object.fromEntries(
      [...form.entries()].map(([k, v]) => [k, typeof v === "string" ? v : ""])
    );

    // Ensure we have date/time for metadata (prevents null timeSlot later)
    if (!data.date || !data.timeSlot) {
      return NextResponse.json(
        { error: "Missing date or timeSlot in request." },
        { status: 400 }
      );
    }

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID!, // must match test/live mode of your secret key
          quantity: 1,
        },
      ],
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/booking?canceled=true`,
      customer_email: data.email || undefined,
      automatic_tax: { enabled: true },
      metadata: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        service: data.service,
        whenDate: data.date, // e.g. "2025-10-18"
        whenTime: data.timeSlot, // e.g. "10:00 AM"
        notes: data.notes,
      },
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe did not return a checkout URL." },
        { status: 500 }
      );
    }

    // Return JSON; client should do: window.location.href = url
    return NextResponse.json({ url: session.url }, { status: 200 });

    // If you prefer a pure form navigation (no JS), you can instead:
    // return NextResponse.redirect(session.url, 303);
    // BUT only if the request is a native browser form POST (not fetch).
  } catch (e: unknown) {
    const msg =
      e instanceof Error && typeof e.message === "string"
        ? e.message
        : "Unexpected server error";

    const status =
      typeof (e as WithStatus)?.statusCode === "number"
        ? (e as WithStatus).statusCode!
        : 500;

    return NextResponse.json({ error: msg }, { status });
  }
}
