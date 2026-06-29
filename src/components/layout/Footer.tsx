"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, ArrowRight } from "lucide-react";
import InstagramIcon from '@mui/icons-material/Instagram';
import { useLenis } from "@/components/layout";

export function Footer() {
  const pathname = usePathname();
  const lenis = useLenis();
  const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "8780228628";

  const handleScrollTo = (target: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    lenis?.scrollTo(target, { offset: -80 });
  };

  return (
    <footer className="relative bg-transparent text-gray-400 overflow-hidden">

      {/* Main Footer */}
      <div className="container relative z-10 mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          {/* Company Info */}
          <div className="lg:col-span-1 flex flex-col items-center justify-center">
            <Link
              href="/"
              onClick={handleScrollTo("#home")}
              className="inline-block"
            >
              <Image src="/images/logo1.png" alt="Sarthi Tourism Logo" width={120} height={42} className="object-contain opacity-90 hover:opacity-100 transition-opacity" />
            </Link>
            <p className="text-sm leading-relaxed mb-6 font-light">
              Crafting extraordinary journeys with premium itineraries. Discover the world's most breathtaking destinations in unparalleled comfort.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold font-heading text-lg mb-6 tracking-wide">Explore</h4>
            <ul className="space-y-3">
              {["Home", "Packages", "About", "Contact"].map((item) => {
                const target = item === "Home" ? "/" : item === "Packages" ? "/packages" : `/#${item.toLowerCase()}`;
                const hashId = target.startsWith("/#") ? target.substring(1) : "";
                return (
                  <li key={item}>
                    <Link
                      href={target}
                      onClick={(e) => {
                        if (pathname === "/" && hashId) {
                          e.preventDefault();
                          lenis?.scrollTo(hashId, { offset: -80 });
                        } else if (pathname === "/" && item === "Home") {
                          e.preventDefault();
                          lenis?.scrollTo(0, { offset: 0 });
                        }
                      }}
                      className="text-sm hover:text-white flex items-center group relative py-1"
                    >
                      <span className="absolute left-0 w-1.5 h-1.5 rounded-full bg-blue-500 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"></span>
                      <span className="transition-all duration-300 group-hover:translate-x-4 group-hover:translate-y-[2px]">{item}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Popular Tours */}
          <div>
            <h4 className="text-white font-bold font-heading text-lg mb-6 tracking-wide">Featured Tours</h4>
            <ul className="space-y-3">
              {[
                { name: "Ayodhya - Prayagraj", link: "/packages/1" },
                { name: "Malaysia Getaway", link: "/packages/2" },
                { name: "Kashmir Heaven on Earth", link: "/packages/3" },
                { name: "Custom Group Tours", link: "#contact" },
              ].map((tour, idx) => (
                <li key={idx}>
                  <Link
                    href={tour.link}
                    onClick={tour.link.startsWith("#") ? handleScrollTo(tour.link) : undefined}
                    className="text-sm hover:text-white flex items-center group relative py-1"
                  >
                    <span className="absolute left-0 w-1.5 h-1.5 rounded-full bg-blue-500 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"></span>
                    <span className="transition-all duration-300 group-hover:translate-x-4 group-hover:translate-y-[2px]">{tour.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold font-heading text-lg mb-6 tracking-wide">Get in Touch</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-4 group">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-blue-400 group-hover:bg-blue-500/20 transition-colors shrink-0">
                  <MapPin size={16} />
                </div>
                <span className="text-sm leading-relaxed">105, Siddhivinayak Complex, Mission Road, Nadiad 387002</span>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-blue-400 group-hover:bg-blue-500/20 transition-colors shrink-0">
                  <Phone size={16} />
                </div>
                <a href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noopener noreferrer" className="text-sm hover:text-white transition-colors">{`+91 ${WA_NUMBER}`}</a>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-blue-400 group-hover:bg-blue-500/20 transition-colors shrink-0">
                  <Mail size={16} />
                </div>
                <a href="mailto:info@sarthitourism.com" className="text-sm hover:text-white transition-colors">info@sarthitourism.com</a>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-blue-400 group-hover:bg-blue-500/20 transition-colors shrink-0">
                  <InstagramIcon sx={{ fontSize: 16 }} />
                </div>
                <a href="https://www.instagram.com/sarthitourism/" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-white transition-colors">@sarthitourism</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/5 bg-black/20">
        <div className="container mx-auto px-6 py-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-light text-gray-500">
          <p>&copy; {new Date().getFullYear()} Sarthi Tourism. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

