import Link from "next/link";
import { Plus, Map } from "lucide-react";
import { AdminSearch } from "@/components/admin/AdminSearch";
import { createClient } from "@/lib/supabase/server";
import { PackageListClient } from "./PackageListClient";

export default async function AdminPackagesIndex({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const page = typeof resolvedParams.page === "string" ? parseInt(resolvedParams.page, 10) : 1;
  const limit = typeof resolvedParams.limit === "string" ? parseInt(resolvedParams.limit, 10) : 10;
  const searchQuery = typeof resolvedParams.q === "string" ? resolvedParams.q : "";
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const supabase = await createClient();
  let query = supabase
    .from('packages')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (searchQuery) {
    query = query.ilike('name', `%${searchQuery}%`);
  }

  const { data: packages, count, error } = await query;

  if (error) {
    console.error('Error fetching packages:', error);
  }

  const packageList = packages || [];
  const totalItems = count || 0;
  const totalPages = Math.ceil(totalItems / limit);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 rounded-xl">
            <Map className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Manage Packages</h1>
            <p className="text-gray-400 mt-1">View, create, and manage your tour packages.</p>
          </div>
        </div>
          <AdminSearch placeholder="Search packages by name..." />
          <Link
            href="/admin/packages/new"
            className="group flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl transition-all duration-300 font-medium shadow-[0_0_20px_-5px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_-5px_rgba(37,99,235,0.6)] hover:-translate-y-0.5 shrink-0"
          >
            <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
            <span>Add New Package</span>
          </Link>
      </div>

      <PackageListClient 
        packages={packageList} 
        page={page} 
        totalPages={totalPages} 
        totalItems={totalItems} 
        limit={limit} 
      />
    </div>
  );
}
