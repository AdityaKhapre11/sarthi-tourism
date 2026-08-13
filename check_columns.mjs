import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://eqzgikfszvufvkafstxk.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_rSkc4w_P-tvbfQmPhzC-7Q_c-3mJ8yL";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
  // Test if verification_token_hash exists
  const res1 = await supabase.from('users').select('verification_token_hash').limit(1);
  console.log('Test verification_token_hash:', res1.error ? res1.error.message : 'EXISTS');
  
  // Test if verification_token exists
  const res2 = await supabase.from('users').select('verification_token').limit(1);
  console.log('Test verification_token:', res2.error ? res2.error.message : 'EXISTS');

  // Test if email_verified exists
  const res3 = await supabase.from('users').select('email_verified').limit(1);
  console.log('Test email_verified:', res3.error ? res3.error.message : 'EXISTS');
}

main();
