import Link from "next/link";
import { Plus, Edit, Map } from "lucide-react";
import Image from "next/image";
import { DeletePackageButton, PaginationControls } from "@/components/ui";
import { createClient } from "@/lib/supabase/server";

export const dynamic = 'force-dynamic';

export default async function AdminPackages({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const page = typeof resolvedParams.page === "string" ? parseInt(resolvedParams.page, 10) : 1;
  const limit = typeof resolvedParams.limit === "string" ? parseInt(resolvedParams.limit, 10) : 10;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const supabase = await createClient();
  const { data: packages, count, error } = await supabase
    .from('packages')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

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
        <Link
          href="/admin/packages/new"
          className="group flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl transition-all duration-300 font-medium shadow-[0_0_20px_-5px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_-5px_rgba(37,99,235,0.6)] hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
          <span>Add New Package</span>
        </Link>
      </div>

      {/* Packages List */}
      <div className="grid gap-6">
        {packageList.map((pkg: any) => (
          <div key={pkg.id} className="group bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] rounded-2xl p-4 transition-all duration-300">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              
              {/* Image */}
              <div className="relative w-full md:w-48 h-32 md:h-28 rounded-xl overflow-hidden shrink-0">
                {pkg.image ? (
                  <Image src={pkg.image} alt={pkg.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full bg-white/5 flex items-center justify-center">
                    <Map className="w-8 h-8 text-gray-500" />
                  </div>
                )}
                {/* Duration Badge overlaid on image */}
                <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-medium text-white border border-white/10 shadow-lg">
                  {pkg.duration}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-xl font-bold text-white line-clamp-2 leading-tight group-hover:text-blue-400 transition-colors">
                    {pkg.name}
                  </h3>
                  <div className="hidden md:block text-right shrink-0">
                    <div className="text-sm text-gray-400 mb-0.5">Starting from</div>
                    <div className="text-xl font-bold text-green-400">{pkg.price}</div>
                  </div>
                </div>

                {/* Mobile Price */}
                <div className="md:hidden flex items-center gap-2 mb-3">
                  <span className="text-sm text-gray-400">Starting from:</span>
                  <span className="font-bold text-green-400">{pkg.price}</span>
                </div>

                {/* Highlights */}
                {pkg.highlights && pkg.highlights.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {pkg.highlights.slice(0, 3).map((highlight: string, idx: number) => (
                      <span key={idx} className="px-2.5 py-1 bg-white/5 border border-white/5 rounded-full text-xs text-gray-300">
                        {highlight}
                      </span>
                    ))}
                    {pkg.highlights.length > 3 && (
                      <span className="px-2.5 py-1 bg-white/5 border border-white/5 rounded-full text-xs text-gray-500">
                        +{pkg.highlights.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="w-full md:w-auto flex md:flex-col justify-end gap-3 shrink-0 border-t border-white/5 md:border-t-0 pt-4 md:pt-0">
                <Link 
                  href={`/admin/packages/edit/${pkg.id}`} 
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-xl transition-colors border border-blue-500/20"
                >
                  <Edit className="w-4 h-4" />
                  <span className="text-sm font-medium">Edit</span>
                </Link>
                <div className="flex-1 md:flex-none">
                  <DeletePackageButton id={pkg.id} packageName={pkg.name} />
                </div>
              </div>

            </div>
          </div>
        ))}

        {packageList.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 bg-white/[0.02] border border-white/5 rounded-2xl">
            <Map className="w-16 h-16 text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Packages Found</h3>
            <p className="text-gray-400 mb-6 max-w-sm text-center">You haven&apos;t added any tour packages yet. Create your first package to get started.</p>
            <Link
              href="/admin/packages/new"
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl transition-all"
            >
              <Plus className="w-5 h-5" />
              <span>Create Package</span>
            </Link>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {packageList.length > 0 && (
        <PaginationControls
          currentPage={page}
          totalPages={totalPages}
          totalItems={totalItems}
          limit={limit}
        />
      )}

    </div>
  );
}
