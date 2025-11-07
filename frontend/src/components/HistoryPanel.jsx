import { motion, AnimatePresence } from 'framer-motion';
import { History, X, TrendingUp, Clock, Trophy, Trash2, BarChart3 } from 'lucide-react';
import { useState } from 'react';
import { useOptimizationHistory } from '../hooks/useOptimizationHistory';

export default function HistoryPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const { history, clearHistory, deleteEntry, getStats } = useOptimizationHistory();
  const stats = getStats();

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    // Less than 1 hour
    if (diff < 3600000) {
      const mins = Math.floor(diff / 60000);
      return mins === 0 ? 'Just now' : `${mins}m ago`;
    }

    // Less than 24 hours
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `${hours}h ago`;
    }

    // Less than 7 days
    if (diff < 604800000) {
      const days = Math.floor(diff / 86400000);
      return `${days}d ago`;
    }

    // Older
    return date.toLocaleDateString();
  };

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-vercel-900 dark:bg-white text-white dark:text-vercel-900 rounded-full shadow-vercel-lg hover:shadow-vercel-md transition-all flex items-center justify-center z-40"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="View optimization history"
      >
        <History className="w-6 h-6" />
        {history.length > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-white text-xs rounded-full flex items-center justify-center font-medium">
            {history.length}
          </span>
        )}
      </motion.button>

      {/* Slide-out Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white dark:bg-vercel-900 shadow-vercel-lg z-50 overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="border-b border-vercel-200 dark:border-vercel-800 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-vercel-100 dark:bg-vercel-800 rounded-vercel flex items-center justify-center">
                      <History className="w-5 h-5 text-vercel-900 dark:text-vercel-50" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-vercel-900 dark:text-vercel-50">
                        Optimization History
                      </h2>
                      <p className="text-sm text-vercel-600 dark:text-vercel-400">
                        {history.length} run{history.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {history.length > 0 && (
                      <button
                        onClick={clearHistory}
                        className="p-2 rounded-vercel hover:bg-red-50 dark:hover:bg-red-900/20 text-vercel-600 dark:text-vercel-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        aria-label="Clear history"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-2 rounded-vercel hover:bg-vercel-100 dark:hover:bg-vercel-800 text-vercel-600 dark:text-vercel-400 transition-colors"
                      aria-label="Close panel"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Stats */}
                {stats && (
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-vercel-50 dark:bg-vercel-800 rounded-vercel p-3">
                      <div className="flex items-center gap-2 text-xs text-vercel-600 dark:text-vercel-400 mb-1">
                        <BarChart3 className="w-3 h-3" />
                        <span>Avg Improvement</span>
                      </div>
                      <div className="text-lg font-semibold text-vercel-900 dark:text-vercel-50">
                        {stats.avgImprovement.toFixed(1)}%
                      </div>
                    </div>

                    <div className="bg-vercel-50 dark:bg-vercel-800 rounded-vercel p-3">
                      <div className="flex items-center gap-2 text-xs text-vercel-600 dark:text-vercel-400 mb-1">
                        <TrendingUp className="w-3 h-3" />
                        <span>Best</span>
                      </div>
                      <div className="text-lg font-semibold text-emerald-600">
                        {stats.maxImprovement.toFixed(1)}%
                      </div>
                    </div>

                    <div className="bg-vercel-50 dark:bg-vercel-800 rounded-vercel p-3">
                      <div className="flex items-center gap-2 text-xs text-vercel-600 dark:text-vercel-400 mb-1">
                        <Trophy className="w-3 h-3" />
                        <span>Total Runs</span>
                      </div>
                      <div className="text-lg font-semibold text-vercel-900 dark:text-vercel-50">
                        {stats.totalRuns}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* History List */}
              <div className="flex-1 overflow-y-auto p-6">
                {history.length === 0 ? (
                  <div className="text-center py-12">
                    <History className="w-12 h-12 text-vercel-300 dark:text-vercel-700 mx-auto mb-3" />
                    <p className="text-vercel-600 dark:text-vercel-400 mb-1">No optimization history yet</p>
                    <p className="text-sm text-vercel-500 dark:text-vercel-500">Run your first optimization to get started</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {history.map((entry, index) => (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="vercel-card p-4 group"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Clock className="w-3 h-3 text-vercel-500 dark:text-vercel-400" />
                              <span className="text-xs text-vercel-600 dark:text-vercel-400">
                                {formatDate(entry.timestamp)}
                              </span>
                            </div>
                            <p className="text-sm text-vercel-900 dark:text-vercel-50 line-clamp-2">
                              {entry.problemDescription}
                            </p>
                          </div>

                          <button
                            onClick={() => deleteEntry(entry.id)}
                            className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 text-vercel-400 hover:text-red-600 dark:hover:text-red-400 transition-all"
                            aria-label="Delete entry"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mb-3">
                          {entry.universes.slice(0, 4).map(universe => {
                            const isWinner = universe.id === entry.winner;
                            return (
                              <div
                                key={universe.id}
                                className={`text-xs p-2 rounded-vercel ${
                                  isWinner
                                    ? 'bg-accent/10 border border-accent/20'
                                    : 'bg-vercel-50 dark:bg-vercel-800 border border-vercel-200 dark:border-vercel-700'
                                }`}
                              >
                                <div className="flex items-center gap-1 mb-1">
                                  <span className={`font-medium ${isWinner ? 'text-accent' : 'text-vercel-900 dark:text-vercel-50'}`}>
                                    {universe.agent?.replace('Agent', '')}
                                  </span>
                                  {isWinner && <Trophy className="w-3 h-3 text-accent" />}
                                </div>
                                <div className={isWinner ? 'text-accent font-medium' : 'text-vercel-600 dark:text-vercel-400'}>
                                  +{universe.improvement?.toFixed(1) || 0}%
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <div className="flex items-center gap-2 text-xs">
                          <div className="flex items-center gap-1 text-emerald-600">
                            <TrendingUp className="w-3 h-3" />
                            <span className="font-medium">Best: {entry.bestImprovement.toFixed(1)}%</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
