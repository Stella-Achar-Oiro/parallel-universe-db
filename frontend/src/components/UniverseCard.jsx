import { motion } from 'framer-motion';
import {
  Zap,
  Database,
  Settings,
  CheckCircle,
  AlertCircle,
  Loader,
  Trophy,
  ArrowUpRight,
  TrendingUp,
  Clock
} from 'lucide-react';
import CountingNumber from './CountingNumber';

const agentIcons = {
  IndexAgent: Database,
  QueryAgent: Zap,
  CacheAgent: TrendingUp,
  SchemaAgent: Settings,
};

/**
 * UniverseCard - Displays individual universe optimization progress
 * Vercel-inspired minimal design
 */
export default function UniverseCard({ universe, isWinner, index }) {
  const AgentIcon = agentIcons[universe.agent] || Database;

  const handlePromote = () => {
    const event = new CustomEvent('promoteUniverse', {
      detail: { universe }
    });
    window.dispatchEvent(event);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={`universe-card relative ${isWinner ? 'winner' : ''}`}
      aria-label={`Universe ${universe.id} - ${universe.agent} - ${universe.status}`}
    >
      {/* Winner Badge */}
      {isWinner && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', duration: 0.6 }}
          className="absolute -top-3 -right-3"
        >
          <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center shadow-vercel-md animate-pulse-glow">
            <Trophy className="w-5 h-5 text-white" />
          </div>
        </motion.div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-vercel-100/70 dark:bg-vercel-800/50 backdrop-blur-xl rounded-vercel flex items-center justify-center border border-vercel-200/30 dark:border-vercel-700/30">
            <AgentIcon className="w-5 h-5 text-vercel-900 dark:text-vercel-50" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-vercel-900 dark:text-vercel-50">
              Universe {universe.id.charAt(0).toUpperCase() + universe.id.slice(1)}
            </h3>
            <p className="text-sm text-vercel-700 dark:text-vercel-300">
              {universe.agent?.replace('Agent', '')} Strategy
            </p>
          </div>
        </div>

        {/* Status */}
        {universe.status === 'complete' && (
          <span className="vercel-badge-success">
            <CheckCircle className="w-3 h-3" />
            Complete
          </span>
        )}
        {universe.status === 'failed' && (
          <span className="vercel-badge-error">
            <AlertCircle className="w-3 h-3" />
            Failed
          </span>
        )}
        {universe.status === 'running' && (
          <span className="vercel-badge-accent">
            <Loader className="w-3 h-3 animate-spin" />
            Running
          </span>
        )}
      </div>

      {/* Content Based on Status */}
      {universe.status === 'running' && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader className="w-8 h-8 text-vercel-600 animate-spin mx-auto mb-3" />
            <p className="text-sm text-vercel-600">Analyzing optimizations...</p>
          </div>
        </div>
      )}

      {universe.status === 'failed' && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center max-w-sm">
            <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-3" />
            <p className="text-sm text-vercel-900 font-medium mb-1">Optimization Failed</p>
            <p className="text-xs text-vercel-600">{universe.error || 'An error occurred during optimization'}</p>
          </div>
        </div>
      )}

      {universe.status === 'complete' && (
        <div className="space-y-4">
          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Improvement */}
            <div className="metric-card">
              <div className="text-xs text-vercel-700 dark:text-vercel-300 mb-1">Improvement</div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-semibold text-emerald-600 dark:text-emerald-400">
                  <CountingNumber value={universe.improvement} duration={1.5} prefix="+" suffix="%" decimals={1} />
                </span>
                <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>

            {/* Execution Time */}
            <div className="metric-card">
              <div className="text-xs text-vercel-700 dark:text-vercel-300 mb-1">Execution Time</div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-semibold text-vercel-900 dark:text-vercel-50">
                  <CountingNumber value={Math.round(universe.executionTime)} duration={1.5} suffix="ms" decimals={0} />
                </span>
                <Clock className="w-4 h-4 text-vercel-600 dark:text-vercel-400" />
              </div>
            </div>
          </div>

          {/* Changes Applied */}
          {universe.details?.appliedChanges && universe.details.appliedChanges.length > 0 && (
            <div>
              <div className="text-xs font-medium text-vercel-900 dark:text-vercel-50 mb-2">Applied Changes</div>
              <div className="space-y-2">
                {universe.details.appliedChanges.slice(0, 2).map((change, idx) => (
                  <div key={idx} className="vercel-code-block text-xs p-2 bg-vercel-900/80 dark:bg-black/60 backdrop-blur-xl border border-vercel-800/50 dark:border-vercel-700/30">
                    {change.length > 60 ? change.substring(0, 60) + '...' : change}
                  </div>
                ))}
                {universe.details.appliedChanges.length > 2 && (
                  <div className="text-xs text-vercel-700 dark:text-vercel-300">
                    +{universe.details.appliedChanges.length - 2} more change{universe.details.appliedChanges.length - 2 > 1 ? 's' : ''}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Promote Button */}
          {isWinner && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              onClick={handlePromote}
              className="vercel-btn-accent w-full mt-2"
            >
              <span>Promote to Production</span>
              <ArrowUpRight className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      )}
    </motion.article>
  );
}
