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
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-gray-800 rounded-lg p-6 border border-gray-700"
      aria-labelledby="performance-chart-title"
    >
      <h2 id="performance-chart-title" className="text-2xl font-bold mb-6">
        Performance Comparison
      </h2>

      <div className="mb-6">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="name"
              stroke="#9CA3AF"
              tick={{ fill: '#9CA3AF' }}
            />
            <YAxis
              stroke="#9CA3AF"
              tick={{ fill: '#9CA3AF' }}
              label={{ value: 'Time (ms)', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '0.5rem',
                color: '#fff'
              }}
              cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
            />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="circle"
            />
            <Bar
              dataKey="baseline"
              fill="#6B7280"
              name="Baseline"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="optimized"
              fill="#3B82F6"
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
            <tr className="border-b border-gray-700">
              <th scope="col" className="text-left py-2 px-3">Universe</th>
              <th scope="col" className="text-left py-2 px-3">Agent</th>
              <th scope="col" className="text-right py-2 px-3">Baseline</th>
              <th scope="col" className="text-right py-2 px-3">Optimized</th>
              <th scope="col" className="text-right py-2 px-3">Improvement</th>
            </tr>
          </thead>
          <tbody>
            {chartData.map((data, index) => (
              <tr
                key={index}
                className="border-b border-gray-700 hover:bg-gray-700/50"
              >
                <td className="py-2 px-3">{data.name}</td>
                <td className="py-2 px-3 text-gray-400">{data.agent}</td>
                <td className="py-2 px-3 text-right text-gray-400">{data.baseline}ms</td>
                <td className="py-2 px-3 text-right text-blue-400 font-semibold">
                  {data.optimized}ms
                </td>
                <td className="py-2 px-3 text-right text-green-400 font-semibold">
                  +{data.improvement}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-900 rounded p-4">
          <div className="text-sm text-gray-400 mb-1">Best Improvement</div>
          <div className="text-2xl font-bold text-green-400">
            +{Math.max(...chartData.map(d => d.improvement))}%
          </div>
        </div>

        <div className="bg-gray-900 rounded p-4">
          <div className="text-sm text-gray-400 mb-1">Average Improvement</div>
          <div className="text-2xl font-bold text-blue-400">
            +{Math.round(chartData.reduce((sum, d) => sum + d.improvement, 0) / chartData.length)}%
          </div>
        </div>

        <div className="bg-gray-900 rounded p-4">
          <div className="text-sm text-gray-400 mb-1">Fastest Query</div>
          <div className="text-2xl font-bold text-purple-400">
            {Math.min(...chartData.map(d => d.optimized))}ms
          </div>
        </div>
      </div>
    </motion.section>
  );
}
