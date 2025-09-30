import * as React from "react";

type HeadingProps = {
  children?: React.ReactNode;
  className?: string;
};

export default function Heading({ className, children }: HeadingProps) {
  return <h2 className={`${className}`}>{children}</h2>;
}
