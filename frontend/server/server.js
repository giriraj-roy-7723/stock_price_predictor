import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

const NEWS_API_KEY = process.env.NEWS_API_KEY;


async function fetchNewsAPI() {
  try {
    const queries = [
      'Indian stock market NSE BSE',
      'Sensex Nifty stocks India',
      'India finance economy stocks',
    ];

    const allArticles = [];

    for (const q of queries) {
      const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(q)}&language=en&sortBy=publishedAt&pageSize=15&apiKey=${NEWS_API_KEY}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.articles) {
        const articles = data.articles.map((a) => ({
          title: a.title,
          body: a.description || '',
          source: a.source.name,
          url: a.url,
          published: a.publishedAt,
          type: 'newsapi',
        }));
        allArticles.push(...articles);
      }
    }

    return allArticles;
  } catch (err) {
    console.error('[NewsAPI] Error:', err.message);
    return [];
  }
}


async function fetchRSSFeed(url, sourceName) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'FinSage/1.0' },
    });
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
    console.error(`[RSS:${sourceName}] Error:`, err.message);
    return [];
  }
}

async function fetchAllRSS() {
  const feeds = [
    {
      url: 'https://finshots.in/feed/',
      name: 'Finshots',
    },
    {
      url: 'https://economictimes.indiatimes.com/markets/stocks/rssfeeds/2146842.cms',
      name: 'Economic Times Markets',
    },
    {
      url: 'https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms',
      name: 'Economic Times',
    },
    {
      url: 'https://www.moneycontrol.com/rss/business.xml',
      name: 'MoneyControl',
    },
    {
      url: 'https://feeds.feedburner.com/ndtvprofit-latest',
      name: 'NDTV Profit',
    },
  ];

  const results = await Promise.allSettled(
    feeds.map((f) => fetchRSSFeed(f.url, f.name))
  );

  return results
    .filter((r) => r.status === 'fulfilled')
    .flatMap((r) => r.value);
}


async function fetchYahooFinance() {
  const tickers = ['RELIANCE.NS', 'TCS.NS', 'INFY.NS', 'HDFCBANK.NS', 'NIFTY50'];
  const allItems = [];

  for (const ticker of tickers) {
    const items = await fetchRSSFeed(
      `https://feeds.finance.yahoo.com/rss/2.0/headline?s=${ticker}&region=IN&lang=en-IN`,
      `Yahoo:${ticker}`
    );
    allItems.push(...items);
  }

  return allItems;
}


app.get('/api/mine', async (req, res) => {
  try {
    console.log('[Server] Mining started...');

    const [newsApiPosts, rssPosts, yahooPosts] = await Promise.allSettled([
      fetchNewsAPI(),
      fetchAllRSS(),
      fetchYahooFinance(),
    ]);

    const allPosts = [
      ...(newsApiPosts.status === 'fulfilled' ? newsApiPosts.value : []),
      ...(rssPosts.status === 'fulfilled' ? rssPosts.value : []),
      ...(yahooPosts.status === 'fulfilled' ? yahooPosts.value : []),
    ];

    // Deduplicate by title similarity
    const seen = new Set();
    const unique = allPosts.filter((p) => {
      const key = p.title.slice(0, 40).toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    unique.sort((a, b) => new Date(b.published) - new Date(a.published));

    console.log(`[Server] Done. Total: ${unique.length} articles`);

    res.json({
      success: true,
      posts: unique,
      count: unique.length,
      sources: {
        newsapi: newsApiPosts.status === 'fulfilled' ? newsApiPosts.value.length : 0,
        rss: rssPosts.status === 'fulfilled' ? rssPosts.value.length : 0,
        yahoo: yahooPosts.status === 'fulfilled' ? yahooPosts.value.length : 0,
      },
    });
  } catch (err) {
    console.error('[Server] Fatal:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

app.listen(3001, () => {
  console.log('FinSage miner server running ');
  console.log('   Test: http://localhost:3001/api/mine');
});