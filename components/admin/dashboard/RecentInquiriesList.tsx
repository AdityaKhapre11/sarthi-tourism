import Link from "next/link";

interface RecentInquiry {
  id: string | number;
  full_name: string;
  subject: string;
  created_at: string;
}

interface RecentInquiriesListProps {
  inquiries: RecentInquiry[];
}

export function RecentInquiriesList({ inquiries }: RecentInquiriesListProps) {
  return (
    <div className="lg:col-span-2 bg-white/[0.02] border border-white/5 rounded-2xl p-6 backdrop-blur-xl">
      <h3 className="text-lg font-semibold text-white mb-4">Recent Inquiries</h3>
      <div className="space-y-4">
        {inquiries.length > 0 ? (
          inquiries.map((inquiry) => (
            <Link key={inquiry.id} href="/admin/inquiries" className="flex items-center justify-between p-4 rounded-xl bg-white/[0.01] hover:bg-white/[0.03] transition-colors border border-white/5 cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold uppercase shrink-0 border border-blue-500/20 group-hover:scale-105 transition-transform">
                  {inquiry.full_name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-white font-medium truncate group-hover:text-blue-400 transition-colors">{inquiry.full_name}</p>
                  <p className="text-sm text-gray-400 truncate">{inquiry.subject}</p>
                </div>
              </div>
              <div className="text-sm text-gray-500 shrink-0 ml-4">{new Date(inquiry.created_at).toLocaleDateString()}</div>
            </Link>
          ))
        ) : (
          <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 text-center text-gray-500">
            No recent inquiries.
          </div>
        )}
      </div>
    </div>
  );
}
