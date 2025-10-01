import * as React from "react";

type TertiaryHeadingProps = {
  className?: string;
  children?: React.ReactNode;
};

export default function TertiaryHeading({
  className,
  children,
}: TertiaryHeadingProps) {
  return <p className={`tertiary-heading ${className}`}>{children}</p>;
}
