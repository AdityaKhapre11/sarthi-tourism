"use client";

import { useRouter } from "next/navigation";
import { PackageForm } from "@/components/admin/packages";
import { createPackage } from "../actions";

export default function NewPackage() {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    await createPackage(data);
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
