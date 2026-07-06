import { Settings as SettingsIcon } from "lucide-react";

export default function AdminSettingsIndex() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 h-full flex flex-col justify-center items-center text-center mt-20">
      <div className="w-20 h-20 bg-gray-500/10 rounded-full flex items-center justify-center mb-6">
        <SettingsIcon className="w-10 h-10 text-gray-400" />
      </div>
      <h1 className="text-3xl font-bold text-white tracking-tight">Website Settings</h1>
      <p className="text-gray-400 max-w-md mx-auto">
        This section is under construction. Here you will be able to manage global website details like contact information, social links, and hero images.
      </p>
    </div>
  );
}
