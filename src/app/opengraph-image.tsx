import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const runtime = 'nodejs';
export const alt = 'Sarthi Tourism | Premium Travel';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  try {
    // Read local logo image
    const logoData = await readFile(join(process.cwd(), 'public/images/logo11.png'));
    const logoBase64 = `data:image/png;base64,${logoData.toString('base64')}`;

    // Read hero background image
    const heroData = await readFile(join(process.cwd(), 'public/images/uttarakhand_3.png'));
    const heroBase64 = `data:image/jpeg;base64,${heroData.toString('base64')}`;

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
