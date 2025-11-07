import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, ShoppingCart, BarChart3, Search, Package } from 'lucide-react';

export default function ExamplePrompts({ onSelectPrompt }) {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const examples = [
    {
      icon: ShoppingCart,
      title: "E-commerce Performance",
      prompt: "Our e-commerce site is slowing down during peak hours. Customer searches are taking 5+ seconds, and the checkout process times out frequently. We have 500K products and 2M orders. Help optimize query performance.",
      color: "from-blue-500 to-cyan-500",
      tags: ["High Traffic", "Search", "Checkout"]
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      prompt: "Our analytics dashboard loads data from multiple large tables with complex aggregations. Users are complaining about 30-second load times for reports. We need to optimize read performance for dashboard queries that aggregate order data by date, region, and product category.",
      color: "from-purple-500 to-pink-500",
      tags: ["Aggregations", "Reports", "Slow Queries"]
    },
    {
      icon: Search,
      title: "User Search Feature",
      prompt: "Our user search feature searches across names, emails, and addresses but it's very slow with 1M+ users. Search queries are timing out. Need to optimize text search and filtering.",
      color: "from-amber-500 to-orange-500",
      tags: ["Full-text Search", "Filters", "Timeouts"]
    },
    {
      icon: Package,
      title: "Inventory System",
      prompt: "We have a real-time inventory system that tracks 100K products across 50 warehouses. Stock level queries are slow, causing inventory sync issues. We need to optimize queries that check stock levels and update inventory counts.",
      color: "from-emerald-500 to-green-500",
      tags: ["Real-time", "Updates", "Concurrency"]
    }
  ];

  const handleCopy = (prompt, index) => {
    navigator.clipboard.writeText(prompt);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleUsePrompt = (prompt) => {
    onSelectPrompt(prompt);
    // Smooth scroll to form
    document.querySelector('textarea')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    document.querySelector('textarea')?.focus();
  };

  return (
    <div className="mb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold text-vercel-900 dark:text-vercel-50 mb-3">
          Try Example Scenarios
        </h2>
        <p className="text-vercel-600 dark:text-vercel-400 max-w-2xl mx-auto">
          Click any example to auto-fill the form, or copy and customize it for your needs
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {examples.map((example, index) => {
          const Icon = example.icon;
          const isCopied = copiedIndex === index;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              className="vercel-card p-6 relative overflow-hidden group cursor-pointer"
              onClick={() => handleUsePrompt(example.prompt)}
            >
              {/* Gradient background on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${example.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

              <div className="relative">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-vercel bg-gradient-to-br ${example.color} p-0.5 flex-shrink-0`}>
                      <div className="w-full h-full bg-white dark:bg-vercel-900 rounded-vercel flex items-center justify-center">
                        <Icon className="w-5 h-5 text-white" style={{
                          filter: 'drop-shadow(0 0 8px currentColor)'
                        }} />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-vercel-900 dark:text-vercel-50">
                      {example.title}
                    </h3>
                  </div>

                  {/* Copy Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy(example.prompt, index);
                    }}
                    className="p-2 rounded-vercel hover:bg-vercel-100 dark:hover:bg-vercel-800 transition-colors"
                    aria-label="Copy prompt"
                  >
                    <AnimatePresence mode="wait">
                      {isCopied ? (
                        <motion.div
                          key="check"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="copy"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <Copy className="w-5 h-5 text-vercel-600 dark:text-vercel-400" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                </div>

                {/* Prompt Text */}
                <p className="text-sm text-vercel-700 dark:text-vercel-300 leading-relaxed mb-4 line-clamp-4">
                  {example.prompt}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {example.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-2 py-1 text-xs rounded-vercel bg-vercel-100 dark:bg-vercel-800 text-vercel-700 dark:text-vercel-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Use Prompt Button (appears on hover) */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  className="absolute inset-0 bg-gradient-to-t from-white/95 dark:from-vercel-900/95 to-transparent flex items-end justify-center pb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                >
                  <button
                    className="px-4 py-2 bg-accent text-white rounded-vercel text-sm font-medium pointer-events-auto hover:bg-accent/90 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUsePrompt(example.prompt);
                    }}
                  >
                    Use This Prompt →
                  </button>
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Helper Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mt-6 text-center"
      >
        <p className="text-sm text-vercel-500 dark:text-vercel-500">
          💡 Tip: Click any example to auto-fill the form below, or copy and modify it for your specific use case
        </p>
      </motion.div>
    </div>
  );
}
