import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, AlertCircle } from 'lucide-react';

/**
 * UniverseSpawner - Main UI for launching parallel optimization universes
 * Accessible form with real-time validation and clear feedback
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
      icon: '📊'
    },
    {
      id: 'query',
      name: 'Query Rewriting',
      description: 'Optimize SQL query structure and execution',
      icon: '⚡'
    },
    {
      id: 'cache',
      name: 'Caching Strategy',
      description: 'Implement materialized views and caching',
      icon: '💾'
    },
    {
      id: 'schema',
      name: 'Schema Optimization',
      description: 'Improve database schema and constraints',
      icon: '🏗️'
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
      className="bg-gray-800 rounded-lg p-8 border border-gray-700"
      aria-labelledby="spawner-title"
    >
      <div className="flex items-center gap-3 mb-6">
        <Rocket className="w-8 h-8 text-blue-400" aria-hidden="true" />
        <h2 id="spawner-title" className="text-3xl font-bold">
          Launch Parallel Universes
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Problem Description */}
        <div>
          <label
            htmlFor="problem-description"
            className="block text-sm font-medium mb-2"
          >
            Describe Your Performance Issue
          </label>
          <textarea
            id="problem-description"
            value={problemDescription}
            onChange={(e) => setProblemDescription(e.target.value)}
            placeholder="e.g., Slow queries on users table with email lookups taking over 200ms..."
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-white placeholder-gray-500"
            rows={4}
            disabled={loading}
            aria-required="true"
            aria-describedby={error ? 'problem-error' : undefined}
          />
        </div>

        {/* Strategy Selection */}
        <div>
          <fieldset>
            <legend className="block text-sm font-medium mb-3">
              Select Optimization Strategies
            </legend>
            <div className="grid md:grid-cols-2 gap-4">
              {strategies.map((strategy) => {
                const isSelected = selectedStrategies.includes(strategy.id);

                return (
                  <motion.div
                    key={strategy.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <label
                      className={`block p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-blue-500 bg-blue-900/20'
                          : 'border-gray-700 bg-gray-900 hover:border-gray-600'
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
                        <span className="text-2xl" aria-hidden="true">
                          {strategy.icon}
                        </span>
                        <div className="flex-1">
                          <div className="font-semibold mb-1">
                            {strategy.name}
                          </div>
                          <div className="text-sm text-gray-400">
                            {strategy.description}
                          </div>
                        </div>
                        {isSelected && (
                          <div
                            className="text-blue-500 font-bold"
                            aria-hidden="true"
                          >
                            ✓
                          </div>
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
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-start gap-2 p-4 bg-red-900/20 border border-red-700 rounded-lg"
              role="alert"
              id="problem-error"
            >
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <span className="text-sm text-red-400">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Launch Button */}
        <motion.button
          type="submit"
          disabled={loading}
          className={`w-full btn-primary text-lg py-4 flex items-center justify-center gap-3 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          whileHover={!loading ? { scale: 1.02 } : {}}
          whileTap={!loading ? { scale: 0.98 } : {}}
          aria-busy={loading}
        >
          {loading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                aria-hidden="true"
              />
              <span>Spawning Parallel Universes...</span>
            </>
          ) : (
            <>
              <Rocket className="w-6 h-6" aria-hidden="true" />
              <span>Launch Parallel Universes</span>
            </>
          )}
        </motion.button>

        {/* Selected Count */}
        <div className="text-center text-sm text-gray-400">
          {selectedStrategies.length > 0 ? (
            <span>
              Will spawn {selectedStrategies.length} parallel universe
              {selectedStrategies.length > 1 ? 's' : ''}
            </span>
          ) : (
            <span>Select at least one strategy to begin</span>
          )}
        </div>
      </form>

      {/* Info Box */}
      <div className="mt-6 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
        <h3 className="font-semibold mb-2 text-sm">How it works:</h3>
        <ol className="space-y-1 text-sm text-gray-400 list-decimal list-inside">
          <li>Describe your database performance issue</li>
          <li>Select which optimization strategies to test</li>
          <li>We instantly create zero-copy forks of your database</li>
          <li>AI agents compete in parallel to find the best solution</li>
          <li>Promote the winning optimization to production</li>
        </ol>
      </div>
    </motion.section>
  );
}
