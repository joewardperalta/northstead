import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function Success() {
  return (
    <>
      <Navbar />

      <main className="min-h-[80vh] flex items-center justify-center px-6 py-12">
        <div className="max-w-md w-full bg-white rounded-2xl text-center">
          {/* Icon */}
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-8 w-8 text-emerald-600"
            >
              <path
                fillRule="evenodd"
                d="M9 16.2 4.8 12l-1.4 1.4L9 19l12-12-1.4-1.4z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-semibold text-zinc-900">
            Booking Successful
          </h1>
          <p className="mt-3 text-zinc-600 leading-relaxed">
            Thank you for your booking! We’ve received your payment and your
            appointment has been confirmed.
          </p>

          {/* Info box */}
          <div className="mt-6 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">
            You’ll receive a confirmation email shortly with your booking
            details. If you have not received any confirmation email, please
            check your spam folder.
          </div>

          {/* Support */}
          <p className="mt-6 text-sm text-zinc-500">
            If you have any questions, please contact us at{" "}
            <a
              href="mailto:info@northsteadimmig.com"
              className="text-emerald-700 font-medium underline hover:text-emerald-800"
            >
              info@northsteadimmig.com
            </a>
            .
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}
