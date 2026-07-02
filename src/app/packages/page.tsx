"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Clock, ArrowRight } from "lucide-react";
import { Loader } from "@/components/ui/Loader";
import { ImageWithSkeleton } from "@/components/ui/ImageWithSkeleton";

interface Package {
  id: number;
  name: string;
  image: string;
  duration: string;
  price: string;
  rating: number;
  highlights?: string[];
}

export default function PackagesPage() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

    gsap.registerPlugin(ScrollTrigger);

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
    <>
    {isLoading && <Loader fullScreen solidBackground />}
    <main className="min-h-screen bg-transparent pt-32 pb-20 relative">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-[750px] bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />

      <section ref={sectionRef} className="container relative z-10 mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-blue-400 font-semibold tracking-wider uppercase text-xs md:text-sm">
            Explore The World
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-white mt-3 tracking-tight">
            All Tour Packages
          </h1>
          <p className="text-gray-400 mt-6 max-w-2xl mx-auto text-lg">
            Discover our complete collection of carefully curated travel experiences, designed to create unforgettable memories.
          </p>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10">
          {packages.map((pkg) => (
            <Link href={`/packages/${pkg.id}`} key={pkg.id} className="package-card group relative bg-white/5 backdrop-blur-sm rounded-[2.5rem] border border-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden flex flex-col shadow-2xl hover:-translate-y-2">
              <div className="relative h-72 overflow-hidden shrink-0 m-2 rounded-[2rem]">
                <ImageWithSkeleton
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
                      <span key={idx} className="bg-white/5 border border-white/10 text-gray-300 text-[10px] font-medium px-3 py-1.5 rounded-full uppercase tracking-wider">
                        {highlight}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/10">
                  <div>
                    <span className="text-xs text-gray-500 uppercase tracking-widest block mb-1">Starting from</span>
                    <div className="text-2xl font-bold text-white">{pkg.price}</div>
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
      </section>
    </main>
    </>
  );
}
