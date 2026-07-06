import { MessageSquare } from "lucide-react";

export default function AdminInquiriesIndex() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 h-full flex flex-col justify-center items-center text-center mt-20">
      <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mb-6">
        <MessageSquare className="w-10 h-10 text-blue-400" />
      </div>
      <h1 className="text-3xl font-bold text-white tracking-tight">Inquiries Management</h1>
      <p className="text-gray-400 max-w-md mx-auto">
        This section is currently under construction. Soon, you'll be able to view and manage all customer inquiries and bookings from this dashboard.
      </p>
    </div>
  );
}
