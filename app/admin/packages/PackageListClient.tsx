"use client";

import Link from "next/link";
import Image from "next/image";
import { Edit, Map, Plus } from "lucide-react";
import { DeletePackageButton, PaginationControls } from "@/components/ui";
import { formatPrice } from "@/lib/utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function PackageListClient({ packages, page, totalPages, totalItems, limit }: any) {
  if (packages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-white/[0.02] border border-white/5 rounded-2xl">
        <Map className="w-16 h-16 text-gray-600 mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">No Packages Found</h3>
        <p className="text-gray-400 mb-6 max-w-sm text-center">You haven&apos;t added any tour packages yet. Create your first package to get started.</p>
        <Link
          href="/admin/packages/new"
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl transition-all cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          <span>Create Package</span>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-6">
        {packages.map((pkg: any) => {
          return (
            <div 
              key={pkg.id} 
              className="group bg-slate-900/60 backdrop-blur-xl border border-white/10 hover:border-blue-500/50 rounded-2xl p-5 transition-all duration-300 relative hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)] hover:-translate-y-1"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                
                {/* Image */}
                <div className="relative w-full md:w-64 h-48 md:h-36 rounded-xl overflow-hidden shrink-0 shadow-lg">
                  {pkg.image ? (
                    <>
                      <Image src={pkg.image} alt={pkg.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300"></div>
                    </>
                  ) : (
                    <div className="w-full h-full bg-slate-800 flex items-center justify-center border border-white/5">
                      <Map className="w-10 h-10 text-slate-600" />
                    </div>
                  )}
                  {pkg.category && (
                    <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase border backdrop-blur-md shadow-lg z-10 ${pkg.category.toLowerCase() === 'domestic' ? 'bg-green-500/80 text-green-100 border-green-400/50' : 'bg-blue-500/80 text-blue-100 border-blue-400/50'}`}>
                      {pkg.category}
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide text-white border border-white/10 shadow-lg flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                    {pkg.duration}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-4 pointer-events-none w-full py-1">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-2xl font-bold line-clamp-2 leading-tight transition-colors text-white group-hover:text-blue-400">
                      {pkg.name}
                    </h3>
                    
                    {/* Price Badge - Desktop */}
                    <div className="hidden md:flex flex-col items-end shrink-0">
                      <span className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-1.5">Starting from</span>
                      <div className="bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-xl shadow-[0_0_15px_-3px_rgba(34,197,94,0.2)]">
                        <span className="text-2xl font-black text-green-400 tracking-tight">{formatPrice(pkg.price)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Price Badge - Mobile */}
                  <div className="md:hidden flex items-center justify-between mb-3 bg-slate-800/50 p-4 rounded-xl border border-white/5">
                    <span className="text-xs uppercase font-bold tracking-wider text-slate-400">Starting from</span>
                    <span className="text-xl font-black text-green-400">{formatPrice(pkg.price)}</span>
                  </div>

                  {/* Highlights */}
                  {pkg.highlights && pkg.highlights.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {pkg.highlights.slice(0, 3).map((highlight: string, idx: number) => (
                        <span key={idx} className="px-3 py-1.5 bg-slate-800/80 border border-slate-700 rounded-lg text-xs text-slate-200 font-medium shadow-sm">
                          {highlight}
                        </span>
                      ))}
                      {pkg.highlights.length > 3 && (
                        <span className="px-3 py-1.5 bg-slate-800/50 border border-slate-700 rounded-lg text-xs text-slate-400 font-medium">
                          +{pkg.highlights.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="w-full md:w-44 flex flex-row md:flex-col justify-end items-stretch gap-3 shrink-0 border-t border-white/10 md:border-t-0 pt-5 md:pt-0 relative z-10">
                  <Link 
                    href={`/admin/packages/edit/${pkg.id}`} 
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all shadow-[0_0_15px_-3px_rgba(37,99,235,0.4)] cursor-pointer hover:-translate-y-0.5 font-bold text-sm"
                  >
                    <Edit className="w-4 h-4 shrink-0" />
                    <span>Edit Package</span>
                  </Link>
                  
                  <div className="flex-1 flex items-stretch">
                    <DeletePackageButton id={pkg.id} packageName={pkg.name} />
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {packages.length > 0 && (
        <PaginationControls
          currentPage={page}
          totalPages={totalPages}
          totalItems={totalItems}
          limit={limit}
        />
      )}
    </>
  );
}
