import { motion } from 'framer-motion';
import { Zap, TrendingUp, Database, CheckCircle, AlertCircle, Loader } from 'lucide-react';

const agentIcons = {
  IndexAgent: Database,
  QueryAgent: Zap,
  CacheAgent: TrendingUp,
  SchemaAgent: Database,
};

const statusIcons = {
  complete: CheckCircle,
  failed: AlertCircle,
  running: Loader,
};

const statusColors = {
  complete: 'text-green-500',
  failed: 'text-red-500',
  running: 'text-blue-500',
};

/**
 * UniverseCard - Displays individual universe optimization progress
 * Accessible, animated, and visually engaging
 */
export default function UniverseCard({ universe, isWinner }) {
  const AgentIcon = agentIcons[universe.agent] || Database;
  const StatusIcon = statusIcons[universe.status] || Loader;

  return (
    <motion.article
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`universe-card relative ${
        isWinner ? 'border-yellow-500 animate-glow' : ''
      }`}
      role="article"
      aria-label={`Universe ${universe.id} - ${universe.agent} - ${universe.status}`}
    >
      {/* Winner Crown */}
      {isWinner && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-4xl"
          role="img"
          aria-label="Winner"
        >
          🏆
        </motion.div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-3xl font-bold text-gray-400">
            {universe.symbol || universe.id}
          </div>
          <div>
            <h3 className="font-semibold text-lg" id={`universe-${universe.id}-title`}>
              Universe {universe.id.charAt(0).toUpperCase() + universe.id.slice(1)}
            </h3>
            <p className="text-sm text-gray-400">
              {universe.agent}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <AgentIcon className="w-6 h-6 text-blue-400" aria-hidden="true" />
          <StatusIcon
            className={`w-6 h-6 ${statusColors[universe.status]} ${
              universe.status === 'running' ? 'animate-spin' : ''
            }`}
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Status */}
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Status:</span>
          <span
            className={`text-sm capitalize ${statusColors[universe.status]}`}
            role="status"
            aria-live="polite"
          >
            {universe.status}
          </span>
        </div>
      </div>

      {/* Metrics */}
      {universe.status === 'complete' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          {/* Improvement */}
          <div className="bg-gray-900 rounded p-3">
            <div className="text-sm text-gray-400 mb-1">Performance Improvement</div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-green-400">
                +{universe.improvement}%
              </span>
            </div>
          </div>

          {/* Execution Time */}
          <div className="bg-gray-900 rounded p-3">
            <div className="text-sm text-gray-400 mb-1">Query Time</div>
            <div className="flex items-center gap-2">
              {universe.baselineTime && (
                <span className="text-sm text-gray-500 line-through">
                  {Math.round(universe.baselineTime)}ms
                </span>
              )}
              <span className="text-lg font-semibold text-blue-400">
                {Math.round(universe.executionTime)}ms
              </span>
            </div>
          </div>

          {/* Strategy */}
          <div className="bg-gray-900 rounded p-3">
            <div className="text-sm text-gray-400 mb-1">Strategy</div>
            <p className="text-sm text-white">
              {universe.strategy}
            </p>
          </div>

          {/* Cost */}
          {universe.cost !== undefined && (
            <div className="bg-gray-900 rounded p-3">
              <div className="text-sm text-gray-400 mb-1">Impact</div>
              <div className="text-sm text-white">
                {universe.cost > 0 ? `+${universe.cost} KB` : 'Negligible'}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Error State */}
      {universe.status === 'failed' && (
        <div className="bg-red-900/20 border border-red-700 rounded p-3">
          <p className="text-sm text-red-400">
            {universe.error || 'Optimization failed'}
          </p>
        </div>
      )}

      {/* Running State */}
      {universe.status === 'running' && (
        <div className="space-y-3">
          <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
            <motion.div
              className="bg-blue-500 h-full"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 3, ease: 'linear' }}
            />
          </div>
          <p className="text-sm text-gray-400 text-center">
            Analyzing and optimizing...
          </p>
        </div>
      )}

      {/* Winner Badge */}
      {isWinner && universe.status === 'complete' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 pt-4 border-t border-yellow-500"
        >
          <button
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-semibold py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            onClick={() => {
              // Promote functionality will be handled by parent component
              const event = new CustomEvent('promoteUniverse', {
                detail: { universe }
              });
              window.dispatchEvent(event);
            }}
            aria-label={`Promote Universe ${universe.id} to production`}
          >
            🚀 Promote to Production
          </button>
        </motion.div>
      )}
    </motion.article>
  );
}
