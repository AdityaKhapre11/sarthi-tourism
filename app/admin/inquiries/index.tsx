import { MessageSquare } from "lucide-react";
import Link from "next/link";
import { PaginationControls } from "@/components/ui";
import { AdminSearch } from "@/components/admin/AdminSearch";
import { createClient } from "@/lib/supabase/server";
import { InquiryRow, Inquiry } from "./components/InquiryRow";
export default async function AdminInquiriesIndex({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const page = typeof resolvedParams.page === "string" ? parseInt(resolvedParams.page, 10) : 1;
  const limit = typeof resolvedParams.limit === "string" ? parseInt(resolvedParams.limit, 10) : 10;
  const searchQuery = typeof resolvedParams.q === "string" ? resolvedParams.q : "";
  const filter = typeof resolvedParams.filter === "string" ? resolvedParams.filter : "all";
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const supabase = await createClient();
  let query = supabase
    .from('inquiries')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (filter === "unread") {
    query = query.or('is_read.is.null,is_read.eq.false');
  } else if (filter === "read") {
    query = query.eq('is_read', true);
  }

  if (searchQuery) {
    query = query.or(`full_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,subject.ilike.%${searchQuery}%,phone.ilike.%${searchQuery}%`);
  }

  const { data: inquiries, count, error } = await query;

  if (error) {
    console.error('Error fetching inquiries:', error);
  }

  const inquiryList = inquiries || [];
  const totalItems = count || 0;
  const totalPages = Math.ceil(totalItems / limit);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 rounded-xl">
            <MessageSquare className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Manage Inquiries</h1>
            <p className="text-gray-400 mt-1">View and manage customer contact messages.</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          {/* Filter Pills */}
          <div className="flex p-1 bg-white/[0.02] border border-white/10 rounded-lg shrink-0">
            <Link 
              href={`?filter=all${searchQuery ? `&q=${searchQuery}` : ''}`} 
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${filter === 'all' ? 'bg-blue-500 text-white shadow' : 'text-gray-400 hover:text-white'}`}
            >
              All
            </Link>
            <Link 
              href={`?filter=unread${searchQuery ? `&q=${searchQuery}` : ''}`} 
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${filter === 'unread' ? 'bg-blue-500 text-white shadow' : 'text-gray-400 hover:text-white'}`}
            >
              Unread
            </Link>
            <Link 
              href={`?filter=read${searchQuery ? `&q=${searchQuery}` : ''}`} 
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${filter === 'read' ? 'bg-blue-500 text-white shadow' : 'text-gray-400 hover:text-white'}`}
            >
              Read
            </Link>
          </div>
          <AdminSearch placeholder="Search inquiries..." />
        </div>
      </div>

      {/* Inquiries List */}
      <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
        {/* Table Header (Desktop Only) */}
        {inquiryList.length > 0 && (
          <div className="hidden lg:grid grid-cols-12 gap-4 p-4 border-b border-white/10 text-sm font-semibold text-gray-400 bg-white/[0.02] items-center">
            <div className="col-span-3">Customer</div>
            <div className="col-span-3">Contact</div>
            <div className="col-span-2">Subject</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>
        )}

        <div className="divide-y divide-white/5">
          {inquiryList.map((inquiry: Inquiry) => (
            <InquiryRow key={inquiry.id} inquiry={inquiry} />
          ))}

          {inquiryList.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24">
              <MessageSquare className="w-16 h-16 text-gray-600 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Inquiries Found</h3>
              <p className="text-gray-400 mb-6 max-w-sm text-center">
                {searchQuery ? "No inquiries match your search." : "You haven't received any contact inquiries yet."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Pagination Controls */}
      {inquiryList.length > 0 && (
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
