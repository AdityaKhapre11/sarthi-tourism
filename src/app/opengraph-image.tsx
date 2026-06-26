import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const runtime = 'nodejs';
export const alt = 'Sarthi Tourism | Premium Travel';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  try {
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000';

    // Fetch local logo image via HTTP
    const logoRes = await fetch(new URL('/images/logo11.png', baseUrl));
    if (!logoRes.ok) throw new Error('Failed to fetch logo');
    const logoBuffer = await logoRes.arrayBuffer();
    const logoBase64 = `data:image/png;base64,${Buffer.from(logoBuffer).toString('base64')}`;

    // Fetch hero background image via HTTP
    const heroRes = await fetch(new URL('/images/uttarakhand_3.png', baseUrl));
    if (!heroRes.ok) throw new Error('Failed to fetch hero image');
    const heroBuffer = await heroRes.arrayBuffer();
    const heroBase64 = `data:image/jpeg;base64,${Buffer.from(heroBuffer).toString('base64')}`;

    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          {/* Background Image */}
          <img
            src={heroBase64}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '1200px',
              height: '630px',
              objectFit: 'cover',
            }}
          />

          {/* Light Overlay for better contrast with dark logo and text */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '1200px',
              height: '630px',
              backgroundColor: 'rgba(255, 255, 255, 0.40)',
            }}
          />

          {/* Content Card */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'transparent',
              padding: '60px 80px',
              position: 'relative',
              maxWidth: '900px',
            }}
          >
            {/* Logo */}
            <img
              src={logoBase64}
              alt="Sarthi Tourism"
              style={{
                width: '500px',
                objectFit: 'contain',
                marginBottom: '40px',
              }}
            />

            {/* Tagline */}
            <div
              style={{
                display: 'flex',
                fontSize: '52px',
                fontWeight: 800,
                color: '#0f172a',
                letterSpacing: '-0.02em',
                textAlign: 'center',
              }}
            >
              Premium Travel & Tour Packages
            </div>

            <div
              style={{
                display: 'flex',
                fontSize: '28px',
                fontWeight: 600,
                color: '#334155',
                marginTop: '24px',
                textAlign: 'center',
                lineHeight: 1.4,
              }}
            >
              Discover breathtaking destinations and unforgettable experiences with our expert-crafted itineraries.
            </div>

            <div
              style={{
                display: 'flex',
                fontSize: '24px',
                fontWeight: 700,
                color: '#2563eb',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                marginTop: '40px',
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
  } catch (error) {
    console.error('Error generating OG image:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}
