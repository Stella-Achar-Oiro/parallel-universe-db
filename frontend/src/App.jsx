import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import UniverseSpawner from './components/UniverseSpawner';
import UniverseCard from './components/UniverseCard';
import PerformanceChart from './components/PerformanceChart';
import CostCalculator from './components/CostCalculator';
import { useOptimization } from './hooks/useOptimization';
import { Sparkles, Github, ExternalLink } from 'lucide-react';

function App() {
  const { optimize, promote, loading, error, results } = useOptimization();
  const [universes, setUniverses] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [winner, setWinner] = useState(null);

  // Handle optimization
  const handleOptimize = async (problemDescription, strategies) => {
    setShowResults(false);
    setUniverses([]);
    setWinner(null);

    try {
      const result = await optimize(problemDescription, strategies);

      if (result && result.universes) {
        setUniverses(result.universes);
        setWinner(result.winner);
        setShowResults(true);
      }
    } catch (err) {
      console.error('Optimization error:', err);
    }
  };

  // Handle promotion
  useEffect(() => {
    const handlePromotion = async (event) => {
      const { universe } = event.detail;

      try {
        await promote(universe.forkId, universe.details?.appliedChanges || []);

        // Show success notification
        alert(`✅ Universe ${universe.id} successfully promoted to production!`);
      } catch (err) {
        alert(`❌ Failed to promote: ${err.message}`);
      }
    };

    window.addEventListener('promoteUniverse', handlePromotion);
    return () => window.removeEventListener('promoteUniverse', handlePromotion);
  }, [promote]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Skip to main content link (accessibility) */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-blue-400" aria-hidden="true" />
              <div>
                <h1 className="text-2xl font-bold">Parallel Universe Database</h1>
                <p className="text-sm text-gray-400">
                  AI agents optimizing databases across instant forks
                </p>
              </div>
            </div>

            <nav aria-label="External links">
              <a
                href="https://github.com/Stella-Achar-Oiro/parallel-universe-db"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="View on GitHub"
              >
                <Github className="w-5 h-5" aria-hidden="true" />
                <span className="hidden sm:inline">GitHub</span>
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              What if your database existed in multiple realities?
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Spawn instant database forks, deploy AI agents to test different optimization
              strategies, watch them compete in real-time, and promote the winner to production.
            </p>
          </motion.div>

          {/* Universe Spawner */}
          <UniverseSpawner onOptimize={handleOptimize} loading={loading} />

          {/* Error Display */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-red-900/20 border border-red-700 rounded-lg p-4"
                role="alert"
              >
                <p className="text-red-400">Error: {error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Section */}
          <AnimatePresence>
            {showResults && universes.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                {/* Results Header */}
                <div className="text-center">
                  <h2 className="text-3xl font-bold mb-2">Optimization Results</h2>
                  <p className="text-gray-400">
                    {universes.filter(u => u.status === 'complete').length} universes completed
                  </p>
                </div>

                {/* Universe Cards Grid */}
                <div className="grid md:grid-cols-2 gap-6" role="region" aria-label="Optimization results">
                  {universes.map((universe) => (
                    <UniverseCard
                      key={universe.id}
                      universe={universe}
                      isWinner={universe.id === winner}
                    />
                  ))}
                </div>

                {/* Performance Chart */}
                <PerformanceChart universes={universes} />

                {/* Cost Calculator */}
                {results?.costSavings && (
                  <CostCalculator costSavings={results.costSavings} />
                )}

                {/* Summary */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg p-8 border border-blue-700 text-center"
                >
                  <h3 className="text-2xl font-bold mb-4">
                    Winner: Universe {winner?.charAt(0).toUpperCase() + winner?.slice(1)}
                  </h3>
                  <p className="text-gray-300 max-w-2xl mx-auto">
                    The winning optimization has been identified and is ready to promote to
                    production. Click the "Promote to Production" button on the winning universe
                    to apply these changes to your main database.
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Features Section */}
          {!showResults && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid md:grid-cols-3 gap-6 mt-12"
            >
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="text-3xl mb-3">⚡</div>
                <h3 className="text-lg font-semibold mb-2">Instant Forks</h3>
                <p className="text-sm text-gray-400">
                  Zero-copy database forks spawn in under 1 second. No waiting, no copying data.
                </p>
              </div>

              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="text-3xl mb-3">🤖</div>
                <h3 className="text-lg font-semibold mb-2">AI-Powered Agents</h3>
                <p className="text-sm text-gray-400">
                  Specialized agents test different optimization strategies using PostgreSQL expertise.
                </p>
              </div>

              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="text-3xl mb-3">💰</div>
                <h3 className="text-lg font-semibold mb-2">2,375x Cost Savings</h3>
                <p className="text-sm text-gray-400">
                  Pay $0.02 instead of $47.50 for testing 4 optimization strategies in parallel.
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>
            Built with ❤️ for the{' '}
            <a
              href="https://dev.to/challenges/postgres"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 inline-flex items-center gap-1"
            >
              Agentic Postgres Challenge
              <ExternalLink className="w-3 h-3" aria-hidden="true" />
            </a>
          </p>
          <p className="mt-2 text-sm">
            By Stella Achar Oiro • Powered by Tiger Cloud & Anthropic Claude
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
