import Link from "next/link";

export default function ComingSoon() {
  return (
    <main className="min-h-[100svh] grid place-items-center bg-gradient-to-b px-6 bg-slate-50">
      <div className="max-w-xl text-center">
        <h1 className="mt-3 text-4xl sm:text-5xl font-semibold text-slate-900">
          Online Booking Coming Soon
        </h1>

        <p className="mt-4 text-slate-600">
          We’re finalizing our new appointment scheduling system to make booking
          consultations faster and easier for you. Please check back soon — or
          contact us directly to schedule your consultation today.
        </p>

        <p className="mt-6 text-sm text-slate-500">
          In the meantime, reach us at{" "}
          <a
            href="mailto:admin@northsteadimmig.ca"
            className="text-sky-700 underline"
          >
            admin@northsteadimmig.ca
          </a>{" "}
          or call{" "}
          <a href="tel:+16472704116" className="text-sky-700 underline">
            +1 (647) 270-4116
          </a>
          .
        </p>

        <div className="mt-10">
          <Link
            href="/"
            className="text-sm text-slate-500 hover:text-slate-700"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
