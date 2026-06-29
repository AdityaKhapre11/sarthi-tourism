"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ImageUploadModal from "@/components/ui/ImageUploadModal";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal";

import { DynamicListInput } from "./DynamicListInput";
import { ItineraryInput, ItineraryDay } from "./ItineraryInput";
import { MediaSection } from "./MediaSection";

export interface PackageFormData {
  id?: number;
  name: string;
  duration: string;
  price: string;
  image: string;
  description: string;
  highlights: string[];
  included: string[];
  excluded: string[];
  gallery: string[];
  itinerary: ItineraryDay[];
}

interface PackageFormProps {
  initialData?: Partial<PackageFormData>;
  title: string;
  subtitle: string;
  onSubmit: (data: any) => Promise<void>;
  showDelete?: boolean;
  onDelete?: () => void;
}

const defaultFormData: PackageFormData = {
  name: "",
  duration: "",
  price: "",
  image: "",
  description: "",
  highlights: [""],
  included: [""],
  excluded: [""],
  gallery: ["", ""],
  itinerary: [{ day: 1, title: "", description: "" }],
};

export function PackageForm({
  initialData,
  title,
  subtitle,
  onSubmit,
  showDelete,
  onDelete
}: PackageFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState<PackageFormData>({
    ...defaultFormData,
    ...initialData,
  });

  const [uploadModalState, setUploadModalState] = useState<{
    isOpen: boolean;
    field: "main" | "gallery";
    index?: number;
  }>({ isOpen: false, field: "main" });

  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
  }>({ isOpen: false });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        ...formData,
        highlights: formData.highlights.filter(h => h.trim() !== ""),
        included: formData.included.filter(i => i.trim() !== ""),
        excluded: formData.excluded.filter(e => e.trim() !== ""),
        gallery: formData.gallery.filter(g => g.trim() !== ""),
        itinerary: formData.itinerary.filter(i => i.title.trim() !== "")
      };

      await onSubmit(data);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center space-x-4">
          <Link href="/admin/packages" className="p-2 bg-white/[0.03] hover:bg-white/[0.08] rounded-xl text-gray-400 hover:text-white transition-colors border border-white/5">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">{title}</h1>
            <p className="text-gray-400 mt-1">{subtitle}</p>
          </div>
        </div>

        <div></div>
      </div>

      <form id="package-form" className="space-y-8" onSubmit={handleSubmit}>
        {/* Basic Information */}
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 md:p-8 backdrop-blur-xl">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center">
            <span className="bg-blue-500/20 text-blue-400 w-8 h-8 rounded-lg flex items-center justify-center mr-3 text-sm">1</span>
            Basic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-300 mb-2">Package Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all text-white placeholder-gray-600"
                placeholder="e.g. Majestic Dubai Tour"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Duration</label>
              <input
                type="text"
                required
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all text-white placeholder-gray-600"
                placeholder="e.g. 5 Nights / 6 Days"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Price</label>
              <input
                type="text"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all text-white placeholder-gray-600"
                placeholder="e.g. Rs. 25,000 or Contact Us"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-300 mb-2">Description</label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all text-white placeholder-gray-600 resize-none"
                placeholder="Write a compelling description for this package..."
              />
            </div>
          </div>
        </div>

        {/* Media */}
        <MediaSection
          mainImage={formData.image}
          gallery={formData.gallery}
          onMainImageClick={() => setUploadModalState({ isOpen: true, field: "main" })}
          onGalleryImageClick={(index) => setUploadModalState({ isOpen: true, field: "gallery", index })}
          onRemoveGalleryImage={(index) => {
            const newGallery = formData.gallery.filter((_, i) => i !== index);
            setFormData({ ...formData, gallery: newGallery });
          }}
          onAddGalleryImage={() => {
            setFormData({ ...formData, gallery: [...formData.gallery, ""] });
          }}
        />

        {/* Details & Inclusions */}
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 md:p-8 backdrop-blur-xl">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center">
            <span className="bg-blue-500/20 text-blue-400 w-8 h-8 rounded-lg flex items-center justify-center mr-3 text-sm">3</span>
            Details & Inclusions
          </h2>

          <div className="space-y-8">
            <DynamicListInput
              label="Key Highlights"
              items={formData.highlights}
              onChange={(newItems) => setFormData({ ...formData, highlights: newItems })}
              placeholder="e.g. Visit Burj Khalifa"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-white/5">
              <DynamicListInput
                label="What's Included"
                items={formData.included}
                onChange={(newItems) => setFormData({ ...formData, included: newItems })}
                placeholder="e.g. 5 Star Hotel Stay"
              />
              <DynamicListInput
                label="What's Excluded"
                items={formData.excluded}
                onChange={(newItems) => setFormData({ ...formData, excluded: newItems })}
                placeholder="e.g. Flight Tickets"
              />
            </div>
          </div>
        </div>

        {/* Itinerary */}
        <ItineraryInput
          itinerary={formData.itinerary}
          onChange={(newItinerary) => setFormData({ ...formData, itinerary: newItinerary })}
        />

        {/* Bottom Actions */}
        <div className="flex justify-end pt-8 mt-8 border-t border-white/5">
          <Button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-6 rounded-2xl transition-all shadow-[0_10px_30px_-10px_rgba(37,99,235,0.6)] hover:shadow-[0_10px_40px_-10px_rgba(37,99,235,0.8)] flex items-center gap-3 font-bold text-lg w-full sm:w-auto transform hover:-translate-y-1"
          >
            <Save className="w-6 h-6" />
            {loading ? "Saving Changes..." : (initialData?.id ? "Update Package" : "Add Package")}
          </Button>
        </div>
      </form>

      {/* Modals */}
      <ImageUploadModal
        isOpen={uploadModalState.isOpen}
        onClose={() => setUploadModalState({ isOpen: false, field: "main" })}
        onUpload={(url) => {
          if (uploadModalState.field === "main") {
            setFormData({ ...formData, image: url });
          } else if (uploadModalState.field === "gallery" && uploadModalState.index !== undefined) {
            const newGallery = [...formData.gallery];
            newGallery[uploadModalState.index] = url;
            setFormData({ ...formData, gallery: newGallery });
          }
        }}
      />

      <ConfirmDeleteModal
        isOpen={deleteModalState.isOpen}
        onClose={() => setDeleteModalState({ isOpen: false })}
        onConfirm={async () => {
          if (onDelete) {
            await onDelete();
            setDeleteModalState({ isOpen: false });
          }
        }}
        isDeleting={loading} // Can use loading state
        title="Delete Package"
        message={`Are you sure you want to delete '${formData.name}'? This action cannot be undone.`}
      />
    </div>
  );
}
