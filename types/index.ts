import { User as SupabaseUser } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  email?: string;
  full_name?: string;
  avatar_url?: string;
  role?: 'user' | 'admin' | string;
  created_at?: string;
}

export type AppUser = SupabaseUser;

export interface ItineraryItem {
  day: number;
  title: string;
  description: string;
}

export interface PackageItem {
  id: string | number;
  name: string;
  image: string;
  duration: string;
  price: string;
  highlights?: string[];
  description?: string;
  itinerary?: ItineraryItem[];
  included?: string[];
  excluded?: string[];
  gallery?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface InquiryItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  package_name?: string;
  message?: string;
  status?: string;
  created_at?: string;
}

export interface FooterPackageLink {
  name: string;
  link: string;
}
