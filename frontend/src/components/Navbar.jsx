import { NavLink } from 'react-router-dom';

export default function Navbar({ onRefresh, loading }) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
        .nav-link-item { transition: color 0.2s; }
        .nav-link-item:hover { color: #fff !important; }
        .refresh-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #a855f7, #ec4899) !important;
          transform: scale(1.02);
        }
        .refresh-btn { transition: all 0.2s; }
      `}</style>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(10,10,12,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '0 2.5rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '64px',
        fontFamily: "'Sora', sans-serif",
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1rem', fontWeight: 800, color: '#fff',
          }}>F</div>
          <span style={{
            fontWeight: 700, fontSize: '1.05rem', color: '#fff',
            letterSpacing: '-0.02em',
          }}>FinSage</span>
          <span style={{
            fontSize: '0.55rem', color: 'rgba(168,85,247,0.9)',
            border: '1px solid rgba(168,85,247,0.25)',
            borderRadius: 4, padding: '2px 7px',
            letterSpacing: '0.12em', fontWeight: 600,
          }}>BETA</span>
        </div>

        {/* Nav Links */}
        <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
          {[
            { to: '/', label: 'Dashboard' },
            { to: '/market', label: 'Market Analysis' },
            { to: '/predictor', label: 'Stock Predictor' },
          ].map(({ to, label }) => (
            <NavLink key={to} to={to} end={to === '/'}
              className="nav-link-item"
              style={({ isActive }) => ({
                padding: '7px 18px',
                borderRadius: 8,
                fontSize: '0.82rem',
                fontWeight: isActive ? 600 : 400,
                textDecoration: 'none',
                color: isActive ? '#fff' : 'rgba(255,255,255,0.45)',
                background: isActive ? 'rgba(255,255,255,0.07)' : 'transparent',
                border: isActive ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent',
              })}>
              {label}
            </NavLink>
          ))}
        </div>

        {/* Refresh button */}
        <button
          className="refresh-btn"
          onClick={onRefresh}
          disabled={loading}
          style={{
            padding: '8px 20px',
            borderRadius: 8,
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            background: loading
              ? 'rgba(168,85,247,0.12)'
              : 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
            color: loading ? 'rgba(168,85,247,0.7)' : '#fff',
            border: loading ? '1px solid rgba(168,85,247,0.2)' : 'none',
            letterSpacing: '0.02em',
            opacity: loading ? 0.8 : 1,
            display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
          <span style={{ display: 'inline-block', animation: loading ? 'spin 1s linear infinite' : 'none' }}>
            {loading ? '⟳' : '↻'}
          </span>
          {loading ? 'Analyzing...' : 'Refresh'}
        </button>
      </nav>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}