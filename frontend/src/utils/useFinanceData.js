import { useState, useCallback } from 'react';
import { aggregateFinanceData } from '../financeInfoMiner/index.js';
import { runFinanceGraph } from './llmWorkflow.js';

export function useFinanceData() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null); 
  // data = { posts, recommendations, marketAnalysis, sentimentData, minedAt }

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { posts, corpus, minedAt } = await aggregateFinanceData();
      const graphOutput = await runFinanceGraph(corpus);

      setData({ posts, minedAt, ...graphOutput });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, data, refresh };
}