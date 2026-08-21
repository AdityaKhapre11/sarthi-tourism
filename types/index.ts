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


