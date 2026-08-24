import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve('.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase credentials");
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
  console.log("Checking for legal_pages table...");
  const { data: legalData, error: legalError } = await supabase.from('legal_pages').select('*').limit(1);
  if (legalError) {
    console.log("legal_pages error:", legalError.message);
  } else {
    console.log("legal_pages exists:", legalData);
  }

  console.log("Checking for settings table...");
  const { data: settingsData, error: settingsError } = await supabase.from('settings').select('*').limit(1);
  if (settingsError) {
    console.log("settings error:", settingsError.message);
  } else {
    console.log("settings exists:", settingsData);
  }
}

checkTables();
