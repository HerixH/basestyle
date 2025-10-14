import { ImageResponse } from 'next/og'
 
// Image metadata
export const alt = 'Baselifestyle - Share Your Daily Wins'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'
 
// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '80px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Abstract background elements */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 100%)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-150px',
            left: '-150px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.03) 100%)',
            display: 'flex',
          }}
        />
        
        {/* Top section - Branding */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', zIndex: 1 }}>
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '48px',
              fontWeight: 'bold',
              color: 'white',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
            }}
          >
            B
          </div>
          <div
            style={{
              fontSize: '42px',
              fontWeight: 'bold',
              color: 'white',
              display: 'flex',
              letterSpacing: '-1px',
            }}
          >
            Baselifestyle
          </div>
        </div>

        {/* Middle section - Main message */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', zIndex: 1 }}>
          <div
            style={{
              fontSize: '68px',
              fontWeight: 'bold',
              color: 'white',
              lineHeight: 1.2,
              display: 'flex',
              flexDirection: 'column',
              maxWidth: '900px',
            }}
          >
            <span style={{ display: 'flex' }}>Share Your</span>
            <span style={{ display: 'flex', background: 'linear-gradient(90deg, #FFD700 0%, #FFA500 100%)', backgroundClip: 'text', color: 'transparent', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Daily Wins
            </span>
          </div>
          <div
            style={{
              fontSize: '32px',
              color: 'rgba(255, 255, 255, 0.85)',
              display: 'flex',
              maxWidth: '800px',
              lineHeight: 1.4,
            }}
          >
            Post your activities, earn USDC payments, and collect NFTs on Base
          </div>
        </div>

        {/* Bottom section - Features */}
        <div style={{ display: 'flex', gap: '24px', zIndex: 1, flexWrap: 'wrap' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              padding: '16px 32px',
              borderRadius: '50px',
              fontSize: '26px',
              color: 'white',
              fontWeight: '600',
            }}
          >
            USDC Rewards
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              padding: '16px 32px',
              borderRadius: '50px',
              fontSize: '26px',
              color: 'white',
              fontWeight: '600',
            }}
          >
            NFT Minting
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}

