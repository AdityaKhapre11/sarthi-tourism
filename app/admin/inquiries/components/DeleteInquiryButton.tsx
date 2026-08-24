"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { deleteInquiry } from "../actions";
import { ConfirmDeleteModal } from "@/components/ui";
import { toast } from "sonner";

export function DeleteInquiryButton({ id, name, disabled }: { id: string; name: string; disabled?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteInquiry(id);
      if (!result?.success) {
        toast.error(result?.error || "Failed to delete inquiry.");
        return;
      }
      toast.success("Inquiry deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsDeleting(false);
      setIsOpen(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => !disabled && setIsOpen(true)}
        disabled={disabled}
        className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl transition-colors font-medium border ${
          disabled 
            ? "bg-gray-500/10 text-gray-500 border-gray-500/20 cursor-not-allowed" 
            : "bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/20 cursor-pointer"
        } w-full md:w-auto h-full min-h-[40px]`}
        title="Delete Inquiry"
      >
        <Trash2 className="w-4 h-4 shrink-0" />
        <span className="text-sm font-medium">Delete</span>
      </button>

      <ConfirmDeleteModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleDelete}
        title="Delete Inquiry"
        message={`Are you sure you want to delete the inquiry from ${name}? This action cannot be undone.`}
        isDeleting={isDeleting}
      />
    </>
  );
}
