import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const alt = 'Sarthi Tourism | Premium Travel';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  try {
    // We use Node.js runtime (50MB limit) to avoid Vercel's strict 1MB Edge function limit.
    // Fetch local images securely via Vercel's network to bypass Node File Trace issues.
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000');


    // Fetch a tiny, highly-compressed version to stretch and simulate a backdrop blur!
    // Next.js restricts the 'q' parameter, so we use 75 to avoid 400 Bad Request errors.
    const blurRes = await fetch(new URL('/_next/image?url=%2Fimages%2Futtarakhand_3.png&w=48&q=75', baseUrl));
    if (!blurRes.ok) throw new Error(`Failed to fetch blur image: ${await blurRes.text()}`);
    const blurContentType = blurRes.headers.get('content-type') || 'image/jpeg';
    const blurBuffer = await blurRes.arrayBuffer();
    const blurBase64 = `data:${blurContentType};base64,${Buffer.from(blurBuffer).toString('base64')}`;

    const logoRes = await fetch(new URL('/images/logo1.png', baseUrl));
    if (!logoRes.ok) throw new Error(`Failed to fetch logo: ${await logoRes.text()}`);
    const logoContentType = logoRes.headers.get('content-type') || 'image/png';
    const logoBuffer = await logoRes.arrayBuffer();
    const logoBase64 = `data:${logoContentType};base64,${Buffer.from(logoBuffer).toString('base64')}`;

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
          {/* Layer 1: The blurred, stretched background filling the entire canvas */}
          <img
            src={blurBase64}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: '1200px',
              height: '630px',
              objectFit: 'cover',
            }}
          />

          {/* Layer 2: Semi-transparent black glassmorphism overlay on the left */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: '1200px',
              height: '630px',
              backgroundColor: 'rgba(10, 10, 10, 0.75)',
            }}
          />




          {/* Content Box */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              height: '100%',
              padding: '80px 100px',
              position: 'relative',
              justifyContent: 'center',
            }}
          >
            {/* Logo - Anchored to the left side */}
            <div style={{ position: 'absolute', top: '165px', left: '100px', display: 'flex' }}>
              <img
                src={logoBase64}
                style={{
                  height: '300px',
                  objectFit: 'contain',
                }}
              />
            </div>

            {/* Main Text Content - Pushed to the right side */}
            <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 'auto', maxWidth: '600px' }}>
              {/* Refined Gold Line */}
              <div
                style={{
                  width: '60px',
                  height: '3px',
                  backgroundColor: '#d4af37',
                  marginBottom: '28px',
                  borderRadius: '2px',
                  boxShadow: '0 2px 12px rgba(212, 175, 55, 0.4)',
                }}
              />

              {/* Subtitle */}
              <div
                style={{
                  color: '#d4af37',
                  fontSize: '20px',
                  fontWeight: 700,
                  letterSpacing: '5px',
                  marginBottom: '20px',
                  textTransform: 'uppercase',
                }}
              >
                The New Decadence
              </div>

              {/* Title */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  color: '#ffffff',
                  fontSize: '76px',
                  fontWeight: 800,
                  lineHeight: 1.15,
                  marginBottom: '32px',
                  fontFamily: 'serif',
                  letterSpacing: '-1.5px',
                }}
              >
                <span style={{ display: 'flex', paddingBottom: '4px' }}>Sarthi Tourism |</span>
                <span style={{ display: 'flex', color: '#f3f4f6' }}>Premium Travel</span>
              </div>

              {/* Description */}
              <div
                style={{
                  color: '#e5e7eb',
                  fontSize: '26px',
                  lineHeight: 1.6,
                  fontWeight: 400,
                  maxWidth: '750px',
                  letterSpacing: '0.5px',
                }}
              >
                Discover premium tour packages, breathtaking destinations, and unforgettable experiences.
              </div>
            </div>
          </div>
        </div>
      ),
      {
        ...size,
      }
    );
  } catch (error) {
    console.error('Error generating OG image:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}
