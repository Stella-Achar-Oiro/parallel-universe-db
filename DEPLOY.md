# Deployment Guide

## 🚀 Quick Deploy (15 minutes)

### Step 1: Deploy Backend to Render.com

1. **Go to Render.com**
   - Visit: https://render.com
   - Sign up/Login with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository: `Stella-Achar-Oiro/parallel-universe-db`
   - Click "Connect"

3. **Configure Service**
   ```
   Name: parallel-universe-db-api
   Region: Oregon (US West) or closest to you
   Branch: main
   Root Directory: backend
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   Instance Type: Free
   ```

4. **Add Environment Variables**
   Click "Advanced" → "Add Environment Variable":
   ```
   DATABASE_URL=postgresql://tsdbadmin:cty505404v1jmhqz@ggmangg7ne.h61u5yx0k9.tsdb.cloud.timescale.com:39747/tsdb?sslmode=require
   TIGER_SERVICE_ID=ggmangg7ne
   TIGER_CLI_AVAILABLE=true
   NODE_ENV=production
   PORT=3000
   FRONTEND_URL=https://parallel-universe-db.vercel.app
   ```

   ⚠️ **Note**: Update `FRONTEND_URL` after deploying frontend (Step 2)

5. **Deploy**
   - Click "Create Web Service"
   - Wait 2-3 minutes for deployment
   - Copy your backend URL: `https://parallel-universe-db-api.onrender.com`

---

### Step 2: Deploy Frontend to Vercel

1. **Push Latest Changes**
   ```bash
   cd /home/achar/Desktop/Projects/parallel-universe-db
   git add vercel.json frontend/.env.example
   git commit -m "chore: Add deployment configuration"
   git push origin main
   ```

2. **Go to Vercel**
   - Visit: https://vercel.com
   - Sign up/Login with GitHub

3. **Import Project**
   - Click "Add New..." → "Project"
   - Import `Stella-Achar-Oiro/parallel-universe-db`
   - Click "Import"

4. **Configure Project**
   ```
   Framework Preset: Vite
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

5. **Add Environment Variable**
   - Click "Environment Variables"
   - Add:
     ```
     VITE_API_URL = https://parallel-universe-db-api.onrender.com
     ```
   - Replace with YOUR Render backend URL from Step 1

6. **Deploy**
   - Click "Deploy"
   - Wait 1-2 minutes
   - Copy your frontend URL: `https://parallel-universe-db-stella.vercel.app`

---

### Step 3: Update CORS (Important!)

1. **Go back to Render.com**
   - Open your backend service
   - Click "Environment"
   - Update `FRONTEND_URL` to your actual Vercel URL
   - Click "Save Changes"
   - Service will automatically redeploy (~2 min)

---

### Step 4: Test Your Deployment

1. **Visit your Vercel URL**
   ```
   https://parallel-universe-db-stella.vercel.app
   ```

2. **Test the app**
   - Click any Example Prompt
   - Click "Launch Optimization"
   - Verify results appear (may take 30-60 seconds for first request)

3. **Check backend logs**
   - On Render.com → Logs tab
   - Should see: `[TigerService] Creating fork...`

---

## 🎯 For Challenge Submission

### Your Live URLs:
```
Live Demo: https://parallel-universe-db-stella.vercel.app
GitHub: https://github.com/Stella-Achar-Oiro/parallel-universe-db
API: https://parallel-universe-db-api.onrender.com
```

### Testing Instructions for Judges:
```markdown
**How to Test:**
1. Visit the live demo link above
2. Scroll to "Try Example Scenarios"
3. Click "E-commerce Performance" example
4. Click "Launch Optimization"
5. Watch 4 AI agents compete in real-time!
6. Results appear in 30-60 seconds

**No login required** - fully public demo
**Works on free tier** - agents run sequentially (1 fork at a time)
```

---

## 🔧 Alternative: Railway.app

If Render.com doesn't work, try Railway.app:

1. Visit: https://railway.app
2. "New Project" → "Deploy from GitHub"
3. Select your repo → `backend` folder
4. Add same environment variables as above
5. Deploy!

Railway gives you: `https://parallel-universe-db-api.up.railway.app`

---

## 🚨 Troubleshooting

### Backend won't start
**Check Render logs** → Look for errors
- Database connection issue? Check `DATABASE_URL`
- Missing env vars? Verify all variables set

### Frontend can't reach backend
**CORS error?**
- Update `FRONTEND_URL` in Render backend env vars
- Must match your exact Vercel URL

### "Tiger CLI not found"
**This is OK!** System falls back to demo mode
- Agents still work with simulated data
- To fix: Add Tiger CLI to Render build command:
  ```
  curl -sSL https://install.tigerdata.cloud/cli.sh | sh && npm install
  ```

### Agents showing 0%
**Wait 30-60 seconds** - first request is slow (cold start)
- Render free tier sleeps after inactivity
- Subsequent requests are fast

---

## 📊 What to Expect

### On Free Tier:
- ✅ Beautiful UI loads instantly
- ✅ Example prompts work
- ✅ Agents show realistic improvements
- ⏱️ First request: 30-60 seconds (cold start)
- ⏱️ Subsequent requests: 10-20 seconds
- 🔄 Agents run sequentially (free tier limit)

### In Production Mode (TIGER_CLI_AVAILABLE=true):
- ✅ Real Tiger Cloud forks created
- ✅ Actual SQL optimizations applied
- ✅ True performance benchmarks
- ⏱️ Agents run sequentially on free tier
- 💰 Would run parallel on paid tier

---

## 🎉 You're Live!

Your app is now:
- ✅ Publicly accessible
- ✅ Running on real infrastructure
- ✅ Ready for judge testing
- ✅ Self-explanatory (no docs needed)
- ✅ Beautiful and accessible

**Congratulations on deploying to production!** 🚀

Add these URLs to your Agentic Postgres Challenge submission and you're done!
