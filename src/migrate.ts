import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import { getDbConfig } from './db';

dotenv.config();

async function runMigrations() {
  console.log('Running migrations...');

  // Get the database configuration from our helper function
  const config = getDbConfig();
  console.log(
    'Database config:',
    JSON.stringify({
      ...config,
      password: '******', // Hide password in logs
    }),
  );

  const pool = new Pool(config);
  const db = drizzle(pool);

  try {
    // Log the migration path for debugging
    console.log('Migration path:', process.cwd() + '/drizzle');

    // Run migrations
    await migrate(db, { migrationsFolder: './drizzle' });
    console.log('Migrations completed successfully!');
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  } finally {
    // Close the pool
    await pool.end();
  }
}

// Run migrations
runMigrations();
