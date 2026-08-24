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

const privacyPolicyHtml = `<h2>1. Information We Collect</h2>
<p>We collect information you provide directly to us when you request information, book a tour package, or communicate with us. This may include your name, email address, phone number, and any other details you choose to provide.</p>
<h2>2. How We Use Your Information</h2>
<p>We use the information we collect to:</p>
<ul>
  <li>Provide, maintain, and improve our services.</li>
  <li>Process your tour bookings and send related information.</li>
  <li>Respond to your comments, questions, and customer service requests.</li>
  <li>Send you technical notices, updates, and security alerts.</li>
</ul>
<h2>3. Data Security</h2>
<p>We implement appropriate technical and organizational measures to maintain the safety of your personal information. However, please note that no method of transmission over the Internet is 100% secure.</p>
<h2>4. Contact Us</h2>
<p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:info@sarthitourism.com">info@sarthitourism.com</a>.</p>`;

const termsConditionsHtml = `<h2>1. Acceptance of Terms</h2>
<p>By accessing and using our website and services, you accept and agree to be bound by the terms and provision of this agreement.</p>
<h2>2. Booking and Payments</h2>
<p>When booking a tour package with Sarthi Tourism:</p>
<ul>
  <li>A deposit may be required to secure your reservation.</li>
  <li>Full payment must be completed before the tour commencement date unless otherwise specified.</li>
  <li>Prices are subject to change without prior notice, except for confirmed bookings.</li>
</ul>
<h2>3. Cancellations and Refunds</h2>
<p>Cancellation policies vary depending on the specific tour package booked. Please refer to your booking confirmation for specific cancellation terms and refund eligibility.</p>
<h2>4. Travel Documents</h2>
<p>It is the traveler's responsibility to ensure they have valid passports, visas, and any other necessary travel documents prior to departure.</p>
<h2>5. Contact Information</h2>
<p>If you have any questions regarding these Terms of Service, please contact us at <a href="mailto:info@sarthitourism.com">info@sarthitourism.com</a>.</p>`;

async function seed() {
  console.log("Seeding Privacy Policy...");
  const { error: pError } = await supabase.from('settings').upsert({
    key: 'privacy_policy',
    value: {
      title: 'Privacy Policy',
      content: privacyPolicyHtml
    },
    updated_at: new Date().toISOString()
  }, { onConflict: 'key' });
  
  if (pError) console.error("Error seeding privacy_policy:", pError);
  else console.log("Privacy Policy seeded successfully.");

  console.log("Seeding Terms & Conditions...");
  const { error: tError } = await supabase.from('settings').upsert({
    key: 'terms_conditions',
    value: {
      title: 'Terms of Service',
      content: termsConditionsHtml
    },
    updated_at: new Date().toISOString()
  }, { onConflict: 'key' });

  if (tError) console.error("Error seeding terms_conditions:", tError);
  else console.log("Terms & Conditions seeded successfully.");
}

seed();
