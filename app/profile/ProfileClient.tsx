"use client";

import Image from "next/image";
import Link from "next/link";
import { User, Mail, Shield, Calendar, ArrowLeft, LogOut, Camera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { toast } from "sonner";

interface ProfileClientProps {
  user: any;
  profile: any;
}

export default function ProfileClient({ user, profile }: ProfileClientProps) {
  const router = useRouter();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);

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
      
    } catch (err: any) {
      toast.error(err.message || "An error occurred while uploading");
      setPreviewUrl(null); // Revert optimistic UI on fail
      setFileToUpload(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const getInitials = (name?: string, email?: string) => {
    if (name) return name.charAt(0).toUpperCase();
    if (email) return email.charAt(0).toUpperCase();
    return "U";
  };

  const formattedDate = new Date(user.created_at).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

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

      <div className="w-full max-w-2xl relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
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

              <div className="space-y-4">
                <div className="flex items-center justify-center sm:justify-start gap-4 text-gray-300">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 border border-white/5">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Email Address</p>
                    <p className="text-white font-medium">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center justify-center sm:justify-start gap-4 text-gray-300">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 border border-white/5">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Joined</p>
                    <p className="text-white font-medium">{formattedDate}</p>
                  </div>
                </div>
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
      </div>
    </div>
  );
}

