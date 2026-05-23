import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

const REDDIT_CLIENT_ID = process.env.REDDIT_CLIENT_ID;
const REDDIT_CLIENT_SECRET = process.env.REDDIT_CLIENT_SECRET;


async function getRedditToken() {
  const credentials = Buffer.from(
    `${REDDIT_CLIENT_ID}:${REDDIT_CLIENT_SECRET}`
  ).toString('base64');

  const res = await fetch('https://www.reddit.com/api/v1/access_token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'FinanceMiner/1.0',
    },
    body: 'grant_type=client_credentials',
  });

  const data = await res.json();
  return data.access_token;
}


app.get('/api/mine', async (req, res) => {
  try {
    const token = await getRedditToken();

    const subreddits = [
      'IndianStockMarket',
      'IndiaInvestments', 
      'Sensex',
      'stocks',
    ];

    const allPosts = [];

    for (const sub of subreddits) {
      const response = await fetch(
        `https://oauth.reddit.com/r/${sub}/hot?limit=15`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'User-Agent': 'FinanceMiner/1.0',
          },
        }
      );
      const data = await response.json();

      const posts = data.data.children.map((post) => ({
        title: post.data.title,
        body: post.data.selftext?.slice(0, 500) || '',
        upvotes: post.data.ups,
        subreddit: post.data.subreddit,
        url: `https://reddit.com${post.data.permalink}`,
        created: new Date(post.data.created_utc * 1000).toISOString(),
      }));

      allPosts.push(...posts);
    }

  
    allPosts.sort((a, b) => b.upvotes - a.upvotes);

    res.json({ success: true, posts: allPosts, count: allPosts.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(3001, () => console.log('Miner server running on :3001'));