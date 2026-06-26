"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Clock, Star, ArrowRight } from "lucide-react";
import { useLenis } from "@/components/layout";

interface Package {
  id: number;
  name: string;
  image: string;
  duration: string;
  price: string;
  rating: number;
  highlights?: string[];
}

export function FeaturedPackages() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleScrollTo = (target: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    lenis?.scrollTo(target, { offset: -80 });
  };

  useEffect(() => {
    async function fetchPackages() {
      try {
        const res = await fetch("/api/packages");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setPackages(data);
      } catch (error) {
        console.error("Error fetching packages:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPackages();
  }, []);

  useEffect(() => {
    if (isLoading || packages.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(".package-card",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            toggleActions: "play none none none"
          },
        }
      );

      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    }, sectionRef);

    return () => ctx.revert();
  }, [isLoading, packages]);

  return (
    <section id="packages" ref={sectionRef} className="py-20 md:py-32 bg-transparent relative border-t border-white/5">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-full h-[500px] bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 text-center md:text-left">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-8">
          <div>
            <span className="text-blue-400 font-semibold tracking-wider uppercase text-xs md:text-sm">
              Trending Tours
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-white mt-3 tracking-tight">
              Featured Packages
            </h2>
          </div>
          {packages.length > 6 && (
            <Link
              href="/packages"
              className="group relative overflow-hidden px-7 py-3.5 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 hover:from-blue-600/20 hover:to-indigo-600/20 backdrop-blur-md border border-blue-500/30 text-white font-medium rounded-full flex items-center gap-3 transition-all duration-300 hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.4)] hover:-translate-y-1"
            >
              <span className="relative z-10 flex items-center gap-3 font-semibold tracking-wide">
                View All Packages
                <span className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500 transition-colors duration-300">
                  <ArrowRight className="group-hover:translate-x-0.5 transition-transform" />
                </span>
              </span>
              {/* Shine effect on hover */}
              <div className="absolute inset-0 -translate-x-[150%] skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:transition-transform group-hover:duration-1000 group-hover:translate-x-[150%] z-0" />
            </Link>
          )}
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10">
          {isLoading ? (
            // Loading Skeletons
            [...Array(6)].map((_, i) => (
              <div key={i} className="bg-white/5 animate-pulse rounded-[2rem] h-[550px] w-full border border-white/10"></div>
            ))
          ) : packages.slice(0, 6).map((pkg) => (
            <Link href={`/packages/${pkg.id}`} key={pkg.id} className="package-card group relative bg-white/5 backdrop-blur-sm rounded-[2.5rem] border border-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden flex flex-col shadow-2xl hover:-translate-y-2">
              <div className="relative h-72 overflow-hidden shrink-0 m-2 rounded-[2rem]">
                <Image
                  src={pkg.image}
                  alt={pkg.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw"
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
              </div>

              <div className="p-8 pt-4 flex flex-col flex-grow">
                <div className="flex items-center text-blue-300 text-sm font-medium mb-4 uppercase tracking-wider">
                  <Clock className="mr-2" />
                  {pkg.duration}
                </div>
                <h3 className="text-2xl font-bold font-heading text-white mb-5 group-hover:text-blue-400 transition-colors leading-snug">
                  {pkg.name}
                </h3>

                {/* Highlights Section */}
                {pkg.highlights && pkg.highlights.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-8">
                    {pkg.highlights.map((highlight, idx) => (
                      <span key={idx} className="bg-white/5 border border-white/10 text-gray-300 text-[11px] font-medium px-3 py-1.5 rounded-full uppercase tracking-wider">
                        {highlight}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/10">
                  <div>
                    <span className="text-xs text-gray-500 uppercase tracking-widest block mb-1">Starting from</span>
                    <div className="text-3xl font-bold text-white">{pkg.price}</div>
                  </div>
                  <div
                    className="w-12 h-12 rounded-full bg-blue-600 group-hover:bg-blue-500 flex items-center justify-center text-white transition-all transform group-hover:rotate-45"
                  >
                    <ArrowRight size={20} className="-rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

