import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import UniverseSpawner from './components/UniverseSpawner';
import UniverseCard from './components/UniverseCard';
import PerformanceChart from './components/PerformanceChart';
import CostCalculator from './components/CostCalculator';
import HowItWorks from './components/HowItWorks';
import ExamplePrompts from './components/ExamplePrompts';
import Toast from './components/Toast';
import ThemeToggle from './components/ThemeToggle';
import HistoryPanel from './components/HistoryPanel';
import StreamingLogs from './components/StreamingLogs';
import { useOptimization } from './hooks/useOptimization';
import { useOptimizationHistory } from './hooks/useOptimizationHistory';
import { useStreamingLogs } from './hooks/useStreamingLogs';
import {
  Sparkles,
  Github,
  ExternalLink,
  Zap,
  Database,
  DollarSign,
  Trophy
} from 'lucide-react';

function App() {
  const { optimize, promote, loading, error, results } = useOptimization();
  const { addToHistory } = useOptimizationHistory();
  const { logs, isActive, addLog, startStreaming, stopStreaming } = useStreamingLogs();
  const [universes, setUniverses] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [winner, setWinner] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [selectedPrompt, setSelectedPrompt] = useState('');

  // Keep backend warm to prevent cold starts
  useEffect(() => {
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    
    const keepWarm = () => {
      fetch(`${API_BASE}/health`).catch(() => {});
    };
    
    // Ping immediately and then every 10 minutes
    keepWarm();
    const interval = setInterval(keepWarm, 600000);
    
    return () => clearInterval(interval);
  }, []);

  // Toast helpers
  const addToast = (type, title, message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => removeToast(id), 5000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const triggerConfetti = () => {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 }
    };

    function fire(particleRatio, opts) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
        spread: 90,
        colors: ['#0070f3', '#000000', '#10b981', '#f59e0b']
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });

    fire(0.2, {
      spread: 60,
    });

    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  };

  // Handle optimization
  const handleOptimize = async (problemDescription, strategies) => {
    setShowResults(false);
    setUniverses([]);
    setWinner(null);

    // Start streaming logs
    startStreaming();
    addLog('System', 'Starting optimization...', 'info');

    try {
      // Simulate agent logs (in real implementation, these would come from backend via WebSocket)
      const agentNames = strategies.map(s => {
        const nameMap = { index: 'IndexAgent', query: 'QueryAgent', cache: 'CacheAgent', schema: 'SchemaAgent' };
        return nameMap[s];
      });

      // Initial logs
      agentNames.forEach(agent => {
        setTimeout(() => addLog(agent, 'Analyzing database schema...'), Math.random() * 500);
        setTimeout(() => addLog(agent, 'Examining pg_stat_statements...'), Math.random() * 1000 + 500);
      });

      const result = await optimize(problemDescription, strategies);

      if (result && result.universes) {
        // Add completion logs
        result.universes.forEach((universe, idx) => {
          setTimeout(() => {
            if (universe.status === 'complete') {
              addLog(universe.agent, `✓ Optimization complete: +${universe.improvement}% improvement`, 'success');
            } else if (universe.status === 'failed') {
              addLog(universe.agent, `✗ Optimization failed: ${universe.error}`, 'error');
            }
          }, idx * 200);
        });

        setUniverses(result.universes);
        setWinner(result.winner);
        setShowResults(true);

        // Final log
        setTimeout(() => {
          const winningUniverse = result.universes.find(u => u.id === result.winner);
          if (winningUniverse) {
            addLog('System', `🏆 Winner: ${winningUniverse.agent} with ${winningUniverse.improvement}% improvement`, 'success');
          }
          stopStreaming();
        }, result.universes.length * 200 + 500);

        // Add to history
        addToHistory({
          problemDescription,
          winner: result.winner,
          universes: result.universes
        });
      }
    } catch (err) {
      console.error('Optimization error:', err);
      addLog('System', `Error: ${err.message}`, 'error');
      stopStreaming();
    }
  };

  // Handle promotion
  useEffect(() => {
    const handlePromotion = async (event) => {
      const { universe } = event.detail;

      try {
        await promote(universe.forkId, universe.details?.appliedChanges || []);

        // Trigger confetti celebration
        triggerConfetti();

        // Show success toast
        addToast(
          'success',
          'Successfully Promoted!',
          `Universe ${universe.id} optimizations are now live in production.`
        );
      } catch (err) {
        // Show error toast
        addToast(
          'error',
          'Promotion Failed',
          err.message || 'An unexpected error occurred during promotion.'
        );
      }
    };

    window.addEventListener('promoteUniverse', handlePromotion);
    return () => window.removeEventListener('promoteUniverse', handlePromotion);
  }, [promote]);

  return (
    <div className="min-h-screen">
      <Toast toasts={toasts} onClose={removeToast} />
      <HistoryPanel />

      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Header */}
      <header className="border-b border-vercel-200/20 dark:border-vercel-700/20 sticky top-0 z-40 bg-white/50 dark:bg-vercel-900/50 backdrop-blur-2xl shadow-vercel">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-vercel-900/90 dark:bg-white/90 backdrop-blur-xl rounded-vercel flex items-center justify-center shadow-vercel">
                <Sparkles className="w-4 h-4 text-white dark:text-vercel-900" aria-hidden="true" />
              </div>
              <h1 className="text-lg font-semibold text-vercel-900 dark:text-vercel-50">
                Parallel Universe DB
              </h1>
            </div>

            <nav className="flex items-center gap-2">
              <ThemeToggle />
              <a
                href="https://github.com/Stella-Achar-Oiro/parallel-universe-db"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-vercel-600 dark:text-vercel-400 hover:text-vercel-900 dark:hover:text-vercel-100 transition-colors"
              >
                <Github className="w-4 h-4" />
                <span className="hidden sm:inline">GitHub</span>
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-5xl font-semibold mb-4 text-vercel-900 dark:text-vercel-50">
              AI-Powered Database Optimization
            </h2>
            <p className="text-lg text-vercel-700 dark:text-vercel-300 mb-8">
              Spawn instant database forks, test optimizations in parallel, and promote the winning strategy to production.
            </p>

            <div className="flex items-center justify-center gap-6 text-sm text-vercel-700 dark:text-vercel-300">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                <span>~1 second forks</span>
              </div>
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4" />
                <span>4 AI agents</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                <span>2,375x savings</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* How It Works Section */}
        <div className="max-w-7xl mx-auto mb-12">
          <HowItWorks />
        </div>

        {/* Example Prompts Section */}
        <div className="max-w-7xl mx-auto mb-12">
          <ExamplePrompts onSelectPrompt={setSelectedPrompt} />
        </div>

        {/* Universe Spawner */}
        <div className="max-w-7xl mx-auto mb-12">
          <UniverseSpawner
            onOptimize={handleOptimize}
            loading={loading}
            selectedPrompt={selectedPrompt}
            onPromptChange={setSelectedPrompt}
          />
        </div>

        {/* Streaming Logs */}
        <StreamingLogs logs={logs} isActive={isActive} />

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto mb-8"
          >
            <div className="vercel-card p-4 border-red-200 bg-red-50">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Results Section */}
        <AnimatePresence mode="wait">
          {showResults && universes.length > 0 && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Results Header */}
              <div className="max-w-7xl mx-auto mb-8">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-2xl font-semibold text-vercel-900 dark:text-vercel-50">
                    Optimization Results
                  </h3>
                  {winner && (
                    <span className="vercel-badge-accent inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium">
                      <Trophy className="w-4 h-4" />
                      Winner: Universe {winner}
                    </span>
                  )}
                </div>
                <p className="text-sm text-vercel-700 dark:text-vercel-300">
                  Compare performance improvements across parallel universes
                </p>
              </div>

              {/* Universe Cards Grid */}
              <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
                {universes.map((universe, index) => (
                  <UniverseCard
                    key={universe.id}
                    universe={universe}
                    isWinner={universe.id === winner}
                    index={index}
                  />
                ))}
              </div>

              {/* Charts Section */}
              <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="vercel-card p-6">
                  <h3 className="text-lg font-semibold text-vercel-900 dark:text-vercel-50 mb-4">
                    Performance Comparison
                  </h3>
                  <PerformanceChart universes={universes} />
                </div>

                <div className="vercel-card p-6">
                  <h3 className="text-lg font-semibold text-vercel-900 dark:text-vercel-50 mb-4">
                    Cost Analysis
                  </h3>
                  <CostCalculator costSavings={{
                    forkCount: universes.length,
                    traditional: (universes.length * 200).toFixed(2),
                    agentic: "0.34",
                    savingsMultiplier: Math.round((universes.length * 200) / 0.34)
                  }} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* Footer */}
      <footer className="border-t border-vercel-200/30 dark:border-vercel-700/30 mt-20 bg-white/40 dark:bg-vercel-900/40 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-vercel-700 dark:text-vercel-300">
              Built for the Agentic Postgres Challenge
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/Stella-Achar-Oiro/parallel-universe-db"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-vercel-700 dark:text-vercel-300 hover:text-vercel-900 dark:hover:text-vercel-50 transition-colors"
              >
                <span>View on GitHub</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
