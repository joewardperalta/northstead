import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { stripe } from "@/lib/stripe";

type WithStatus = { statusCode?: number };

export async function POST(req: Request) {
  try {
    const headersList = await headers();
    const origin = headersList.get("origin");

    const form = await req.formData();

    // Turn FormData into Record<string, string>
    const data: Record<string, string> = Object.fromEntries(
      [...form.entries()].map(([k, v]) => [k, typeof v === "string" ? v : ""])
    );

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?canceled=true`,
      automatic_tax: { enabled: true },
      metadata: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        service: data.service,
        whenDate: data.date,
        whenTime: data.time,
        notes: data.notes,
      },
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe did not return a checkout URL." },
        { status: 500 }
      );
    }

    return NextResponse.redirect(session.url, 303);
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
