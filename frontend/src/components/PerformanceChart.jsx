import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

/**
 * PerformanceChart - Visual comparison of optimization results
 * Accessible with keyboard navigation and screen reader support
 */
export default function PerformanceChart({ universes }) {
  if (!universes || universes.length === 0) {
    return null;
  }

  // Prepare data for chart
  const chartData = universes
    .filter(u => u.status === 'complete')
    .map(u => ({
      name: `${u.symbol || u.id.charAt(0).toUpperCase()}`,
      baseline: Math.round(u.baselineTime) || 0,
      optimized: Math.round(u.executionTime) || 0,
      improvement: u.improvement,
      agent: u.agent,
    }))
    .sort((a, b) => b.improvement - a.improvement);

  if (chartData.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      aria-labelledby="performance-chart-title"
    >
      <div className="mb-6">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="name"
              stroke="#a1a1aa"
              tick={{ fill: '#a1a1aa' }}
            />
            <YAxis
              stroke="#a1a1aa"
              tick={{ fill: '#a1a1aa' }}
              label={{ value: 'Time (ms)', angle: -90, position: 'insideLeft', fill: '#a1a1aa' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid rgba(228, 228, 231, 0.5)',
                borderRadius: '8px',
                color: '#18181b',
                backdropFilter: 'blur(12px)'
              }}
              cursor={{ fill: 'rgba(0, 112, 243, 0.1)' }}
            />
            <Legend
              wrapperStyle={{ paddingTop: '20px', color: '#52525b' }}
              iconType="circle"
            />
            <Bar
              dataKey="baseline"
              fill="#a1a1aa"
              name="Baseline"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="optimized"
              fill="#0070f3"
              name="Optimized"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Data Table (for accessibility) */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm" role="table" aria-label="Performance comparison data">
          <thead>
            <tr className="border-b border-vercel-200 dark:border-vercel-700">
              <th scope="col" className="text-left py-3 px-3 font-medium text-vercel-900 dark:text-vercel-50">Universe</th>
              <th scope="col" className="text-left py-3 px-3 font-medium text-vercel-900 dark:text-vercel-50">Agent</th>
              <th scope="col" className="text-right py-3 px-3 font-medium text-vercel-900 dark:text-vercel-50">Baseline</th>
              <th scope="col" className="text-right py-3 px-3 font-medium text-vercel-900 dark:text-vercel-50">Optimized</th>
              <th scope="col" className="text-right py-3 px-3 font-medium text-vercel-900 dark:text-vercel-50">Improvement</th>
            </tr>
          </thead>
          <tbody>
            {chartData.map((data, index) => (
              <tr
                key={index}
                className="border-b border-vercel-200/50 dark:border-vercel-700/50 hover:bg-vercel-50/50 dark:hover:bg-vercel-800/30 transition-colors"
              >
                <td className="py-3 px-3 font-medium text-vercel-900 dark:text-vercel-50">{data.name}</td>
                <td className="py-3 px-3 text-vercel-700 dark:text-vercel-300">{data.agent}</td>
                <td className="py-3 px-3 text-right text-vercel-700 dark:text-vercel-300">{data.baseline}ms</td>
                <td className="py-3 px-3 text-right text-accent font-semibold">
                  {data.optimized}ms
                </td>
                <td className="py-3 px-3 text-right text-emerald-600 dark:text-emerald-400 font-semibold">
                  +{data.improvement}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="metric-card">
          <div className="text-xs text-vercel-700 dark:text-vercel-300 mb-2">Best Improvement</div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            +{Math.max(...chartData.map(d => d.improvement))}%
          </div>
        </div>

        <div className="metric-card">
          <div className="text-xs text-vercel-700 dark:text-vercel-300 mb-2">Average Improvement</div>
          <div className="text-2xl font-bold text-accent">
            +{Math.round(chartData.reduce((sum, d) => sum + d.improvement, 0) / chartData.length)}%
          </div>
        </div>

        <div className="metric-card">
          <div className="text-xs text-vercel-700 dark:text-vercel-300 mb-2">Fastest Query</div>
          <div className="text-2xl font-bold text-vercel-900 dark:text-vercel-50">
            {Math.min(...chartData.map(d => d.optimized))}ms
          </div>
        </div>
      </div>
    </motion.div>
  );
}
