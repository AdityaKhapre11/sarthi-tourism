"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail, Shield, Calendar, ArrowLeft, Camera, Loader2, LogOut, MapPin, Phone, User as UserIcon, Edit } from "lucide-react";
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

  // Use optimistic name for the header title if editing but not yet saved,
  // or use the current metadata if not. Actually, let's keep the header reflecting real saved data,
  // or optimistic if we manually update it on save. We refresh on save anyway.

  const currentAvatar = previewUrl || user.user_metadata?.avatar_url;

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
      // Notice we are intentionally NOT setting previewUrl to null here.
      // This keeps the optimistic UI image active on the screen perfectly without reloading!
      // And we avoid router.refresh() which would cause a full page reload and screen flicker.
      
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
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground font-sans relative overflow-hidden py-24 px-6">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/dubai.png"
          alt="Background"
          fill
          className="object-cover opacity-30 mix-blend-luminosity scale-105 blur-sm"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
      </div>

      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none z-0" />

      <div className="w-full max-w-4xl relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700 pt-28">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 font-medium">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="bg-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-[32px] p-8 sm:p-12 shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-600/20 to-transparent" />
          
          <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-8 z-10">
            {/* Avatar */}
            <div className="w-32 h-32 rounded-full border-4 border-background/50 shadow-2xl overflow-hidden bg-blue-600 flex items-center justify-center shrink-0 relative group">
              {currentAvatar ? (
                <Image src={currentAvatar} alt="Profile" fill className="object-cover" />
              ) : (
                <span className="text-5xl font-bold text-white">{getInitials(user.user_metadata?.full_name, user.email)}</span>
              )}

              {/* Upload Overlay */}
              <div 
                className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                onClick={() => !isUploading && fileInputRef.current?.click()}
              >
                {isUploading ? (
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                ) : (
                  <Camera className="w-8 h-8 text-white" />
                )}
              </div>
            </div>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/png, image/jpeg, image/jpg, image/webp"
              onChange={handleFileSelect}
              disabled={isUploading}
            />

            {/* Main Info */}
            <div className="flex-1 text-center sm:text-left pt-2">
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{user.user_metadata?.full_name || "User"}</h1>
              
              <div className="inline-flex items-center justify-center sm:justify-start gap-2 bg-blue-500/10 text-blue-400 px-4 py-1.5 rounded-full text-sm font-medium border border-blue-500/20 mb-6">
                <Shield className="w-4 h-4" />
                <span className="capitalize">{profile?.role || 'User'} Account</span>
              </div>

              {fileToUpload && (
                <div className="flex items-center justify-center sm:justify-start gap-3 mb-6 animate-in fade-in slide-in-from-top-2">
                  <Button 
                    onClick={handleUpload} 
                    disabled={isUploading}
                    className="bg-green-600 hover:bg-green-500 text-white rounded-full font-semibold"
                  >
                    {isUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    Save Photo
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={cancelUpload}
                    disabled={isUploading}
                    className="text-gray-300 hover:text-white rounded-full"
                  >
                    Cancel
                  </Button>
                </div>
              )}

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mt-8 w-full text-left">
                <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                  <h3 className="text-lg font-semibold text-white">Personal Information</h3>
                  {!isEditing && (
                    <Button 
                      variant="ghost" 
                      onClick={() => setIsEditing(true)} 
                      className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 h-8 px-3 rounded-lg"
                    >
                      <Edit className="w-3.5 h-3.5 mr-2" />
                      Edit
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="flex items-start gap-4 text-gray-300">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 border border-white/5 shrink-0 mt-1">
                      <UserIcon className="w-5 h-5" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Full Name</p>
                      {isEditing ? (
                        <input 
                          type="text" 
                          value={formData.full_name}
                          onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                          className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                          placeholder="Your full name"
                        />
                      ) : (
                        <p className="text-white font-medium mt-1.5">{user.user_metadata?.full_name || "Not provided"}</p>
                      )}
                    </div>
                  </div>

                  {/* Gender */}
                  <div className="flex items-start gap-4 text-gray-300">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 border border-white/5 shrink-0 mt-1">
                      <UserIcon className="w-5 h-5" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Gender</p>
                      {isEditing ? (
                        <select 
                          value={formData.gender}
                          onChange={(e) => setFormData({...formData, gender: e.target.value})}
                          className="w-full bg-[#1e293b] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none text-sm"
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      ) : (
                        <p className="text-white font-medium mt-1.5">{user.user_metadata?.gender || "Not provided"}</p>
                      )}
                    </div>
                  </div>

                  {/* Email (Read Only) */}
                  <div className="flex items-start gap-4 text-gray-300">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 border border-white/5 shrink-0 mt-1">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Email Address</p>
                      <p className="text-gray-300 font-medium mt-1.5 opacity-80">{user.email}</p>
                    </div>
                  </div>

                  {/* Mobile Number */}
                  <div className="flex items-start gap-4 text-gray-300">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 border border-white/5 shrink-0 mt-1">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Mobile Number</p>
                      {isEditing ? (
                        <PhoneInput 
                          value={formData.mobile_number}
                          onChange={(val) => setFormData({...formData, mobile_number: val})}
                          className="w-full bg-black/20 border-white/10 text-white placeholder-gray-500 text-sm"
                        />
                      ) : (
                        <p className="text-white font-medium mt-1.5">{user.user_metadata?.mobile_number || "Not provided"}</p>
                      )}
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-4 text-gray-300 sm:col-span-2">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 border border-white/5 shrink-0 mt-1">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Address</p>
                      {isEditing ? (
                        <textarea 
                          value={formData.address}
                          onChange={(e) => setFormData({...formData, address: e.target.value})}
                          className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px] resize-none transition-all text-sm"
                          placeholder="Your full address"
                        />
                      ) : (
                        <p className="text-white font-medium mt-1.5 whitespace-pre-wrap">{user.user_metadata?.address || "Not provided"}</p>
                      )}
                    </div>
                  </div>

                  {/* Date of Birth */}
                  <div className="flex items-start gap-4 text-gray-300 sm:col-span-2">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 border border-white/5 shrink-0 mt-1">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Date of Birth</p>
                      {isEditing ? (
                        <input 
                          type="date"
                          value={formData.dob}
                          onChange={(e) => setFormData({...formData, dob: e.target.value})}
                          className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm max-w-sm block"
                        />
                      ) : (
                        <p className="text-white font-medium mt-1.5">{user.user_metadata?.dob ? new Date(user.user_metadata.dob).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : "Not provided"}</p>
                      )}
                    </div>
                  </div>


                </div>

                {isEditing && (
                  <div className="flex gap-3 mt-8 pt-6 border-t border-white/10 justify-end">
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
                      className="rounded-xl text-gray-300 hover:text-white border border-white/10 px-6"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6"
                    >
                      {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                      Save Changes
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row gap-4 justify-between items-center relative z-10">
            <p className="text-sm text-gray-500 text-center sm:text-left">Manage your account settings and preferences.</p>
            <Button 
              onClick={handleSignOut}
              variant="destructive" 
              className="w-full sm:w-auto rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 font-semibold cursor-pointer"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* FAQ Section */}
        <FaqSection />
      </div>
    </div>
  );
}

