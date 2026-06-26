interface RecentInquiry {
  id: number;
  name: string;
  packageInterested: string;
  createdAt: string;
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
            <div key={inquiry.id} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.01] hover:bg-white/[0.03] transition-colors border border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold uppercase">
                  {inquiry.name.charAt(0)}
                </div>
                <div>
                  <p className="text-white font-medium">{inquiry.name}</p>
                  <p className="text-sm text-gray-400">Interested in {inquiry.packageInterested}</p>
                </div>
              </div>
              <div className="text-sm text-gray-500">{new Date(inquiry.createdAt).toLocaleDateString()}</div>
            </div>
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
