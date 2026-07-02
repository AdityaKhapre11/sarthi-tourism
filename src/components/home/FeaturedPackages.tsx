"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Clock, Star, ArrowRight, Sparkles } from "lucide-react";
import { useLenis } from "@/components/layout";
import { PackageCard } from "@/components/packages";

import { Package } from "@/data/packages";

export function FeaturedPackages({ initialPackages = [] }: { initialPackages?: Package[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const [packages, setPackages] = useState<Package[]>(() => [...initialPackages].sort((a, b) => b.id - a.id));

  useEffect(() => {
    // If not passed via props, fetch (fallback)
    if (initialPackages.length === 0) {
      async function fetchPackages() {
        try {
          const res = await fetch("/api/packages");
          if (!res.ok) throw new Error("Failed to fetch");
          const data = await res.json();
          setPackages(data.sort((a: Package, b: Package) => b.id - a.id));
        } catch (error) {
          console.error("Error fetching packages:", error);
        }
      }
      fetchPackages();
    }
  }, [initialPackages]);

  useEffect(() => {
    if (packages.length === 0) return;

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
  }, [packages]);

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
          {packages.length === 0 ? (
            // Loading Skeletons
            [...Array(6)].map((_, i) => (
              <div key={i} className="bg-white/5 animate-pulse rounded-[2rem] h-[550px] w-full border border-white/10"></div>
            ))
          ) : packages.slice(0, 6).map((pkg, index) => (
            <PackageCard key={pkg.id} pkg={pkg} isFeatured={index < 3} />
          ))}
        </div>
      </div>
    </section>
  );
}

