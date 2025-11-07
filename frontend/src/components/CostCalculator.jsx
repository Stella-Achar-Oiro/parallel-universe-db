import { motion } from 'framer-motion';
import { DollarSign, Zap } from 'lucide-react';

/**
 * CostCalculator - Shows economic advantage of zero-copy forks
 * Highlights the cost savings compared to traditional database cloning
 */
export default function CostCalculator({ costSavings }) {
  if (!costSavings) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5 }}
      aria-labelledby="cost-calculator-title"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-emerald-50/70 dark:bg-emerald-900/30 backdrop-blur-xl rounded-vercel flex items-center justify-center border border-emerald-200/30 dark:border-emerald-700/30">
          <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
        </div>
        <h3 id="cost-calculator-title" className="text-lg font-semibold text-vercel-900 dark:text-vercel-50">
          Cost Savings Analysis
        </h3>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {/* Traditional Approach */}
        <div className="metric-card border-l-2 border-red-500/50">
          <div className="text-xs text-vercel-700 dark:text-vercel-300 mb-2">Traditional Approach</div>
          <div className="text-sm font-medium text-vercel-900 dark:text-vercel-50 mb-3">
            {costSavings.forkCount} Full Database Clones
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-red-600 dark:text-red-400">
              ${costSavings.traditional}
            </span>
          </div>
          <div className="mt-3 text-xs text-vercel-700 dark:text-vercel-300">
            ${(parseFloat(costSavings.traditional) / costSavings.forkCount).toFixed(2)} per clone
          </div>
        </div>

        {/* Agentic Postgres */}
        <div className="metric-card border-l-2 border-emerald-500/50">
          <div className="text-xs text-vercel-700 dark:text-vercel-300 mb-2">Parallel Universe DB</div>
          <div className="text-sm font-medium text-vercel-900 dark:text-vercel-50 mb-3">
            {costSavings.forkCount} Zero-Copy Forks
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              ${costSavings.agentic}
            </span>
          </div>
          <div className="mt-3 text-xs text-vercel-700 dark:text-vercel-300">
            Instant forks, minimal storage
          </div>
        </div>
      </div>

      {/* Savings Highlight */}
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.7, type: 'spring' }}
        className="bg-gradient-to-r from-emerald-500 to-accent rounded-vercel p-6 text-center mb-6"
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <Zap className="w-5 h-5 text-white" aria-hidden="true" />
          <div className="text-sm font-semibold text-white">You Saved</div>
        </div>
        <div className="text-4xl font-bold mb-1 text-white">
          {costSavings.savingsMultiplier}x
        </div>
        <div className="text-xs text-white/90">
          Cost reduction vs traditional cloning
        </div>
      </motion.div>

      {/* Explanation */}
      <div className="p-4 bg-vercel-50/50 dark:bg-vercel-800/30 backdrop-blur-xl rounded-vercel border border-vercel-200/30 dark:border-vercel-700/30 mb-4">
        <h4 className="font-semibold mb-3 text-sm text-vercel-900 dark:text-vercel-50">
          Why Zero-Copy Forks are Revolutionary
        </h4>
        <ul className="space-y-2 text-xs text-vercel-700 dark:text-vercel-300">
          <li className="flex items-start gap-2">
            <span className="text-emerald-600 dark:text-emerald-400 mt-0.5">✓</span>
            <span>Instant database forks without copying data</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-600 dark:text-emerald-400 mt-0.5">✓</span>
            <span>Test multiple strategies in parallel without resource waste</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-600 dark:text-emerald-400 mt-0.5">✓</span>
            <span>Pay only for changes, not for duplicate storage</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-600 dark:text-emerald-400 mt-0.5">✓</span>
            <span>Scale optimization testing without scaling costs</span>
          </li>
        </ul>
      </div>

      {/* Time Savings */}
      <div className="grid grid-cols-2 gap-4">
        <div className="metric-card text-center">
          <div className="text-xs text-vercel-700 dark:text-vercel-300 mb-2">Traditional Setup</div>
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">~30 min</div>
        </div>
        <div className="metric-card text-center">
          <div className="text-xs text-vercel-700 dark:text-vercel-300 mb-2">Zero-Copy Fork</div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">&lt; 1 sec</div>
        </div>
      </div>
    </motion.div>
  );
}
