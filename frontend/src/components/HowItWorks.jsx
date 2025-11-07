import { motion } from 'framer-motion';
import { Sparkles, GitBranch, Zap, Trophy } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      icon: Sparkles,
      title: "1. Describe Your Problem",
      description: "Tell us about your database performance issue - slow queries, high CPU, or any bottleneck you're facing.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: GitBranch,
      title: "2. Spawn Parallel Universes",
      description: "We instantly create zero-copy database forks (~1 second vs 30+ minutes traditional cloning). Each fork tests a different optimization strategy.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Zap,
      title: "3. Agents Compete",
      description: "Four AI agents run in parallel - IndexAgent creates indexes, QueryAgent rewrites queries, CacheAgent adds materialized views, SchemaAgent optimizes structure.",
      color: "from-amber-500 to-orange-500"
    },
    {
      icon: Trophy,
      title: "4. Winner Takes All",
      description: "The best performing optimization wins. Apply the winning strategy to production with one click - no manual work required!",
      color: "from-emerald-500 to-green-500"
    }
  ];

  return (
    <div className="mb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold text-vercel-900 dark:text-vercel-50 mb-3">
          How It Works
        </h2>
        <p className="text-vercel-600 dark:text-vercel-400 max-w-2xl mx-auto">
          Transform database optimization from hours of manual testing to seconds of parallel AI competition
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="vercel-card p-6 relative overflow-hidden group"
            >
              {/* Gradient background on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

              <div className="relative">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-vercel bg-gradient-to-br ${step.color} p-0.5 mb-4`}>
                  <div className="w-full h-full bg-white dark:bg-vercel-900 rounded-vercel flex items-center justify-center">
                    <Icon className={`w-6 h-6 bg-gradient-to-br ${step.color} bg-clip-text text-transparent`} />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-vercel-900 dark:text-vercel-50 mb-2">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-vercel-600 dark:text-vercel-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Key Benefits */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="mt-8 vercel-card p-6"
      >
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-accent mb-1">~1 sec</div>
            <div className="text-sm text-vercel-600 dark:text-vercel-400">Fork Creation Time</div>
            <div className="text-xs text-vercel-500 dark:text-vercel-500 mt-1">(vs 30+ min traditional)</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">594x</div>
            <div className="text-sm text-vercel-600 dark:text-vercel-400">Cost Savings</div>
            <div className="text-xs text-vercel-500 dark:text-vercel-500 mt-1">Zero-copy vs full clones</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">4 Agents</div>
            <div className="text-sm text-vercel-600 dark:text-vercel-400">Competing in Parallel</div>
            <div className="text-xs text-vercel-500 dark:text-vercel-500 mt-1">Best strategy wins</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
