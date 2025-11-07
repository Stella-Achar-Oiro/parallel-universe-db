import { exec } from 'child_process';
import { promisify } from 'util';
import pg from 'pg';
const { Pool } = pg;

const execAsync = promisify(exec);

/**
 * TigerService - Wrapper around Tiger CLI for zero-copy fork management
 * Handles creation, deletion, promotion, and metrics for database forks
 */
class TigerService {
  constructor() {
    this.mainServiceId = process.env.TIGER_SERVICE_ID;
    this.mainPool = null;
    if (process.env.DATABASE_URL) {
      this.mainPool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
      });
    }
  }

  /**
   * Create a zero-copy fork of the main database
   * @param {string} forkName - Name for the fork (e.g., 'universe-alpha')
   * @returns {Promise<Object>} Fork details including id, name, and connection string
   */
  async createFork(forkName) {
    try {
      // In production, use Tiger CLI
      if (process.env.TIGER_CLI_AVAILABLE === 'true') {
        const { stdout } = await execAsync(
          `tiger service fork ${this.mainServiceId} --name ${forkName}`
        );

        const forkId = this.parseForkId(stdout);
        const connectionString = await this.getForkConnectionString(forkId);

        return {
          id: forkId,
          name: forkName,
          connectionString,
          createdAt: new Date().toISOString(),
          status: 'active'
        };
      }

      // For development/demo: simulate fork creation
      const forkId = `fork-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      return {
        id: forkId,
        name: forkName,
        connectionString: process.env.DATABASE_URL, // Use main DB in dev mode
        createdAt: new Date().toISOString(),
        status: 'active',
        isDemoMode: true
      };
    } catch (error) {
      console.error(`Error creating fork ${forkName}:`, error);
      throw new Error(`Failed to create fork: ${error.message}`);
    }
  }

  /**
   * List all forks for the service
   * @returns {Promise<Array>} Array of fork objects
   */
  async listForks() {
    try {
      if (process.env.TIGER_CLI_AVAILABLE === 'true') {
        const { stdout } = await execAsync('tiger service list --format json');
        const services = JSON.parse(stdout);
        return services.filter(s => s.parentServiceId === this.mainServiceId);
      }

      // Demo mode: return empty array
      return [];
    } catch (error) {
      console.error('Error listing forks:', error);
      return [];
    }
  }

  /**
   * Delete a fork
   * @param {string} forkId - Fork ID to delete
   * @returns {Promise<boolean>} Success status
   */
  async deleteFork(forkId) {
    try {
      if (process.env.TIGER_CLI_AVAILABLE === 'true') {
        await execAsync(`tiger service delete ${forkId} --confirm`);
        return true;
      }

      // Demo mode: always succeed
      return true;
    } catch (error) {
      console.error(`Error deleting fork ${forkId}:`, error);
      throw new Error(`Failed to delete fork: ${error.message}`);
    }
  }

  /**
   * Promote fork changes to main database
   * @param {string} forkId - Fork to promote
   * @param {Array} changes - SQL statements to apply
   * @returns {Promise<Object>} Promotion result
   */
  async promoteFork(forkId, changes) {
    try {
      if (!this.mainPool) {
        throw new Error('Main database pool not initialized');
      }

      // Execute changes on main database
      const client = await this.mainPool.connect();
      try {
        await client.query('BEGIN');

        for (const change of changes) {
          await client.query(change);
        }

        await client.query('COMMIT');

        return {
          success: true,
          appliedChanges: changes.length,
          timestamp: new Date().toISOString()
        };
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    } catch (error) {
      console.error(`Error promoting fork ${forkId}:`, error);
      throw new Error(`Failed to promote fork: ${error.message}`);
    }
  }

  /**
   * Get performance metrics for a fork
   * @param {string} connectionString - Fork connection string
   * @returns {Promise<Object>} Performance metrics
   */
  async getForkMetrics(connectionString) {
    const pool = new Pool({
      connectionString,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });

    try {
      const client = await pool.connect();

      // Get query statistics
      const statsQuery = `
        SELECT
          query,
          calls,
          total_exec_time,
          mean_exec_time,
          min_exec_time,
          max_exec_time
        FROM pg_stat_statements
        WHERE query NOT LIKE '%pg_stat_statements%'
        ORDER BY mean_exec_time DESC
        LIMIT 10
      `;

      const { rows: stats } = await client.query(statsQuery);

      // Get database size
      const sizeQuery = `
        SELECT pg_database_size(current_database()) as size_bytes
      `;
      const { rows: sizeResult } = await client.query(sizeQuery);

      // Get index usage
      const indexQuery = `
        SELECT
          schemaname,
          tablename,
          indexname,
          idx_scan,
          idx_tup_read,
          idx_tup_fetch
        FROM pg_stat_user_indexes
        ORDER BY idx_scan DESC
        LIMIT 10
      `;
      const { rows: indexes } = await client.query(indexQuery);

      client.release();

      return {
        queryStats: stats,
        databaseSize: sizeResult[0].size_bytes,
        indexUsage: indexes,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting fork metrics:', error);
      return {
        queryStats: [],
        databaseSize: 0,
        indexUsage: [],
        error: error.message
      };
    } finally {
      await pool.end();
    }
  }

  /**
   * Execute a query on a fork and measure performance
   * @param {string} connectionString - Fork connection string
   * @param {string} query - SQL query to execute
   * @returns {Promise<Object>} Query result with timing
   */
  async executeQuery(connectionString, query) {
    const pool = new Pool({
      connectionString,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });

    try {
      const client = await pool.connect();

      const startTime = Date.now();

      // Get execution plan
      const explainResult = await client.query(`EXPLAIN ANALYZE ${query}`);

      const endTime = Date.now();
      const executionTime = endTime - startTime;

      client.release();

      return {
        executionTime,
        plan: explainResult.rows,
        success: true
      };
    } catch (error) {
      console.error('Error executing query:', error);
      return {
        executionTime: -1,
        error: error.message,
        success: false
      };
    } finally {
      await pool.end();
    }
  }

  /**
   * Parse fork ID from Tiger CLI output
   * @private
   */
  parseForkId(output) {
    // Example output: "Created fork: fork-abc123-def456"
    const match = output.match(/fork-[a-z0-9-]+/i);
    return match ? match[0] : null;
  }

  /**
   * Get connection string for a fork
   * @private
   */
  async getForkConnectionString(forkId) {
    if (process.env.TIGER_CLI_AVAILABLE === 'true') {
      const { stdout } = await execAsync(`tiger service info ${forkId} --format json`);
      const info = JSON.parse(stdout);
      return info.connectionString;
    }
    return process.env.DATABASE_URL;
  }
}

export default new TigerService();
