import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PrivacyPolicyIndex() {
  return (
    <main className="min-h-screen bg-transparent pt-40 pb-20 relative text-gray-300">
      <div className="absolute top-0 left-0 w-full h-[750px] bg-gradient-to-b from-blue-500/10 to-transparent pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 max-w-4xl">
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold font-heading text-white mb-4 tracking-tight">Privacy Policy</h1>
          <p className="text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="bg-white/5 backdrop-blur-md rounded-[2.5rem] border border-white/10 p-8 md:p-12 space-y-8 shadow-2xl">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
            <p className="leading-relaxed">
              We collect information you provide directly to us when you request information, book a tour package, or communicate with us. This may include your name, email address, phone number, and any other details you choose to provide.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
            <p className="leading-relaxed mb-4">We use the information we collect to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Provide, maintain, and improve our services.</li>
              <li>Process your tour bookings and send related information.</li>
              <li>Respond to your comments, questions, and customer service requests.</li>
              <li>Send you technical notices, updates, and security alerts.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Data Security</h2>
            <p className="leading-relaxed">
              We implement appropriate technical and organizational measures to maintain the safety of your personal information. However, please note that no method of transmission over the Internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Contact Us</h2>
            <p className="leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at <a href="mailto:info@sarthitourism.com" className="text-blue-400 hover:underline">info@sarthitourism.com</a>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
