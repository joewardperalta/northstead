import { Schema, model, models, Document } from "mongoose";

function normalizeDate(d: Date | string) {
  const dt = new Date(d);
  dt.setHours(0, 0, 0, 0);
  return dt;
}

export interface IBooking extends Document {
  date: Date; // normalized to midnight (day-only)
  timeSlot: string | null; // e.g. "9:30 AM"
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  notes?: string;
  status: "booked" | "cancelled";
  stripeSessionId?: string;
  paymentStatus?: "paid" | "unpaid" | "refunded";
}

const BookingSchema = new Schema<IBooking>(
  {
    date: { type: Date, required: true, set: normalizeDate, index: true },
    timeSlot: { type: String, default: null, index: true }, // "9:00 AM" format
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String },
    notes: { type: String },
    status: { type: String, enum: ["booked", "cancelled"], default: "booked" },
    stripeSessionId: { type: String, unique: true, sparse: true },
    paymentStatus: {
      type: String,
      enum: ["paid", "unpaid", "refunded"],
      default: "unpaid",
    },
  },
  { timestamps: true }
);

// Prevent double-booking: unique per (date, timeSlot) when status="booked"
BookingSchema.index(
  { date: 1, timeSlot: 1 },
  {
    unique: true,
    partialFilterExpression: { status: "booked", timeSlot: { $ne: null } },
  }
);

export const Booking =
  models.Booking || model<IBooking>("Booking", BookingSchema);
