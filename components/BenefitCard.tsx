import * as React from "react";
import TertiaryHeading from "./TertiaryHeading";
import Image from "next/image";

type BenefitCardProps = {
  title: string;
  description: string;
};

export default function BenefitCard({ title, description }: BenefitCardProps) {
  return (
    <div className="flex gap-3">
      <Image
        className="w-3 h-3 inline-block mt-3"
        src="/icons/right-arrow-black.png"
        alt=""
        width={32}
        height={32}
      />

      <div>
        <TertiaryHeading>{title}</TertiaryHeading>
        <p>{description}</p>
      </div>
    </div>
  );
}
