import Link from "next/link";
import { Clock, ArrowRight, Sparkles } from "lucide-react";
import { ImageWithSkeleton } from "@/components/ui";
import { Package } from "@/data/packages";

interface PackageCardProps {
  pkg: Package;
  isFeatured?: boolean;
}

export function PackageCard({ pkg, isFeatured = false }: PackageCardProps) {
  return (
    <Link
      href={`/packages/${pkg.id}`}
      className="package-card group relative bg-white/5 backdrop-blur-sm rounded-[2.5rem] border border-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden flex flex-col shadow-2xl hover:-translate-y-2"
    >
      <div className="relative h-72 overflow-hidden shrink-0 m-2 rounded-[2rem]">
        <ImageWithSkeleton
          src={pkg.image}
          alt={pkg.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />

        {/* Featured / New Badge */}
        {isFeatured && (
          <div className="absolute top-4 right-4 z-20 group">
            {/* Subtle outer glow */}
            <div className="absolute inset-0 bg-[#ff7900] rounded-full blur-md opacity-50 animate-pulse"></div>
            {/* Badge Content */}
            <div className="relative bg-gradient-to-r from-[#ff7900] to-[#ff5e00] text-white text-[10px] sm:text-xs font-bold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 border border-white/25 shadow-xl backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
              <Sparkles size={14} className="text-white/90 animate-pulse" />
              <span className="tracking-widest uppercase drop-shadow-sm">New</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-8 pt-4 flex flex-col flex-grow text-left">
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
              <span
                key={idx}
                className="bg-white/5 border border-white/10 text-gray-300 text-[10px] font-medium px-3 py-1.5 rounded-full uppercase tracking-wider"
              >
                {highlight}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/10">
          <div>
            <span className="text-xs text-gray-500 uppercase tracking-widest block mb-1">
              Starting from
            </span>
            <div className="text-2xl md:text-3xl font-bold text-white">{pkg.price}</div>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-600 group-hover:bg-blue-500 flex items-center justify-center text-white transition-all transform group-hover:rotate-45">
            <ArrowRight size={20} className="-rotate-45 group-hover:rotate-0 transition-transform duration-300" />
          </div>
        </div>
      </div>
    </Link>
  );
}
