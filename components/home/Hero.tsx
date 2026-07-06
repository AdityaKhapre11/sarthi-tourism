"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "@/components/layout";
import { AnimatePresence, motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const heroImages = [
  "/images/hero.png",
  "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80&w=1920", // Kerala Backwaters, India
  "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=1920", // Goa, India
  "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&q=80&w=1920", // Ladakh, India
];

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScrollTo = (target: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    lenis?.scrollTo(target, { offset: -80 });
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax Effect on the wrapper
      gsap.to(imageWrapperRef.current, {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // Text Reveal
      gsap.from(".hero-text", {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power4.out",
        delay: 0.2,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="home" ref={containerRef} className="relative h-screen w-full overflow-hidden flex items-center justify-center">

      {/* Background Image Carousel */}
      <div ref={imageWrapperRef} className="absolute inset-0 z-0 h-[120%] -top-[10%] w-full">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={heroImages[currentIndex]}
              alt={`Sarthi Tourism Premium Travel Destination - Breathtaking views ${currentIndex + 1}`}
              fill
              className="object-cover"
              priority={currentIndex === 0}
            />
          </motion.div>
        </AnimatePresence>
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70 z-10 pointer-events-none" />
      </div>

      {/* Content */}
      <div className="container relative z-20 mx-auto px-4 mt-30 lg:mt-35 text-center" ref={textRef}>
        <span className="hero-text block text-blue-400 font-semibold tracking-wider uppercase mb-4 text-sm md:text-base">
          Discover the Unseen
        </span>
        <h1 className="hero-text text-4xl md:text-6xl lg:text-8xl font-bold text-white mb-6 font-heading leading-tight">
          Explore The World <br className="hidden sm:block" /> With Sarthi Tourism
        </h1>
        <p className="hero-text text-base md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto">
          Experience premium travel and curated tours designed just for you. Your next adventure awaits.
        </p>

        <div className="hero-text flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="#packages"
            onClick={handleScrollTo("#packages")}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-all transform hover:scale-105 active:scale-95"
          >
            Explore Tours
          </Link>
          <Link
            href="#contact"
            onClick={handleScrollTo("#contact")}
            className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 rounded-full font-medium transition-all transform hover:scale-105 active:scale-95"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}

