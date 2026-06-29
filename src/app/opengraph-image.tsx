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
    // Read local logo image directly from the filesystem to bypass Vercel network/auth blocks
    const logoPath = join(process.cwd(), 'public', 'images', 'logo1.png');
    const logoBuffer = await readFile(logoPath);
    const logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`;

    // Read local hero background directly from filesystem
    const heroPath = join(process.cwd(), 'public', 'images', 'uttarakhand_3.png');
    const heroBuffer = await readFile(heroPath);
    const heroBase64 = `data:image/jpeg;base64,${heroBuffer.toString('base64')}`;

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

          {/* Left-to-Right Light Gradient Overlay */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '1200px',
              height: '630px',
              backgroundImage: 'linear-gradient(to right, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.85) 45%, rgba(255, 255, 255, 0) 100%)',
            }}
          />

          {/* Content Container (Left Aligned) */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'center',
              padding: '60px 80px',
              height: '100%',
              width: '750px',
              position: 'relative',
            }}
          >
            {/* Logo */}
            <img
              src={logoBase64}
              alt="Sarthi Tourism"
              style={{
                height: '180px', // Restrict height instead of width so tall logos don't break layout
                objectFit: 'contain',
                marginBottom: '24px',
              }}
            />

            {/* Tagline */}
            <div
              style={{
                display: 'flex',
                fontSize: '60px',
                fontWeight: 800,
                color: '#0f172a',
                letterSpacing: '-0.03em',
                lineHeight: '1.2',
                marginBottom: '16px',
              }}
            >
              Premium Travel & Tour Packages
            </div>

            {/* Subtext */}
            <div
              style={{
                display: 'flex',
                fontSize: '26px',
                fontWeight: 500,
                color: '#475569',
                lineHeight: '1.5',
                maxWidth: '600px',
              }}
            >
              Discover breathtaking destinations and unforgettable experiences with our expert-crafted itineraries.
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
