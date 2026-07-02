"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (url: string) => void;
  folder?: string;
}

export default function ImageUploadModal({ isOpen, onClose, onUpload, folder = "packages" }: ImageUploadModalProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 0);
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

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Maximum allowed file size is 10 MB.");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success && data.url) {
        onUpload(data.url);
        onClose();
      } else {
        setError(data.error || "Failed to upload image.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card border border-white/10 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <ImageIcon className="w-5 h-5 mr-2 text-blue-400" />
            Upload Image
          </h3>
          <Button 
            variant="ghost"
            size="icon"
            onClick={onClose}
            disabled={isUploading}
            className="text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div 
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300
              ${isUploading ? "border-white/10 bg-white/5 cursor-not-allowed" : "border-blue-500/30 bg-blue-500/5 hover:border-blue-500/60 hover:bg-blue-500/10"}
            `}
          >
            {isUploading ? (
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-3" />
            ) : (
              <Upload className="w-10 h-10 text-blue-400 mb-3" />
            )}
            
            <p className="text-sm font-medium text-white mb-1">
              {isUploading ? "Uploading image..." : "Click to select an image"}
            </p>
            <p className="text-xs text-gray-400">
              PNG, JPG, WEBP up to 10MB
            </p>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400">
              {error}
            </div>
          )}
        </div>

        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          ref={fileInputRef}
          onChange={handleFileSelect}
        />
      </div>
    </div>
  );

  return createPortal(modalContent, document.getElementById("modal-root") || document.body);
}
