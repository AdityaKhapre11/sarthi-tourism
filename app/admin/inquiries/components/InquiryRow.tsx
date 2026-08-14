"use client";

import { useState } from "react";
import { Eye } from "lucide-react";
import { DeleteInquiryButton } from "./DeleteInquiryButton";
import { InquiryDetailsModal } from "./InquiryDetailsModal";

interface Inquiry {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  created_at: string;
}

export function InquiryRow({ inquiry }: { inquiry: Inquiry }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="group bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] rounded-2xl p-4 transition-all duration-300">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          
          {/* Avatar/Initial */}
          <div className="hidden md:flex w-12 h-12 rounded-xl bg-blue-500/20 items-center justify-center text-blue-400 font-bold text-xl uppercase shrink-0 border border-blue-500/20">
            {inquiry.full_name.charAt(0)}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-1 w-full cursor-pointer" onClick={() => setIsModalOpen(true)}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-lg font-bold text-white truncate pr-4 group-hover:text-blue-400 transition-colors">
                {inquiry.full_name}
              </h3>
              <span className="text-sm text-gray-500 shrink-0">
                {new Date(inquiry.created_at).toLocaleDateString()}
              </span>
            </div>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-400">
              <span className="truncate max-w-[200px]">{inquiry.email}</span>
              {inquiry.phone && (
                <>
                  <span className="hidden sm:inline">•</span>
                  <span>{inquiry.phone}</span>
                </>
              )}
            </div>

            <div className="mt-2">
              <span className="text-sm font-semibold text-gray-300">{inquiry.subject}</span>
              <p className="text-sm text-gray-500 line-clamp-1 mt-0.5">
                {inquiry.message}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="w-full md:w-auto flex md:flex-col justify-end gap-3 shrink-0 border-t border-white/5 md:border-t-0 pt-4 md:pt-0">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-xl transition-colors border border-blue-500/20 font-medium"
            >
              <Eye className="w-4 h-4" />
              <span className="text-sm">View</span>
            </button>
            <div className="flex-1 md:flex-none">
              <DeleteInquiryButton id={inquiry.id} name={inquiry.full_name} />
            </div>
          </div>
          
        </div>
      </div>

      <InquiryDetailsModal
        inquiry={inquiry}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
