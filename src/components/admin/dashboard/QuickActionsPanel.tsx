import Link from "next/link";
import { Button } from "@/components/ui/button";

export function QuickActionsPanel() {
  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 backdrop-blur-xl">
      <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
      <div className="space-y-3 flex flex-col">
        <Link href="/admin/packages/new" className="w-full">
          <Button variant="outline" className="w-full justify-start px-4 py-6 rounded-xl bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 hover:text-blue-300 transition-colors font-medium border border-blue-500/20 text-base h-auto cursor-pointer">
            + Add New Package
          </Button>
        </Link>
        <Link href="/admin/inquiries" className="w-full">
          <Button variant="outline" className="w-full justify-start px-4 py-6 rounded-xl bg-white/[0.03] text-gray-300 hover:bg-white/[0.06] hover:text-white transition-colors font-medium border border-white/5 text-base h-auto cursor-pointer">
            View All Inquiries
          </Button>
        </Link>
        <Link href="/admin/settings" className="w-full">
          <Button variant="outline" className="w-full justify-start px-4 py-6 rounded-xl bg-white/[0.03] text-gray-300 hover:bg-white/[0.06] hover:text-white transition-colors font-medium border border-white/5 text-base h-auto cursor-pointer">
            Update Site Settings
          </Button>
        </Link>
      </div>
    </div>
  );
}
