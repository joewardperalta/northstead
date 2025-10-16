import { Schema, model, models } from "mongoose";

// Normalize a Date to local midnight for "date-only" uniqueness.
// Adjust to your business timezone if needed (e.g., setHours(0,0,0,0) in that TZ).
function normalizeDate(d: Date | string) {
  const dt = new Date(d);
  dt.setHours(0, 0, 0, 0);
  return dt;
}

const BookingSchema = new Schema(
  {
    date: {
      type: Date,
      required: true,
      set: normalizeDate,
    },
    // Optional: time slots; make (date, timeSlot) unique to prevent duplicates per slot
    timeSlot: {
      type: String, // e.g., "10:00-11:00"
      default: null,
      index: true,
    },
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true },
    notes: { type: String },
    // Useful flags
    status: { type: String, enum: ["booked", "cancelled"], default: "booked" },
  },
  { timestamps: true }
);

// Unique per date OR per (date, timeSlot) if timeSlot provided.
// This compound index allows either:
// - Only one booking for a day if timeSlot is null
// - Many per day but unique per timeSlot if timeSlot is set
BookingSchema.index(
  { date: 1, timeSlot: 1 },
  { unique: true, partialFilterExpression: { status: "booked" } }
);

export type BookingType = {
  date: Date;
  timeSlot?: string | null;
  name: string;
  email: string;
  phone?: string;
  notes?: string;
  status?: "booked" | "cancelled";
};

export const Booking =
  models.Booking || model<BookingType>("Booking", BookingSchema);
