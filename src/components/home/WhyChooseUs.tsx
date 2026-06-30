"use client";

import Image from "next/image";
import { Award, ThumbsUp, Headphones, Map } from "lucide-react";

const features = [
  {
    icon: <Award className="w-6 h-6 text-blue-400" />,
    title: "Best Price Guarantee",
    description: "We offer the best prices in the market without compromising on quality or experience."
  },
  {
    icon: <ThumbsUp className="w-6 h-6 text-blue-400" />,
    title: "Trusted Agency",
    description: "Over 10 years of experience curating journeys for thousands of happy travelers."
  },
  {
    icon: <Headphones className="w-6 h-6 text-blue-400" />,
    title: "24/7 Support",
    description: "Our dedicated support team is available round the clock to assist you anywhere in the world."
  },
  {
    icon: <Map className="w-6 h-6 text-blue-400" />,
    title: "Custom Packages",
    description: "Tailor-made itineraries crafted specifically to match your exact preferences and budget."
  }
];

export function WhyChooseUs() {
  return (
    <section id="about" className="py-20 lg:py-32 bg-transparent relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-900/10 rounded-full blur-[120px] -z-10 translate-x-1/3 -translate-y-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[100px] -z-10 -translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="container mx-auto px-5 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 items-center">

          {/* Images Section (Left Side) */}
          <div className="relative order-2 lg:order-1 h-[550px] sm:h-[650px] w-full mt-10 lg:mt-0">
            {/* Top Right Image */}
            <div className="absolute top-0 right-4 sm:right-10 w-3/4 h-[350px] sm:h-[400px] rounded-[2rem] overflow-hidden shadow-2xl z-10 transform transition-transform hover:scale-[1.02] duration-500 border border-white/10">
              <Image
                src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&q=80&w=1000"
                alt="Travel experiences"
                fill
                className="object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            </div>

            {/* Bottom Left Image */}
            <div className="absolute bottom-0 left-0 w-2/3 h-[300px] sm:h-[350px] rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-20 border-[6px] border-background transform transition-transform hover:scale-[1.02] duration-500">
              <Image
                src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&q=80&w=1000"
                alt="Beautiful destinations"
                fill
                className="object-cover opacity-90"
              />
            </div>

            {/* Premium Floating Badge */}
            <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 bg-card/90 backdrop-blur-xl p-5 sm:p-6 rounded-3xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] flex items-center gap-4 sm:gap-5 border border-white/10 animate-[bounce_4s_ease-in-out_infinite] min-w-[240px]">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 shadow-lg shrink-0 border border-blue-500/30">
                <ThumbsUp className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">99%</div>
                <div className="text-xs sm:text-sm text-blue-300 font-bold uppercase tracking-widest mt-1">Happy Clients</div>
              </div>
            </div>
          </div>

          {/* Text Content Section (Right Side) */}
          <div className="order-1 lg:order-2">
            <div>
              <span className="text-blue-400 font-semibold tracking-wider uppercase text-xs md:text-sm">
                Why Choose Us
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-white mt-3 mb-6 tracking-tight leading-tight">
                Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Sarthi Tourism?</span>
              </h2>
            </div>
            <p className="text-gray-400 text-lg md:text-xl font-light leading-relaxed mb-10">
              We go above and beyond to ensure your travel experience is nothing short of extraordinary. From hidden gems to world-famous landmarks, we bring your dream destinations to life.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {features.map((feature, idx) => (
                <div key={idx} className="group p-6 rounded-[2rem] bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                  <div className="w-12 h-12 rounded-2xl bg-transparent shadow-inner border border-white/5 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2 tracking-wide">{feature.title}</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
