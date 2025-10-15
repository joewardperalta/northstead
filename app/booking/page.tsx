import ComingSoon from "@/components/ComingSoon";

export default function Booking() {
  return (
    <ComingSoon />
    // <main className="max-w-2xl mx-auto p-6">
    //   <h1 className="text-3xl font-bold mb-6">Book a Consultation</h1>

    //   <form action="/api/checkout" method="POST" className="space-y-4">
    //     {/* Service */}
    //     <div>
    //       <label className="block text-sm font-medium">Service</label>
    //       <select
    //         name="service"
    //         className="mt-1 w-full rounded border p-2"
    //         required
    //         defaultValue="consult_60"
    //       >
    //         <option value="consult_30">Initial Consultation — 30 min</option>
    //         <option value="consult_60">Full Consultation — 60 min</option>
    //         <option value="follow_up_30">Follow-up — 30 min</option>
    //       </select>
    //       <p className="text-xs text-gray-500 mt-1">
    //         You’ll pay securely on the next step (Stripe).
    //       </p>
    //     </div>

    //     {/* Date & time */}
    //     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    //       <div>
    //         <label className="block text-sm font-medium">Preferred date</label>
    //         <input
    //           type="date"
    //           name="date"
    //           className="mt-1 w-full rounded border p-2"
    //           required
    //         />
    //       </div>
    //       <div>
    //         <label className="block text-sm font-medium">Preferred time</label>
    //         <input
    //           type="time"
    //           name="time"
    //           className="mt-1 w-full rounded border p-2"
    //           required
    //         />
    //       </div>
    //     </div>

    //     {/* Contact */}
    //     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    //       <div>
    //         <label className="block text-sm font-medium">Full name</label>
    //         <input
    //           type="text"
    //           name="name"
    //           className="mt-1 w-full rounded border p-2"
    //           placeholder="Jane Doe"
    //           required
    //           minLength={2}
    //         />
    //       </div>
    //       <div>
    //         <label className="block text-sm font-medium">Email</label>
    //         <input
    //           type="email"
    //           name="email"
    //           className="mt-1 w-full rounded border p-2"
    //           placeholder="you@example.com"
    //           required
    //         />
    //       </div>
    //     </div>

    //     <div>
    //       <label className="block text-sm font-medium">Phone</label>
    //       <input
    //         type="tel"
    //         name="phone"
    //         pattern="[0-9+\-\s()]{7,}"
    //         className="mt-1 w-full rounded border p-2"
    //         placeholder="+1 (555) 555-5555"
    //         required
    //       />
    //     </div>

    //     {/* Notes */}
    //     <div>
    //       <label className="block text-sm font-medium">Notes (optional)</label>
    //       <textarea
    //         name="notes"
    //         className="mt-1 w-full rounded border p-2"
    //         rows={4}
    //         placeholder="Briefly describe your case or goals..."
    //       />
    //     </div>

    //     <button
    //       type="submit"
    //       className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded"
    //       role="link"
    //     >
    //       Continue to payment
    //     </button>
    //   </form>
    // </main>
  );
}
