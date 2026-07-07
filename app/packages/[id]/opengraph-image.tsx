import { createClient } from '@/lib/supabase/server';

export const runtime = 'edge';
export const alt = 'Package Cover';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/jpeg';

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: pkg } = await supabase.from('packages').select('image').eq('id', id).single();

    if (!pkg || !pkg.image) {
      return new Response('Not Found', { status: 404 });
    }

    let optimizedUrl = pkg.image;
    if (pkg.image.includes('/storage/v1/object/public/')) {
      optimizedUrl = pkg.image.replace('/storage/v1/object/public/', '/storage/v1/render/image/public/') + '?width=1200&height=630&resize=cover&quality=80';
    }

    const imageRes = await fetch(optimizedUrl);
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
