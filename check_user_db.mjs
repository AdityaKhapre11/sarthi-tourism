import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkUser(id) {
  const { data, error } = await supabase.from('users').select('*').eq('id', id);
  console.log("public.users row:", data, error);
}
checkUser('0afd6067-2bbb-41b6-976f-72cf6393bd41');
