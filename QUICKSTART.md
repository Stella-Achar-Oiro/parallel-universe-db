#  Quick Start Guide

Get Parallel Universe Database running in 5 minutes!

## Prerequisites Check

Before starting, ensure you have:

```bash
# Node.js 18+
node --version  # Should show v18 or higher

# npm
npm --version

# PostgreSQL
psql --version  # Should show 14 or higher

# Git
git --version
```

## Installation Steps

### 1. Clone Repository

```bash
git clone https://github.com/Stella-Achar-Oiro/parallel-universe-db.git
cd parallel-universe-db
```

### 2. Database Setup

```bash
# Create database
createdb parallel_universe_db

# Run schema
psql parallel_universe_db < database/schema.sql

# Seed with test data (this will take 2-3 minutes)
psql parallel_universe_db < database/seed.sql

# Verify installation
psql parallel_universe_db -c "SELECT COUNT(*) FROM users;"
# Should show 100000
```

### 3. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp ../.env.example .env

# Edit .env file - Required settings:
# DATABASE_URL=postgresql://localhost/parallel_universe_db
# ANTHROPIC_API_KEY=your-key-here
# TIGER_CLI_AVAILABLE=false  # Use 'true' if you have Tiger Cloud

# Start backend
npm run dev
```

You should see:
```
╔════════════════════════════════════════════════╗
║   🌌 Parallel Universe Database API          ║
╚════════════════════════════════════════════════╝

Server running on port 3000
Ready to spawn parallel universes! 🚀
```

### 4. Frontend Setup

Open a **new terminal** window:

```bash
cd frontend

# Install dependencies
npm install

# Start frontend
npm run dev
```

You should see:
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 5. Access Application

Open your browser to: **http://localhost:5173**

You should see the Parallel Universe Database interface!

## First Optimization Test

1. **Describe Problem:**
   ```
   Slow queries on users table with email lookups taking over 200ms
   ```

2. **Select All Strategies:**
   -  Index Optimization
   -  Query Rewriting
   -  Caching Strategy
   -  Schema Optimization

3. **Click "Launch Parallel Universes"**

4. **Watch the magic happen:**
   - 4 universes spawn instantly
   - AI agents compete in real-time
   - Winner gets crowned with 
   - See performance improvements and cost savings

## Troubleshooting

### Backend won't start

**Error:** `Error: connect ECONNREFUSED`
- **Solution:** Check DATABASE_URL in .env file
- **Verify:** Run `psql $DATABASE_URL -c "SELECT 1;"`

**Error:** `Missing ANTHROPIC_API_KEY`
- **Solution:** Add your Anthropic API key to .env
- **Get key:** https://console.anthropic.com/

### Frontend won't connect

**Error:** `Failed to fetch`
- **Solution:** Ensure backend is running on port 3000
- **Check:** Visit http://localhost:3000/health

### Database queries fail

**Error:** `relation "users" does not exist`
- **Solution:** Run schema and seed files:
  ```bash
  psql parallel_universe_db < database/schema.sql
  psql parallel_universe_db < database/seed.sql
  ```

### pg_stat_statements not working

**Error:** `extension "pg_stat_statements" does not exist`
- **Solution:** Enable extension in PostgreSQL:
  ```bash
  # Add to postgresql.conf:
  shared_preload_libraries = 'pg_stat_statements'

  # Restart PostgreSQL:
  brew services restart postgresql  # macOS
  sudo systemctl restart postgresql  # Linux

  # Create extension:
  psql parallel_universe_db -c "CREATE EXTENSION pg_stat_statements;"
  ```

## Next Steps

**Explore the code:**
- Backend agents: `backend/src/agents/`
- Frontend components: `frontend/src/components/`
- Database schema: `database/schema.sql`

 **Customize:**
- Add your own database schema
- Create custom agents
- Modify optimization strategies

 **Deploy:**
- Frontend: Deploy to Vercel
- Backend: Deploy to Railway or Heroku
- Database: Use Tiger Cloud for production forks

## Getting Help

- **GitHub Issues:** https://github.com/Stella-Achar-Oiro/parallel-universe-db/issues
- **Documentation:** See README.md
- **DEV.to Post:** [Link to post]

---

**Happy optimizing! **
