import { FilterQuery } from "mongoose";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoose";
import { Booking } from "@/models/Booking";
import { z } from "zod";
import { BookingType } from "@/models/Booking";

// Validation schema
const BookingInput = z.object({
  date: z.union([z.string(), z.date()]),
  timeSlot: z.string().min(1).max(50).optional().nullable(),
  name: z.string().min(1).max(120),
  email: z.string().email(),
  phone: z.string().max(40).optional(),
  notes: z.string().max(1000).optional(),
});

// GET /api/bookings?from=YYYY-MM-DD&to=YYYY-MM-DD
// Returns booked items; handy for disabling dates/slots on the calendar
export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const query: FilterQuery<BookingType> = { status: "booked" };
    if (from || to) {
      query.date = {};
      if (from) query.date.$gte = new Date(from);
      if (to) {
        const end = new Date(to);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    const bookings = await Booking.find(query)
      .select("date timeSlot -_id")
      .lean();
    return NextResponse.json(bookings, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to load bookings" },
      { status: 500 }
    );
  }
}

// POST /api/bookings
// Body: { date, timeSlot?, name, email, phone?, notes? }
export async function POST(req: Request) {
  try {
    await dbConnect();
    const raw = await req.json();
    const parsed = BookingInput.parse(raw);

    // Normalize date-only uniqueness is handled by schema setter.
    // We rely on the unique index to prevent double-booking.
    const doc = new Booking({
      ...parsed,
      timeSlot: parsed.timeSlot ?? null,
      status: "booked",
    });

    await doc.save(); // throws if unique constraint violated

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (e: any) {
    if (e.name === "ZodError") {
      return NextResponse.json({ error: e.flatten() }, { status: 400 });
    }
    if (e?.code === 11000) {
      // Duplicate key (unique index) -> already booked
      return NextResponse.json(
        { error: "This date/time is already booked" },
        { status: 409 }
      );
    }
    console.error(e);
    return NextResponse.json(
      { error: "Unable to create booking" },
      { status: 500 }
    );
  }
}
