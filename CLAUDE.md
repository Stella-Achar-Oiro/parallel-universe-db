# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Parallel Universe Database is a system that spawns instant database forks (parallel universes), deploys AI agents to each fork to test different optimization strategies, and promotes the winning optimization to production. Built for the Agentic Postgres Challenge.

Key concept: Uses zero-copy database forks (~1 second vs 30+ minutes) to enable parallel testing of optimization strategies by competing AI agents.

## Development Commands

### Backend (Node.js + Express)

```bash
cd backend
npm install              # Install dependencies
npm run dev             # Start with hot reload (node --watch)
npm start               # Start production server
```

### Frontend (React + Vite)

```bash
cd frontend
npm install             # Install dependencies
npm run dev             # Start dev server (http://localhost:5173)
npm run build           # Build for production
npm run preview         # Preview production build
```

### Database Setup

```bash
createdb parallel_universe_db
psql parallel_universe_db < database/schema.sql
psql parallel_universe_db < database/seed.sql
```

## Environment Configuration

Copy `.env.example` to `.env` and configure:

- `DATABASE_URL`: PostgreSQL connection string (required)
- `ANTHROPIC_API_KEY`: Anthropic API key for Claude AI agents (required)
- `TIGER_SERVICE_ID`: Tiger Cloud service ID (optional - for production forks)
- `TIGER_CLI_AVAILABLE`: Set to `true` if Tiger CLI is available (defaults to `false` for dev mode)
- `PORT`: Backend server port (default: 3000)
- `FRONTEND_URL`: Frontend URL for CORS (default: http://localhost:5173)

**Dev Mode**: When `TIGER_CLI_AVAILABLE=false`, the system simulates fork creation using the main database connection. All agents still run but share the same DB.

## Architecture

### Core Workflow

1. User submits optimization problem via frontend
2. Backend creates 4 zero-copy database forks (one per strategy)
3. Four AI agents run in parallel, each on their own fork:
   - **IndexAgent**: Creates B-tree/GiST/GIN/BRIN indexes
   - **QueryAgent**: Rewrites queries for performance
   - **CacheAgent**: Creates materialized views
   - **SchemaAgent**: Optimizes constraints/statistics
4. Agents benchmark before/after, return improvement metrics
5. Frontend displays real-time results, identifies winner
6. User can promote winning changes to production

### Agent Design Pattern

All agents follow the same pattern (`backend/src/agents/`):

```javascript
class Agent {
  constructor(forkConnectionString, forkId)
  async optimize(problemDescription)  // Main entry point
  async analyzeDatabase()              // Gather current state
  async getRecommendations()           // AI-powered suggestions
  async benchmarkQueries()             // Measure performance
  async applyChanges()                 // Apply optimizations
  calculateImprovement()               // Compute metrics
  async cleanup()                      // Close connections
}
```

Each agent:
- Gets its own database fork connection string
- Must track `appliedChanges` array (SQL statements for promotion)
- Returns standardized result: `{ agent, status, improvement, executionTime, details }`
- Calls `cleanup()` to close pool connections

### Key Services

**tigerService.js**: Wraps Tiger CLI for fork management
- `createFork(name)`: Returns `{ id, name, connectionString }`
- `deleteFork(id)`: Cleans up fork
- `promoteFork(id, changes)`: Applies SQL changes to main DB
- `executeQuery(connectionString, query)`: Run query with EXPLAIN ANALYZE
- **Dev mode simulation**: When Tiger CLI unavailable, returns main DB connection

**mcpService.js**: AI-powered PostgreSQL expertise
- Uses Anthropic SDK to provide optimization guidance
- Searches PostgreSQL documentation context
- Helps agents make informed decisions

### API Endpoints

**POST /api/optimize**
- Body: `{ problemDescription: string, strategies: string[] }`
- Creates forks, runs agents in parallel, returns results
- Auto-cleanup: Forks deleted after 60 seconds

**POST /api/optimize/promote**
- Body: `{ forkId: string, changes: string[] }`
- Applies winning SQL changes to production in transaction
- Rolls back on error

**GET /api/optimize/history**
- Returns past optimization runs (placeholder implementation)

### Frontend Components

- `UniverseSpawner.jsx`: Main UI orchestrator
- `UniverseCard.jsx`: Displays individual agent results with animations
- `PerformanceChart.jsx`: Recharts visualization of improvements
- `CostCalculator.jsx`: Shows cost savings vs traditional approach
- `useOptimization.js`: API client hook

## Database Requirements

- PostgreSQL 14+ required
- `pg_stat_statements` extension must be available (agents create it if missing)
- Test dataset: 100K users, 500K orders, 1M order items, 1K products

## Important Implementation Details

### Agent Benchmarking Strategy

Agents benchmark by:
1. Identifying slow queries from `pg_stat_statements`
2. Running queries before optimization (baseline)
3. Applying changes
4. Running same queries after (optimized)
5. Computing percent improvement: `(baseline - optimized) / baseline * 100`

Default behavior if no slow queries found: Agents benchmark against `SELECT COUNT(*) FROM pg_catalog.pg_tables`

### Fork Lifecycle

Forks are:
- Created synchronously (one after another) in `optimize.js`
- Agents run in parallel via `Promise.all()`
- Deleted asynchronously after 60 seconds (non-blocking cleanup)
- Each gets a universe name: alpha (α), beta (β), gamma (γ), delta (δ)

### Connection Pool Management

Critical: Agents must call `cleanup()` to end their pool connections, otherwise connections leak.

Pattern:
```javascript
try {
  const result = await agent.optimize(problemDescription);
  await agent.cleanup();
  return result;
} catch (error) {
  await agent.cleanup();  // Always cleanup on error
  throw error;
}
```

## Accessibility

Frontend is WCAG AA compliant:
- Semantic HTML with proper ARIA labels
- Keyboard navigation throughout
- Screen reader tested
- 4.5:1 minimum color contrast
- Focus indicators on all interactive elements

## Testing Approach

No test suite currently exists. When adding tests:
- Backend: Test agents with real PostgreSQL instance (use test DB)
- Mock Tiger CLI calls in tests unless integration testing
- Frontend: Test component rendering and API hook states

## Future Enhancements (Planned)

- Hybrid search: BM25 + vector search to find similar past optimizations
- Agent memory: Learn from historical runs
- WebSocket streaming for real-time progress updates
- Additional agents: PartitionAgent, ConnectionPoolAgent
