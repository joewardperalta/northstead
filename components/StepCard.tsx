import * as React from "react";
import TertiaryHeading from "./TertiaryHeading";

type StepCardProps = {
  title: string;
  description: string;
  backgroundImg: string;
  step: number;
  className?: string;
};

export default function StepCard({
  title,
  description,
  backgroundImg,
  step,
  className,
}: StepCardProps) {
  return (
    <section
      className={`service-card bg-cover ${className}`}
      style={{ backgroundImage: `url(/photos/${backgroundImg})` }}
    >
      <span className="inline-block mb-4">0{step}</span>
      <TertiaryHeading className="mb-[10rem]">{title}</TertiaryHeading>
      <p className="text-base">{description}</p>
    </section>
  );
}
