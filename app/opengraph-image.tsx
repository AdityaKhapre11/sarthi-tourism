import { ImageResponse } from 'next/og';

import { readFileSync } from 'fs';
import { join } from 'path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const alt = 'Sarthi Tourism | Premium Travel';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  try {
    let logoBase64 = '';
    try {
      const logoBuffer = readFileSync(join(process.cwd(), 'public/images/logo1.png'));
      logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`;
    } catch (e) {
      console.error('Failed to read logo via fs', e);
    }

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
          {/* Layer 1: Dark gradient background replacing the fetched image */}
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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoBase64}
                alt="Sarthi Tourism Logo"
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
