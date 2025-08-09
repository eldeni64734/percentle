import { useRouter } from "next/router";

export default function WelcomePage() {
  const router = useRouter();

  function startGame() {
    router.replace("/play");
  }

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{
        backgroundColor: '#ffffff', borderRadius: '16px', padding: '2.5rem', maxWidth: '400px', width: '90%', textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', border: '1px solid #e5e7eb'
      }}>
        <img src="/logo.png" alt="Percentle Logo" style={{ width: '120px', height: 'auto', marginBottom: '1.5rem', display: 'block', margin: '0 auto 1.5rem auto' }} />
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>
          Welcome to Percentle!
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#6b7280', lineHeight: '1.6', marginBottom: '2rem' }}>
          Guess the countries with the highest % of today's letter.
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