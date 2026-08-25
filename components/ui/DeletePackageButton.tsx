"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { deletePackage } from "@/app/admin/packages/actions";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";
import { toast } from "sonner";

export function DeletePackageButton({ id, packageName, onSuccess, disabled }: { id: string | number; packageName?: string; onSuccess?: () => void; disabled?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deletePackage(id);
      if (!result?.success) {
        toast.error(result?.error || "Failed to delete package.");
        return;
      }
      toast.success("Package deleted successfully!");
      if (onSuccess) onSuccess();
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
        className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl transition-colors font-bold border ${
          disabled 
            ? "bg-gray-500/10 text-gray-500 border-gray-500/20 cursor-not-allowed" 
            : "bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/20 cursor-pointer"
        } w-full h-full min-h-[44px]`}
        title="Delete Package"
      >
        <Trash2 className="w-4 h-4 shrink-0" />
        <span className="text-medium">Delete</span>
      </button>

      <ConfirmDeleteModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        title="Delete Package"
        message={
          packageName
            ? `Are you sure you want to delete '${packageName}'? This action cannot be undone.`
            : "Are you sure you want to delete this package? This action cannot be undone and will permanently remove all associated data."
        }
      />
    </>
  );
}
