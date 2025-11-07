import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import optimizeRouter from './routes/optimize.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'parallel-universe-db',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API routes
app.use('/api/optimize', optimizeRouter);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'Parallel Universe Database API',
    version: '1.0.0',
    description: 'AI agents optimizing databases across instant forks',
    endpoints: {
      health: 'GET /health',
      optimize: 'POST /api/optimize',
      promote: 'POST /api/optimize/promote',
      history: 'GET /api/optimize/history'
    },
    docs: 'https://github.com/Stella-Achar-Oiro/parallel-universe-db'
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('[Error]', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    path: req.path
  });
});

// Start server
app.listen(PORT, () => {
  console.log('╔════════════════════════════════════════════════╗');
  console.log('║   🌌 Parallel Universe Database API          ║');
  console.log('╚════════════════════════════════════════════════╝');
  console.log('');
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Database: ${process.env.DATABASE_URL ? 'Connected' : 'Not configured'}`);
  console.log('');
  console.log('Endpoints:');
  console.log(`  - GET  http://localhost:${PORT}/health`);
  console.log(`  - POST http://localhost:${PORT}/api/optimize`);
  console.log(`  - POST http://localhost:${PORT}/api/optimize/promote`);
  console.log(`  - GET  http://localhost:${PORT}/api/optimize/history`);
  console.log('');
  console.log('Ready to spawn parallel universes! 🚀');
  console.log('');
});

export default app;
