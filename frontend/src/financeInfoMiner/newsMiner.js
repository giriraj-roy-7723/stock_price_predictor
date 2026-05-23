// Before (local dev):
const SERVER_URL = 'http://localhost:3001';


const SERVER_URL = import.meta.env.VITE_API_URL || '';

export async function fetchFinancePosts() {
  const res = await fetch(`${SERVER_URL}/api/mine`);
  if (!res.ok) throw new Error('Miner server not reachable');
  const data = await res.json();
  return data.posts;
}