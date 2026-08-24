"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Edit, Map, Plus } from "lucide-react";
import { DeletePackageButton, PaginationControls } from "@/components/ui";
import { formatPrice } from "@/lib/utils";

export function PackageListClient({ packages, page, totalPages, totalItems, limit }: any) {
  const [selectedId, setSelectedId] = useState<string | number | null>(null);

  if (packages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-white/[0.02] border border-white/5 rounded-2xl">
        <Map className="w-16 h-16 text-gray-600 mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">No Packages Found</h3>
        <p className="text-gray-400 mb-6 max-w-sm text-center">You haven't added any tour packages yet. Create your first package to get started.</p>
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
    <div className="grid gap-6">
      {packages.map((pkg: any) => {
        const isSelected = selectedId === pkg.id;

        return (
          <div 
            key={pkg.id} 
            onClick={() => setSelectedId(isSelected ? null : pkg.id)}
            className={`group bg-white/[0.02] border hover:bg-white/[0.04] rounded-2xl p-4 transition-all duration-300 relative cursor-pointer ${
              isSelected ? "border-blue-500 ring-1 ring-blue-500" : "border-white/5 hover:border-white/10"
            }`}
          >
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              
              {/* Image */}
              <div className="relative w-full md:w-48 h-32 md:h-28 rounded-xl overflow-hidden shrink-0">
                {pkg.image ? (
                  <Image src={pkg.image} alt={pkg.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full bg-white/5 flex items-center justify-center">
                    <Map className="w-8 h-8 text-gray-500" />
                  </div>
                )}
                <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-medium text-white border border-white/10 shadow-lg">
                  {pkg.duration}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 space-y-2 pointer-events-none">
                <div className="flex items-start justify-between gap-4">
                  <h3 className={`text-xl font-bold line-clamp-2 leading-tight transition-colors ${isSelected ? "text-blue-400" : "text-white group-hover:text-blue-400"}`}>
                    {pkg.name}
                  </h3>
                  <div className="hidden md:block text-right shrink-0">
                    <div className="text-sm text-gray-400 mb-0.5">Starting from</div>
                    <div className="text-2xl font-bold text-green-400">{formatPrice(pkg.price)}</div>
                  </div>
                </div>

                <div className="md:hidden flex items-center gap-2 mb-3">
                  <span className="text-sm text-gray-400">Starting from:</span>
                  <span className="font-bold text-green-400">{formatPrice(pkg.price)}</span>
                </div>

                {pkg.highlights && pkg.highlights.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {pkg.highlights.slice(0, 3).map((highlight: string, idx: number) => (
                      <span key={idx} className="px-2.5 py-1 bg-white/5 border border-white/5 rounded-full text-xs text-gray-300">
                        {highlight}
                      </span>
                    ))}
                    {pkg.highlights.length > 3 && (
                      <span className="px-2.5 py-1 bg-white/5 border border-white/5 rounded-full text-xs text-gray-500">
                        +{pkg.highlights.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div 
                className="w-full md:w-auto flex md:flex-col justify-end gap-3 shrink-0 border-t border-white/5 md:border-t-0 pt-4 md:pt-0 relative z-10"
                onClick={(e) => e.stopPropagation()} // prevent row click when clicking buttons
              >
                {isSelected ? (
                  <Link 
                    href={`/admin/packages/edit/${pkg.id}`} 
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-xl transition-colors border border-blue-500/20 cursor-pointer"
                  >
                    <Edit className="w-4 h-4" />
                    <span className="text-sm font-medium">Edit</span>
                  </Link>
                ) : (
                  <button 
                    disabled
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-gray-500/10 text-gray-500 rounded-xl transition-colors border border-gray-500/20 opacity-50 cursor-not-allowed"
                  >
                    <Edit className="w-4 h-4" />
                    <span className="text-sm font-medium">Edit</span>
                  </button>
                )}
                
                <div className={`flex-1 md:flex-none ${!isSelected ? "opacity-50" : ""}`}>
                  <DeletePackageButton id={pkg.id} packageName={pkg.name} disabled={!isSelected} />
                </div>
              </div>

            </div>
          </div>
        );
      })}

      {packages.length > 0 && (
        <PaginationControls
          currentPage={page}
          totalPages={totalPages}
          totalItems={totalItems}
          limit={limit}
        />
      )}
    </div>
  );
}
