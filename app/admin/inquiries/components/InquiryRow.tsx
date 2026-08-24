"use client";

import { useState } from "react";
import { Eye, Clock, CheckCircle2, CircleDashed } from "lucide-react";
import { DeleteInquiryButton } from "./DeleteInquiryButton";
import { InquiryDetailsModal } from "./InquiryDetailsModal";
import { updateInquiryStatus } from "../actions";
import { toast } from "sonner";

export interface Inquiry {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  created_at: string;
  status?: string;
}

export function InquiryRow({ inquiry }: { inquiry: Inquiry }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState(inquiry.status || 'New');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setIsUpdating(true);
    
    const result = await updateInquiryStatus(inquiry.id, newStatus);
    if (!result.success) {
      toast.error(result.error || "Failed to update status");
      setStatus(inquiry.status || 'New'); // Revert
    } else {
      toast.success("Status updated successfully");
    }
    
    setIsUpdating(false);
  };

  const getStatusColor = (s: string) => {
    switch(s) {
      case 'Resolved': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'In Progress': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      default: return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
    }
  };

  const getStatusIcon = (s: string) => {
    switch(s) {
      case 'Resolved': return <CheckCircle2 className="w-3.5 h-3.5 mr-1" />;
      case 'In Progress': return <Clock className="w-3.5 h-3.5 mr-1" />;
      default: return <CircleDashed className="w-3.5 h-3.5 mr-1" />;
    }
  };

  return (
    <>
      <div className="group hover:bg-white/[0.04] p-4 transition-all duration-300">
        
        {/* Mobile View (Card) */}
        <div className="flex flex-col gap-4 lg:hidden">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setIsModalOpen(true)}>
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-lg uppercase shrink-0 border border-blue-500/20">
                {inquiry.full_name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-white group-hover:text-blue-400 transition-colors">
                  {inquiry.full_name}
                </h3>
                <span className="text-xs text-gray-500">
                  {new Date(inquiry.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className={`flex items-center px-2 py-1 rounded-full border text-xs font-medium ${getStatusColor(status)}`}>
              {getStatusIcon(status)}
              {status}
            </div>
          </div>
          
          <div className="text-sm text-gray-400 space-y-1">
            <div className="truncate">{inquiry.email}</div>
            {inquiry.phone && <div>{inquiry.phone}</div>}
          </div>
          
          <div>
            <span className="text-sm font-semibold text-gray-300">{inquiry.subject}</span>
            <p className="text-sm text-gray-500 line-clamp-1 mt-0.5">{inquiry.message}</p>
          </div>
          
          <div className="flex justify-end gap-2 pt-2 border-t border-white/5">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors font-medium text-sm flex items-center gap-2 cursor-pointer"
            >
              <Eye className="w-4 h-4" /> View
            </button>
            <DeleteInquiryButton id={inquiry.id} name={inquiry.full_name} />
          </div>
        </div>

        {/* Desktop View (Table Row) */}
        <div className="hidden lg:grid grid-cols-12 gap-4 items-center">
          {/* Customer */}
          <div className="col-span-3 flex items-center gap-3 cursor-pointer overflow-hidden pr-2" onClick={() => setIsModalOpen(true)}>
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-lg uppercase shrink-0 border border-blue-500/20">
              {inquiry.full_name.charAt(0)}
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-white group-hover:text-blue-400 transition-colors truncate">
                {inquiry.full_name}
              </h3>
              <span className="text-xs text-gray-500 truncate block">
                {new Date(inquiry.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Contact */}
          <div className="col-span-3 text-sm text-gray-400 overflow-hidden pr-2 flex flex-col justify-center">
            <span className="truncate block">{inquiry.email}</span>
            {inquiry.phone && <span className="truncate block mt-0.5">{inquiry.phone}</span>}
          </div>

          {/* Subject */}
          <div className="col-span-2 overflow-hidden pr-2 cursor-pointer" onClick={() => setIsModalOpen(true)}>
            <span className="text-sm font-semibold text-gray-300 truncate block">{inquiry.subject}</span>
            <p className="text-xs text-gray-500 truncate mt-0.5">{inquiry.message}</p>
          </div>

          {/* Status */}
          <div className="col-span-2">
            <div className="relative">
              <select
                value={status}
                onChange={handleStatusChange}
                disabled={isUpdating}
                className={`appearance-none bg-transparent pl-8 pr-6 py-1.5 rounded-full border text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer ${getStatusColor(status)} ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <option value="New" className="bg-slate-900 text-white">New</option>
                <option value="In Progress" className="bg-slate-900 text-white">In Progress</option>
                <option value="Resolved" className="bg-slate-900 text-white">Resolved</option>
              </select>
              <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                {getStatusIcon(status)}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="col-span-2 flex justify-end gap-2">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="p-2 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-xl transition-colors cursor-pointer"
              title="View Details"
            >
              <Eye className="w-4 h-4" />
            </button>
            <DeleteInquiryButton id={inquiry.id} name={inquiry.full_name} />
          </div>
        </div>

      </div>

      <InquiryDetailsModal
        inquiry={{...inquiry, status}}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
