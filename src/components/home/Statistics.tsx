"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {  Users, Map, Award, Smile  } from "lucide-react";

const stats = [
  {
    icon: <Users className="w-8 h-8 text-blue-400" />,
    value: 50,
    suffix: "k+",
    label: "Happy Travelers",
  },
  {
    icon: <Map className="w-8 h-8 text-blue-400" />,
    value: 120,
    suffix: "+",
    label: "Destinations",
  },
  {
    icon: <Award className="w-8 h-8 text-blue-400" />,
    value: 15,
    suffix: "+",
    label: "Years Experience",
  },
  {
    icon: <Smile className="w-8 h-8 text-blue-400" />,
    value: 99,
    suffix: "%",
    label: "Satisfaction Rate",
  },
];

export function Statistics() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Counter Animation
      const counters = gsap.utils.toArray(".stat-value") as HTMLElement[];
      
      counters.forEach((counter) => {
        const target = parseFloat(counter.getAttribute("data-target") || "0");
        
        gsap.to(counter, {
          innerHTML: target,
          duration: 2.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
          },
          snap: { innerHTML: 1 },
          onUpdate: function () {
            counter.innerHTML = Math.ceil(Number(this.targets()[0].innerHTML)).toString();
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Use this component but comment it out in page.tsx if not wanted, but we'll style it just in case.
  return (
    <section ref={sectionRef} className="py-12 md:py-16 bg-transparent relative overflow-hidden border-t border-b border-white/5">
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-center">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center bg-white/5 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/10 hover:bg-white/10 transition-colors">
              <div className="mb-4">
                {stat.icon}
              </div>
              <div className="flex items-baseline justify-center mb-1">
                <span 
                  className="stat-value text-3xl md:text-5xl font-bold font-heading text-white tracking-tight"
                  data-target={stat.value}
                >
                  0
                </span>
                <span className="text-2xl md:text-4xl font-bold font-heading text-blue-400">
                  {stat.suffix}
                </span>
              </div>
              <p className="text-gray-400 font-medium text-xs md:text-sm tracking-widest uppercase mt-2">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
