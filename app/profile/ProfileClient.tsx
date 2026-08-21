"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail, Shield, Calendar, ArrowLeft, Camera, Loader2, LogOut, MapPin, Phone, User as UserIcon, Edit, CheckCircle2, XCircle, KeyRound, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { performLogout } from "@/lib/auth/logout";
import { AppUser, UserProfile } from "@/types";
import FaqSection from "./FaqSection";

interface ProfileClientProps {
  user: AppUser;
  profile?: UserProfile | null;
}

export default function ProfileClient({ user, profile }: ProfileClientProps) {
  const router = useRouter();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: user.user_metadata?.full_name || "",
    gender: user.user_metadata?.gender || "",
    mobile_number: user.user_metadata?.mobile_number || "",
    address: user.user_metadata?.address || "",
    dob: user.user_metadata?.dob || "",
  });

  const currentAvatar = previewUrl || user.user_metadata?.avatar_url;
  const isVerified = !!user.email_confirmed_at;
  const joinedDate = user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "Recently";

  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = document.createElement("img");
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, ".webp"), {
                  type: "image/webp",
                  lastModified: Date.now(),
                });
                resolve(newFile);
              } else {
                reject(new Error("Canvas to Blob failed"));
              }
            },
            "image/webp",
            0.8
          );
        };
        img.onerror = (error) => reject(error);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    if (!file.type.match(/^image\/(jpeg|png|webp|jpg)$/)) {
      toast.error("Only JPG, PNG and WEBP files are allowed");
      return;
    }

    try {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      
      const compressedFile = await compressImage(file);
      setFileToUpload(compressedFile);
    } catch (err) {
      toast.error("Failed to process image");
      console.error(err);
    }
  };

  const cancelUpload = () => {
    setPreviewUrl(null);
    setFileToUpload(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUpload = async () => {
    if (!fileToUpload) return;
    setIsUploading(true);
    
    try {
      const timestamp = new Date().getTime();
      const fileName = `${timestamp}.webp`;
      const filePath = `${user.id}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, fileToUpload, { upsert: true });

      if (uploadError) throw new Error("Failed to upload image. Make sure the 'avatars' storage bucket exists and is public.");

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const finalUrl = `${publicUrl}?v=${timestamp}`;

      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: finalUrl }
      });

      if (updateError) throw updateError;

      // Attempt to update public.users, but don't fail if column doesn't exist
      await supabase.from('users').update({ avatar_url: finalUrl }).eq('id', user.id);

      toast.success("Profile photo updated successfully!");
      setFileToUpload(null);
      
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred while uploading";
      toast.error(errorMessage);
      setPreviewUrl(null); // Revert optimistic UI on fail
      setFileToUpload(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!formData.full_name.trim()) {
      toast.error("Name is required");
      return;
    }
    
    if (formData.gender && !["Male", "Female", "Other"].includes(formData.gender)) {
      toast.error("Invalid gender selection");
      return;
    }
    
    if (formData.mobile_number) {
      const digitsOnly = formData.mobile_number.startsWith("+91")
        ? formData.mobile_number.slice(3)
        : formData.mobile_number.replace(/\D/g, "");
      
      if (digitsOnly.length > 0 && digitsOnly.length < 10) {
        toast.error("Please enter a valid 10-digit mobile number");
        return;
      }
    }

    setIsSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: formData.full_name,
          gender: formData.gender,
          mobile_number: formData.mobile_number,
          address: formData.address,
          dob: formData.dob,
        }
      });
      
      if (error) throw error;
      
      // Attempt to update public.users, but ignore errors if columns don't exist
      await supabase.from('users').update({
        full_name: formData.full_name,
        gender: formData.gender,
        mobile_number: formData.mobile_number,
        address: formData.address,
        dob: formData.dob || null, // Convert empty string to null for date column
      }).eq('id', user.id);

      toast.success("Profile updated successfully!");
      setIsEditing(false);
      router.refresh();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update profile";
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    await performLogout(router);
  };

  const getInitials = (name?: string, email?: string) => {
    if (name) return name.charAt(0).toUpperCase();
    if (email) return email.charAt(0).toUpperCase();
    return "U";
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white pt-48 pb-16 px-4 sm:px-6 relative overflow-hidden font-sans">
      {/* Background elements */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-blue-600/30 blur-[150px] rounded-[100%]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-8 ">
          <Link href="/" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors font-medium text-sm">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold mt-4 tracking-tight">My Profile</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (Header Card & Actions) */}
          <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
            
            {/* Main Profile Card */}
            <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl flex flex-col items-center text-center relative overflow-hidden h-full">
              <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-blue-600/20 to-transparent" />
              
              <div className="relative w-32 h-32 rounded-full border-4 border-[#020617] shadow-xl mb-4 group shrink-0">
                <div className="absolute inset-0 rounded-full bg-blue-600 flex items-center justify-center overflow-hidden">
                  {currentAvatar ? (
                    <Image src={currentAvatar} alt="Avatar" fill className="object-cover" />
                  ) : (
                    <span className="text-4xl font-bold text-white">{getInitials(user.user_metadata?.full_name, user.email)}</span>
                  )}
                </div>
                
                {/* Upload Overlay */}
                <div 
                  className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm z-10"
                  onClick={() => !isUploading && fileInputRef.current?.click()}
                >
                  {isUploading ? (
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  ) : (
                    <Camera className="w-6 h-6 text-white" />
                  )}
                </div>
                
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  onChange={handleFileSelect}
                  disabled={isUploading}
                />
              </div>

              {/* Upload Actions if file selected */}
              {fileToUpload && (
                <div className="flex items-center gap-2 mb-4 w-full justify-center">
                  <Button size="sm" onClick={handleUpload} disabled={isUploading} className="bg-green-600 hover:bg-green-500 rounded-full text-xs h-8 px-4 cursor-pointer">
                    {isUploading ? <Loader2 className="w-3 h-3 mr-1.5 animate-spin" /> : null}
                    Save
                  </Button>
                  <Button size="sm" variant="ghost" onClick={cancelUpload} disabled={isUploading} className="text-gray-300 hover:text-white rounded-full text-xs h-8 px-4 cursor-pointer">
                    Cancel
                  </Button>
                </div>
              )}

              <h2 className="text-2xl font-bold text-white truncate w-full">{user.user_metadata?.full_name || "Guest User"}</h2>
              <p className="text-gray-400 text-sm truncate w-full mb-4">{user.email}</p>

              <div className="flex flex-wrap items-center justify-center gap-2 w-full mt-2">
                <div className="flex items-center gap-1.5 bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-xs font-semibold border border-blue-500/20">
                  <Shield className="w-3.5 h-3.5" />
                  <span className="capitalize">{profile?.role || 'User'}</span>
                </div>
                {isVerified ? (
                  <div className="flex items-center gap-1.5 bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-xs font-semibold border border-green-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 bg-orange-500/10 text-orange-400 px-3 py-1 rounded-full text-xs font-semibold border border-orange-500/20">
                    <XCircle className="w-3.5 h-3.5" />
                    Unverified
                  </div>
                )}
              </div>
            </div>

            {/* Actions Card */}
            <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-2xl flex flex-col justify-center gap-4 h-full">
              <Button 
                onClick={() => setIsEditing(!isEditing)} 
                variant="ghost" 
                className={`w-full justify-start rounded-xl h-12 cursor-pointer border border-white/5 transition-all ${isEditing ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'}`}
              >
                <Edit className="w-4 h-4 mr-3" />
                {isEditing ? "Cancel Editing" : "Edit Profile"}
              </Button>
              <Button 
                onClick={() => router.push('/forgot-password')} 
                variant="ghost" 
                className="w-full justify-start rounded-xl h-12 cursor-pointer border border-white/5 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition-all"
              >
                <KeyRound className="w-4 h-4 mr-3" />
                Change Password
              </Button>
              <div className="pt-2">
                <Button 
                  onClick={handleSignOut} 
                  variant="destructive" 
                  className="w-full justify-start rounded-xl h-12 cursor-pointer bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 font-semibold transition-all"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Sign Out
                </Button>
              </div>
            </div>

          </div>

          {/* Right Column (Personal Information) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />
              
              <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-6 relative z-10">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <UserIcon className="w-5 h-5 text-blue-400" />
                    Personal Information
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">Manage your personal details and contact information.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Full Name</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={formData.full_name}
                      onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                      className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
                      placeholder="Your full name"
                    />
                  ) : (
                    <div className="flex items-center gap-3 bg-black/20 border border-white/5 rounded-xl px-4 py-3">
                      <UserIcon className="w-4 h-4 text-gray-500" />
                      <span className="text-white text-sm font-medium">{user.user_metadata?.full_name || "Not provided"}</span>
                    </div>
                  )}
                </div>

                {/* Email (Read Only) */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email Address</label>
                  <div className="flex items-center gap-3 bg-black/40 border border-white/5 rounded-xl px-4 py-3 opacity-80 cursor-not-allowed">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-300 text-sm font-medium truncate">{user.email}</span>
                  </div>
                </div>

                {/* Mobile Number */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Mobile Number</label>
                  {isEditing ? (
                    <PhoneInput 
                      value={formData.mobile_number}
                      onChange={(val) => setFormData({...formData, mobile_number: val})}
                      className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm focus-within:ring-2 focus-within:ring-blue-500/50 transition-all"
                    />
                  ) : (
                    <div className="flex items-center gap-3 bg-black/20 border border-white/5 rounded-xl px-4 py-3">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-white text-sm font-medium">{user.user_metadata?.mobile_number || "Not provided"}</span>
                    </div>
                  )}
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Gender</label>
                  {isEditing ? (
                    <select 
                      value={formData.gender}
                      onChange={(e) => setFormData({...formData, gender: e.target.value})}
                      className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none text-sm cursor-pointer"
                    >
                      <option value="" className="bg-[#0f172a]">Select Gender</option>
                      <option value="Male" className="bg-[#0f172a]">Male</option>
                      <option value="Female" className="bg-[#0f172a]">Female</option>
                      <option value="Other" className="bg-[#0f172a]">Other</option>
                    </select>
                  ) : (
                    <div className="flex items-center gap-3 bg-black/20 border border-white/5 rounded-xl px-4 py-3">
                      <UserIcon className="w-4 h-4 text-gray-500" />
                      <span className="text-white text-sm font-medium">{user.user_metadata?.gender || "Not provided"}</span>
                    </div>
                  )}
                </div>

                {/* Date of Birth */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Date of Birth</label>
                  {isEditing ? (
                    <input 
                      type="date"
                      value={formData.dob}
                      onChange={(e) => setFormData({...formData, dob: e.target.value})}
                      className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm cursor-pointer"
                      style={{ colorScheme: 'dark' }}
                    />
                  ) : (
                    <div className="flex items-center gap-3 bg-black/20 border border-white/5 rounded-xl px-4 py-3">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-white text-sm font-medium">
                        {user.user_metadata?.dob ? new Date(user.user_metadata.dob).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : "Not provided"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Joined Date (Read Only) */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Joined</label>
                  <div className="flex items-center gap-3 bg-black/40 border border-white/5 rounded-xl px-4 py-3 opacity-80 cursor-not-allowed">
                    <CalendarDays className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-300 text-sm font-medium">{joinedDate}</span>
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Address</label>
                  {isEditing ? (
                    <textarea 
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 min-h-[120px] resize-none transition-all text-sm"
                      placeholder="Your full residential address"
                    />
                  ) : (
                    <div className="flex items-start gap-3 bg-black/20 border border-white/5 rounded-xl px-4 py-3 min-h-[100px]">
                      <MapPin className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
                      <span className="text-white text-sm font-medium whitespace-pre-wrap">{user.user_metadata?.address || "Not provided"}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Save / Cancel Buttons */}
              {isEditing && (
                <div className="mt-8 pt-6 border-t border-white/10 flex flex-col-reverse sm:flex-row gap-3 justify-end items-center relative z-10 animate-in fade-in slide-in-from-bottom-4">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setFormData({
                        full_name: user.user_metadata?.full_name || "",
                        gender: user.user_metadata?.gender || "",
                        mobile_number: user.user_metadata?.mobile_number || "",
                        address: user.user_metadata?.address || "",
                        dob: user.user_metadata?.dob || "",
                      });
                      setIsEditing(false);
                    }}
                    disabled={isSaving}
                    className="w-full sm:w-auto rounded-xl text-gray-300 hover:text-white hover:bg-white/5 px-6 cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="w-full sm:w-auto rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 cursor-pointer shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all"
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Shield className="w-4 h-4 mr-2" />}
                    Save Changes
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12">
          <FaqSection />
        </div>
      </div>
    </div>
  );
}
