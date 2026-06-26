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
            backgroundColor: '#ffffff',
            backgroundImage: 'radial-gradient(circle at 50% 50%, #f0f9ff 0%, #ffffff 100%)',
            position: 'relative',
          }}
        >
          {/* Subtle Decorative Elements */}
          <div
            style={{
              position: 'absolute',
              top: '-20%',
              right: '-10%',
              width: '600px',
              height: '600px',
              backgroundColor: 'rgba(59, 130, 246, 0.05)',
              borderRadius: '50%',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-20%',
              left: '-10%',
              width: '500px',
              height: '500px',
              backgroundColor: 'rgba(99, 102, 241, 0.05)',
              borderRadius: '50%',
            }}
          />

          {/* Logo */}
          <img
            src={logoBase64}
            alt="Sarthi Tourism"
            style={{
              width: '600px',
              objectFit: 'contain',
              marginBottom: '40px',
            }}
          />

          {/* Tagline */}
          <div
            style={{
              display: 'flex',
              fontSize: '46px',
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
              fontWeight: 500,
              color: '#64748b',
              marginTop: '20px',
              textAlign: 'center',
              maxWidth: '800px',
            }}
          >
            Discover breathtaking destinations and unforgettable experiences with our expert-crafted itineraries.
          </div>
          
          <div
            style={{
              display: 'flex',
              position: 'absolute',
              bottom: '40px',
              fontSize: '24px',
              fontWeight: 700,
              color: '#3b82f6',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            sarthitourism.com
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
