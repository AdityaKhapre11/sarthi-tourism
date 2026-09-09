import { ImageResponse } from 'next/og';
import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs';
import path from 'node:path';

export const runtime = 'nodejs';
export const alt = 'Tour Package Details | Sarthi Tourism';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';
export const revalidate = 3600; // Cache for 1 hour

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let pkg: {
    id?: string | number;
    name?: string;
    image?: string;
    price?: string;
    duration?: string;
  } | null = null;

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey) {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

      let query = supabase.from('packages').select('*');
      if (isUUID) {
        query = query.eq('id', id);
      } else {
        const searchName = id.split('-').slice(0, 2).join(' ');
        query = query.ilike('name', `${searchName}%`);
      }

      const { data } = await query.single();
      if (data) {
        pkg = data;
      }
    }
  } catch (error) {
    console.error('Error fetching package for dynamic OG image:', error);
  }

  // Load logo as base64
  let logoDataUrl = '';
  try {
    const logoPath = path.join(process.cwd(), 'public', 'images', 'logo1.png');
    if (fs.existsSync(logoPath)) {
      const logoBuf = fs.readFileSync(logoPath);
      logoDataUrl = `data:image/png;base64,${logoBuf.toString('base64')}`;
    }
  } catch (e) {
    console.error('Error loading logo:', e);
  }

  // Resolve exact package hero image as base64 data URL
  let heroDataUrl = '';
  if (pkg?.image) {
    try {
      if (pkg.image.startsWith('http://') || pkg.image.startsWith('https://')) {
        const res = await fetch(pkg.image, { signal: AbortSignal.timeout(6000) });
        if (res.ok) {
          const buf = Buffer.from(await res.arrayBuffer());
          const isJpeg = buf[0] === 0xff && buf[1] === 0xd8;
          const isPng = buf[0] === 0x89 && buf[1] === 0x50;
          const mime = isJpeg ? 'image/jpeg' : (isPng ? 'image/png' : 'image/webp');
          heroDataUrl = `data:${mime};base64,${buf.toString('base64')}`;
        }
      } else if (pkg.image.startsWith('/')) {
        const localImgPath = path.join(process.cwd(), 'public', pkg.image.replace(/^\//, ''));
        if (fs.existsSync(localImgPath)) {
          const buf = fs.readFileSync(localImgPath);
          const isJpeg = buf[0] === 0xff && buf[1] === 0xd8;
          const isPng = buf[0] === 0x89 && buf[1] === 0x50;
          const mime = isJpeg ? 'image/jpeg' : (isPng ? 'image/png' : 'image/webp');
          heroDataUrl = `data:${mime};base64,${buf.toString('base64')}`;
        }
      }
    } catch (e) {
      console.error('Error loading hero image for OG:', e);
    }
  }

  // Clean branded fallback if hero image is unavailable
  if (!heroDataUrl) {
    try {
      const fallbackPath = path.join(process.cwd(), 'public', 'images', 'og-image.png');
      if (fs.existsSync(fallbackPath)) {
        const buf = fs.readFileSync(fallbackPath);
        heroDataUrl = `data:image/png;base64,${buf.toString('base64')}`;
      }
    } catch (e) {
      console.error('Error loading fallback image:', e);
    }
  }

  const packageName = pkg?.name ? pkg.name.trim() : 'Premium Tour Package';
  const durationText = pkg?.duration || '';
  const priceText = pkg?.price
    ? (pkg.price.toLowerCase().includes('contact') ? 'Contact for Best Rates' : `Starting from ₹${pkg.price}`)
    : '';
  const supportingText = [durationText, priceText].filter(Boolean).join('  •  ');

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          position: 'relative',
          backgroundColor: '#070f1e',
          fontFamily: 'sans-serif',
          overflow: 'hidden',
        }}
      >
        {/* Exact Hero Image of the current package */}
        {heroDataUrl ? (
          <img
            src={heroDataUrl}
            alt={packageName}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '1200px',
              height: '630px',
              objectFit: 'cover',
            }}
          />
        ) : null}

        {/* Subtle dark gradient overlay to ensure text readability while keeping image visually dominant */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '1200px',
            height: '630px',
            background: 'linear-gradient(90deg, rgba(6, 12, 24, 0.92) 0%, rgba(6, 12, 24, 0.72) 48%, rgba(6, 12, 24, 0.22) 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '1200px',
            height: '630px',
            background: 'linear-gradient(180deg, rgba(6, 12, 24, 0.45) 0%, transparent 40%, rgba(6, 12, 24, 0.82) 100%)',
          }}
        />

        {/* Content Container (left-aligned, 60px safe margin) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '100%',
            height: '100%',
            padding: '50px 60px 45px 60px',
            boxSizing: 'border-box',
            position: 'relative',
          }}
        >
          {/* Logo: top-left, approx 60px from left and 50px from top */}
          <div style={{ display: 'flex' }}>
            {logoDataUrl ? (
              <img
                src={logoDataUrl}
                alt="Sarthi Tourism"
                style={{
                  height: '80px',
                  width: '74px',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 4px 16px rgba(0, 0, 0, 0.85))',
                }}
              />
            ) : null}
          </div>

          {/* Package Name + Supporting Text */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              maxWidth: '620px',
            }}
          >
            {/* Package name: 56px, weight 700-800 */}
            <div
              style={{
                display: 'flex',
                fontSize: '56px',
                fontWeight: 800,
                lineHeight: 1.08,
                letterSpacing: '-1.5px',
                color: '#ffffff',
                textShadow: '0 4px 24px rgba(0, 0, 0, 0.95)',
              }}
            >
              {packageName}
            </div>

            {/* Supporting package information: 24px, weight 400-500, 24-30px spacing below */}
            {supportingText ? (
              <div
                style={{
                  display: 'flex',
                  fontSize: '24px',
                  fontWeight: 500,
                  color: '#38bdf8',
                  marginTop: '26px',
                  textShadow: '0 2px 12px rgba(0, 0, 0, 0.95)',
                }}
              >
                {supportingText}
              </div>
            ) : null}
          </div>

          {/* Website/Company Name: bottom-left, approx 60px from left and 45px from bottom */}
          <div
            style={{
              display: 'flex',
              fontSize: '18px',
              fontWeight: 600,
              letterSpacing: '0.8px',
              color: '#e2e8f0',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.9)',
            }}
          >
            sarthitourism.com
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
