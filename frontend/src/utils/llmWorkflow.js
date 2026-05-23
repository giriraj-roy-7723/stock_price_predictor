const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile';

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

export async function runFinanceGraph(corpus) {
  console.log('[Graph] Starting Groq workflow...');

  const stocks = await extractStocksNode(corpus);
  console.log('[Graph] Stocks found:', stocks);

  await sleep(5000); 

  const sentimentData = await sentimentNode(corpus, stocks);

  await sleep(5000);

  const marketAnalysis = await marketAnalysisNode(corpus);

  await sleep(3000);

  const recommendations = await recommendationNode(sentimentData);

  console.log('[Graph] Workflow complete.');
  return { stocks, sentimentData, recommendations, marketAnalysis };
}