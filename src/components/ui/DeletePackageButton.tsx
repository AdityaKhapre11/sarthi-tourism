"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { deletePackage } from "@/app/admin/packages/actions";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { Button } from "@/components/ui/button";

export default function DeletePackageButton({ id, packageName, onSuccess }: { id: string | number; packageName?: string; onSuccess?: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deletePackage(id);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
      setIsOpen(false);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
        title="Delete Package"
      >
        <Trash2 className="w-4 h-4" />
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
