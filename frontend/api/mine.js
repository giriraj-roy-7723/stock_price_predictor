// api/mine.js
const NEWS_API_KEY = process.env.NEWS_API_KEY;

async function fetchNewsAPI() {
  try {
    const queries = [
      'Indian stock market NSE BSE',
      'Sensex Nifty stocks India',
    ];
    const allArticles = [];

    for (const q of queries) {
      const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(q)}&language=en&sortBy=publishedAt&pageSize=15&apiKey=${NEWS_API_KEY}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.articles) {
        allArticles.push(...data.articles.map(a => ({
          title: a.title,
          body: a.description || '',
          source: a.source.name,
          url: a.url,
          published: a.publishedAt,
          type: 'newsapi',
        })));
      }
    }
    return allArticles;
  } catch (err) {
    console.error('[NewsAPI]', err.message);
    return [];
  }
}

async function fetchRSSFeed(url, sourceName) {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'FinSage/1.0' } });
    const xml = await res.text();
    const items = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;

    while ((match = itemRegex.exec(xml)) !== null) {
      const item = match[1];
      const title = (item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) ||
        item.match(/<title>(.*?)<\/title>/))?.[1] || '';
      const desc = (item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/) ||
        item.match(/<description>(.*?)<\/description>/))?.[1] || '';
      const link = item.match(/<link>(.*?)<\/link>/)?.[1] || '';
      const pubDate = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || '';

      if (title) {
        items.push({
          title: title.trim(),
          body: desc.replace(/<[^>]*>/g, '').slice(0, 400).trim(),
          source: sourceName,
          url: link.trim(),
          published: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
          type: 'rss',
        });
      }
    }
    return items;
  } catch (err) {
    console.error(`[RSS:${sourceName}]`, err.message);
    return [];
  }
}

// This is the Vercel serverless function handler
export default async function handler(req, res) {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const feeds = [
      { url: 'https://economictimes.indiatimes.com/markets/stocks/rssfeeds/2146842.cms', name: 'Economic Times Markets' },
      { url: 'https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms', name: 'Economic Times' },
      { url: 'https://www.moneycontrol.com/rss/business.xml', name: 'MoneyControl' },
      { url: 'https://finshots.in/feed/', name: 'Finshots' },
    ];

    const [newsApiPosts, ...rssResults] = await Promise.allSettled([
      fetchNewsAPI(),
      ...feeds.map(f => fetchRSSFeed(f.url, f.name)),
    ]);

    const allPosts = [
      ...(newsApiPosts.status === 'fulfilled' ? newsApiPosts.value : []),
      ...rssResults.flatMap(r => r.status === 'fulfilled' ? r.value : []),
    ];

    // Deduplicate
    const seen = new Set();
    const unique = allPosts.filter(p => {
      const key = p.title.slice(0, 40).toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    unique.sort((a, b) => new Date(b.published) - new Date(a.published));

    res.status(200).json({ success: true, posts: unique, count: unique.length });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}