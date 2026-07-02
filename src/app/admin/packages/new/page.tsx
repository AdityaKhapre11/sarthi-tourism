"use client";

import { useRouter } from "next/navigation";
import { PackageForm } from "@/components/admin/packages";
import { createPackage } from "../actions";
import { toast } from "sonner";

export default function NewPackage() {
  const router = useRouter();

  const handleSubmit = async (data: import("@/components/admin/packages").PackageFormData) => {
    const result = await createPackage(data);
    if (!result.success) {
      toast.error(result.error || "Failed to create package.");
      throw new Error(result.error || "Failed to create package.");
    }
    toast.success("Package added successfully!");
    router.push("/admin/packages");
  };

  return (
    <PackageForm
      title="Add New Package"
      subtitle="Create a new travel package for the website."
      onSubmit={handleSubmit}
    />
  );
}
