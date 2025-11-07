import { useState } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Custom hook for managing optimization operations
 */
export function useOptimization() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);

  const optimize = async (problemDescription, strategies) => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch(`${API_BASE}/api/optimize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          problemDescription,
          strategies,
        }),
      });

      if (!response.ok) {
        throw new Error(`Optimization failed: ${response.statusText}`);
      }

      const data = await response.json();
      setResults(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const promote = async (forkId, changes) => {
    try {
      const response = await fetch(`${API_BASE}/api/optimize/promote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          forkId,
          changes,
        }),
      });

      if (!response.ok) {
        throw new Error(`Promotion failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const getHistory = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/optimize/history`);

      if (!response.ok) {
        throw new Error(`Failed to fetch history: ${response.statusText}`);
      }

      return await response.json();
    } catch (err) {
      setError(err.message);
      return { history: [] };
    }
  };

  return {
    optimize,
    promote,
    getHistory,
    loading,
    error,
    results,
  };
}
