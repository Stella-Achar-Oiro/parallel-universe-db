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
    <motion.section
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5 }}
      className="bg-gradient-to-br from-green-900/30 to-blue-900/30 rounded-lg p-8 border border-green-700"
      aria-labelledby="cost-calculator-title"
    >
      <div className="flex items-center gap-3 mb-6">
        <DollarSign className="w-8 h-8 text-green-400" aria-hidden="true" />
        <h2 id="cost-calculator-title" className="text-2xl font-bold">
          Cost Savings Analysis
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Traditional Approach */}
        <div className="bg-gray-800/50 rounded-lg p-6 border border-red-700">
          <div className="text-sm text-gray-400 mb-2">Traditional Approach</div>
          <div className="text-lg font-semibold mb-2">
            {costSavings.forkCount} Full Database Clones
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-red-400">
              ${costSavings.traditional}
            </span>
          </div>
          <div className="mt-3 text-sm text-gray-400">
            ${(parseFloat(costSavings.traditional) / costSavings.forkCount).toFixed(2)} per clone
          </div>
        </div>

        {/* Agentic Postgres */}
        <div className="bg-gray-800/50 rounded-lg p-6 border border-green-700">
          <div className="text-sm text-gray-400 mb-2">Agentic Postgres</div>
          <div className="text-lg font-semibold mb-2">
            {costSavings.forkCount} Zero-Copy Forks
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-green-400">
              ${costSavings.agentic}
            </span>
          </div>
          <div className="mt-3 text-sm text-gray-400">
            Instant forks, minimal storage
          </div>
        </div>
      </div>

      {/* Savings Highlight */}
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.7, type: 'spring' }}
        className="bg-gradient-to-r from-yellow-600 to-green-600 rounded-lg p-6 text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-2">
          <Zap className="w-6 h-6" aria-hidden="true" />
          <div className="text-lg font-semibold">You Saved</div>
        </div>
        <div className="text-5xl font-bold mb-2">
          {costSavings.savingsMultiplier}x
        </div>
        <div className="text-sm opacity-90">
          Cost reduction compared to traditional cloning
        </div>
      </motion.div>

      {/* Explanation */}
      <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
        <h3 className="font-semibold mb-2 text-sm text-gray-300">
          Why Zero-Copy Forks are Revolutionary
        </h3>
        <ul className="space-y-2 text-sm text-gray-400">
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-0.5">✓</span>
            <span>Instant database forks without copying data</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-0.5">✓</span>
            <span>Test multiple strategies in parallel without resource waste</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-0.5">✓</span>
            <span>Pay only for changes, not for duplicate storage</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-0.5">✓</span>
            <span>Scale optimization testing without scaling costs</span>
          </li>
        </ul>
      </div>

      {/* Time Savings */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="text-center p-4 bg-gray-800/50 rounded-lg">
          <div className="text-sm text-gray-400 mb-1">Traditional Setup Time</div>
          <div className="text-2xl font-bold text-red-400">~30 min</div>
        </div>
        <div className="text-center p-4 bg-gray-800/50 rounded-lg">
          <div className="text-sm text-gray-400 mb-1">Zero-Copy Fork Time</div>
          <div className="text-2xl font-bold text-green-400">&lt; 1 sec</div>
        </div>
      </div>
    </motion.section>
  );
}
