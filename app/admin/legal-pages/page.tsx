"use client";

import { useState, useEffect } from "react";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { getLegalPage, updateLegalPage } from "./actions";
import { toast } from "sonner";
import { Button } from "@/components/ui";
import { Loader2 } from "lucide-react";

export default function LegalPagesAdmin() {
  const [activeTab, setActiveTab] = useState<'privacy_policy' | 'terms_conditions'>('privacy_policy');
  
  const [privacyData, setPrivacyData] = useState({ title: 'Privacy Policy', content: '' });
  const [termsData, setTermsData] = useState({ title: 'Terms of Service', content: '' });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const pData = await getLegalPage('privacy_policy');
        const tData = await getLegalPage('terms_conditions');
        if (pData?.content) setPrivacyData(pData);
        if (tData?.content) setTermsData(tData);
      } catch {
        toast.error("Failed to load legal pages");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const currentData = activeTab === 'privacy_policy' ? privacyData : termsData;
      
      // Basic check, remove html tags just to check if totally empty
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = currentData.content;
      if (!tempDiv.textContent?.trim()) {
        toast.error("Content cannot be empty");
        setIsSaving(false);
        return;
      }

      const result = await updateLegalPage(activeTab, currentData.title, currentData.content);
      
      if (result.success) {
        toast.success(`${currentData.title} saved successfully`);
      } else {
        toast.error(result.error || "Failed to save changes");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-heading text-white tracking-tight">Legal Pages</h1>
        <Button onClick={handleSave} disabled={isSaving} className={`bg-blue-600 text-white min-w-[120px] ${isSaving ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700 cursor-pointer"}`}>
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="flex space-x-2 border-b border-white/10 pb-4">
        <button
          onClick={() => setActiveTab('privacy_policy')}
          className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 cursor-pointer ${activeTab === 'privacy_policy' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
        >
          Privacy Policy
        </button>
        <button
          onClick={() => setActiveTab('terms_conditions')}
          className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 cursor-pointer ${activeTab === 'terms_conditions' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
        >
          Terms of Service
        </button>
      </div>

      <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-xl">
        <h2 className="text-xl font-semibold text-white mb-6">
          {activeTab === 'privacy_policy' ? 'Edit Privacy Policy' : 'Edit Terms of Service'}
        </h2>
        
        <RichTextEditor
          content={activeTab === 'privacy_policy' ? privacyData.content : termsData.content}
          onChange={(content) => {
            if (activeTab === 'privacy_policy') {
              setPrivacyData(prev => ({ ...prev, content }));
            } else {
              setTermsData(prev => ({ ...prev, content }));
            }
          }}
        />
      </div>
    </div>
  );
}
