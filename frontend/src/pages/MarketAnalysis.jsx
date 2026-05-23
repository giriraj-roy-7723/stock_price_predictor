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

function Card({ children, style = {} }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 16, padding: '1.5rem',
      ...style,
    }}>
      {children}
    </div>
  );
}

function SentimentBar({ sentimentData }) {
  const entries = Object.entries(sentimentData || {});
  if (!entries.length) return null;
  const bull = entries.filter(([, v]) => v.sentiment === 'bullish').length;
  const bear = entries.filter(([, v]) => v.sentiment === 'bearish').length;
  const neutral = entries.length - bull - bear;
  const total = entries.length;

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <div style={{
        fontSize: '0.62rem', color: 'rgba(255,255,255,0.25)',
        letterSpacing: '0.1em', marginBottom: '0.6rem', textTransform: 'uppercase',
      }}>
        Sentiment breakdown · {total} stocks
      </div>
      <div style={{ display: 'flex', height: 6, borderRadius: 3, overflow: 'hidden', gap: 2 }}>
        {bull > 0 && <div style={{ flex: bull, background: 'linear-gradient(90deg,#a855f7,#ec4899)', borderRadius: '3px 0 0 3px' }} />}
        {neutral > 0 && <div style={{ flex: neutral, background: 'rgba(255,255,255,0.1)' }} />}
        {bear > 0 && <div style={{ flex: bear, background: '#f87171', borderRadius: '0 3px 3px 0' }} />}
      </div>
      <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.6rem', fontSize: '0.65rem' }}>
        <span style={{ color: '#c084fc' }}>↑ Bullish {bull}</span>
        <span style={{ color: 'rgba(255,255,255,0.3)' }}>→ Neutral {neutral}</span>
        <span style={{ color: '#f87171' }}>↓ Bearish {bear}</span>
      </div>
    </div>
  );
}

