"use client";
import GoBackHomeButton from "@/components/buttons/GoBackHomeButton";
import Heading from "@/components/Heading";
import Headline from "@/components/Headline";
import Section from "@/components/Section";
import SubTitle from "@/components/SubTitle";
import Title from "@/components/Title";
import Link from "next/link";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type BookedResp = { bookedTimeSlots: string[] };

function buildSlots(): string[] {
  const slots: string[] = [];
  const OPEN_HOUR = 9;
  const CLOSE_HOUR = 16;
  const INTERVAL_MIN = 30;

  for (let hour = OPEN_HOUR; hour < CLOSE_HOUR; hour++) {
    for (let min = 0; min < 60; min += INTERVAL_MIN) {
      const date = new Date();
      date.setHours(hour, min, 0, 0);

      const timeString = date.toLocaleTimeString("en-CA", {
        hour: "numeric",
        minute: "2-digit",
        hour12: false, // 24-hour format
        timeZone: "America/Toronto", // <- forces timezone to Canada Eastern
      });

      slots.push(timeString);
    }
  }
  return slots;
}

const ALL_SLOTS = buildSlots();

export default function Booking() {
  const [date, setDate] = useState<Date | null>(null);
  const [booked, setBooked] = useState<string[]>([]);
  const [timeSlot, setTimeSlot] = useState<string>("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch booked slots
  useEffect(() => {
    if (!date) return;
    const dateStr = date.toLocaleDateString("en-CA");

    (async () => {
      try {
        const res = await fetch(
          `/api/bookings?date=${encodeURIComponent(dateStr)}`
        );
        if (!res.ok) throw new Error("Failed to fetch");
        const data: BookedResp = await res.json();
        console.log(data);
        setBooked(data.bookedTimeSlots);
        if (data.bookedTimeSlots.includes(timeSlot)) setTimeSlot("");
      } catch (err) {
        console.error(err);
      }
    })();
  }, [date, timeSlot]);

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setPhone(value);
    const phoneRegex = /^[0-9]{10,15}$/;
    setError(
      phoneRegex.test(value) ? "" : "Please enter a valid phone number."
    );
  }

  // 🟢 Custom submit handler (fetches Stripe session)
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!date || !timeSlot) {
      alert("Please select a date and time before continuing.");
      return;
    }

    setIsSubmitting(true);
    const form = new FormData(e.currentTarget);
    form.append("date", date.toLocaleDateString("en-CA"));
    form.append("timeSlot", timeSlot);

    try {
      const res = await fetch("/api/checkout", { method: "POST", body: form });
      const j = await res.json();
      if (!res.ok || !j?.url) {
        alert(j?.error || "Unable to start checkout.");
        return;
      }
      window.location.href = j.url; // open Stripe Checkout
    } catch (err) {
      console.error(err);
      alert("Error creating Stripe session.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="lg:flex md:items-center">
      <Section className="bg-[url(/photos/professional-team-smiling.jpg)] bg-cover bg-center w-full h-dvh px-6 md:p-[5.5rem] flex flex-col justify-between">
        <div>
          <GoBackHomeButton className="text-white" />

          <Headline className="text-white max-w-[40rem]">
            <Title className="text-5xl">
              Let&apos;s start your journey to Canada
            </Title>
            <SubTitle className="text-lg">
              Book a consultation with our licensed immigration experts to
              discuss your goals and explore your best pathway to success.
            </SubTitle>
          </Headline>
        </div>

        <div>
          <Heading className="text-2xl text-white">
            Follow us on our social media:
          </Heading>
          <ul className="flex gap-4">
            <li>
              <Link
                href="https://www.facebook.com/Northsteadimmigration2025"
                className="underline text-white text-xl"
                target="_blank"
              >
                Facebook
              </Link>
            </li>
            <li>
              <Link
                href="https://www.instagram.com/northsteadimmigration/"
                className="underline text-white text-xl"
                target="_blank"
              >
                Instagram
              </Link>
            </li>
          </ul>
        </div>
      </Section>

      {/* Booking form */}
      <Section className="px-6 md:p-[5.5rem] w-full">
        <form onSubmit={handleSubmit} className="space-y-4 w-full">
          {/* Service */}
          <div>
            <label className="block text-sm font-medium">Service</label>
            <input
              type="text"
              name="service"
              value="Consultation"
              className="mt-1 w-full border p-4"
              readOnly
            />
            <p className="text-xs text-gray-500 mt-1">
              You’ll pay securely on the next step (Stripe).
            </p>
          </div>

          {/* Date & time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">
                Preferred date
              </label>
              <DatePicker
                selected={date}
                onChange={(d) => setDate(d)}
                minDate={new Date()}
                filterDate={(d) => d.getDay() !== 0}
                dateFormat="yyyy-MM-dd"
                placeholderText="Select a date"
                className="mt-1 border p-3 w-full"
                wrapperClassName="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">
                Preferred time
              </label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                required
                disabled={!date}
                className="mt-1 border p-3 w-full"
              >
                <option value="" disabled>
                  {date ? "Select a time" : "Pick a date first"}
                </option>
                {ALL_SLOTS.map((slot) => {
                  console.log(booked);
                  return (
                    <option
                      key={slot}
                      value={slot}
                      disabled={booked.includes(slot)}
                    >
                      {slot} {booked.includes(slot) ? "— (booked)" : ""}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* First & Last name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">First name</label>
              <input
                type="text"
                name="firstName"
                className="mt-1 w-full border p-4"
                placeholder="Firstname"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Last name</label>
              <input
                type="text"
                name="lastName"
                className="mt-1 w-full border p-4"
                placeholder="Lastname"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              className="mt-1 w-full p-4 border"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium">Phone</label>
            <input
              type="tel"
              name="phone"
              placeholder="Phone number"
              pattern="[0-9]*"
              inputMode="numeric"
              value={phone}
              onChange={handlePhoneChange}
              required
              className={`mt-1 w-full border p-4 ${
                error ? "border-red-500" : ""
              }`}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium">
              Notes (optional)
            </label>
            <textarea
              name="notes"
              className="mt-1 w-full p-4 border"
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Briefly describe your case or goals..."
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={!date || !timeSlot || isSubmitting}
            className={`w-full md:w-auto btn primary-btn ${
              !date || !timeSlot || isSubmitting
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            {isSubmitting ? "Processing..." : "Continue to payment"}
          </button>
        </form>
      </Section>
    </main>
  );
}
