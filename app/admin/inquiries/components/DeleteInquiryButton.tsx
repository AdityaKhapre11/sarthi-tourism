"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { deleteInquiry } from "../actions";
import { ConfirmDeleteModal, Button } from "@/components/ui";
import { toast } from "sonner";

export function DeleteInquiryButton({ id, name }: { id: string; name: string }) {
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
      <Button
        variant="ghost"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 transition-colors border border-red-500/20 rounded-xl px-4 py-2 font-medium"
        title="Delete Inquiry"
      >
        <Trash2 className="w-4 h-4" />
        <span className="hidden sm:inline">Delete</span>
      </Button>

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
