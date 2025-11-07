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

    // Step 1: Create forks for each strategy (in parallel)
    const forkPromises = [];
    const universeNames = ['alpha', 'beta', 'gamma', 'delta'];
    const strategyMap = {
      'index': IndexAgent,
      'query': QueryAgent,
      'cache': CacheAgent,
      'schema': SchemaAgent
    };

    // Create forks
    const selectedStrategies = strategies.slice(0, 4);
    const forks = [];

    for (let i = 0; i < selectedStrategies.length; i++) {
      const strategy = selectedStrategies[i];
      const universeName = universeNames[i];

      try {
        console.log(`[Optimize] Creating fork for ${universeName} (${strategy})...`);
        const fork = await tigerService.createFork(`universe-${universeName}`);
        forks.push({
          fork,
          strategy,
          universeName,
          symbol: getUniverseSymbol(universeName)
        });
      } catch (error) {
        console.error(`[Optimize] Error creating fork for ${universeName}:`, error);
      }
    }

    console.log(`[Optimize] Created ${forks.length} forks successfully`);

    // Step 2: Run agents in parallel
    const agentPromises = forks.map(async ({ fork, strategy, universeName, symbol }) => {
      const AgentClass = strategyMap[strategy];
      const agent = new AgentClass(fork.connectionString, fork.id);

      try {
        console.log(`[Optimize] Running ${strategy} agent on ${universeName}...`);
        const result = await agent.optimize(problemDescription);

        // Clean up agent resources
        await agent.cleanup();

        return {
          id: universeName,
          symbol,
          ...result,
          forkId: fork.id
        };
      } catch (error) {
        console.error(`[Optimize] Error running ${strategy} agent:`, error);

        await agent.cleanup();

        return {
          id: universeName,
          symbol,
          agent: AgentClass.name,
          forkId: fork.id,
          status: 'failed',
          error: error.message,
          improvement: 0,
          executionTime: -1
        };
      }
    });

    const universes = await Promise.all(agentPromises);

    console.log('[Optimize] All agents completed');

    // Step 3: Determine winner
    const winner = universes.reduce((best, current) =>
      current.improvement > best.improvement ? current : best
    );

    console.log(`[Optimize] Winner: ${winner.id} with ${winner.improvement}% improvement`);

    // Step 4: Calculate cost savings
    const costSavings = calculateCostSavings(forks.length);

    // Step 5: Clean up forks (in background - don't wait)
    setTimeout(async () => {
      for (const { fork } of forks) {
        try {
          await tigerService.deleteFork(fork.id);
          console.log(`[Optimize] Cleaned up fork ${fork.id}`);
        } catch (error) {
          console.error(`[Optimize] Error cleaning up fork ${fork.id}:`, error);
        }
      }
    }, 60000); // Clean up after 1 minute

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
