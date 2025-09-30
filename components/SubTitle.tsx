import * as React from "react";

type SubTitleProps = {
  className?: string;
  children?: React.ReactNode;
};

export default function SubTitle({ className, children }: SubTitleProps) {
  return <p className={`subtitle ${className}`}>{children}</p>;
}
