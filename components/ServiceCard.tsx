import * as React from "react";
import TertiaryHeading from "./TertiaryHeading";

type ServiceCardProps = {
  title: string;
  description: string;
  backgroundImg: string;
  className?: string;
};

export default function ServiceCard({
  title,
  description,
  backgroundImg,
  className,
}: ServiceCardProps) {
  return (
    <section
      className={`service-card bg-cover relative ${className}`}
      style={{ backgroundImage: `url(/photos/generic/${backgroundImg})` }}
    >
      {/* Overlay */}
      <div className="bg-black/50 absolute inset-0"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-between">
        <TertiaryHeading className="mb-[12rem]">{title}</TertiaryHeading>

        {/* Description */}
        <div className="md:min-h-[14rem] md:flex md:flex-col md:justify-end">
          <p className="text-base leading-[1.4] mb-8">{description}</p>
        </div>
      </div>
    </section>
  );
}
