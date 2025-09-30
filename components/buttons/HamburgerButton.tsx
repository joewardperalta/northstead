import * as React from "react";

type HamburgerButtonProps = {
  onClick?: () => void;
};

export default function HamburgerButton({ onClick }: HamburgerButtonProps) {
  return (
    <button className="space-y-1" onClick={onClick}>
      <div className="w-5 h-0.5 bg-black"></div>
      <div className="w-5 h-0.5 bg-black"></div>
      <div className="w-5 h-0.5 bg-black"></div>
    </button>
  );
}
