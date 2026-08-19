import { ImageResponse } from 'next/og';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const alt = 'Sarthi Tourism Tour Package';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let pkg: { name: string; image?: string; price?: string; duration?: string } | null = null;

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey) {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      const { data } = await supabase
        .from('packages')
        .select('name, image, price, duration')
        .eq('id', id)
        .single();

      pkg = data;
    }
  } catch (error) {
    console.error('Error fetching package for OG image:', error);
  }

  // Fetch the logo as base64 using fs
  let logoBase64 = '';
  try {
    const { readFileSync } = await import('fs');
    const { join } = await import('path');
    const logoBuffer = readFileSync(join(process.cwd(), 'public/images/logo1.png'));
    logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`;
  } catch (e) {
    console.error('Failed to read logo for package OG', e);
  }

  // Fetch the package cover image as base64
  let coverBase64 = '';
  if (pkg?.image) {
    try {
      const coverRes = await fetch(pkg.image);
      if (coverRes.ok) {
        const coverContentType = coverRes.headers.get('content-type') || 'image/jpeg';
        const coverBuffer = await coverRes.arrayBuffer();
        coverBase64 = `data:${coverContentType};base64,${Buffer.from(coverBuffer).toString('base64')}`;
      }
    } catch {
      // Cover image fetch failed, continue without it
    }
  }

  const packageName = pkg?.name || 'Tour Package';
  const packagePrice = pkg?.price || '';
  const packageDuration = pkg?.duration || '';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
        }}
      >
        {/* Background: Package cover image or dark gradient */}
        {coverBase64 ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverBase64}
            alt="Package Cover"
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: '1200px',
              height: '630px',
              objectFit: 'cover',
            }}
          />
        ) : (
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: '1200px',
              height: '630px',
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
            }}
          />
        )}

        {/* Dark overlay for text readability */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '1200px',
            height: '630px',
            background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.2) 100%)',
          }}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            width: '100%',
            height: '100%',
            padding: '50px 60px',
            position: 'relative',
          }}
        >
          {/* Top bar: Logo + Branding */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              position: 'absolute',
              top: '40px',
              left: '60px',
            }}
          >
            {logoBase64 && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoBase64}
                alt="Sarthi Tourism"
                style={{
                  height: '60px',
                  objectFit: 'contain',
                  marginRight: '16px',
                }}
              />
            )}
            <div
              style={{
                color: '#d4af37',
                fontSize: '22px',
                fontWeight: 700,
                letterSpacing: '3px',
                textTransform: 'uppercase',
              }}
            >
              Sarthi Tourism
            </div>
          </div>

          {/* Gold accent line */}
          <div
            style={{
              width: '80px',
              height: '4px',
              backgroundColor: '#d4af37',
              borderRadius: '2px',
              marginBottom: '20px',
              boxShadow: '0 2px 12px rgba(212, 175, 55, 0.5)',
            }}
          />

          {/* Package Name */}
          <div
            style={{
              display: 'flex',
              color: '#ffffff',
              fontSize: packageName.length > 40 ? '42px' : '52px',
              fontWeight: 800,
              lineHeight: 1.2,
              marginBottom: '20px',
              textShadow: '0 2px 20px rgba(0,0,0,0.5)',
              maxWidth: '900px',
            }}
          >
            {packageName}
          </div>

          {/* Price + Duration badges */}
          <div style={{ display: 'flex', gap: '16px' }}>
            {packagePrice && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: 'rgba(212, 175, 55, 0.2)',
                  border: '1.5px solid rgba(212, 175, 55, 0.5)',
                  borderRadius: '12px',
                  padding: '10px 24px',
                  color: '#fbbf24',
                  fontSize: '24px',
                  fontWeight: 700,
                }}
              >
                💰 {packagePrice}
              </div>
            )}
            {packageDuration && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: '1.5px solid rgba(255, 255, 255, 0.25)',
                  borderRadius: '12px',
                  padding: '10px 24px',
                  color: '#e5e7eb',
                  fontSize: '24px',
                  fontWeight: 600,
                }}
              >
                🕐 {packageDuration}
              </div>
            )}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
