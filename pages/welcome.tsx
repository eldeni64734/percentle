import Image from "next/image";
import { useRouter } from "next/router";
import PlayPage from "./play";

export default function WelcomePage() {
  const router = useRouter();

  function startGame() {
    router.replace("/play");
  }

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, fontFamily: 'Inter, sans-serif', overflow: 'hidden'
    }}>
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
        }}
      >
        <div style={{ filter: 'blur(3px)', transform: 'scale(1.02)', height: '100%' }}>
          <PlayPage />
        </div>
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.18)' }} />
      </div>
      <div style={{
        position: 'relative',
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        padding: '2.5rem',
        maxWidth: '400px',
        width: '90%',
        textAlign: 'center',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        border: '1px solid #e5e7eb'
      }}>
        <Image
          src="/logo.png"
          alt="Percentle Logo"
          width={200}
          height={42}
          style={{ marginBottom: '1.5rem', height: 'auto' }}
          priority
        />
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>
          Welcome to Percentle!
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#6b7280', lineHeight: '1.6', marginBottom: '2rem' }}>
          Guess the countries with the highest % of today&apos;s letter.
        </p>
        <button
          onClick={startGame}
          style={{
            backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '12px', padding: '0.875rem 2rem', fontSize: '1.125rem', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', transition: 'all 0.2s ease', width: '100%'
          }}
          onMouseOver={e => { e.currentTarget.style.backgroundColor = '#059669'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseOut={e => { e.currentTarget.style.backgroundColor = '#10b981'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          Play
        </button>
      </div>
    </div>
  );
}
