"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MapPin } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { useLenis } from "@/components/layout";

const destinations = [
  {
    id: 1,
    name: "Paris",
    country: "France",
    image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 2,
    name: "Bali",
    country: "Indonesia",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 3,
    name: "Santorini",
    country: "Greece",
    image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 4,
    name: "Kyoto",
    country: "Japan",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 5,
    name: "Rajasthan",
    country: "India",
    image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 6,
    name: "Kerala",
    country: "India",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 7,
    name: "Goa",
    country: "India",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=800",
  },
];

export function PopularDestinations() {
  const sectionRef = useRef<HTMLElement>(null);
  const carouselWrapperRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  const handleScrollTo = (target: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    lenis?.scrollTo(target, { offset: -80 });
  };

  const [emblaRef] = useEmblaCarousel(
    { loop: true, dragFree: true },
    [
      AutoScroll({
        playOnInit: true,
        stopOnInteraction: false,
        stopOnMouseEnter: false,
        speed: 1.2,
      }),
    ]
  );

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(carouselWrapperRef.current, {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (

    <section ref={sectionRef} className="py-20 md:py-32 bg-transparent overflow-hidden relative border-t border-white/5">
      {/* Decorative Blur */}

      <div className="absolute top-1/4 left-0 w-96 h-96 bg-blue-900/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 mb-12 md:mb-16">
        <div className="text-center">
          <span className="text-blue-400 font-semibold tracking-wider uppercase text-xs md:text-sm">
            Top Locations
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-white mt-3 mb-6 tracking-tight">
            Popular Destinations
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto font-light md:text-lg">
            Discover our most loved destinations around the globe. From pristine beaches to historic cities, find your perfect getaway.
          </p>
        </div>
      </div>

      <div ref={carouselWrapperRef} className="w-full relative z-10">
        <div className="overflow-hidden w-full cursor-grab active:cursor-grabbing" ref={emblaRef}>
          <div className="flex -ml-4 sm:-ml-6" style={{ touchAction: "pan-y pinch-zoom" }}>
            {destinations.map((dest) => (
              <div
                className="flex-[0_0_280px] md:flex-[0_0_400px] min-w-0 pl-4 sm:pl-6"
                key={dest.id}
              >
                <Link
                  href="#packages"
                  onClick={handleScrollTo("#packages")}
                  className="destination-card group relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden block shadow-2xl border border-white/10"
                >
                  <Image
                    src={dest.image}
                    alt={dest.name}
                    fill
                    sizes="(max-width: 768px) 280px, 400px"
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="absolute bottom-0 left-0 w-full p-8 text-white transform transition-transform duration-500 group-hover:-translate-y-2">
                    <h3 className="text-3xl font-bold font-heading mb-2 tracking-wide">{dest.name}</h3>
                    <div className="flex items-center text-sm text-gray-300 font-medium tracking-wider uppercase">
                      <MapPin className="mr-2 text-blue-400" /> {dest.country}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
