"use client";

import { useState } from "react";
import { Save, Image as ImageIcon, Plus, X } from "lucide-react";
import Image from "next/image";
import { Button, Loader, ImageUploadModal } from "@/components/ui";
import { ConfirmDeleteModal } from "@/components/ui/ConfirmDeleteModal";
import { updateHomeSettings, deleteHeroImage } from "./actions";
import { toast } from "sonner"; // Assuming sonner is used for toasts, else I can use standard alert/UI

export function HomeSettingsClient({ 
  initialImages 
}: { 
  initialImages: string[]
}) {
  const [images, setImages] = useState<string[]>(initialImages);
  const [loading, setLoading] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      const validImages = images.filter(img => img.trim() !== "");
      const res = await updateHomeSettings(validImages, null);
      if (res.success) {
        if (toast && toast.success) {
          toast.success("Home settings updated successfully!");
        } else {
          alert("Settings saved successfully!");
        }
      } else {
        setError(res.error || "Failed to update settings");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = async () => {
    if (!imageToDelete) return;
    
    setLoading(true);
    setError(null);
    try {
      const res = await deleteHeroImage(imageToDelete, images, null);
      if (res.success) {
        setImages(prev => prev.filter(img => img !== imageToDelete));
        if (toast && toast.success) {
          toast.success("Image deleted successfully!");
        } else {
          alert("Image deleted successfully!");
        }
      } else {
        setError(res.error || "Failed to delete image");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
      setImageToDelete(null);
    }
  };

  const handleUpload = async (url: string) => {
    if (images.length >= 6) {
      setError("Maximum of 6 images allowed.");
      return;
    }
    
    const newImages = [...images, url];
    setImages(newImages);
    
    // Auto-save when an image is uploaded to ensure DB is in sync with Storage
    setLoading(true);
    await updateHomeSettings(newImages, null);
    setLoading(false);
  };

  return (
    <>
      {loading && <Loader fullScreen />}
      <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 mt-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Home Page Settings</h1>
            <p className="text-gray-400 mt-1">Manage the Hero Banner images that appear on the main landing page. Max 6 images.</p>
          </div>
          <Button
            onClick={handleSave}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl transition-all shadow-[0_10px_30px_-10px_rgba(37,99,235,0.6)] hover:shadow-[0_10px_40px_-10px_rgba(37,99,235,0.8)] flex items-center gap-2 font-bold"
          >
            <Save className="w-5 h-5" />
            Save Changes
          </Button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-3">
            <span className="font-semibold">Error:</span> {error}
          </div>
        )}

        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 md:p-8 backdrop-blur-xl">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center">
            <span className="bg-blue-500/20 text-blue-400 w-8 h-8 rounded-lg flex items-center justify-center mr-3 text-sm">
              <ImageIcon className="w-4 h-4" />
            </span>
            Hero Background Images ({images.length}/6)
          </h2>
          <p className="text-gray-400 text-sm mb-6 max-w-2xl">
            Upload up to 6 high-quality images. They will automatically cycle as a beautiful carousel on the public homepage.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((img, index) => {
              return (
                <div 
                  key={index} 
                  className="relative group rounded-2xl overflow-hidden aspect-video bg-black/50 flex items-center justify-center transition-all border border-white/10"
                >
                  <Image
                    src={img}
                    alt={`Hero Image ${index + 1}`}
                    fill
                    className="object-cover"
                  />

                  <div className="absolute inset-0 bg-black/60 transition-opacity flex flex-col items-center justify-center gap-4 z-10 opacity-0 group-hover:opacity-100">
                    <button
                      onClick={() => setImageToDelete(img)}
                      className="px-4 py-2 bg-red-500/80 hover:bg-red-500 text-white font-medium rounded-xl transition-colors flex items-center gap-2 transform hover:scale-105"
                    >
                      <X className="w-4 h-4" /> Delete Completely
                    </button>
                  </div>
                </div>
              );
            })}
            
            {images.length < 6 && (
              <button
                onClick={() => setUploadModalOpen(true)}
                className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-white/10 hover:border-blue-500/50 hover:bg-blue-500/5 rounded-2xl aspect-video transition-all text-gray-500 hover:text-blue-400"
              >
                <Plus className="w-8 h-8" />
                <span className="font-medium">Add Image</span>
              </button>
            )}
          </div>
        </div>

      </div>

      <ImageUploadModal
        isOpen={uploadModalOpen}
        folder="home"
        onClose={() => setUploadModalOpen(false)}
        onUpload={(url) => {
          handleUpload(url);
          setUploadModalOpen(false);
        }}
      />
      
      <ConfirmDeleteModal
        isOpen={!!imageToDelete}
        onClose={() => setImageToDelete(null)}
        onConfirm={handleRemoveImage}
        title="Delete Hero Image"
        message="Are you sure you want to permanently delete this hero image from your gallery? This will remove it from the website immediately."
      />
    </>
  );
}
