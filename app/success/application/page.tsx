"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect after 10 seconds
    const timer = setTimeout(() => {
      router.push("/");
    }, 10000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-900 px-6">
      <div className="max-w-md w-full rounded-xl border border-green-200 bg-white p-8 shadow-lg text-center">
        <div className="text-4xl mb-4">✅</div>
        <h1 className="text-2xl font-semibold mb-3">
          Thank you for completing this assessment form.
        </h1>
        <p className="text-gray-600 mb-6">
          Our client coordinators will review your information and contact you
          for the next steps.
        </p>
        <p className="text-sm text-gray-500">
          You’ll be redirected to the homepage in 10 seconds...
        </p>
      </div>
    </div>
  );
}
