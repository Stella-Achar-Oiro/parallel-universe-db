# Deployment Guide - Parallel Universe Database

This guide covers deploying your parallel universe database system with real Tiger Data fork capabilities for production scale.

## Current Configuration Status

 **Tiger Data Trial Account**: Active
 **Tiger CLI**: Installed at `~/go/bin/tiger`
 **Main Service**: `ggmangg7ne` (parallel-universe-main)
 **Environment**: Configured for real fork creation

---

##  Prerequisites Checklist

### 1. Tiger Data Setup (Completed)

- [x] Tiger Data trial account activated
- [x] Tiger CLI installed (`~/go/bin/tiger`)
- [x] Main database service created (`ggmangg7ne`)
- [x] CLI authenticated with Tiger Cloud
- [x] `.pgpass` file configured for password management

### 2. API Keys (Optional)

- [ ] **Anthropic API Key**: NOT REQUIRED ✅
  - Agents use intelligent rule-based optimization strategies
  - No paid API required - completely free to run!
  - (Optional) Can be added later for AI-powered enhancements

### 3. Frontend Deployment (Completed)

- [x] Frontend deployed to Vercel: https://paralleluniversedb.vercel.app
- [x] CORS configured in backend for Vercel origin

---

##  Deployment Steps

### Step 1: Update Environment Variables

Your current `.env` is already configured! No API keys needed.

**For Render Deployment**, set these environment variables:

```bash
# Required
DATABASE_URL=postgresql://tsdbadmin:your-password@ggmangg7ne.h61u5yx0k9.tsdb.cloud.timescale.com:39747/tsdb?sslmode=require
TIGER_SERVICE_ID=ggmangg7ne
TIGER_CLI_AVAILABLE=true
FRONTEND_URL=https://paralleluniversedb.vercel.app

# Optional (not required)
# ANTHROPIC_API_KEY=sk-ant-your-key-if-you-want-ai-enhancements

# Optional
NODE_ENV=production
PORT=3000
DEBUG=false
```

### Step 2: Install Tiger CLI on Render

Render needs the Tiger CLI binary. Add a build script:

**Option A: Build Hook (Recommended)**

Create `render-build.sh` in your repo:

```bash
#!/bin/bash
# Install Tiger CLI during Render build
echo "Installing Tiger CLI..."

# Download and install Go (if not available)
if ! command -v go &> /dev/null; then
    echo "Installing Go..."
    wget https://go.dev/dl/go1.21.0.linux-amd64.tar.gz
    tar -C /usr/local -xzf go1.21.0.linux-amd64.tar.gz
    export PATH=$PATH:/usr/local/go/bin
fi

# Install Tiger CLI
echo "Installing Tiger CLI..."
go install github.com/timescale/tiger/cmd/tiger@latest

# Verify installation
~/go/bin/tiger version

echo "Tiger CLI installed successfully!"
```

Then in Render dashboard:
- Build Command: `chmod +x render-build.sh && ./render-build.sh && cd backend && npm install`
- Start Command: `cd backend && npm start`

**Option B: Docker Deployment**

If using Docker, add to your `Dockerfile`:

```dockerfile
# Install Go and Tiger CLI
RUN wget https://go.dev/dl/go1.21.0.linux-amd64.tar.gz && \
    tar -C /usr/local -xzf go1.21.0.linux-amd64.tar.gz && \
    rm go1.21.0.linux-amd64.tar.gz

ENV PATH="/usr/local/go/bin:${PATH}"

RUN go install github.com/timescale/tiger/cmd/tiger@latest
```

### Step 3: Configure Tiger CLI Authentication on Render

Since Render is a server environment, you need to authenticate Tiger CLI:

**Add to your startup script** (`backend/server-start.sh`):

```bash
#!/bin/bash
# Authenticate Tiger CLI on server startup
if [ "$TIGER_CLI_AVAILABLE" = "true" ]; then
    echo "Configuring Tiger CLI authentication..."

    # Set Tiger auth token (add TIGER_AUTH_TOKEN to Render env vars)
    export TIGER_AUTH_TOKEN=$TIGER_AUTH_TOKEN

    # Or authenticate with credentials
    # tiger auth login --email $TIGER_EMAIL --password $TIGER_PASSWORD
fi

# Start the server
node src/server.js
```

### Step 4: Deploy to Render

