import { useEffect } from 'react';


function cleanTitle(raw) {
  if (!raw) return '';
  return raw
    .replace(/<!\[CDATA\[|\]\]>/g, '')
    .replace(/<[^>]*>/g, '')
    .trim();
}

function StatCard({ value, label, accent }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 14,
      padding: '1.4rem 1.6rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: accent || 'linear-gradient(90deg, #a855f7, #ec4899)',
        borderRadius: '14px 14px 0 0',
      }} />
      <div style={{
        fontSize: '2rem', fontWeight: 800, color: '#fff',
        letterSpacing: '-0.04em', lineHeight: 1,
      }}>{value}</div>
      <div style={{
        fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)',
        marginTop: '0.5rem', letterSpacing: '0.08em',
        textTransform: 'uppercase', fontWeight: 500,
      }}>{label}</div>
    </div>
  );
}

function BuyCard({ rec }) {
  const confColor = rec.confidence === 'High'
    ? { bg: 'rgba(168,85,247,0.12)', color: '#c084fc', border: 'rgba(168,85,247,0.25)' }
    : rec.confidence === 'Medium'
    ? { bg: 'rgba(251,191,36,0.1)', color: '#fbbf24', border: 'rgba(251,191,36,0.2)' }
    : { bg: 'rgba(248,113,113,0.1)', color: '#f87171', border: 'rgba(248,113,113,0.2)' };

  const riskColor = rec.risk === 'Low'
    ? '#34d399'
    : rec.risk === 'High'
    ? '#f87171'
    : '#fbbf24';

  return (
    <div style={{
      background: 'rgba(168,85,247,0.04)',
      border: '1px solid rgba(168,85,247,0.12)',
      borderRadius: 12,
      padding: '1.1rem 1.25rem',
      marginBottom: '0.75rem',
      transition: 'border-color 0.2s',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
        <div>
          <span style={{
            fontSize: '1.15rem', fontWeight: 800, color: '#fff',
            letterSpacing: '-0.02em',
          }}>{rec.ticker}</span>
          {rec.sector && (
            <span style={{
              marginLeft: 8, fontSize: '0.65rem',
              color: 'rgba(255,255,255,0.3)', fontWeight: 400,
            }}>{rec.sector}</span>
          )}
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{
            fontSize: '0.6rem', padding: '3px 9px', borderRadius: 6,
            fontWeight: 700, letterSpacing: '0.06em',
            background: confColor.bg, color: confColor.color,
            border: `1px solid ${confColor.border}`,
          }}>{rec.confidence}</span>
          <span style={{
            fontSize: '0.6rem', padding: '3px 9px', borderRadius: 6,
            fontWeight: 600,
            background: 'rgba(255,255,255,0.04)',
            color: riskColor,
            border: '1px solid rgba(255,255,255,0.08)',
          }}>Risk: {rec.risk}</span>
        </div>
      </div>
      <div style={{
        fontSize: '0.76rem', color: 'rgba(255,255,255,0.45)',
        lineHeight: 1.65,
      }}>{rec.reason}</div>
    </div>
  );
}

function NewsItem({ post }) {
  const title = cleanTitle(post.title);
  const date = post.published
    ? new Date(post.published).toLocaleString('en-IN', {
        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
      })
    : '';

  return (
    <div style={{
      padding: '0.85rem 0',
      borderBottom: '1px solid rgba(255,255,255,0.04)',
    }}>
      <a
        href={post.url}
        target="_blank"
        rel="noreferrer"
        style={{ textDecoration: 'none' }}
      >
        <div style={{
          fontSize: '0.82rem', color: 'rgba(255,255,255,0.78)',
          lineHeight: 1.55, marginBottom: '0.35rem',
          fontWeight: 400,
          transition: 'color 0.15s',
        }}
          onMouseEnter={e => e.currentTarget.style.color = '#fff'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.78)'}
        >{title}</div>
      </a>
      <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
        <span style={{
          fontSize: '0.62rem', color: 'rgba(168,85,247,0.7)',
          background: 'rgba(168,85,247,0.08)',
          border: '1px solid rgba(168,85,247,0.15)',
          padding: '1px 8px', borderRadius: 4, fontWeight: 500,
        }}>{post.source}</span>
        <span style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.2)' }}>{date}</span>
      </div>
    </div>
  );
}

