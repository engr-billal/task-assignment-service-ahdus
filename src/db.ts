import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

// Parse DATABASE_URL for Heroku compatibility
export const getDbConfig = () => {
  if (process.env.DATABASE_URL) {
    // When running on Heroku, use the DATABASE_URL
    const connectionString = process.env.DATABASE_URL;
    return {
      connectionString,
      ssl:
        process.env.NODE_ENV === 'production'
          ? { rejectUnauthorized: false }
          : false,
    };
  }

  // Local development configuration
  return {
    user: 'postgres',
    host: 'localhost',
    database: 'task-assignment-service',
    password: 'Muhammad3913@',
    port: 5432,
  };
};

// Create a new pool for PostgreSQL
export const pool = new Pool(getDbConfig());

// Create the Drizzle instance using the PostgreSQL connection pool
export const db = drizzle(pool, { schema });
