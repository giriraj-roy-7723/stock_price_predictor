export default function StockPredictor() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0c',
      padding: '80px 2.5rem 4rem',
      fontFamily: "'Sora', sans-serif",
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
    }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');`}</style>

      {/* Glow blob */}
      <div style={{
        position: 'absolute',
        width: 400, height: 400,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        width: 72, height: 72, borderRadius: 18,
        background: 'rgba(168,85,247,0.08)',
        border: '1px solid rgba(168,85,247,0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '2rem', marginBottom: '1.75rem',
      }}>📈</div>

      <div style={{
        fontSize: '0.62rem', color: 'rgba(168,85,247,0.7)',
        letterSpacing: '0.16em', textTransform: 'uppercase',
        fontWeight: 600, marginBottom: '0.75rem',
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#a855f7', display: 'inline-block' }} />
        Coming Soon
      </div>

      <h1 style={{
        fontSize: '2.2rem', fontWeight: 800, color: '#fff',
        letterSpacing: '-0.04em', margin: '0 0 1rem', textAlign: 'center',
        lineHeight: 1.15,
      }}>Stock Price Predictor</h1>

      <p style={{
        fontSize: '0.82rem', color: 'rgba(255,255,255,0.3)',
        textAlign: 'center', maxWidth: 440, lineHeight: 1.8, margin: 0,
      }}>
        This engine will combine historical price data with live news sentiment
        to predict short-term price movements for individual NSE stocks.
      </p>

      <div style={{
        marginTop: '2.5rem',
        padding: '0.75rem 1.75rem',
        borderRadius: 10,
        background: 'rgba(168,85,247,0.05)',
        border: '1px solid rgba(168,85,247,0.12)',
        fontSize: '0.72rem', color: 'rgba(168,85,247,0.4)',
        letterSpacing: '0.06em', fontWeight: 500,
      }}>
        Phase 2 · Not yet implemented
      </div>
    </div>
  );
}