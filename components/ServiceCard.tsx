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
        className={`service-card bg-cover ${className}`}
        style={{ backgroundImage: `url(/photos/${backgroundImg})` }}
      >
        <TertiaryHeading className="mb-[12rem]">{title}</TertiaryHeading>
        <p className="text-base leading-[1.4] mb-8">{description}</p>
        <button className="btn">Learn more</button>
      </div>
    </Link>
  );
}
