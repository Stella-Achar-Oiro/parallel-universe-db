import Anthropic from '@anthropic-ai/sdk';

/**
 * MCPService - Wrapper for AI-powered database optimization using Claude
 * Provides semantic search and reasoning capabilities for agents
 */
class MCPService {
  constructor() {
    this.client = null;
    if (process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY !== 'your-anthropic-api-key') {
      this.client = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY
      });
    }
  }

  /**
   * Search PostgreSQL documentation for best practices
   * @param {string} query - Search query (e.g., "best practices for indexing foreign keys")
   * @returns {Promise<string>} Relevant documentation and recommendations
   */
  async searchPostgresDocs(query) {
    // If no API key, return fallback recommendations
    if (!this.client) {
      console.log('[MCP] No Anthropic API key configured, using fallback logic');
      return 'Using rule-based optimization strategies.';
    }

    try {
      const response = await this.client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: `You are a PostgreSQL expert. Provide concise, actionable advice for the following database optimization question:

${query}

Focus on:
1. Specific SQL commands or configurations
2. Performance implications
3. Trade-offs and considerations

Keep response under 300 words.`
        }]
      });

      return response.content[0].text;
    } catch (error) {
      console.error('Error searching Postgres docs:', error);
      return 'Unable to fetch documentation at this time.';
    }
  }

  /**
   * Analyze query plan and suggest optimizations
   * @param {string} queryPlan - EXPLAIN ANALYZE output
   * @param {string} originalQuery - The SQL query
   * @returns {Promise<Object>} Analysis and suggestions
   */
  async analyzeQueryPlan(queryPlan, originalQuery) {
    if (!this.client) {
      return {
        bottlenecks: ['API key not configured'],
        recommendations: ['Using rule-based optimization'],
        alternativeQuery: null,
        estimatedImprovement: 0
      };
    }

    try {
      const response = await this.client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2048,
        messages: [{
          role: 'user',
          content: `Analyze this PostgreSQL query execution plan and suggest optimizations:

Original Query:
${originalQuery}

Execution Plan:
${JSON.stringify(queryPlan, null, 2)}

Provide:
1. Bottlenecks identified
2. Specific optimization recommendations
3. Alternative query approaches if applicable
4. Expected performance improvement

Format as JSON with keys: bottlenecks (array), recommendations (array), alternativeQuery (string), estimatedImprovement (number 0-100)`
        }]
      });

      const text = response.content[0].text;

      // Try to parse JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      // Fallback if not JSON
      return {
        bottlenecks: ['Unable to parse execution plan'],
        recommendations: [text],
        alternativeQuery: null,
        estimatedImprovement: 0
      };
    } catch (error) {
      console.error('Error analyzing query plan:', error);
      return {
        bottlenecks: ['Analysis failed'],
        recommendations: [],
        alternativeQuery: null,
        estimatedImprovement: 0
      };
    }
  }

  /**
   * Generate index recommendations for a table
   * @param {string} tableName - Table name
   * @param {Object} tableStats - Statistics about the table
   * @param {Array} commonQueries - Common queries on this table
   * @returns {Promise<Array>} Array of index recommendations
   */
  async recommendIndexes(tableName, tableStats, commonQueries) {
    if (!this.client) {
      return [];
    }

    try {
      const response = await this.client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2048,
        messages: [{
          role: 'user',
          content: `You are a PostgreSQL optimization expert. Recommend indexes for this table:

Table: ${tableName}
Statistics: ${JSON.stringify(tableStats, null, 2)}
Common Queries: ${commonQueries.join('\n')}

For each recommendation, provide:
1. Index type (B-tree, GiST, GIN, BRIN, hash)
2. Columns to index
3. CREATE INDEX statement
4. Expected benefit
5. Trade-offs (space, write performance)

Format as JSON array with keys: indexType, columns, createStatement, benefit, tradeoffs`
        }]
      });

      const text = response.content[0].text;

      // Try to parse JSON array from response
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      // Fallback: parse individual recommendations
      return [{
        indexType: 'B-tree',
        columns: [],
        createStatement: '',
        benefit: text,
        tradeoffs: 'See analysis above'
      }];
    } catch (error) {
      console.error('Error recommending indexes:', error);
      return [];
    }
  }

  /**
   * Suggest query rewrites for optimization
   * @param {string} originalQuery - Original SQL query
   * @param {Object} context - Additional context (schema, stats, etc.)
   * @returns {Promise<Object>} Rewrite suggestions
   */
  async suggestQueryRewrite(originalQuery, context = {}) {
    if (!this.client) {
      return {
        optimizedQuery: originalQuery,
        explanation: 'Using rule-based query optimization',
        improvement: 0
      };
    }

    try {
      const response = await this.client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2048,
        messages: [{
          role: 'user',
          content: `Optimize this PostgreSQL query:

Original Query:
${originalQuery}

Context: ${JSON.stringify(context, null, 2)}

Provide:
1. Optimized query (different approach if needed)
2. Explanation of changes
3. Expected performance improvement (percentage)

Format as JSON with keys: optimizedQuery, explanation, improvement`
        }]
      });

      const text = response.content[0].text;

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return {
        optimizedQuery: originalQuery,
        explanation: text,
        improvement: 0
      };
    } catch (error) {
      console.error('Error suggesting query rewrite:', error);
      return {
        optimizedQuery: originalQuery,
        explanation: 'Unable to generate rewrite',
        improvement: 0
      };
    }
  }
}

export default new MCPService();
