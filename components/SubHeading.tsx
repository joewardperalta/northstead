import * as React from "react";

type SubHeadingProps = {
  className?: string;
  children?: React.ReactNode;
};

export default function SubHeading({ className, children }: SubHeadingProps) {
  return <p className={`subheading ${className}`}>{children}</p>;
}
