import { useState, useEffect } from 'react';

const HISTORY_KEY = 'optimization_history';
const MAX_HISTORY = 10;

export function useOptimizationHistory() {
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(HISTORY_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save to localStorage whenever history changes
  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  const addToHistory = (result) => {
    const entry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      problemDescription: result.problemDescription,
      winner: result.winner,
      universes: result.universes.map(u => ({
        id: u.id,
        agent: u.agent,
        improvement: u.improvement,
        executionTime: u.executionTime,
        status: u.status
      })),
      bestImprovement: Math.max(...result.universes.map(u => u.improvement || 0))
    };

    setHistory(prev => [entry, ...prev].slice(0, MAX_HISTORY));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  };

  const deleteEntry = (id) => {
    setHistory(prev => prev.filter(entry => entry.id !== id));
  };

  const getStats = () => {
    if (history.length === 0) return null;

    const totalRuns = history.length;
    const avgImprovement = history.reduce((sum, entry) => sum + entry.bestImprovement, 0) / totalRuns;
    const maxImprovement = Math.max(...history.map(e => e.bestImprovement));

    // Count wins by agent
    const winsByAgent = history.reduce((acc, entry) => {
      const winningUniverse = entry.universes.find(u => u.id === entry.winner);
      if (winningUniverse) {
        acc[winningUniverse.agent] = (acc[winningUniverse.agent] || 0) + 1;
      }
      return acc;
    }, {});

    return {
      totalRuns,
      avgImprovement,
      maxImprovement,
      winsByAgent
    };
  };

  return {
    history,
    addToHistory,
    clearHistory,
    deleteEntry,
    getStats
  };
}
