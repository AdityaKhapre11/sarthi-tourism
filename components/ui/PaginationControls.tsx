"use client";

import { useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Loader2, ChevronDown } from "lucide-react";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  limit: number;
}

export function PaginationControls({
  currentPage,
  totalPages,
  totalItems,
  limit,
}: PaginationControlsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleLimitChange = (newLimit: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("limit", newLimit.toString());
    params.set("page", "1");
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  if (totalPages <= 1 && totalItems === 0) return null;

  // Generate page numbers safely
  const getVisiblePages = () => {
    const pages = [];
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + 4);
    
    if (end - start < 4) {
      start = Math.max(1, end - 4);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-6 py-4 px-6 bg-white/[0.02] border border-white/5 rounded-2xl shadow-sm backdrop-blur-md animate-in fade-in duration-500">
      
      {/* Left: Info */}
      <div className="flex items-center text-sm text-gray-400">
        <div>
          Showing <span className="font-medium text-white">{Math.min((currentPage - 1) * limit + 1, totalItems)}</span> to <span className="font-medium text-white">{Math.min(currentPage * limit, totalItems)}</span> of <span className="font-medium text-white">{totalItems}</span> results
        </div>
      </div>

      {/* Center: Pagination numbers */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1 || isPending}
          className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Prev</span>
        </button>

        <div className="flex items-center gap-1">
          {isPending ? (
            <div className="w-9 h-9 flex items-center justify-center">
               <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
            </div>
          ) : (
            getVisiblePages().map(page => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                  currentPage === page 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {page}
              </button>
            ))
          )}
        </div>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages || isPending}
          className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Right: Select Limit */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500">Per page:</span>
        <div className="relative">
          <select
            value={limit}
            onChange={(e) => handleLimitChange(Number(e.target.value))}
            disabled={isPending}
            className="appearance-none bg-white/5 border border-white/10 hover:border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50 py-1.5 pl-3 pr-8 cursor-pointer disabled:opacity-50 transition-colors"
          >
            <option value="10" className="bg-[#0f172a] text-white">10</option>
            <option value="20" className="bg-[#0f172a] text-white">20</option>
            <option value="50" className="bg-[#0f172a] text-white">50</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>
      
    </div>
  );
}