```bash
# Commit your changes
git add .
git commit -m "feat: Enable Tiger Data production fork capabilities"
git push origin main
```

Render will automatically deploy with the new configuration.

---

## Verifying Deployment

### Test Fork Creation

Once deployed, test the fork creation:

```bash
# Via API
curl -X POST https://parallel-universe-db.onrender.com/api/optimize \
  -H "Content-Type: application/json" \
  -d '{
    "problemDescription": "Optimize user queries with high execution time",
    "strategies": ["index", "query", "cache", "schema"]
  }'
```

### Check Logs

In Render dashboard, check logs for:

```
[TigerService] Creating fork universe-alpha using Tiger CLI...
[TigerService] Fork created in 2.34s
[TigerService] Parsed fork ID: xyz123
```

### Monitor Fork Lifecycle

```bash
# Locally, check forks
~/go/bin/tiger service list -o json | jq '.[] | select(.parent_service_id == "ggmangg7ne")'
```

---

## Important Notes

### Fork Creation Timing

- **Zero-copy forks**: ~1-5 seconds (Tiger Data magic!)
- **Traditional forks**: 30+ minutes (not using this)
- **Timeout**: Set to 120 seconds with automatic fallback to demo mode

### Fallback Behavior

If Tiger fork creation fails (API timeout, limits, etc.), the system automatically falls back to **demo mode**:
- Uses main database for all agents
- Agents still run and test optimizations
- Results marked with `isDemoMode: true`
- Safe for demonstrations and testing

### Cost Optimization

Your trial includes:
- Main database: $36/month compute + storage
- Forks: **Free** (zero-copy, instant)
- Storage: $0.212/GB-month (only charged for actual data size)

**Pro tip**: Forks are cleaned up after 60 seconds to minimize costs.

### Tiger Cloud Limitations (Trial)

Trial accounts may have:
- Fork creation rate limits
- Maximum concurrent forks
- API timeout issues during peak times

If you hit limits, the system gracefully falls back to demo mode.

---

## Troubleshooting

### Fork Creation Timeouts

**Symptom**: `Error: context deadline exceeded`

**Solutions**:
1. Check Tiger Cloud status: https://status.timescale.com/
2. Verify your trial account limits in Tiger console
3. Try creating fork manually: `tiger service fork ggmangg7ne --name test --now`
4. Increase timeout in code (already set to 120s)

### CORS Errors

**Symptom**: `No 'Access-Control-Allow-Origin' header`

**Solution**: Already fixed! Verify `FRONTEND_URL` is set correctly on Render.

### Authentication Errors

**Symptom**: `Error: authentication required`

**Solution**:
1. Ensure `TIGER_AUTH_TOKEN` is set in Render environment variables
2. Or run `tiger auth login` during build/startup

### Connection String Issues

**Symptom**: `Error: password authentication failed`

**Solution**:
1. Verify `.pgpass` file is created on Render
2. Check `DATABASE_URL` has correct password
3. Ensure SSL mode is `require` for Tiger connections

---

## Performance Metrics

With real Tiger forks, you'll see:

- **Fork Creation**: 1-5 seconds (vs 30+ minutes traditional)
- **4 Parallel Agents**: Running simultaneously on separate forks
- **Zero Data Copy**: No storage duplication
- **Automatic Cleanup**: Forks deleted after 60s

**Example Output**:

```json
{
  "results": [
    {
      "agent": "IndexAgent",
      "universe": "α (alpha)",
      "improvement": 73.5,
      "executionTime": 4.2,
      "creationTime": 1.8,
      "isDemoMode": false
    },
    ...
  ]
}
```

---

## Next Steps

1. **Add Anthropic API Key**: Get from https://console.anthropic.com/
2. **Deploy to Render**: Follow Step 2 & 3 for Tiger CLI installation
3. **Test Real Forks**: Verify fork creation works in production
4. **Monitor Costs**: Track usage in Tiger Cloud console
5. **Scale Up**: Upgrade from trial when needed

---

## Resources

- Tiger Data Docs: https://docs.timescale.com/
- Tiger CLI: https://github.com/timescale/tiger
- Anthropic API: https://docs.anthropic.com/
- Project README: [README.md](README.md)
- Claude Instructions: [CLAUDE.md](CLAUDE.md)

---

**Questions?** Check the logs, verify environment variables, and ensure Tiger CLI is authenticated on your deployment platform.
