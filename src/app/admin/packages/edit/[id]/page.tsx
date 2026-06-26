"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { PackageForm, PackageFormData } from "@/components/admin/packages";
import { updatePackage, deletePackage } from "../../actions";
import { Loader2 } from "lucide-react";

export default function EditPackage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [initialData, setInitialData] = useState<PackageFormData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch package details
    const fetchPackage = async () => {
      try {
        const res = await fetch("/api/packages");
        if (res.ok) {
          const packages = await res.json();
          const pkg = packages.find((p: any) => p.id.toString() === id);
          if (pkg) {
            setInitialData(pkg);
          }
        }
      } catch (err) {
        console.error("Failed to fetch package", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPackage();
    }
  }, [id]);

  const handleSubmit = async (data: any) => {
    await updatePackage(id, data);
    router.push("/admin/packages");
  };

  const handleDelete = async () => {
    await deletePackage(Number(id));
    router.push("/admin/packages");
  };

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!initialData) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="text-gray-400">Package not found.</div>
      </div>
    );
  }

  return (
    <PackageForm
      title="Edit Package"
      subtitle="Update the details of this package."
      initialData={initialData}
      onSubmit={handleSubmit}
      showDelete={true}
      onDelete={handleDelete}
    />
  );
}
