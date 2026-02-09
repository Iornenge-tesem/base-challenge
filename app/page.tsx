'use client'

// Simple test page - SDK ready() is called in providers.tsx
export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0a2540',
      color: 'white',
      fontSize: '20px',
      fontFamily: 'system-ui, sans-serif',
      textAlign: 'center',
      padding: '20px'
    }}>
      <div>
        <h1 style={{ marginBottom: '20px' }}>Base Challenge</h1>
        <p>App loaded successfully!</p>
      </div>
    </div>
  )
}


