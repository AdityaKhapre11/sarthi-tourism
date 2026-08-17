"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: "How do I book a tour package?",
    answer: "You can browse our available packages from the Packages page, select the one you like, and submit an inquiry. Our team will get back to you with the availability and booking process.",
  },
  {
    question: "Can I customize my itinerary?",
    answer: "Yes, we offer customizable itineraries. Please mention your specific requirements when submitting your inquiry, and our travel experts will tailor the package to your needs.",
  },
  {
    question: "What is your cancellation policy?",
    answer: "Our cancellation policy varies depending on the package and the time of cancellation. Generally, cancellations made 30 days before the trip are eligible for a full refund (excluding processing fees). Please refer to our Terms of Service for detailed information.",
  },
  {
    question: "How can I update my profile details?",
    answer: "Currently, you can update your profile photo from the top of this dashboard. If you need to change your email or other details, please contact support.",
  },
  {
    question: "Do you offer group discounts?",
    answer: "Yes, we offer special rates for groups of 10 or more. Please reach out to our team with your group size and desired destination for a custom quote.",
  }
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    if (openIndex === index) {
      setOpenIndex(null);
    } else {
      setOpenIndex(index);
    }
  };

  return (
    <div className="w-full bg-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-[32px] p-8 sm:p-12 shadow-2xl relative mt-8 z-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
          <HelpCircle className="w-5 h-5" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white">Frequently Asked Questions</h2>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div 
              key={index} 
              className={`border rounded-2xl transition-all duration-300 overflow-hidden ${
                isOpen ? "bg-white/5 border-blue-500/30 shadow-[0_0_15px_rgba(37,99,235,0.1)]" : "bg-transparent border-white/10 hover:border-white/20"
              }`}
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full flex items-center justify-between p-5 sm:p-6 text-left focus:outline-none"
              >
                <span className={`font-semibold text-lg transition-colors ${isOpen ? "text-blue-400" : "text-white"}`}>
                  {faq.question}
                </span>
                <div className={`shrink-0 ml-4 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isOpen ? "bg-blue-500/20 text-blue-400" : "bg-white/5 text-gray-400"
                }`}>
                  <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`} />
                </div>
              </button>
              
              <div 
                className={`transition-all duration-300 ease-in-out ${
                  isOpen ? "max-h-[500px] opacity-100 pb-5 sm:pb-6 px-5 sm:px-6" : "max-h-0 opacity-0 px-5 sm:px-6"
                }`}
              >
                <p className="text-gray-300 leading-relaxed pt-2 border-t border-white/5">
                  {faq.answer}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
