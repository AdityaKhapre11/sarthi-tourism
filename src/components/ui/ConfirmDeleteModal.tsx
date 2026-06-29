"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  isDeleting?: boolean;
}

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Delete",
  message = "Are you sure you want to delete this item? This action cannot be undone.",
  isDeleting = false,
}: ConfirmDeleteModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const mainEl = document.getElementById("admin-main-content");
    if (isOpen) {
      document.body.style.overflow = "hidden";
      if (mainEl) mainEl.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      if (mainEl) mainEl.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "unset";
      if (mainEl) mainEl.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card border border-white/10 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative animate-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
            {title}
          </h3>
          <Button
            variant="ghost"
            size="lg"
            onClick={onClose}
            disabled={isDeleting}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-gray-300 text-sm mb-6">
            {message}
          </p>

          <div className="flex justify-end gap-3">
            <Button
              onClick={onClose}
              disabled={isDeleting}
              variant="ghost"
              size="lg"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              disabled={isDeleting}
              variant="destructive"
              size="lg"
            >
              {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Confirm Delete"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.getElementById("modal-root") || document.body);
}
