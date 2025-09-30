import * as React from "react";

type TitleProps = {
  children?: React.ReactNode;
  className?: string;
};

export default function Title({ className, children }: TitleProps) {
  return <h1 className={`${className}`}>{children}</h1>;
}
