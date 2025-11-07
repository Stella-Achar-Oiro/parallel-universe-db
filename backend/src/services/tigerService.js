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
    this.mainPool = null;
  }

  get mainServiceId() {
    return process.env.TIGER_SERVICE_ID;
  }

  getMainPool() {
    if (!this.mainPool && process.env.DATABASE_URL) {
      this.mainPool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
      });
    }
    return this.mainPool;
  }

  /**
   * Create a zero-copy fork of the main database
   * @param {string} forkName - Name for the fork (e.g., 'universe-alpha')
   * @returns {Promise<Object>} Fork details including id, name, and connection string
   */
  async createFork(forkName) {
    // In production, use Tiger CLI
    if (process.env.TIGER_CLI_AVAILABLE === 'true') {
      try {
        console.log(`[TigerService] Creating fork ${forkName} using Tiger CLI...`);
        console.log(`[TigerService] TIGER_SERVICE_ID from env: ${process.env.TIGER_SERVICE_ID}`);
        console.log(`[TigerService] this.mainServiceId: ${this.mainServiceId}`);

        // Use pgpass mode to save passwords to .pgpass file for easy access
        const command = `${process.env.HOME}/go/bin/tiger --password-storage pgpass service fork ${this.mainServiceId} --name ${forkName} --now`;
        console.log(`[TigerService] Command: ${command}`);

        const { stdout, stderr } = await execAsync(command);

        if (stderr) {
          console.log(`[TigerService] stderr: ${stderr}`);
        }
        console.log(`[TigerService] stdout: ${stdout}`);

        const forkId = this.parseForkId(stdout);
        console.log(`[TigerService] Parsed fork ID: ${forkId}`);

        const connectionString = await this.getForkConnectionString(forkId);
        console.log(`[TigerService] Connection string: ${connectionString}`);

        return {
          id: forkId,
          name: forkName,
          connectionString,
          createdAt: new Date().toISOString(),
          status: 'active'
        };
      } catch (error) {
        console.error(`[TigerService] Error creating fork ${forkName} with Tiger CLI:`, error);
        console.error(`[TigerService] Falling back to demo mode`);

        // Fallback to demo mode
        const forkId = `fork-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        return {
          id: forkId,
          name: forkName,
          connectionString: process.env.DATABASE_URL, // Use main DB in dev mode
          createdAt: new Date().toISOString(),
          status: 'active',
          isDemoMode: true
        };
      }
    }

    // For development/demo: simulate fork creation
    console.log(`[TigerService] Creating fork ${forkName} in demo mode...`);
    const forkId = `fork-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    return {
      id: forkId,
      name: forkName,
      connectionString: process.env.DATABASE_URL, // Use main DB in dev mode
      createdAt: new Date().toISOString(),
      status: 'active',
      isDemoMode: true
    };
  }

  /**
   * List all forks for the service
   * @returns {Promise<Array>} Array of fork objects
   */
  async listForks() {
    try {
      if (process.env.TIGER_CLI_AVAILABLE === 'true') {
        const { stdout } = await execAsync(`${process.env.HOME}/go/bin/tiger service list --format json`);
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
        await execAsync(`${process.env.HOME}/go/bin/tiger service delete ${forkId} --confirm`);
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
      const mainPool = this.getMainPool();
      if (!mainPool) {
        throw new Error('Main database pool not initialized');
      }

      // Execute changes on main database
      const client = await mainPool.connect();
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
      ssl: { rejectUnauthorized: false } // Always disable SSL verification for forks
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
      ssl: { rejectUnauthorized: false } // Always disable SSL verification for forks
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
    // Example output: "New Service ID: hosdzr5zco"
    const match = output.match(/New Service ID:\s*([a-z0-9]+)/i);
    if (match) {
      return match[1];
    }

    // Fallback: look for service ID pattern
    const idMatch = output.match(/([a-z0-9]{10})/i);
    return idMatch ? idMatch[1] : null;
  }

  /**
   * Get connection string for a fork
   * @private
   */
  async getForkConnectionString(forkId) {
    if (process.env.TIGER_CLI_AVAILABLE === 'true') {
      try {
        const { stdout } = await execAsync(`${process.env.HOME}/go/bin/tiger --password-storage pgpass service list -o json`);
        const services = JSON.parse(stdout);
        const fork = services.find(s => s.service_id === forkId);

        if (fork && fork.host && fork.port) {
          // Read password from .pgpass file (Tiger CLI saves it there with --password-storage pgpass)
          console.log(`[TigerService] Looking for password for ${fork.host}:${fork.port}/${fork.database}`);
          const password = await this.getPasswordFromPgpass(fork.host, fork.port, fork.database);

          if (password) {
            console.log(`[TigerService] Found password in .pgpass: ${password.substring(0, 4)}...`);
            // Construct fork connection string with password from pgpass
            // Note: Don't include sslmode in URL - let the Pool config handle SSL
            return `postgresql://tsdbadmin:${password}@${fork.host}:${fork.port}/${fork.database}`;
          } else {
            console.warn(`[TigerService] No password found in .pgpass for ${fork.host}:${fork.port}/${fork.database}`);
            return `postgresql://tsdbadmin@${fork.host}:${fork.port}/${fork.database}`;
          }
        }

        // Fallback: construct connection string from main DB pattern
        const mainUrl = new URL(process.env.DATABASE_URL);
        const forkHost = mainUrl.hostname.replace(this.mainServiceId, forkId);
        return process.env.DATABASE_URL.replace(mainUrl.hostname, forkHost);
      } catch (error) {
        console.error('Error getting fork connection string:', error);
        // Fallback to constructing from pattern
        const mainUrl = new URL(process.env.DATABASE_URL);
        const forkHost = mainUrl.hostname.replace(this.mainServiceId, forkId);
        return process.env.DATABASE_URL.replace(mainUrl.hostname, forkHost);
      }
    }
    return process.env.DATABASE_URL;
  }

  /**
   * Read password from .pgpass file
   * @private
   */
  async getPasswordFromPgpass(hostname, port, database) {
    try {
      const pgpassPath = `${process.env.HOME}/.pgpass`;
      const { readFile } = await import('fs/promises');
      const content = await readFile(pgpassPath, 'utf-8');

      // .pgpass format: hostname:port:database:username:password
      const lines = content.split('\n');
      for (const line of lines) {
        if (!line || line.startsWith('#')) continue;

        const [host, portStr, db, user, pass] = line.split(':');

        // Match hostname, port, database (allow wildcards)
        if ((host === '*' || host === hostname) &&
            (portStr === '*' || portStr === String(port)) &&
            (db === '*' || db === database) &&
            (user === '*' || user === 'tsdbadmin')) {
          return pass;
        }
      }

      return null;
    } catch (error) {
      console.warn('[TigerService] Could not read .pgpass:', error.message);
      return null;
    }
  }
}

export default new TigerService();
