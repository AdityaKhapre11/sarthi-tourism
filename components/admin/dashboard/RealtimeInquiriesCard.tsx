"use client";

import { useState, useEffect } from "react";
import { Users } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface RealtimeInquiriesCardProps {
  initialUnreadCount: number;
}

export function RealtimeInquiriesCard({ initialUnreadCount }: RealtimeInquiriesCardProps) {
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount);

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel('public:inquiries:unread')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'inquiries' },
        (payload) => {
          // New inquiry added (default is_read = false usually)
          if (payload.new && (payload.new.is_read === false || payload.new.is_read === null || payload.new.is_read === undefined)) {
             setUnreadCount((current) => current + 1);
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'inquiries' },
        (payload) => {
          const oldRead = payload.old?.is_read;
          const newRead = payload.new?.is_read;
          
          if (!oldRead && newRead) {
            // Marked as read
            setUnreadCount((current) => Math.max(0, current - 1));
          } else if (oldRead && !newRead) {
            // Marked as unread
            setUnreadCount((current) => current + 1);
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'inquiries' },
        (payload) => {
          if (!payload.old?.is_read) {
             setUnreadCount((current) => Math.max(0, current - 1));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 backdrop-blur-xl hover:bg-white/[0.04] transition-all duration-300">
      <div className="flex justify-between items-start">
        <div className="min-w-0 pr-2">
          <p className="text-sm font-medium text-gray-400 mb-1 truncate">Active Inquiries</p>
          <h3 className="text-3xl font-bold text-white">{unreadCount}</h3>
        </div>
        <div className="relative p-3 rounded-xl bg-emerald-400/10">
          <Users className="w-6 h-6 text-emerald-400" />
          
          {unreadCount > 0 && (
            <div className="absolute -top-1.5 -right-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white shadow-[0_0_10px_rgba(239,68,68,0.5)]">
              {unreadCount}
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-40"></span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
