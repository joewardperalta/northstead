import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoose";
import { Booking, IBooking } from "@/models/Booking";
import { z, ZodError } from "zod";
import type { FilterQuery } from "mongoose";
import type { MongoServerError } from "mongodb";

export const runtime = "nodejs"; // ensure Node runtime for mongoose

// Optional helper if you keep a Date field for reporting
function localMidnightFromYmd(ymd: string) {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1, 0, 0, 0, 0);
}

// ---------- validation ----------
const BookingInput = z
  .object({
    // local, human date string only
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    timeSlot: z.string().min(1).max(50),
    firstName: z.string().min(1).max(120),
    lastName: z.string().min(1).max(120),
    email: z.string().email(),
    phone: z.string().max(40).optional(),
    notes: z.string().max(1000).optional(),
  })
  .transform((v) => ({
    ...v,
    name: `${v.firstName.trim()} ${v.lastName.trim()}`.trim(),
  }));

function isMongoDupKey(
  err: unknown
): err is MongoServerError & { code: 11000 } {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as Partial<MongoServerError>).code === 11000
  );
}

// ---------- GET ----------
// GET /api/bookings?date=YYYY-MM-DD
export async function GET(req: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get("date"); // "YYYY-MM-DD"

    if (!dateParam) {
      return NextResponse.json({ bookedTimeSlots: [] }, { status: 200 });
    }

    // Match by date string directly (no timezone math)
    const q: FilterQuery<IBooking> = {
      status: "booked",
      date: dateParam,
      timeSlot: { $ne: null },
    };

    const rows = await Booking.find(q).select("timeSlot -_id").lean();
    const bookedTimeSlots = rows.map((r) => r.timeSlot as string);

    return NextResponse.json({ bookedTimeSlots }, { status: 200 });
  } catch (e) {
    console.error("GET /api/bookings error:", e);
    return NextResponse.json(
      { error: "Failed to load bookings" },
      { status: 500 }
    );
  }
}

// ---------- POST ----------
// Body: { date: "YYYY-MM-DD", timeSlot, firstName, lastName, email, phone?, notes? }
export async function POST(req: Request) {
  try {
    await dbConnect();

    const raw = await req.json();
    const parsed = BookingInput.parse(raw);

    const doc = new Booking({
      date: parsed.date, // <— key change: store date string
      timeSlot: parsed.timeSlot,
      firstName: parsed.firstName,
      lastName: parsed.lastName,
      name: parsed.name,
      email: parsed.email,
      phone: parsed.phone,
      notes: parsed.notes,
      status: "booked",
      timezone: "America/Toronto", // optional, nice to keep
      // optional: if your schema has this field
      dateLocalMidnight: localMidnightFromYmd(parsed.date),
    });

    await doc.save(); // unique index on {date, timeSlot, status:"booked"} prevents double-booking
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (e: unknown) {
    if (e instanceof ZodError) {
      return NextResponse.json({ error: e.flatten() }, { status: 400 });
    }
    if (isMongoDupKey(e)) {
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
