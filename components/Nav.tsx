import * as React from "react";
import Link from "next/link";

type NavItem = {
  label: string;
  link: string;
};

type NavProps = {
  items: NavItem[];
  className?: string;
};

export default function Nav({ items, className }: NavProps) {
  return (
    <nav className={`nav ${className}`}>
      <ul className="uppercase text-sm space-y-4 w-full py-15">
        {items.map((item, index) => (
          <li key={index}>
            <Link href={item.link}>{item.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
