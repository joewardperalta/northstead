"use client";
import Heading from "@/components/Heading";
import Headline from "@/components/Headline";
import Section from "@/components/Section";
import SubTitle from "@/components/SubTitle";
import Title from "@/components/Title";
import Link from "next/link";
import { useState } from "react";

export default function Booking() {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    // Remove all non-digit and non-plus characters
    const value = e.target.value.replace(/[^0-9]/g, "");

    setPhone(value);

    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(value)) {
      setError("Please enter a valid phone number.");
    } else {
      setError("");
    }
  }

  return (
    <main className="lg:flex md:items-center">
      <Section className="bg-[url(/photos/professional-team-smiling.jpg)] bg-cover bg-center w-full h-dvh px-6 md:p-[5.5rem] flex flex-col justify-between">
        <div>
          <Link
            href="/"
            className="text-white mb-10 w-fit flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span>Go back to home</span>
          </Link>

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

      <Section className="px-6 md:p-[5.5rem] w-full">
        <form action="/api/checkout" method="POST" className="space-y-4 w-full">
          {/* Service */}
          <div>
            <label className="block text-sm font-medium">Service</label>
            <input
              type="text"
              name="text"
              value="Consultation"
              className="mt-1"
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
              <input type="date" name="date" className="mt-1" required />
            </div>
            <div>
              <label className="block text-sm font-medium">
                Preferred time
              </label>
              <input type="time" name="time" className="mt-1" required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">First name</label>
              <input
                type="text"
                name="firstname"
                className="mt-1 w-full border p-4"
                placeholder="Firstname"
                required
                minLength={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Last name</label>
              <input
                type="text"
                name="lastname"
                className="mt-1 w-full border p-4"
                placeholder="Lastname"
                required
                minLength={2}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              className="mt-1 w-full p-4"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Phone</label>
            <input
              type="tel"
              name="phone"
              id="phone"
              placeholder="Phone number"
              pattern="[0-9]*"
              inputMode="numeric"
              value={phone}
              onChange={handlePhoneChange}
              required
              className={`${error ? "border-red-500" : ""}`}
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium">
              Notes (optional)
            </label>
            <textarea
              name="notes"
              className="mt-1 w-full p-4"
              rows={4}
              placeholder="Briefly describe your case or goals..."
            />
          </div>

          <button
            type="submit"
            className="w-full md:w-auto btn primary-btn"
            role="link"
          >
            Continue to payment
          </button>
        </form>
      </Section>
    </main>
  );
}
