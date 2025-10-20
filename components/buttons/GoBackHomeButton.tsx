import Link from "next/link";

type GoBackHomeButtonProps = {
  className?: string;
};

export default function GoBackHomeButton({ className }: GoBackHomeButtonProps) {
  return (
    <Link
      href="/"
      className={`${className} mb-10 w-fit flex items-center gap-2 `}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        className="w-4 h-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M15 19l-7-7 7-7"
        />
      </svg>
      <span>Go back to home</span>
    </Link>
  );
}
