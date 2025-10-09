import Link from "next/link";
import Logo from "./Logo";
import TertiaryHeading from "./TertiaryHeading";
import Wrapper from "./Wrapper";
import Image from "next/image";

const pages = [
  { label: "Home", link: "/" },
  { label: "About", link: "/about" },
  { label: "Services", link: "/services" },
  { label: "Contact", link: "/contact" },
];

export default function Footer() {
  return (
    <footer className="py-14">
      <Wrapper className="space-y-12">
        {/* Company */}
        <div className="space-y-3">
          <Logo />
          <p className="text-lg">
            At Northstead Immigration, we believe every journey deserves
            clarity, care, and confidence as we guide you through each step to
            turn your dream of a new life in Canada into reality.
          </p>
        </div>

        {/* Pages */}
        <div>
          <TertiaryHeading className="text-base font-bold mb-5">
            Pages
          </TertiaryHeading>
          <ul className="space-y-4">
            {pages.map((page, index) => (
              <li key={index}>
                <Link href={page.link}>{page.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact information */}
        <div>
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

        {/* Copyright */}
        <div className="space-y-3 ">
          <p className="text-sm">
            © 2025 Northstead Immigration Inc. All rights reserved.
          </p>
          <p className="text-sm">Designed and developed by Joeward Peralta</p>
        </div>
      </Wrapper>
    </footer>
  );
}
