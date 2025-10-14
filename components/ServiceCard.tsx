import * as React from "react";
import TertiaryHeading from "./TertiaryHeading";
import Link from "next/link";

type ServiceCardProps = {
  title: string;
  description: string;
  link: string;
  backgroundImg: string;
  className?: string;
};

export default function ServiceCard({
  title,
  description,
  link,
  backgroundImg,
  className,
}: ServiceCardProps) {
  return (
    <Link href={link}>
      <div
        className={`service-card bg-cover relative ${className}`}
        style={{ backgroundImage: `url(/photos/${backgroundImg})` }}
      >
        {/* Overlay */}
        <div className="bg-black/50 absolute inset-0"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between">
          <TertiaryHeading className="mb-[12rem]">{title}</TertiaryHeading>

          {/* Description */}
          <div className="md:min-h-[14rem] md:flex md:flex-col md:justify-end">
            <p className="text-base leading-[1.4] mb-8">{description}</p>
            <button className="btn cursor-pointer">Learn more</button>
          </div>
        </div>
      </div>
    </Link>
  );
}
