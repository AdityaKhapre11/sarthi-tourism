import Link from "next/link";
import { Plus, Edit, Map } from "lucide-react";
import { packages } from "@/data/packages";
import Image from "next/image";
import DeletePackageButton from "@/components/ui/DeletePackageButton";

export default function AdminPackages() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Manage Packages</h1>
          <p className="text-gray-400 mt-1">View, create, and manage your tour packages.</p>
        </div>
        <Link
          href="/admin/packages/new"
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl transition-all duration-300 font-medium shadow-[0_0_20px_-5px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_-5px_rgba(37,99,235,0.6)]"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Package</span>
        </Link>
      </div>

      <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-gray-300">
            <thead className="text-xs text-gray-400 uppercase bg-white/[0.02] border-b border-white/5">
              <tr>
                <th className="px-6 py-4 font-semibold">Package</th>
                <th className="px-6 py-4 font-semibold">Duration</th>
                <th className="px-6 py-4 font-semibold">Price</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[...packages].sort((a, b) => b.id - a.id).map((pkg) => (
                <tr key={pkg.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                        {pkg.image ? (
                          <Image src={pkg.image} alt={pkg.name} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full bg-white/5 flex items-center justify-center">
                            <Map className="w-5 h-5 text-gray-500" />
                          </div>
                        )}
                      </div>
                      <div className="font-medium text-white line-clamp-2">{pkg.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{pkg.duration}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{pkg.price}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <Link href={`/admin/packages/edit/${pkg.id}`} className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors inline-block" title="Edit">
                        <Edit className="w-4 h-4" />
                      </Link>
                      <DeletePackageButton id={pkg.id} packageName={pkg.name} />
                    </div>
                  </td>
                </tr>
              ))}
              {packages.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    No packages found. Click "Add New Package" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
