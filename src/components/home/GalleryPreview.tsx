"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import InstagramIcon from '@mui/icons-material/Instagram';
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";

const galleryImages = [
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1504150558240-0b4fd8946624?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=600", // Extra image for better loop
];

export function GalleryPreview() {
  const sectionRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  const [emblaRef] = useEmblaCarousel(
    { loop: true, dragFree: true },
    [
      AutoScroll({
        playOnInit: true,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
        speed: 1.2,
      }),
    ]
  );

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(galleryRef.current, {
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
    <section ref={sectionRef} className="py-20 md:py-32 bg-transparent overflow-hidden border-t border-white/5">
      <div className="container mx-auto px-4 mb-12 md:mb-16">
        <div className="text-center">
          <span className="text-blue-400 font-semibold tracking-wider uppercase text-xs md:text-sm">
            Travel Memories
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-white mt-3 mb-6 tracking-tight">
            Follow Us On Instagram
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto flex items-center justify-center gap-2 font-light md:text-lg">
            <InstagramIcon className="text-pink-500 w-8 h-8" />
            <a href="https://www.instagram.com/sarthitourism/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">@sarthitourism</a>
          </p>
        </div>
      </div>

      <div ref={galleryRef} className="w-full">
        {/* Embla Viewport */}
        <div className="overflow-hidden w-full cursor-grab active:cursor-grabbing" ref={emblaRef}>
          {/* Embla Container */}
          <div className="flex -ml-4 sm:-ml-6" style={{ touchAction: "pan-y pinch-zoom" }}>
            {galleryImages.map((img, idx) => (
              <div
                className="flex-[0_0_280px] md:flex-[0_0_340px] min-w-0 pl-4 sm:pl-6"
                key={idx}
              >
                <a
                  href="https://www.instagram.com/sarthitourism/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gallery-item relative block overflow-hidden rounded-3xl group cursor-pointer h-full border border-white/10"
                  style={{ aspectRatio: "4/5" }}
                >
                  <Image
                    src={img}
                    alt={`Gallery image ${idx + 1}`}
                    fill
                    sizes="(max-width: 768px) 280px, 340px"
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity duration-500 group-hover:opacity-100 backdrop-blur-sm">
                    <InstagramIcon sx={{ fontSize: 50 }} className="text-white" />
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
