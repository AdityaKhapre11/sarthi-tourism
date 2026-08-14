import { createClient as createPublicClient } from '@supabase/supabase-js';

export const runtime = 'edge';
export const alt = 'Package Cover';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/jpeg';

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return new Response('Configuration missing', { status: 500 });
    }

    const supabase = createPublicClient(supabaseUrl, supabaseAnonKey);
    const { data: pkg } = await supabase.from('packages').select('image').eq('id', id).single();

    if (!pkg || !pkg.image) {
      return new Response('Not Found', { status: 404 });
    }

    const imageRes = await fetch(pkg.image);
    if (!imageRes.ok) {
       return new Response('Failed to fetch image', { status: 500 });
    }

    const buffer = await imageRes.arrayBuffer();
    return new Response(buffer, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error generating OG image:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}
