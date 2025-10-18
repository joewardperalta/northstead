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
      <Wrapper className="space-y-12 md:space-y-24">
        <div className="space-y-12 md:space-y-0 md:flex">
          {/* Company */}
          <div className="space-y-3 md:pr-[10rem] md:max-w-[34rem]">
            <Logo />
            <p className="text-lg">
              At Northstead Immigration, we believe every journey deserves
              clarity, care, and confidence as we guide you through each step to
              turn your dream of a new life in Canada into reality.
            </p>
          </div>

          <div className="space-y-8 md:space-y-0 md:flex md:w-full md:justify-end md:gap-30">
            {/* Pages */}
            <div className="">
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
            <div className="">
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
                  <p>Office coming soon</p>
                </li>
                <li className="flex gap-3 items-center">
                  <Image
                    className="w-4 h-4"
                    src="/icons/envelope.png"
                    alt=""
                    width={64}
                    height={64}
                  />
                  <Link href="mailto:info@northsteadimmig.com">
                    info@northsteadimmig.com
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
              </ul>
            </div>

            {/* Contact information */}
            <div className="">
              <TertiaryHeading className="text-base font-bold mb-5">
                Socials
              </TertiaryHeading>
              <ul className="space-y-4">
                <li className="flex gap-3 items-center">
                  <Link
                    href="https://www.facebook.com/Northsteadimmigration2025"
                    target="_blank"
                  >
                    Facebook
                  </Link>
                </li>
                <li className="flex gap-3 items-center">
                  <Link
                    href="https://www.instagram.com/northsteadimmigration/"
                    target="_blank"
                  >
                    Instagram
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="space-y-3 md:space-y-0 md:flex md:justify-between md:items-center">
          <p className="text-sm">
            © 2025 Northstead Immigration Inc. All rights reserved.
          </p>
          <p className="text-sm">
            Designed and developed by{" "}
            <a href="https://www.jpstudio.ca/">Joeward Peralta</a>
          </p>
        </div>
      </Wrapper>
    </footer>
  );
}
