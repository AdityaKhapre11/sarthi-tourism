import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkTrigger() {
  const { data, error } = await supabase.rpc('get_trigger_status'); // Supabase RPC requires a function, which we don't have.
  
  // Alternatively, just try to manually insert the user to see if it fails!
  const { error: insertError } = await supabase.from('users').insert({
    id: '0afd6067-2bbb-41b6-976f-72cf6393bd41',
    email: 'naru12@yopmail.com',
    full_name: 'test'
  });
  console.log("Manual insert error:", insertError);
}
checkTrigger();
