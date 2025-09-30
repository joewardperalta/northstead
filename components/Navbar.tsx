"use client";
import HamburgerButton from "./buttons/HamburgerButton";
import Logo from "./Logo";
import Section from "./Section";
import Wrapper from "./Wrapper";
import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isToggle, setIsToggle] = useState(false);

  const navItems = [
    { label: "Home", link: "/" },
    { label: "About", link: "/about" },
    { label: "Services", link: "/services" },
  ];

  function handleHamburgerButtonClick() {
    setIsToggle(!isToggle);
  }

  return (
    <Section className="py-5">
      <Wrapper>
        <div className="flex justify-between items-center">
          <Logo className="" />
          <HamburgerButton onClick={handleHamburgerButtonClick} />
        </div>
        <div>
          <nav>
            <ul
              className={`uppercase text-sm space-y-4 py-15 w-full ${
                isToggle ? "block" : "hidden"
              }`}
            >
              {navItems.map((item, index) => (
                <li key={index}>
                  <Link href={item.link}>{item.label}</Link>
                </li>
              ))}
              <li className="mt-8">
                <Link className="btn primary-btn" href="/booking">
                  Book a consultation
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </Wrapper>
    </Section>
  );
}
