"use client";

import Link from "next/link";
import Image from "next/image";
import { PhoneCall, ArrowRight, MapPin } from "lucide-react";

export function ContactCTA() {
  const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "8780228628";
  // Format the number for display assuming an Indian number format +91 XXXXX XXXXX
  const displayPhone = WA_NUMBER.length === 10 ? `+91 ${WA_NUMBER.slice(0, 5)} ${WA_NUMBER.slice(5)}` : WA_NUMBER;

  return (
    <section id="contact" className="relative py-24 lg:py-32 overflow-hidden">
      {/* Premium Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=2000"
          alt="Travel Landscape Background"
          fill
          priority
          className="object-cover object-center scale-105"
        />
        {/* Sleek Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#030712]/95 via-[#030712]/80 to-blue-900/60" />
      </div>

      <div className="container mx-auto px-5 relative z-10">
        <div className="max-w-6xl mx-auto rounded-[2.5rem] bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-8 sm:p-12 lg:p-20 shadow-2xl relative overflow-hidden group">
          {/* Subtle animated glow inside the glass card */}
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/20 rounded-full blur-[80px] transition-transform duration-700 group-hover:scale-110 group-hover:bg-blue-400/30" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-[80px] transition-transform duration-700 group-hover:scale-110" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">

            <div className="max-w-3xl text-center lg:text-left">
              {/* <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-blue-300 text-sm font-medium mb-8 uppercase tracking-widest backdrop-blur-md">
                <MapPin className="w-4 h-4" /> Start Your Journey
              </div> */}
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-white mb-6 tracking-tight leading-[1.1]">
                Ready to plan your <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">Next Adventure?</span>
              </h2>
              <p className="text-gray-300 text-lg md:text-xl font-light leading-relaxed max-w-xl mx-auto lg:mx-0 text-justify">
                Contact our travel experts today and let us customize the perfect, unforgettable holiday package for you and your loved ones.
              </p>
            </div>

            <div className="flex flex-col gap-5 w-full lg:w-auto shrink-0 mt-4 lg:mt-0">
              <a
                href={`https://wa.me/${WA_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden px-8 py-4 md:py-5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-bold text-lg rounded-full flex items-center justify-center gap-3 transition-all hover:scale-[1.02] shadow-[0_8px_32px_rgba(0,0,0,0.3)] uppercase tracking-wider"
              >
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]"></span>
                </span>
                <span className="relative z-10">ENQUIRE NOW</span>
              </a>
              <a
                href={`https://wa.me/${WA_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 md:py-5 bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 font-medium text-lg rounded-full transition-all flex items-center justify-center gap-3 backdrop-blur-md"
              >
                <PhoneCall className="text-blue-400" />
                {displayPhone}
              </a>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
