import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials.");
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createAdmin() {
  const email = process.env.ADMIN_EMAIL || 'admin@sarthitourism.com';
  const password = process.env.ADMIN_PASSWORD || 'Admin@123';

  console.log(`Creating admin user: ${email}`);

  // Create the user
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) {
    if (error.message.includes('already been registered')) {
      console.log('Admin user already exists!');
    } else {
      console.error('Error creating user:', error.message);
    }
  } else {
    console.log('Admin user created successfully! ID:', data.user.id);
  }
}

createAdmin();
