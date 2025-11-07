import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, ChevronDown, ChevronUp, Copy, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function StreamingLogs({ logs, isActive }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [copied, setCopied] = useState(false);

  if (!isActive && logs.length === 0) return null;

  const copyLogs = () => {
    const text = logs.map(log => `[${log.timestamp}] ${log.agent}: ${log.message}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLogColor = (level) => {
    switch (level) {
      case 'success':
        return 'text-emerald-400';
      case 'error':
        return 'text-red-400';
      case 'warning':
        return 'text-amber-400';
      default:
        return 'text-vercel-400 dark:text-vercel-500';
    }
  };

  const getAgentColor = (agent) => {
    const colors = {
      IndexAgent: 'text-blue-400',
      QueryAgent: 'text-amber-400',
      CacheAgent: 'text-emerald-400',
      SchemaAgent: 'text-purple-400',
    };
    return colors[agent] || 'text-vercel-400';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto mb-6"
    >
      <div className="vercel-card overflow-hidden">
        {/* Header */}
        <div
          className="flex items-center justify-between p-4 border-b border-vercel-200 dark:border-vercel-700 cursor-pointer hover:bg-vercel-50 dark:hover:bg-vercel-800 transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-vercel-900 dark:bg-vercel-100 rounded-vercel flex items-center justify-center">
              <Terminal className="w-4 h-4 text-white dark:text-vercel-900" />
            </div>
            <div>
              <h3 className="font-medium text-vercel-900 dark:text-vercel-50">Agent Activity</h3>
              <p className="text-xs text-vercel-600 dark:text-vercel-400">
                {isActive ? 'Live' : 'Completed'} · {logs.length} event{logs.length !== 1 ? 's' : ''}
              </p>
            </div>
            {isActive && (
              <span className="flex h-2 w-2 ml-2">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {logs.length > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  copyLogs();
                }}
                className="p-2 rounded-vercel hover:bg-vercel-100 dark:hover:bg-vercel-700 text-vercel-600 dark:text-vercel-400 transition-colors"
                aria-label="Copy logs"
              >
                {copied ? (
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            )}
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-vercel-600 dark:text-vercel-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-vercel-600 dark:text-vercel-400" />
            )}
          </div>
        </div>

        {/* Logs */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="bg-vercel-900 dark:bg-black p-4 font-mono text-sm max-h-96 overflow-y-auto">
                {logs.length === 0 ? (
                  <div className="text-vercel-500 text-center py-8">
                    Waiting for agent activity...
                  </div>
                ) : (
                  <div className="space-y-1">
                    <AnimatePresence mode="popLayout">
                      {logs.map((log, index) => (
                        <motion.div
                          key={log.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="flex gap-2"
                        >
                          <span className="text-vercel-600 dark:text-vercel-700 select-none">
                            [{log.timestamp}]
                          </span>
                          <span className={`font-semibold ${getAgentColor(log.agent)}`}>
                            {log.agent}:
                          </span>
                          <span className={getLogColor(log.level)}>
                            {log.message}
                          </span>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
