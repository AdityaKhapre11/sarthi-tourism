import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables if needed (e.g. using dotenv)
// Note: This script assumes NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials. Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrate() {
  console.log("Authenticating as Admin...");
  const { error: authError } = await supabase.auth.signInWithPassword({
    email: 'admin@sarthitourism.com',
    password: 'Admin@123'
  });

  if (authError) {
    console.warn("Could not authenticate automatically (you might have used a different password). You can ignore this if RLS is disabled, but if it fails, please disable RLS temporarily:", authError.message);
  } else {
    console.log("Authenticated successfully.");
  }

  console.log("Starting data migration to Supabase...");
  const dataPath = path.join(process.cwd(), 'src/data/packages.json');
  
  if (!fs.existsSync(dataPath)) {
    console.error(`File not found: ${dataPath}`);
    process.exit(1);
  }

  const rawData = fs.readFileSync(dataPath, 'utf-8');
  const packages = JSON.parse(rawData);

  for (const pkg of packages) {
    console.log(`Migrating package: ${pkg.name}...`);
    
    // Insert Package
    const { data: packageData, error: packageError } = await supabase
      .from('packages')
      .insert({
        name: pkg.name,
        image: pkg.image,
        duration: pkg.duration,
        price: pkg.price,
        description: pkg.description || '',
        highlights: pkg.highlights || [],
        included: pkg.included || [],
        excluded: pkg.excluded || [],
        gallery: pkg.gallery || [],
        itinerary: pkg.itinerary || []
      })
      .select()
      .single();

    if (packageError) {
      console.error(`Error inserting package ${pkg.name}:`, packageError);
      continue;
    }

    console.log(`Successfully inserted package: ${pkg.name} with ID: ${packageData.id}`);
  }

  console.log("Migration complete!");
}

migrate();
