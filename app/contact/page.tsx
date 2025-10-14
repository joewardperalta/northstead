"use client";

// Components
import Heading from "@/components/Heading";
import Headline from "@/components/Headline";
import Section from "@/components/Section";
import SubHeading from "@/components/SubHeading";
import SubTitle from "@/components/SubTitle";
import Tagline from "@/components/Tagline";
import Title from "@/components/Title";
import Wrapper from "@/components/Wrapper";
import TertiaryHeading from "@/components/TertiaryHeading";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import CallToAction from "@/components/CallToAction";

export default function Home() {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    if (!error) {
      const formData = new FormData(e.currentTarget);
      const data = Object.fromEntries(formData.entries()); // convert to object

      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        const result = await res.json();

        if (!res.ok) {
          throw new Error(result.error || "Something went wrong");
        }

        // set message upon successful for submission
        setStatus("success");
        setMessage("Your message has been sent successfully!");

        // clear the form
        (e.target as HTMLFormElement).reset();
        setPhone("");
      } catch (err: unknown) {
        setStatus("error");
        if (err instanceof Error) {
          setMessage("Failed to send message, try again!");
        } else {
          setMessage("Failed to send message, try again!");
        }
      }
    }
  }

  return (
    <>
      {/* Hero Section */}
      <Section className="bg-[url(/photos/professional-team-smiling.jpg)] bg-cover bg-center">
        <Wrapper>
          <Headline className="text-white pt-[6rem] mb-0 md:pt-[23rem] lg:pt-[15rem]">
            <Title>Contact us</Title>
            <SubTitle>
              Connect with us today and take the first step toward your Canadian
              journey with confidence. Our team at Northstead Immigration Inc.
              is ready to provide the guidance and support you need every step
              of the way.
            </SubTitle>
          </Headline>
        </Wrapper>
      </Section>

      {/* Contact form */}
      <Section>
        <Wrapper>
          <Headline className="mb-0 md:flex md:justify-between md:items-center md:w-full md:max-w-none md:gap-[5.5rem]">
            <div className="w-full">
              <Tagline isDarkTheme>How we help clients</Tagline>
              <Heading>
                Need help with immigration or Visa applications?
              </Heading>
            </div>
            <SubHeading className="w-full">
              We are always ready to support our clients and provide solutions
              to any challenges they face during their immigration journey.
            </SubHeading>
          </Headline>

          <div className="flex flex-col gap-12 md:flex-row md:gap-[5.5rem]">
            {/* Contact form */}
            <form onSubmit={handleSubmit} className="space-y-4 w-full">
              <div className="space-y-4 md:space-y-0 md:flex md:gap-4">
                <div className="w-full">
                  <input
                    className="input"
                    type="text"
                    name="firstname"
                    id="firstname"
                    placeholder="First name"
                    required
                  />
                </div>
                <div className="w-full">
                  <input
                    type="text"
                    name="lastname"
                    id="lastname"
                    placeholder="Last name"
                    required
                  />
                </div>
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Email address"
                  required
                />
              </div>
              <div>
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
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
              </div>
              <div>
                <textarea
                  placeholder="Tell us about your case"
                  rows={10}
                  name="message"
                  id="message"
                  required
                />
              </div>
              <div>
                <button className="btn primary-btn" type="submit">
                  {status === "loading" ? "Sending..." : "Send message"}
                </button>
                {status !== "idle" && (
                  <span
                    className={`text-sm ${
                      status === "success" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {message}
                  </span>
                )}
              </div>
            </form>

            {/* Contact information */}
            <div className="w-full">
              <TertiaryHeading className="text-base font-bold mb-5">
                Contact information
              </TertiaryHeading>
              <ul className="space-y-4">
                <li className="flex gap-3 items-center">
                  <Image
                    className="w-4 h-4"
                    src="/icons/map.png"
                    alt=""
                    width={64}
                    height={64}
                  />
                  <p>541 Laval St, Oshawa, ON L1J 6L8</p>
                </li>
                <li className="flex gap-3 items-center">
                  <Image
                    className="w-4 h-4"
                    src="/icons/envelope.png"
                    alt=""
                    width={64}
                    height={64}
                  />
                  <Link href="mailto:admin@northsteadimmig.com">
                    admin@northsteadimmig.com
                  </Link>
                </li>
                <li className="flex gap-3 items-center">
                  <Image
                    className="w-4 h-4"
                    src="/icons/phone.png"
                    alt=""
                    width={64}
                    height={64}
                  />
                  <Link href="tel:+16472704116">+1 (647) 270-4116</Link>
                </li>
                <li className="flex gap-3 items-center">
                  <Image
                    className="w-4 h-4"
                    src="/icons/clock.png"
                    alt=""
                    width={64}
                    height={64}
                  />
                  <p>Mon - Sat: 9am-5pm</p>
                </li>
              </ul>
            </div>
          </div>
        </Wrapper>
      </Section>

      <CallToAction />
    </>
  );
}