function SectionHeader({ label, title }) {
  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <div style={{
        fontSize: '0.62rem', color: 'rgba(168,85,247,0.8)',
        letterSpacing: '0.14em', textTransform: 'uppercase',
        fontWeight: 600, marginBottom: '0.3rem',
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#a855f7', display: 'inline-block' }} />
        {label}
      </div>
      <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>{title}</div>
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div style={{
      textAlign: 'center', padding: '2.5rem 1rem',
      color: 'rgba(255,255,255,0.18)', fontSize: '0.8rem',
    }}>{text}</div>
  );
}

function LoadingState() {
  return (
    <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
      <div style={{
        width: 36, height: 36, border: '2px solid rgba(168,85,247,0.2)',
        borderTopColor: '#a855f7', borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
        margin: '0 auto 1rem',
      }} />
      <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.78rem' }}>
        Mining data & running AI analysis...
      </div>
      <div style={{ color: 'rgba(255,255,255,0.15)', fontSize: '0.68rem', marginTop: '0.3rem' }}>
        Takes ~25 seconds
      </div>
    </div>
  );
}

export default function Dashboard({ data, loading, error, onRefresh }) {
  useEffect(() => {
    if (!data && !loading && !error) onRefresh();
  }, []);

  const recs = data?.recommendations || [];
  const posts = data?.posts || [];
  const stocks = data?.stocks || [];
  const sentimentMap = data?.sentimentData || {};
  const bullish = Object.values(sentimentMap).filter(s => s.sentiment === 'bullish').length;
  const bearish = Object.values(sentimentMap).filter(s => s.sentiment === 'bearish').length;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0c',
      padding: '80px 2.5rem 4rem',
      fontFamily: "'Sora', sans-serif",
      color: '#e2e8f0',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
      `}</style>

      {/* Page header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{
          fontSize: '0.62rem', color: 'rgba(168,85,247,0.8)',
          letterSpacing: '0.16em', textTransform: 'uppercase',
          fontWeight: 600, marginBottom: '0.5rem',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#a855f7', display: 'inline-block', boxShadow: '0 0 8px #a855f7' }} />
          Live Intelligence
        </div>
        <h1 style={{
          fontSize: '2.4rem', fontWeight: 800, margin: 0,
          letterSpacing: '-0.04em', color: '#fff', lineHeight: 1.1,
        }}>Market Dashboard</h1>
        <p style={{
          fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)',
          marginTop: '0.6rem',
        }}>
          {data
            ? `Updated ${new Date(data.minedAt).toLocaleTimeString()} · ${posts.length} articles · ${stocks.length} stocks tracked`
            : 'Click Refresh to load live market intelligence'}
        </p>
      </div>

      {/* Error banner */}
      {error && (
        <div style={{
          background: 'rgba(248,113,113,0.06)',
          border: '1px solid rgba(248,113,113,0.18)',
          borderRadius: 12, padding: '0.9rem 1.25rem',
          marginBottom: '1.5rem', fontSize: '0.78rem', color: '#fca5a5',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span>⚠</span> {error} — Ensure your miner server is running on port 3001.
        </div>
      )}

      {/* Stats row */}
      {(data || loading) && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1rem', marginBottom: '2rem',
        }}>
          <StatCard value={loading ? '—' : posts.length} label="Articles Mined" />
          <StatCard value={loading ? '—' : recs.length} label="Buy Signals"
            accent="linear-gradient(90deg, #a855f7, #ec4899)" />
          <StatCard value={loading ? '—' : bullish} label="Bullish Stocks"
            accent="linear-gradient(90deg, #34d399, #059669)" />
          <StatCard value={loading ? '—' : bearish} label="Bearish Stocks"
            accent="linear-gradient(90deg, #f87171, #dc2626)" />
        </div>
      )}

      {/* Main 2-col grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1.5rem', marginBottom: '1.5rem',
      }}>
        {/* Buy Signals */}
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 16, padding: '1.5rem',
        }}>
          <SectionHeader label="AI Picks" title="Stocks to Buy" />
          {loading ? <LoadingState /> :
           !data ? <EmptyState text="Hit Refresh to generate AI recommendations" /> :
           recs.length === 0 ? <EmptyState text="No strong buy signals in current data" /> :
           recs.map((rec, i) => <BuyCard key={i} rec={rec} />)}
        </div>

        {/* News */}
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 16, padding: '1.5rem',
        }}>
          <SectionHeader label="Real-time feed" title="Latest Finance News" />
          {loading ? <LoadingState /> :
           posts.length === 0 ? <EmptyState text="No news loaded yet" /> :
           posts.slice(0, 14).map((post, i) => <NewsItem key={i} post={post} />)}
        </div>
      </div>

      {/* Stocks detected row */}
      {stocks.length > 0 && !loading && (
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 16, padding: '1.5rem',
        }}>
          <SectionHeader label="Tracked" title="Stocks Detected in News" />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {stocks.map((s, i) => {
              const info = sentimentMap[s];
              const isBull = info?.sentiment === 'bullish';
              const isBear = info?.sentiment === 'bearish';
              return (
                <span key={i} style={{
                  padding: '5px 14px', borderRadius: 8,
                  fontSize: '0.75rem', fontWeight: 600,
                  background: isBull ? 'rgba(168,85,247,0.1)'
                    : isBear ? 'rgba(248,113,113,0.08)'
                    : 'rgba(255,255,255,0.04)',
                  color: isBull ? '#c084fc'
                    : isBear ? '#f87171'
                    : 'rgba(255,255,255,0.35)',
                  border: `1px solid ${isBull ? 'rgba(168,85,247,0.2)'
                    : isBear ? 'rgba(248,113,113,0.18)'
                    : 'rgba(255,255,255,0.07)'}`,
                }}>
                  {s} {isBull ? '↑' : isBear ? '↓' : ''}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Initial empty state */}
      {!data && !loading && !error && (
        <div style={{
          textAlign: 'center', padding: '5rem 2rem',
          color: 'rgba(255,255,255,0.15)', fontSize: '0.85rem',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}>📊</div>
          Click <strong style={{ color: 'rgba(168,85,247,0.6)' }}>Refresh</strong> to mine live data and generate AI analysis
        </div>
      )}
    </div>
  );
}