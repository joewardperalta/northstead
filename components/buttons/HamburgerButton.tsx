import * as React from "react";

type HamburgerButtonProps = {
  onClick?: () => void;
  className?: string;
};

export default function HamburgerButton({
  onClick,
  className,
}: HamburgerButtonProps) {
  return (
    <button className={`space-y-1 ${className}`} onClick={onClick}>
      <div className="w-5 h-0.5 bg-black"></div>
      <div className="w-5 h-0.5 bg-black"></div>
      <div className="w-5 h-0.5 bg-black"></div>
    </button>
  );
}
