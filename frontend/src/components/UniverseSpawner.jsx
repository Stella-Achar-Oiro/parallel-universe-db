import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  AlertCircle,
  Database,
  Zap,
  TrendingUp,
  Settings,
  CheckCircle,
  Info
} from 'lucide-react';

/**
 * UniverseSpawner - Main UI for launching parallel optimization universes
 * Vercel-inspired minimal design
 */
export default function UniverseSpawner({ onOptimize, loading }) {
  const [problemDescription, setProblemDescription] = useState('');
  const [selectedStrategies, setSelectedStrategies] = useState([
    'index',
    'query',
    'cache',
    'schema'
  ]);
  const [error, setError] = useState('');

  const strategies = [
    {
      id: 'index',
      name: 'Index Optimization',
      description: 'Create optimal indexes for faster queries',
      Icon: Database,
    },
    {
      id: 'query',
      name: 'Query Rewriting',
      description: 'Optimize SQL query structure and execution',
      Icon: Zap,
    },
    {
      id: 'cache',
      name: 'Caching Strategy',
      description: 'Implement materialized views and caching',
      Icon: TrendingUp,
    },
    {
      id: 'schema',
      name: 'Schema Optimization',
      description: 'Improve database schema and constraints',
      Icon: Settings,
    }
  ];

  const handleStrategyToggle = (strategyId) => {
    setSelectedStrategies(prev =>
      prev.includes(strategyId)
        ? prev.filter(s => s !== strategyId)
        : [...prev, strategyId]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!problemDescription.trim()) {
      setError('Please describe the performance issue');
      return;
    }

    if (selectedStrategies.length === 0) {
      setError('Please select at least one optimization strategy');
      return;
    }

    onOptimize(problemDescription, selectedStrategies);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="vercel-card p-8"
      aria-labelledby="spawner-title"
    >
      <div className="mb-6">
        <h2 id="spawner-title" className="text-2xl font-semibold text-vercel-900 dark:text-vercel-50 mb-2">
          Launch Optimization
        </h2>
        <p className="text-sm text-vercel-700 dark:text-vercel-300">
          Test multiple optimization strategies in parallel
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Problem Description */}
        <div>
          <label
            htmlFor="problem-description"
            className="block text-sm font-medium text-vercel-900 dark:text-vercel-50 mb-2"
          >
            Describe Performance Issue
          </label>
          <textarea
            id="problem-description"
            value={problemDescription}
            onChange={(e) => setProblemDescription(e.target.value)}
            placeholder="e.g., Slow queries on users table with email lookups taking over 200ms..."
            className="vercel-textarea h-24"
            disabled={loading}
            aria-required="true"
            aria-describedby={error ? 'problem-error' : undefined}
          />
        </div>

        {/* Strategy Selection */}
        <div>
          <fieldset>
            <legend className="block text-sm font-medium text-vercel-900 dark:text-vercel-50 mb-3">
              Select Optimization Strategies
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {strategies.map((strategy) => {
                const isSelected = selectedStrategies.includes(strategy.id);
                const { Icon } = strategy;

                return (
                  <motion.div
                    key={strategy.id}
                    whileHover={!loading ? { y: -1 } : {}}
                    whileTap={!loading ? { scale: 0.99 } : {}}
                  >
                    <label
                      className={`block p-4 rounded-vercel border-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-vercel-900 dark:border-vercel-100 bg-vercel-50 dark:bg-vercel-800/50'
                          : 'border-vercel-200 dark:border-vercel-700 hover:border-vercel-300 dark:hover:border-vercel-600 bg-white dark:bg-vercel-800/30'
                      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleStrategyToggle(strategy.id)}
                        disabled={loading}
                        className="sr-only"
                        aria-label={strategy.name}
                      />
                      <div className="flex items-start gap-3">
                        <div className={`flex-shrink-0 ${isSelected ? 'text-vercel-900 dark:text-vercel-50' : 'text-vercel-600 dark:text-vercel-400'}`}>
                          <Icon className="w-5 h-5" aria-hidden="true" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-vercel-900 dark:text-vercel-50 text-sm mb-0.5">
                            {strategy.name}
                          </div>
                          <div className="text-xs text-vercel-700 dark:text-vercel-300">
                            {strategy.description}
                          </div>
                        </div>
                        {isSelected && (
                          <CheckCircle
                            className="w-5 h-5 text-vercel-900 dark:text-vercel-50 flex-shrink-0"
                            aria-hidden="true"
                          />
                        )}
                      </div>
                    </label>
                  </motion.div>
                );
              })}
            </div>
          </fieldset>
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-vercel"
              role="alert"
              id="problem-error"
            >
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <span className="text-sm text-red-700">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Launch Button */}
        <button
          type="submit"
          disabled={loading}
          className="vercel-btn w-full"
          aria-busy={loading}
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                aria-hidden="true"
              />
              <span>Launching...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Play className="w-4 h-4" aria-hidden="true" />
              <span>Launch Optimization</span>
            </div>
          )}
        </button>

        {/* Selected Count */}
        {selectedStrategies.length > 0 && (
          <div className="text-center text-xs text-vercel-700 dark:text-vercel-300">
            {selectedStrategies.length} strateg{selectedStrategies.length > 1 ? 'ies' : 'y'} selected
          </div>
        )}
      </form>

      {/* Info Box */}
      <div className="mt-6 p-4 bg-vercel-50 dark:bg-vercel-800/50 border border-vercel-200 dark:border-vercel-700 rounded-vercel">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-vercel-600 dark:text-vercel-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-vercel-700 dark:text-vercel-300">
            <p className="font-medium text-vercel-900 dark:text-vercel-50 mb-1">How it works</p>
            <p>We create instant zero-copy database forks, deploy AI agents to test each strategy, and identify the best optimization for your use case.</p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
