"use client";

import { Upload, X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui";

interface MediaSectionProps {
  mainImage: string;
  gallery: string[];
  onMainImageClick: () => void;
  onGalleryImageClick: (index: number) => void;
  onRemoveGalleryImage: (index: number) => void;
  onAddGalleryImage: () => void;
}

export function MediaSection({
  mainImage,
  gallery,
  onMainImageClick,
  onGalleryImageClick,
  onRemoveGalleryImage,
  onAddGalleryImage,
}: MediaSectionProps) {
  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 md:p-8 backdrop-blur-xl">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center">
        <span className="bg-blue-500/20 text-blue-400 w-8 h-8 rounded-lg flex items-center justify-center mr-3 text-sm">2</span>
        Media & Images
      </h2>
      
      <div className="space-y-8">
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-3">Main Image</label>
          <div 
            className="relative w-full h-64 md:h-80 rounded-2xl border-2 border-dashed border-white/20 bg-white/5 overflow-hidden group flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors"
            onClick={onMainImageClick}
          >
            {mainImage ? (
              <>
                <Image src={mainImage} alt="Main Image" fill unoptimized className="object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity duration-300">
                   <Upload className="w-8 h-8 text-white mb-2" />
                   <span className="text-white font-medium text-sm">Change Image</span>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-400 group-hover:text-white transition-colors">
                <ImageIcon className="w-12 h-12 mb-3 opacity-50 group-hover:opacity-100 group-hover:-translate-y-1 transition-all" />
                <span className="font-medium">Click to upload main image</span>
                <span className="text-xs mt-2 opacity-60">High quality image recommended</span>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-semibold text-gray-300">Gallery Images</label>
            <span className="text-xs text-gray-500">{gallery.length} images</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {gallery.map((img, index) => (
              <div key={index} className="relative aspect-square rounded-xl border border-white/10 overflow-hidden group bg-white/5">
                {img ? (
                  <>
                    <Image src={img} alt={`Gallery ${index + 1}`} fill unoptimized className="object-cover" onError={(e: any) => (e.currentTarget.style.display = 'none')} />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity gap-2">
                      <Button type="button" variant="ghost" size="icon" onClick={(e: any) => { e.stopPropagation(); onGalleryImageClick(index); }} className="text-white hover:bg-white/20">
                        <Upload className="w-4 h-4" />
                      </Button>
                      <Button type="button" variant="ghost" size="icon" onClick={(e: any) => { e.stopPropagation(); onRemoveGalleryImage(index); }} className="text-red-400 hover:bg-red-500/30">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <div 
                    className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 transition-colors border-2 border-dashed border-transparent hover:border-white/20"
                    onClick={() => onGalleryImageClick(index)}
                  >
                    <Upload className="w-6 h-6 text-gray-500 mb-2" />
                    <span className="text-xs text-gray-400 font-medium">Upload</span>
                  </div>
                )}
              </div>
            ))}
            <div 
              className="aspect-square rounded-xl border-2 border-dashed border-white/10 bg-white/[0.02] flex flex-col items-center justify-center cursor-pointer hover:bg-white/[0.05] hover:border-white/30 transition-all text-gray-400 hover:text-white"
              onClick={onAddGalleryImage}
            >
              <Upload className="w-6 h-6 mb-2 opacity-50" />
              <span className="text-xs font-medium">Add Image</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
