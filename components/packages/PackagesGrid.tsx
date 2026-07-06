"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Loader2, Plus } from "lucide-react";
import { PackageCard } from "@/components/packages";
import { fetchMorePackages } from "@/app/actions/packageActions";

interface PackagesGridProps {
  initialPackages: any[];
  totalCount: number;
}

export function PackagesGrid({ initialPackages, totalCount }: PackagesGridProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [packages, setPackages] = useState<any[]>(initialPackages);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const animateCards = () => {
    gsap.registerPlugin(ScrollTrigger);
    
    // Animate only cards that haven't been animated yet
    gsap.fromTo(
      ".package-card:not(.animated)",
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        onComplete: () => {
          document.querySelectorAll(".package-card:not(.animated)").forEach(el => {
            el.classList.add("animated");
          });
        },
        scrollTrigger: {
          trigger: cardsRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );
    ScrollTrigger.refresh();
  };

  useEffect(() => {
    if (packages.length === 0) return;
    const ctx = gsap.context(() => {
      animateCards();
    }, sectionRef);
    return () => ctx.revert();
  }, [packages]);

  const handleLoadMore = async () => {
    if (isLoadingMore || packages.length >= totalCount) return;
    
    setIsLoadingMore(true);
    const nextPage = page + 1;
    try {
      // User changed limit to 8 on the server, so we load 8 more
      const newPackages = await fetchMorePackages(nextPage, 8);
      if (newPackages.length > 0) {
        setPackages((prev) => [...prev, ...newPackages]);
        setPage(nextPage);
      }
    } catch (error) {
      console.error("Failed to load more packages:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
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

      <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10 pb-8">
        {packages.map((pkg) => (
          <div key={pkg.id} className="package-card opacity-0">
            <PackageCard pkg={pkg} />
          </div>
        ))}

        {/* Large "Load More" Card */}
        {packages.length > 0 && packages.length < totalCount && (
          <div className="package-card opacity-0 h-full min-h-[420px]">
            <button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="w-full h-full flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/20 bg-white/5 hover:bg-white/10 hover:border-blue-500/50 hover:shadow-[0_0_30px_-5px_rgba(37,99,235,0.3)] transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoadingMore ? (
                <div className="flex flex-col items-center justify-center">
                  <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                  <span className="text-xl font-bold text-white tracking-wide">Loading...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 group-hover:bg-blue-500/20">
                     <Plus className="w-10 h-10 text-blue-400" />
                  </div>
                  <span className="text-2xl font-bold text-white tracking-wide group-hover:text-blue-400 transition-colors">
                    Load More
                  </span>
                  <span className="text-sm font-medium text-gray-400 mt-3 tracking-widest uppercase">
                    {totalCount - packages.length} Packages Left
                  </span>
                </div>
              )}
            </button>
          </div>
        )}
      </div>
      
      {packages.length === 0 && (
        <div className="text-center text-gray-400 py-12">
          No packages found.
        </div>
      )}
    </section>
  );
}
