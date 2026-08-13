import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://eqzgikfszvufvkafstxk.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_rSkc4w_P-tvbfQmPhzC-7Q_c-3mJ8yL";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
  const res = await supabase.from('users').select('id, email').limit(1);
  console.log('Test id, email:', res.error ? res.error.message : 'EXISTS');
}

main();
