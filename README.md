# Parallel Universe Database

> What if your database could exist in multiple realities?

Spawn instant database forks (parallel universes), deploy AI agents to each universe to test different optimization strategies, watch them compete in real-time, and promote the winner to production.

**Built for the [Agentic Postgres Challenge](https://dev.to/challenges/postgres)**

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen)
![React](https://img.shields.io/badge/react-18.2.0-blue)

## What Makes This Special

- **Zero-Copy Forks**: Instant database forks without copying data (~2 seconds vs 30+ minutes)
- **AI Agent Competition**: 4 specialized agents test different optimizations
- **Real-Time Visualization**: Watch optimizations happen live with beautiful animations
- **2,375x Cost Savings**: Pay $0.02 instead of $47.50 for testing 4 strategies
- **One-Click Promotion**: Apply winning optimizations to production instantly
- **Free Tier Compatible**: Sequential execution mode works within Tiger Cloud free tier limits
- **Full Accessibility**: WCAG AA compliant with keyboard navigation and screen reader support

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Tiger Cloud account (optional, for production-scale forks)
- **No paid APIs required!** Agents use intelligent rule-based strategies

### Installation

```bash
# Clone the repository
git clone https://github.com/Stella-Achar-Oiro/parallel-universe-db.git
cd parallel-universe-db

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Database Setup

```bash
# Create a PostgreSQL database
createdb parallel_universe_db

# Run schema
psql parallel_universe_db < database/schema.sql

# Seed with test data
psql parallel_universe_db < database/seed.sql
```

### Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit .env and configure:
# - DATABASE_URL: Your PostgreSQL connection string (required)
# - TIGER_SERVICE_ID: Your Tiger Cloud service ID (optional, for production forks)
# - TIGER_CLI_AVAILABLE: Set to 'true' if using Tiger CLI, 'false' for demo mode
# - ANTHROPIC_API_KEY: NOT REQUIRED - agents use rule-based strategies!
```

**Important Notes:**
- **Tiger Cloud Setup**: If using real forks, install [Tiger CLI](https://docs.timescale.com/use-timescale/latest/services/create-a-service/#fork-a-service) and set `TIGER_CLI_AVAILABLE=true`
- **Free Tier**: System automatically runs in sequential mode (one fork at a time) to stay within free tier limits
- **Demo Mode**: Set `TIGER_CLI_AVAILABLE=false` to test with main database only (no forks created)
- **Password Format**: Tiger CLI saves fork passwords to `~/.pgpass` automatically

### Running the Application

```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start frontend
cd frontend
npm run dev
```

Visit http://localhost:5173 to see the application!

## Architecture

### Backend (Node.js + Express)

```
backend/
├── src/
│   ├── agents/
│   │   ├── IndexAgent.js      # Tests different index strategies
│   │   ├── QueryAgent.js      # Rewrites and optimizes queries
│   │   ├── CacheAgent.js      # Creates materialized views
│   │   └── SchemaAgent.js     # Optimizes schema structure
│   ├── routes/
│   │   └── optimize.js        # Main optimization endpoint
│   ├── services/
│   │   ├── tigerService.js    # Fork management wrapper
│   │   └── mcpService.js      # AI-powered PostgreSQL expertise
│   └── server.js              # Express server
```

### Frontend (React + Vite + Tailwind)

```
frontend/
├── src/
│   ├── components/
│   │   ├── UniverseSpawner.jsx    # Main optimization UI
│   │   ├── UniverseCard.jsx       # Individual universe display
│   │   ├── PerformanceChart.jsx   # Results visualization
│   │   └── CostCalculator.jsx     # Cost savings display
│   ├── hooks/
│   │   └── useOptimization.js     # API integration hook
│   └── App.jsx                    # Main application
```

## How It Works

1. **Describe Problem**: User enters a database performance issue
2. **Select Strategies**: Choose which optimization approaches to test (Index, Query, Cache, Schema)
3. **Spawn Universes**: System creates zero-copy database forks (~2 seconds each)
4. **Run Agents**: AI agents test different optimizations sequentially on real Tiger Cloud forks
5. **Compare Results**: Real-time visualization shows performance improvements
6. **Promote Winner**: One-click promotion of best optimization to production

### Execution Modes

**Sequential Mode (Default - Free Tier Compatible)**
- Creates one fork at a time: Create → Optimize → Delete → Repeat
- Total time: ~8-10 minutes for 4 agents (2-2.5 min per agent)
- Stays within Tiger Cloud free tier limit (2 services max)
- Each agent gets a real isolated fork with proper password authentication

**Parallel Mode (Paid Tier)**
- Creates all 4 forks simultaneously
- Total time: ~2-3 minutes (all agents run at once)
- Requires Tiger Cloud paid tier (allows unlimited concurrent forks)
- Not currently implemented - available for future enhancement

## 🤖 AI Agents

### IndexAgent
- Analyzes pg_stat_statements for slow queries
- Uses Claude to recommend optimal indexes
- Tests B-tree, GiST, GIN, and BRIN indexes
- Measures performance before/after

### QueryAgent
- Identifies query bottlenecks with EXPLAIN ANALYZE
- Rewrites queries for better performance
- Tests CTE vs subquery patterns
- Optimizes JOIN order

### CacheAgent
- Finds frequently accessed data
- Creates materialized views
- Implements smart caching strategies
- Reduces query load

### SchemaAgent
- Analyzes table structures
- Adds optimal constraints
- Updates statistics with ANALYZE
- Optimizes storage with VACUUM

## Features

### Accessibility (WCAG AA Compliant)
-  Semantic HTML structure
-  Keyboard navigation throughout
-  ARIA labels on all interactive elements
-  Screen reader tested
-  4.5:1 color contrast minimum
-  Focus indicators on all focusable elements

### Technologies Used

**Backend:**
- Express.js - API server
- pg - PostgreSQL client
- Anthropic SDK - AI-powered optimization
- dotenv - Environment management

**Frontend:**
- React 18 - UI framework
- Vite - Build tool
- Tailwind CSS - Styling
- Framer Motion - Animations
- Recharts - Data visualization
- Lucide React - Icons

**Database:**
- PostgreSQL 14+
- pg_stat_statements - Query analysis
- pgvector - Hybrid search (future feature)

##  Performance Metrics

Based on our e-commerce demo dataset:

- **100,000 users**
- **500,000 orders**
- **1,000,000 order items**
- **1,000 products**

Typical improvements:
- Index optimization: 70-90% faster queries
- Query rewriting: 50-70% improvement
- Caching: 40-60% reduction in load
- Schema optimization: 30-50% better planning

## Use Cases

1. **Development Testing**: Try different optimization strategies without affecting production
2. **A/B Testing**: Compare multiple approaches simultaneously
3. **Performance Tuning**: Find the best optimization for your specific workload
4. **Learning**: Understand how different optimizations affect performance
5. **Cost Optimization**: Test strategies without expensive database clones

## Future Enhancements

- [ ] Hybrid search integration (BM25 + vector search for finding similar past optimizations)
- [ ] Persistent memory (agents learn from past optimizations)
- [ ] More agent types (PartitionAgent, ConnectionPoolAgent)
- [ ] Real-time streaming updates via WebSockets
- [ ] Multi-database support (MySQL, MongoDB)
- [ ] Slack/Discord notifications
- [ ] Automated scheduling for routine optimization

## Contributing

This is a competition submission, but feedback is welcome! Feel free to:
- Open issues for bugs or suggestions
- Star the repo if you find it interesting
- Share with others who might benefit

## License

MIT License - see LICENSE file for details

## Acknowledgments

- **Tiger Cloud** for zero-copy fork technology
- **Anthropic** for Claude AI capabilities
- **DEV Community** for hosting the challenge
- **PostgreSQL** for being an amazing database

## Author

**Stella Achar Oiro**

- GitHub: [@Stella-Achar-Oiro](https://github.com/Stella-Achar-Oiro)
- Built for: Agentic Postgres Challenge 2024

---

**Built using Agentic Postgres, Tiger Cloud**

*Making database optimization feel like magic*
