import * as React from "react";

type HeadlineProps = {
  children?: React.ReactNode;
  className?: string;
};

export default function Headline({ children, className }: HeadlineProps) {
  return <div className={`headline ${className}`}>{children}</div>;
}
