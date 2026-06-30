"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useSpring, Variants, useMotionValueEvent } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Clock, Check, X, ArrowLeft, MapPin, Star, Calendar, Shield, Coffee } from "lucide-react";
import { MessageCircle, Plane } from "lucide-react";
import { Package } from "@/data/packages";
import { useRef, useState } from "react";
import { ImageGallery } from "@/components/ui";
import { Button } from "@/components/ui/button";

interface PackageDetailsClientProps {
  pkg: Package;
  whatsappUrl: string;
}

export default function PackageDetailsClient({ pkg, whatsappUrl }: PackageDetailsClientProps) {
  const containerRef = useRef(null);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, 300]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });

  const heroRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Advanced text reveal for the title
    gsap.fromTo(
      ".hero-word",
      { y: 120, opacity: 0, rotate: 5, scale: 0.9 },
      { y: 0, opacity: 1, rotate: 0, scale: 1, stagger: 0.1, duration: 1.2, ease: "power4.out", delay: 0.2 }
    );
    // Smooth fade for the rest of the elements
    gsap.fromTo(
      ".hero-fade",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: "power3.out", delay: 0.6 }
    );
  }, { scope: heroRef });

  // Animation Variants
  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <div className="bg-transparent min-h-screen font-sans selection:bg-blue-500 selection:text-white text-gray-200">

      <div ref={heroRef} className="relative h-[80vh] min-h-[700px] w-full overflow-hidden">
        <motion.div
          style={{ y: smoothY }}
          className="absolute inset-0 w-full h-full"
        >
          <ImageGallery images={pkg.gallery && pkg.gallery.length > 0 ? pkg.gallery : [pkg.image]} alt={pkg.name} />
        </motion.div>

        {/* Multi-layered dramatic gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/20 to-transparent pointer-events-none" />

        {/* Hero Content */}
        <div className="absolute bottom-25 left-0 w-full px-6 md:px-12 z-10">
          <div className="container mx-auto max-w-7xl">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-[1.05] tracking-tighter flex flex-wrap gap-x-4 overflow-hidden">
              {pkg.name.split(" ").map((word, i) => (
                <span key={i} className="overflow-hidden inline-block pb-2">
                  <span className="hero-word inline-block opacity-0 origin-bottom-left">
                    {word}
                  </span>
                </span>
              ))}
            </h1>

            {pkg.highlights && pkg.highlights.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-4 hero-fade opacity-0">
                {pkg.highlights.map((highlight, idx) => (
                  <span key={idx} className="bg-white/[0.03] backdrop-blur-3xl text-gray-200 text-sm font-semibold tracking-wide px-6 py-3 rounded-full border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all cursor-default">
                    {highlight}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- Main Content Layout --- */}
      <div className="container mx-auto px-6 md:px-12 -mt-4 relative z-20 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">

          {/* Left Column - Details */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="w-full lg:w-[65%] space-y-12"
          >

            {/* Overview Section - Minimalist luxury */}
            <div className="relative pt-8">
              <h2 className="text-sm font-bold text-blue-500 uppercase tracking-[0.2em] mb-4">The Experience</h2>
              <div className="relative">
                <p
                  className={`text-gray-300 leading-relaxed text-xl md:text-2xl font-light transition-all duration-500 ${isDescriptionExpanded ? "" : "line-clamp-3"}`}
                >
                  {pkg.description || "Discover the beauty and culture with our specially curated tour package designed for the perfect getaway."}
                </p>

                {/* Read More Toggle */}
                {pkg.description && pkg.description.length > 150 && (
                  <Button
                    variant="link"
                    onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                    className="text-blue-400 font-bold text-sm md:text-base mt-4 hover:text-blue-300 transition-colors uppercase tracking-widest flex items-center gap-2 p-0 h-auto"
                  >
                    {isDescriptionExpanded ? "Read Less" : "Read More"}
                  </Button>
                )}
              </div>
            </div>

            {/* Quick Stats Bento */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
              {[
                { icon: Clock, label: "Duration", value: pkg.duration },
                { icon: Calendar, label: "Availability", value: "Year Round" },
                { icon: Shield, label: "Support", value: "24/7 Guide" },
                { icon: Coffee, label: "Meals", value: "Included" },
              ].map((stat, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col items-center justify-center text-center backdrop-blur-sm hover:bg-white/10 transition-colors">
                  <stat.icon className="text-blue-400 text-2xl mb-3" />
                  <span className="text-xs text-gray-500 uppercase tracking-wider mb-1">{stat.label}</span>
                  <span className="text-gray-200 font-semibold">{stat.value}</span>
                </div>
              ))}
            </div>

            {/* Premium Itinerary Timeline */}
            {pkg.itinerary && pkg.itinerary.length > 0 && (
              <div className="pt-12">
                <h2 className="text-sm font-bold text-blue-500 uppercase tracking-[0.2em] mb-10">Curated Itinerary</h2>

                <AnimatedTimeline itinerary={pkg.itinerary} />
              </div>
            )}

            {/* Inclusions & Exclusions Bento Grid */}
            <div className="grid md:grid-cols-2 gap-6 pt-12">
              {pkg.included && pkg.included.length > 0 && (
                <div className="bg-gradient-to-b from-white/5 to-transparent border border-white/[0.05] rounded-[2rem] p-8 md:p-10">
                  <h2 className="text-sm font-bold text-[#00e676] uppercase tracking-[0.15em] mb-8 flex items-center">
                    <Check className="mr-3 text-lg" strokeWidth={3} /> INCLUDED
                  </h2>
                  <ul className="space-y-6">
                    {pkg.included.map((item, idx) => (
                      <li key={idx} className="flex items-center text-gray-300 text-[15px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00e676] mr-4 shrink-0 shadow-[0_0_8px_rgba(0,230,118,0.5)]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {pkg.excluded && pkg.excluded.length > 0 && (
                <div className="bg-gradient-to-b from-white/5 to-transparent border border-white/[0.05] rounded-[2rem] p-8 md:p-10">
                  <h2 className="text-sm font-bold text-[#ff5252] uppercase tracking-[0.15em] mb-8 flex items-center">
                    <X className="mr-3 text-lg" strokeWidth={3} /> EXCLUDED
                  </h2>
                  <ul className="space-y-6">
                    {pkg.excluded.map((item, idx) => (
                      <li key={idx} className="flex items-center text-gray-300 text-[15px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ff5252] mr-4 shrink-0 shadow-[0_0_8px_rgba(255,82,82,0.5)]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

          </motion.div>

          {/* Right Column - Premium Sticky Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            className="w-full lg:w-[35%]"
          >
            <div className="sticky mt-15 top-32 bg-white/5 backdrop-blur-2xl rounded-[2rem] p-8 border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.4)] relative overflow-hidden">
              {/* Background Glow */}
              <div className="absolute -top-32 -right-32 w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full pointer-events-none" />

              <div className="relative z-10">
                <span className="text-sm font-semibold text-gray-500 uppercase tracking-[0.2em] block mb-4">Get this Package</span>
                <div className="text-4xl md:text-5xl font-bold text-white tracking-tighter mb-2">
                  {pkg.price}
                </div>
                {pkg.price !== "Contact Us" && <span className="text-sm font-medium text-gray-500 block">per person</span>}

                <div className="h-px w-full bg-gradient-to-r from-white/10 via-white/5 to-transparent my-10" />

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative w-full py-5 px-8 bg-white text-black font-bold text-sm md:text-lg rounded-full flex items-center justify-center overflow-hidden transition-all duration-500 hover:scale-[1.02] shadow-[0_0_40px_rgba(255,255,255,0.1)]"
                >
                  <div className="absolute inset-0 bg-[#25D366] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <MessageCircle className="text-2xl mr-3 relative z-10 group-hover:text-white transition-colors duration-500" />
                  <span className="relative z-10 group-hover:text-white transition-colors duration-500">Book Your Package</span>
                </a>

                <p className="text-center text-xs font-medium text-gray-500 mt-6 uppercase tracking-widest">
                  Connect instantly via WhatsApp
                </p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Travel-Themed Premium Divider */}
      <div className="w-full relative flex items-center justify-center py-12">
        <div className="flex items-center justify-center w-full opacity-80">
          <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-blue-500" />
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,1)] mx-3 sm:mx-6" />
          <div className="w-12 sm:w-24 h-[1px] bg-blue-500" />
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <Plane className="text-blue-400 text-2xl mx-4 sm:mx-8 drop-shadow-[0_0_10px_rgba(59,130,246,0.8)] rotate-45 " />
          </motion.div>
          <div className="w-12 sm:w-24 h-[1px] bg-blue-500" />
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,1)] mx-3 sm:mx-6" />
          <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-blue-500/50 to-blue-500" />
        </div>
      </div>
    </div>
  );
}

const AnimatedTimeline = ({ itinerary }: { itinerary: Package['itinerary'] }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  // Instant 1-to-1 mapping for the plane's vertical position
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // Lucide Plane icon points diagonally (Top-Right) by default.
  // Base rotation needed to point straight right is +45deg.
  // To point straight DOWN: 45 + 90 = 135
  // To point straight UP: 45 - 90 = -45 (or 315)
  const [rotation, setRotation] = useState(135);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // If we reach the very bottom, force the plane to rotate up
    if (latest >= 0.99) {
      setRotation(315);
      return;
    }

    const previous = scrollYProgress.getPrevious() || 0;
    // Add a tiny threshold so it doesn't jitter on minor scroll bounces
    if (latest - previous > 0.002) {
      setRotation(135); // Facing Down
    } else if (previous - latest > 0.002) {
      setRotation(315); // Facing Up
    }
  });

  return (
    <div ref={containerRef} className="relative py-10 my-4">
      {/* Background Dim Line */}
      <div className="absolute top-0 bottom-0 left-6 md:left-1/2 w-[2px] bg-white/10 -translate-x-1/2 rounded-full" />

      {/* Illuminated Progress Line */}
      <motion.div
        style={{ height: lineHeight }}
        className="absolute top-0 left-6 md:left-1/2 w-[2px] bg-gradient-to-b from-blue-400 to-blue-600 -translate-x-1/2 shadow-[0_0_15px_rgba(59,130,246,0.8)] origin-top z-0 rounded-full"
      />

      {/* Airplane Traveling Along Scroll */}
      <motion.div
        style={{ top: lineHeight }}
        className="absolute left-6 md:left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
      >
        <motion.div
          animate={{ y: [-3, 3, -3] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="relative flex items-center justify-center w-8 h-8"
        >
          {/* Dynamic Contrail */}
          <div
            className={`absolute left-1/2 -translate-x-1/2 w-[2px] h-16 blur-[1px] rounded-full transition-opacity duration-300 ${rotation === 90
              ? "bg-gradient-to-t from-blue-400/80 to-transparent bottom-1/2 translate-y-3"
              : "bg-gradient-to-b from-blue-400/80 to-transparent top-1/2 -translate-y-3"
              }`}
          />

          {/* Airplane */}
          <motion.div
            animate={{ rotate: rotation }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="absolute text-3xl text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] z-10 flex items-center justify-center"
          >
            <Plane size={35} className="fill-white" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Milestones Container */}
      <div className="space-y-16">
        {itinerary?.map((day, idx) => (
          <TimelineNode key={idx} day={day} />
        ))}
      </div>
    </div>
  );
};

const TimelineNode = ({ day }: { day: import("@/data/packages").ItineraryItem }) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, margin: "0px 0px -50% 0px" }}
      variants={{
        hidden: { opacity: 0.5 },
        visible: { opacity: 1 }
      }}
      className="relative flex items-center justify-end md:even:justify-start w-full group py-4"
    >
      {/* Node Marker (Perfectly Centered) */}
      <motion.div
        variants={{
          hidden: { backgroundColor: "var(--background)", borderColor: "rgba(255,255,255,0.1)", color: "rgba(156,163,175,1)", boxShadow: "0 0 0 rgba(0,0,0,0)" },
          visible: { backgroundColor: "#1e3a8a", borderColor: "rgba(96,165,250,1)", color: "rgba(255,255,255,1)", boxShadow: "0 0 20px rgba(59,130,246,0.6)" }
        }}
        transition={{ duration: 0.5 }}
        className="absolute left-6 md:left-1/2 -translate-x-1/2 flex items-center justify-center w-12 h-12 rounded-full border-2 font-bold z-10 transition-transform duration-500 group-hover:scale-110"
      >
        <motion.div
          variants={{
            hidden: { scale: 1 },
            visible: { scale: [1, 1.15, 1] }
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          {day.day}
        </motion.div>
      </motion.div>

      {/* Content Card (Alternating) */}
      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] relative z-0">
        <motion.div
          variants={{
            hidden: { backgroundColor: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.05)" },
            visible: { backgroundColor: "rgba(59,130,246,0.08)", borderColor: "rgba(59,130,246,0.3)" }
          }}
          transition={{ duration: 0.5 }}
          className="p-8 rounded-3xl border backdrop-blur-md transition-colors duration-300 hover:bg-white/[0.04]"
        >
          <h3 className="font-bold text-white text-xl mb-3 tracking-wide">{day.title}</h3>
          <p className="text-gray-400 leading-relaxed text-sm md:text-base">{day.description}</p>
        </motion.div>
      </div>
    </motion.div>
  );
};
