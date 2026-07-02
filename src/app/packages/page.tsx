"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Loader } from "@/components/ui";
import { PackageCard } from "@/components/packages";

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

        <section ref={sectionRef} className="container relative z-10 mx-auto px-4 mt-6">
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
              <PackageCard key={pkg.id} pkg={pkg as any} />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