function DirectionHero({ analysis, sentimentData }) {
  const dir = analysis.direction;
  const gradientMap = {
    Bullish: 'linear-gradient(135deg, #a855f7, #ec4899)',
    Bearish: 'linear-gradient(135deg, #f87171, #dc2626)',
    Sideways: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
  };
  const colorMap = {
    Bullish: '#c084fc',
    Bearish: '#f87171',
    Sideways: '#fbbf24',
  };

  return (
    <Card>
      <SectionHeader label="AI-Powered" title="Overall Market Direction" />
      <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap' }}>
        <div style={{ minWidth: 200 }}>
          <div style={{
            fontSize: '3.2rem', fontWeight: 900,
            letterSpacing: '-0.05em', lineHeight: 1,
            background: gradientMap[dir] || gradientMap.Sideways,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>{dir}</div>
          <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.25)', marginTop: '0.4rem' }}>
            NSE / BSE / Sensex
          </div>
          <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)' }}>Market Risk</span>
            <span style={{
              fontSize: '0.65rem', padding: '3px 12px', borderRadius: 6,
              fontWeight: 700, letterSpacing: '0.06em',
              background: analysis.riskLevel === 'Low' ? 'rgba(52,211,153,0.1)'
                : analysis.riskLevel === 'High' ? 'rgba(248,113,113,0.1)'
                : 'rgba(251,191,36,0.1)',
              color: analysis.riskLevel === 'Low' ? '#34d399'
                : analysis.riskLevel === 'High' ? '#f87171' : '#fbbf24',
              border: `1px solid ${analysis.riskLevel === 'Low' ? 'rgba(52,211,153,0.2)'
                : analysis.riskLevel === 'High' ? 'rgba(248,113,113,0.2)'
                : 'rgba(251,191,36,0.2)'}`,
            }}>{analysis.riskLevel} Risk</span>
          </div>
          <SentimentBar sentimentData={sentimentData} />
        </div>

        <div style={{
          flex: 1, minWidth: 260,
          borderLeft: '1px solid rgba(255,255,255,0.06)',
          paddingLeft: '2rem',
        }}>
          <div style={{
            fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)',
            lineHeight: 1.8, fontWeight: 400,
          }}>{analysis.summary}</div>

          {analysis.niftyOutlook && (
            <div style={{
              marginTop: '1.25rem',
              padding: '1rem 1.25rem',
              background: 'rgba(168,85,247,0.06)',
              border: '1px solid rgba(168,85,247,0.12)',
              borderRadius: 10,
            }}>
              <div style={{
                fontSize: '0.6rem', color: 'rgba(168,85,247,0.7)',
                letterSpacing: '0.12em', textTransform: 'uppercase',
                fontWeight: 600, marginBottom: '0.4rem',
              }}>Nifty 50 Outlook</div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.65 }}>
                {analysis.niftyOutlook}
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

function SectorOutlook({ sectorOutlook }) {
  const entries = Object.entries(sectorOutlook || {});
  if (!entries.length) return (
    <div style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255,255,255,0.15)', fontSize: '0.78rem' }}>
      No sector data
    </div>
  );

  return entries.map(([sector, outlook]) => {
    const cfg = {
      positive: { color: '#34d399', bg: 'rgba(52,211,153,0.08)', border: 'rgba(52,211,153,0.18)', label: '▲ Positive' },
      negative: { color: '#f87171', bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.18)', label: '▼ Negative' },
      neutral:  { color: '#fbbf24', bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.18)', label: '→ Neutral' },
    }[outlook] || { color: '#fbbf24', bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.18)', label: '→ Neutral' };

    return (
      <div key={sector} style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0.8rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}>
        <span style={{ fontSize: '0.84rem', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{sector}</span>
        <span style={{
          fontSize: '0.65rem', padding: '3px 12px', borderRadius: 6,
          fontWeight: 700, letterSpacing: '0.04em',
          background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
        }}>{cfg.label}</span>
      </div>
    );
  });
}

export default function MarketAnalysis({ data, loading }) {
  const analysis = data?.marketAnalysis;

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
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#a855f7', display: 'inline-block' }} />
          AI-Powered
        </div>
        <h1 style={{
          fontSize: '2.4rem', fontWeight: 800, margin: 0,
          letterSpacing: '-0.04em', color: '#fff', lineHeight: 1.1,
        }}>Market Analysis</h1>
        <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.6rem' }}>
          Where is the Indian market heading?
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '5rem' }}>
          <div style={{
            width: 40, height: 40, border: '2px solid rgba(168,85,247,0.2)',
            borderTopColor: '#a855f7', borderRadius: '50%',
            animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem',
          }} />
          <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.82rem' }}>Running market analysis...</div>
        </div>
      )}

      {/* No data */}
      {!loading && !analysis && (
        <Card>
          <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.18)', fontSize: '0.82rem' }}>
            Go to Dashboard and click <strong style={{ color: 'rgba(168,85,247,0.5)' }}>Refresh</strong> to generate market analysis.
          </div>
        </Card>
      )}

      {analysis && !loading && (
        <>
          <DirectionHero analysis={analysis} sentimentData={data?.sentimentData} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
            {/* Sector Outlook */}
            <Card>
              <SectionHeader label="Breakdown" title="Sector Outlook" />
              <SectorOutlook sectorOutlook={analysis.sectorOutlook} />
            </Card>

            {/* Key Themes */}
            <Card>
              <SectionHeader label="Detected" title="Key Market Themes" />
              {(analysis.keyThemes || []).length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255,255,255,0.15)', fontSize: '0.78rem' }}>
                  No themes extracted
                </div>
              ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {analysis.keyThemes.map((theme, i) => (
                    <span key={i} style={{
                      padding: '6px 14px', borderRadius: 8,
                      fontSize: '0.76rem', fontWeight: 500,
                      background: 'rgba(168,85,247,0.08)',
                      color: 'rgba(192,132,252,0.9)',
                      border: '1px solid rgba(168,85,247,0.15)',
                    }}># {theme}</span>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Individual stock sentiments */}
          {data?.sentimentData && Object.keys(data.sentimentData).length > 0 && (
            <Card style={{ marginTop: '1.5rem' }}>
              <SectionHeader label="Per Stock" title="Individual Sentiment" />
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '0.75rem',
              }}>
                {Object.entries(data.sentimentData).map(([ticker, info]) => {
                  const isBull = info.sentiment === 'bullish';
                  const isBear = info.sentiment === 'bearish';
                  return (
                    <div key={ticker} style={{
                      padding: '0.9rem 1rem', borderRadius: 10,
                      background: 'rgba(255,255,255,0.02)',
                      border: `1px solid ${isBull ? 'rgba(168,85,247,0.15)' : isBear ? 'rgba(248,113,113,0.15)' : 'rgba(255,255,255,0.05)'}`,
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>{ticker}</span>
                        <span style={{
                          fontSize: '0.62rem', fontWeight: 700,
                          color: isBull ? '#c084fc' : isBear ? '#f87171' : '#fbbf24',
                        }}>
                          {isBull ? '▲' : isBear ? '▼' : '→'} {info.sentiment?.toUpperCase()}
                          {info.score ? ` · ${Math.round(info.score * 100)}%` : ''}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', lineHeight: 1.55 }}>
                        {info.reason}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}