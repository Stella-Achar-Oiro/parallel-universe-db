import express from 'express';
import tigerService from '../services/tigerService.js';
import IndexAgent from '../agents/IndexAgent.js';
import QueryAgent from '../agents/QueryAgent.js';
import CacheAgent from '../agents/CacheAgent.js';
import SchemaAgent from '../agents/SchemaAgent.js';

const router = express.Router();

/**
 * POST /api/optimize
 * Main optimization endpoint - spawns parallel universes and runs agents
 */
router.post('/', async (req, res) => {
  const { problemDescription, strategies = ['index', 'query', 'cache', 'schema'] } = req.body;

  if (!problemDescription) {
    return res.status(400).json({
      error: 'Problem description is required'
    });
  }

  try {
    console.log('[Optimize] Starting parallel universe optimization...');
    console.log('[Optimize] Problem:', problemDescription);
    console.log('[Optimize] Strategies:', strategies);
    console.log('[Optimize] Mode: Sequential (free tier compatible)');

    // Step 1: Run agents sequentially to work with free tier limits
    const universeNames = ['alpha', 'beta', 'gamma', 'delta'];
    const strategyMap = {
      'index': IndexAgent,
      'query': QueryAgent,
      'cache': CacheAgent,
      'schema': SchemaAgent
    };

    const selectedStrategies = strategies.slice(0, 4);
    const universes = [];

    // Run each agent sequentially: create fork → run agent → delete fork → repeat
    for (let i = 0; i < selectedStrategies.length; i++) {
      const strategy = selectedStrategies[i];
      const universeName = universeNames[i];
      const symbol = getUniverseSymbol(universeName);
      let fork = null;
      let agent = null;

      try {
        // Step A: Create fork
        console.log(`\n[Optimize] === Universe ${universeName.toUpperCase()} (${strategy}) ===`);
        console.log(`[Optimize] Creating fork for ${universeName}...`);
        fork = await tigerService.createFork(`universe-${universeName}`);

        if (fork.isDemoMode) {
          console.log(`[Optimize] Running in demo mode (using main database)`);
        } else {
          console.log(`[Optimize] Fork created: ${fork.id}`);
        }

        // Step B: Run agent
        console.log(`[Optimize] Running ${strategy} agent...`);
        const AgentClass = strategyMap[strategy];
        agent = new AgentClass(fork.connectionString, fork.id);

        const result = await agent.optimize(problemDescription);
        await agent.cleanup();

        console.log(`[Optimize] ${universeName} completed: ${result.improvement}% improvement`);

        universes.push({
          id: universeName,
          symbol,
          ...result,
          forkId: fork.id
        });

        // Step C: Delete fork immediately (unless in demo mode)
        if (!fork.isDemoMode) {
          console.log(`[Optimize] Deleting fork ${fork.id}...`);
          await tigerService.deleteFork(fork.id);
          console.log(`[Optimize] Fork ${fork.id} deleted successfully`);
        }

      } catch (error) {
        console.error(`[Optimize] Error in ${universeName}:`, error);

        // Clean up agent if it was created
        if (agent) {
          try {
            await agent.cleanup();
          } catch (cleanupError) {
            console.error(`[Optimize] Error cleaning up agent:`, cleanupError);
          }
        }

        // Try to clean up fork on error (if it exists and not demo mode)
        if (fork && !fork.isDemoMode) {
          try {
            console.log(`[Optimize] Cleaning up fork ${fork.id} after error...`);
            await tigerService.deleteFork(fork.id);
            console.log(`[Optimize] Fork ${fork.id} cleaned up`);
          } catch (cleanupError) {
            console.error(`[Optimize] Failed to cleanup fork ${fork.id}:`, cleanupError);
          }
        }

        universes.push({
          id: universeName,
          symbol,
          agent: strategy,
          forkId: fork?.id || 'unknown',
          status: 'failed',
          error: error.message,
          improvement: 0,
          executionTime: -1
        });
      }
    }

    console.log('\n[Optimize] All agents completed');

    // Step 2: Determine winner
    const winner = universes.reduce((best, current) =>
      current.improvement > best.improvement ? current : best
    );

    console.log(`[Optimize] Winner: ${winner.id} with ${winner.improvement}% improvement`);

    // Step 3: Calculate cost savings
    const costSavings = calculateCostSavings(selectedStrategies.length);

    // Return results
    res.json({
      success: true,
      universes,
      winner: winner.id,
      costSavings,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[Optimize] Error:', error);
    res.status(500).json({
      error: 'Optimization failed',
      message: error.message
    });
  }
});

/**
 * POST /api/promote
 * Promote winning universe changes to production
 */
router.post('/promote', async (req, res) => {
  const { forkId, changes } = req.body;

  if (!forkId || !changes) {
    return res.status(400).json({
      error: 'Fork ID and changes are required'
    });
  }

  try {
    console.log(`[Promote] Promoting fork ${forkId} to production...`);

    const result = await tigerService.promoteFork(forkId, changes);

    console.log('[Promote] Promotion successful');

    res.json({
      success: true,
      result,
      message: 'Changes promoted to production successfully'
    });
  } catch (error) {
    console.error('[Promote] Error:', error);
    res.status(500).json({
      error: 'Promotion failed',
      message: error.message
    });
  }
});

/**
 * GET /api/history
 * Get optimization history for hybrid search
 */
router.get('/history', async (req, res) => {
  try {
    // This would query the optimization_history table
    // For now, return sample data
    res.json({
      history: [
        {
          id: 1,
          problemDescription: 'Slow queries on users table',
          strategy: 'index',
          improvement: 84,
          executionTime: 38,
          createdAt: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: 2,
          problemDescription: 'High CPU usage on order queries',
          strategy: 'query',
          improvement: 67,
          executionTime: 52,
          createdAt: new Date(Date.now() - 172800000).toISOString()
        }
      ]
    });
  } catch (error) {
    console.error('[History] Error:', error);
    res.status(500).json({
      error: 'Failed to fetch history',
      message: error.message
    });
  }
});

/**
 * Helper: Get universe symbol
 */
function getUniverseSymbol(name) {
  const symbols = {
    alpha: 'α',
    beta: 'β',
    gamma: 'γ',
    delta: 'δ'
  };
  return symbols[name] || '⊗';
}

/**
 * Helper: Calculate cost savings vs traditional approach
 */
function calculateCostSavings(forkCount) {
  // Traditional approach: Full database clones
  const traditionalCost = forkCount * 11.88; // $11.88 per clone

  // Agentic Postgres: Zero-copy forks
  const agenticCost = 0.02; // Essentially free

  const savings = traditionalCost / agenticCost;

  return {
    traditional: traditionalCost.toFixed(2),
    agentic: agenticCost.toFixed(2),
    savingsMultiplier: Math.round(savings),
    forkCount
  };
}

export default router;
