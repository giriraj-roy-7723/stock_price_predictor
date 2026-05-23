const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
// const MODEL = 'llama-3.3-70b-versatile';
const MODEL='llama-3.1-8b-instant';
async function callGroq(prompt, maxTokens = 1500) {
  const res = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      temperature: 0.3,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Groq API error');
  return data.choices[0].message.content;
}

// Node 1: Extract mentioned stocks
async function extractStocksNode(corpus) {
  console.log('[Graph] Node 1: Extracting stocks...');
  const text = await callGroq(`
From this Indian finance news corpus, extract all Indian stock names and NSE tickers mentioned.
Return ONLY a valid JSON array, no explanation, no markdown, no backticks.
Example: ["RELIANCE", "TCS", "INFY", "HDFCBANK"]

CORPUS:
${corpus.slice(0, 2000)}`);

  try {
    return JSON.parse(text.trim());
  } catch {
    // fallback: extract with regex if JSON fails
    const matches = text.match(/["']([A-Z]{2,10})["']/g) || [];
    return [...new Set(matches.map(m => m.replace(/["']/g, '')))];
  }
}

// Node 2: Sentiment per stock
async function sentimentNode(corpus, stocks) {
  console.log('[Graph] Node 2: Sentiment analysis...');
  if (stocks.length === 0) return {};

  const text = await callGroq(`
Analyze the market sentiment for each of these Indian stocks based on the news corpus below.
Stocks to analyze: ${stocks.slice(0, 10).join(', ')}

Return ONLY a valid JSON object, no explanation, no markdown, no backticks.
Format exactly like this:
{"RELIANCE":{"sentiment":"bullish","score":0.8,"reason":"Brief reason here"},"TCS":{"sentiment":"bearish","score":0.3,"reason":"Brief reason here"}}

Sentiment must be one of: bullish, bearish, neutral
Score must be 0.0 to 1.0

CORPUS:
${corpus.slice(0, 4000)}`);

  try {
    return JSON.parse(text.trim());
  } catch {
    return {};
  }
}

// Node 3: Buy recommendations
async function recommendationNode(sentimentData) {
  console.log('[Graph] Node 3: Recommendations...');
  if (Object.keys(sentimentData).length === 0) return [];

  const text = await callGroq(`
Based on this sentiment analysis data for Indian stocks, generate buy recommendations.
Only include stocks with bullish sentiment and score above 0.55.

Sentiment data: ${JSON.stringify(sentimentData)}

Return ONLY a valid JSON array, no explanation, no markdown, no backticks.
Format exactly like this:
[{"ticker":"RELIANCE","action":"BUY","confidence":"High","reason":"Detailed reason based on news","risk":"Medium","sector":"Energy"}]

Confidence must be: High, Medium, or Low
Risk must be: Low, Medium, or High
Sort by confidence (High first).`);

  try {
    return JSON.parse(text.trim());
  } catch {
    return [];
  }
}

// Node 4: Market analysis
async function marketAnalysisNode(corpus) {
  console.log('[Graph] Node 4: Market analysis...');
  const text = await callGroq(`
Analyze the overall Indian stock market (NSE/BSE/Sensex/Nifty) direction based on this news corpus.

Return ONLY a valid JSON object, no explanation, no markdown, no backticks.
Format exactly like this:
{"direction":"Bullish","summary":"2-3 sentence market summary here","keyThemes":["theme1","theme2","theme3"],"sectorOutlook":{"IT":"positive","Banking":"neutral","Energy":"positive","Pharma":"neutral"},"riskLevel":"Medium","niftyOutlook":"Brief Nifty 50 specific outlook"}

Direction must be: Bullish, Bearish, or Sideways
RiskLevel must be: Low, Medium, or High

CORPUS:
${corpus.slice(0, 4000)}`);

  try {
    return JSON.parse(text.trim());
  } catch {
    return {
      direction: 'Sideways',
      summary: 'Analysis unavailable. Please refresh.',
      keyThemes: [],
      sectorOutlook: {},
      riskLevel: 'Medium',
      niftyOutlook: 'Data unavailable',
    };
  }
}


const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// export async function runFinanceGraph(corpus) {
//   console.log('[Graph] Starting Groq workflow...');

//   const stocks = await extractStocksNode(corpus);
//   console.log('[Graph] Stocks found:', stocks);

//   await sleep(5000); 

//   const sentimentData = await sentimentNode(corpus, stocks);

//   await sleep(5000);

//   const marketAnalysis = await marketAnalysisNode(corpus);

//   await sleep(3000);

//   const recommendations = await recommendationNode(sentimentData);

//   console.log('[Graph] Workflow complete.');
//   return { stocks, sentimentData, recommendations, marketAnalysis };
// }

export async function runFinanceGraph(corpus) {
  console.log('[Graph] Starting Groq workflow...');

  // ── Fallback defaults ────────────────────────────────────────────
  const fallbacks = {
    stocks: [],
    sentimentData: {},
    recommendations: [
      {
        ticker: 'NIFTY50',
        action: 'HOLD',
        confidence: 'Low',
        reason: 'AI analysis unavailable due to rate limits. Data is based on latest mined news. Please refresh in a few minutes.',
        risk: 'Medium',
        sector: 'Index',
      },
    ],
    marketAnalysis: {
      direction: 'Sideways',
      summary: 'Market analysis is temporarily unavailable due to API rate limits. News data has been collected successfully — AI analysis will resume on next refresh.',
      keyThemes: ['Rate limit reached', 'News data available', 'Retry in few minutes'],
      sectorOutlook: {
        IT: 'neutral',
        Banking: 'neutral',
        Energy: 'neutral',
        Pharma: 'neutral',
      },
      riskLevel: 'Medium',
      niftyOutlook: 'Analysis unavailable. Please refresh in a few minutes.',
    },
  };

  // ── Node 1: Extract stocks ───────────────────────────────────────
  let stocks = fallbacks.stocks;
  try {
    stocks = await extractStocksNode(corpus);
    console.log('[Graph] Stocks found:', stocks);
  } catch (err) {
    console.warn('[Graph] Node 1 failed, using fallback:', err.message);
  }

  await sleep(5000);

  // ── Node 2: Sentiment ────────────────────────────────────────────
  let sentimentData = fallbacks.sentimentData;
  try {
    sentimentData = await sentimentNode(corpus, stocks);
  } catch (err) {
    console.warn('[Graph] Node 2 failed, using fallback:', err.message);
  }

  await sleep(5000);

  // ── Node 4: Market analysis ──────────────────────────────────────
  let marketAnalysis = fallbacks.marketAnalysis;
  try {
    marketAnalysis = await marketAnalysisNode(corpus);
  } catch (err) {
    console.warn('[Graph] Node 4 failed, using fallback:', err.message);
    // If we at least got sentiment data, reflect it in the fallback direction
    if (Object.keys(sentimentData).length > 0) {
      const bullCount = Object.values(sentimentData).filter(s => s.sentiment === 'bullish').length;
      const bearCount = Object.values(sentimentData).filter(s => s.sentiment === 'bearish').length;
      marketAnalysis.direction = bullCount > bearCount ? 'Bullish' : bearCount > bullCount ? 'Bearish' : 'Sideways';
      marketAnalysis.summary = `Partial analysis: ${bullCount} bullish and ${bearCount} bearish signals detected. Full market analysis unavailable due to rate limits.`;
    }
  }

  await sleep(3000);

  // ── Node 3: Recommendations ──────────────────────────────────────
  let recommendations = fallbacks.recommendations;
  try {
    recommendations = await recommendationNode(sentimentData);
  } catch (err) {
    console.warn('[Graph] Node 3 failed, using fallback:', err.message);
    // If sentiment ran fine, generate basic recs from it without LLM
    if (Object.keys(sentimentData).length > 0) {
      recommendations = Object.entries(sentimentData)
        .filter(([, v]) => v.sentiment === 'bullish' && v.score > 0.6)
        .map(([ticker, v]) => ({
          ticker,
          action: 'BUY',
          confidence: v.score > 0.75 ? 'High' : 'Medium',
          reason: v.reason || 'Bullish sentiment detected in news.',
          risk: 'Medium',
          sector: 'Unknown',
        }));

      if (recommendations.length === 0) recommendations = fallbacks.recommendations;
    }
  }

  console.log('[Graph] Workflow complete.');
  return { stocks, sentimentData, recommendations, marketAnalysis };
}