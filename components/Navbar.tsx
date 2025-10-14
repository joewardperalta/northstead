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
    { label: "Contact", link: "/contact" },
  ];

  function handleHamburgerButtonClick() {
    setIsToggle(!isToggle);
  }

  return (
    <Section className="py-5">
      <Wrapper className="md:flex md:justify-between md:items-center">
        <div className="flex justify-between items-center">
          <Link href="/">
            <Logo />
          </Link>
          <HamburgerButton
            className="md:hidden"
            onClick={handleHamburgerButtonClick}
          />
        </div>
        <div>
          <nav>
            <ul
              className={`uppercase text-sm space-y-4 pt-15 w-full md:flex md:items-center md:pt-0 md:space-y-0 md:gap-6 ${
                isToggle ? "block" : "hidden"
              }`}
            >
              {navItems.map((item, index) => (
                <li key={index}>
                  <Link href={item.link}>{item.label}</Link>
                </li>
              ))}
              <li className="mt-8 md:mt-0 md:pl-6">
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
