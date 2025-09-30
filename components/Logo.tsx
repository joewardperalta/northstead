import * as React from "react";
import Image from "next/image";

type LogoProps = {
  className?: string;
};

export default function Logo({ className }: LogoProps) {
  return (
    <Image
      className={`${className} logo`}
      src="/photos/northstead-logo.png"
      alt="Northstead Immigration company logo."
      width={160}
      height={48}
    />
  );
}
