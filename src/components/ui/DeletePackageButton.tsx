"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { deletePackage } from "@/app/admin/packages/actions";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";
import { Button } from "@/components/ui";
import { toast } from "sonner";

export function DeletePackageButton({ id, packageName, onSuccess }: { id: string | number; packageName?: string; onSuccess?: () => void }) {
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
      <Button
        variant="ghost"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 transition-colors border border-red-500/20 rounded-xl px-4 py-2 font-medium"
        title="Delete Package"
      >
        <Trash2 className="w-4 h-4" />
        <span className="hidden sm:inline">Delete</span>
      </Button>

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
