"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { Star } from "lucide-react";

import "swiper/css";
import "swiper/css/pagination";

const testimonials = [
  {
    id: 1,
    name: "Sarah Jenkins",
    role: "Adventure Enthusiast",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    text: "Sarthi Tourism completely transformed how I travel. Their attention to detail and custom itineraries made my trip to Bali absolutely unforgettable. Highly recommended!",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Business Traveler",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    text: "Professional, reliable, and incredibly efficient. They handle everything from flights to accommodations flawlessly. I won't travel with anyone else.",
    rating: 5,
  },
  {
    id: 3,
    name: "Emma Watson",
    role: "Family Vacationer",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200",
    text: "Planning a family trip can be stressful, but Sarthi Tourism made it a breeze. The kids loved the activities, and we had the perfect balance of relaxation and adventure.",
    rating: 4,
  },
  {
    id: 4,
    name: "Ava Watson",
    role: "Trip Vacationer",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200",
    text: "Planning a family trip can be stressful, but Sarthi Tourism made it a breeze. The kids loved the activities, and we had the perfect balance of relaxation and adventure.",
    rating: 4,
  },
];

export function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".testimonial-header", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });

      gsap.from(".testimonial-slider", {
        y: 60,
        opacity: 0,
        duration: 1,
        delay: 0.2,
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
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="testimonial-header text-center mb-12 md:mb-16">
          <span className="text-blue-400 font-semibold tracking-wider uppercase text-xs md:text-sm">
            Client Feedback
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-white mt-3 mb-6 tracking-tight">
            What Our Travelers Say
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto font-light md:text-lg">
            Don&apos;t just take our word for it. Read the experiences of thousands of satisfied travelers who chose Sarthi Tourism for their journeys.
          </p>
        </div>

        <div className="testimonial-slider max-w-4xl mx-auto relative">
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={{ delay: 6000, disableOnInteraction: false }}
            className="pb-25"
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id}>
                <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 shadow-2xl text-center mx-4 md:mx-8 mt-4 mb-14 border border-white/10">
                  <div className="flex justify-center gap-1.5 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
                      />
                    ))}
                  </div>
                  <p className="text-xl md:text-2xl text-gray-300 italic mb-8 leading-relaxed font-light">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 relative rounded-full overflow-hidden mb-4 border-2 border-white/20 p-0.5">
                      <div className="w-full h-full relative rounded-full overflow-hidden">
                        <Image
                          src={testimonial.image}
                          alt={testimonial.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <h4 className="font-bold font-heading text-lg text-white tracking-wide">{testimonial.name}</h4>
                    <span className="text-sm text-blue-400 tracking-wider uppercase mt-1">{testimonial.role}</span>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
