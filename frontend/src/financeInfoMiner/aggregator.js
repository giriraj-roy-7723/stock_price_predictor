import { fetchFinancePosts } from "./newsMiner";

export async function aggregateFinanceData() {
  console.log('[Aggregator] Starting data collection...');

  const posts = await fetchFinancePosts();


const corpus = posts
  .slice(0, 15)          
  .map((p, i) => 
    `[${i+1}] ${p.title}\n${p.body?.slice(0, 200) || ''}`  
  )
  .join('\n---\n');

  console.log(`[Aggregator] Collected ${posts.length} posts`);

  return {
    posts,        
    corpus,     
    minedAt: new Date().toISOString(),
  };
}