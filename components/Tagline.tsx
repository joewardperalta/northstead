import * as React from "react";
import Image from "next/image";

type TaglineProps = {
  children?: React.ReactNode;
  className?: string;
};

export default function Tagline({ children, className }: TaglineProps) {
  return (
    <div className={`tagline ${className}`}>
      <Image
        className="w-3 h-3"
        src="/icons/right-arrow.png"
        alt=""
        width={16}
        height={16}
      />
      <p>{children}</p>
    </div>
  );
}
