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
          background: 'linear-gradient(135deg, #0052FF 0%, #0041CC 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px',
          position: 'relative',
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: 'absolute',
            top: '50px',
            right: '50px',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '80px',
            left: '80px',
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.08)',
            display: 'flex',
          }}
        />
        
        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            zIndex: 1,
          }}
        >
          {/* Logo/Icon */}
          <div
            style={{
              width: '160px',
              height: '160px',
              borderRadius: '40px',
              background: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '100px',
              fontWeight: 'bold',
              color: '#0052FF',
              marginBottom: '40px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            }}
          >
            B
          </div>
          
          {/* Title */}
          <div
            style={{
              fontSize: '72px',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '20px',
              letterSpacing: '-2px',
              display: 'flex',
            }}
          >
            Baselifestyle
          </div>
          
          {/* Subtitle */}
          <div
            style={{
              fontSize: '36px',
              color: 'rgba(255, 255, 255, 0.9)',
              marginBottom: '40px',
              display: 'flex',
            }}
          >
            Share Your Daily Wins
          </div>
          
          {/* Features */}
          <div
            style={{
              display: 'flex',
              gap: '40px',
              marginTop: '20px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '24px',
                color: 'white',
                background: 'rgba(255, 255, 255, 0.15)',
                padding: '12px 24px',
                borderRadius: '20px',
              }}
            >
              💰 Earn USDC
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '24px',
                color: 'white',
                background: 'rgba(255, 255, 255, 0.15)',
                padding: '12px 24px',
                borderRadius: '20px',
              }}
            >
              🎨 Mint NFTs
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '24px',
                color: 'white',
                background: 'rgba(255, 255, 255, 0.15)',
                padding: '12px 24px',
                borderRadius: '20px',
              }}
            >
              🔵 Built on Base
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}

