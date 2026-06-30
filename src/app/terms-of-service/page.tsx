import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for Sarthi Tourism. Understand the rules and guidelines for using our website and services.",
  alternates: {
    canonical: "/terms-of-service",
  },
};

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-transparent pt-40 pb-20 relative text-gray-300">
      <div className="absolute top-0 left-0 w-full h-[750px] bg-gradient-to-b from-blue-500/10 to-transparent pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 max-w-4xl">
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold font-heading text-white mb-4 tracking-tight">Terms of Service</h1>
          <p className="text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="bg-white/5 backdrop-blur-md rounded-[2.5rem] border border-white/10 p-8 md:p-12 space-y-8 shadow-2xl">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
            <p className="leading-relaxed">
              By accessing and using our website and services, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Booking and Payments</h2>
            <p className="leading-relaxed mb-4">
              When booking a tour package with Sarthi Tourism:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>A deposit may be required to secure your reservation.</li>
              <li>Full payment must be completed before the tour commencement date unless otherwise specified.</li>
              <li>Prices are subject to change without prior notice, except for confirmed bookings.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Cancellations and Refunds</h2>
            <p className="leading-relaxed">
              Cancellation policies vary depending on the specific tour package booked. Please refer to your booking confirmation for specific cancellation terms and refund eligibility.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Travel Documents</h2>
            <p className="leading-relaxed">
              It is the traveler&apos;s responsibility to ensure they have valid passports, visas, and any other necessary travel documents prior to departure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Contact Information</h2>
            <p className="leading-relaxed">
              If you have any questions regarding these Terms of Service, please contact us at <a href="mailto:info@sarthitourism.com" className="text-blue-400 hover:underline">info@sarthitourism.com</a>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
