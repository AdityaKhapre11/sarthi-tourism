"use client";

import { X, Calendar, Mail, Phone, User, MessageSquare } from "lucide-react";

interface Inquiry {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  created_at: string;
}

interface InquiryDetailsModalProps {
  inquiry: Inquiry | null;
  isOpen: boolean;
  onClose: () => void;
}

export function InquiryDetailsModal({ inquiry, isOpen, onClose }: InquiryDetailsModalProps) {
  if (!isOpen || !inquiry) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-900/50">
          <h2 className="text-xl font-bold text-white">Inquiry Details</h2>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[70vh] space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Field: Date */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
              <div className="flex items-center gap-2 text-gray-400 mb-1">
                <Calendar className="w-4 h-4" />
                <span className="text-xs uppercase font-semibold tracking-wider">Date Received</span>
              </div>
              <p className="text-white font-medium">{new Date(inquiry.created_at).toLocaleString()}</p>
            </div>

            {/* Field: Name */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
              <div className="flex items-center gap-2 text-gray-400 mb-1">
                <User className="w-4 h-4" />
                <span className="text-xs uppercase font-semibold tracking-wider">Full Name</span>
              </div>
              <p className="text-white font-medium">{inquiry.full_name}</p>
            </div>

            {/* Field: Email */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
              <div className="flex items-center gap-2 text-gray-400 mb-1">
                <Mail className="w-4 h-4" />
                <span className="text-xs uppercase font-semibold tracking-wider">Email Address</span>
              </div>
              <a href={`mailto:${inquiry.email}`} className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                {inquiry.email}
              </a>
            </div>

            {/* Field: Phone */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
              <div className="flex items-center gap-2 text-gray-400 mb-1">
                <Phone className="w-4 h-4" />
                <span className="text-xs uppercase font-semibold tracking-wider">Phone Number</span>
              </div>
              <p className="text-white font-medium">{inquiry.phone || "Not provided"}</p>
            </div>
            
          </div>

          {/* Field: Subject */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/5">
            <div className="flex items-center gap-2 text-gray-400 mb-1">
              <MessageSquare className="w-4 h-4" />
              <span className="text-xs uppercase font-semibold tracking-wider">Subject</span>
            </div>
            <p className="text-white font-medium">{inquiry.subject}</p>
          </div>

          {/* Field: Message */}
          <div className="bg-blue-500/5 rounded-xl p-5 border border-blue-500/20 relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 rounded-l-xl" />
            <span className="text-xs uppercase text-blue-400 font-semibold tracking-wider mb-2 block">Message Content</span>
            <p className="text-gray-200 whitespace-pre-wrap leading-relaxed">
              {inquiry.message}
            </p>
          </div>

        </div>
        
        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 bg-slate-900/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
