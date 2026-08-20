"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PackageCard } from "@/components/packages";
import { PaginationControls } from "@/components/ui/PaginationControls";
import { Package } from "@/data/packages";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function PackagesClient({ 
  packages, 
  currentPage = 1, 
  totalPages = 1, 
  totalItems = 0, 
  limit = 10,
  category
}: { 
  packages: Package[];
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  limit?: number;
  category?: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const onCategoryChange = (newCategory: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', '1'); // Reset pagination
    if (newCategory === "All") {
      params.delete('category');
    } else {
      params.set('category', newCategory);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    if (packages.length === 0) return;

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
  }, [packages]);

  return (
    <>
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

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-4 mb-12 relative z-20">
            {["All", "Domestic", "International"].map((tab) => {
              const isActive = (category || "All") === tab;
              return (
                <button
                  key={tab}
                  onClick={() => onCategoryChange(tab)}
                  className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 text-sm tracking-wide ${
                    isActive 
                      ? "bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.5)] scale-105" 
                      : "bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {packages.length === 0 ? (
            <div className="text-center py-20 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-3">No Packages Found</h3>
              <p className="text-gray-400">We couldn&apos;t find any packages in this category. Please try again later.</p>
            </div>
          ) : (
            <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10">
              {packages.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {packages.length > 0 && (
            <div className="mt-16 w-full max-w-8xl mx-auto">
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                limit={limit}
              />
            </div>
          )}
        </section>
      </main>
    </>
  );
}
