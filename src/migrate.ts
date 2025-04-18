import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { db, pool } from './db';

// The main migration function
async function runMigration() {
  try {
    console.log('Starting database migrations...');

    // Run migrations
    await migrate(db, {
      migrationsFolder: './drizzle',
    });

    console.log('Migrations completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    // Close the connection pool
    await pool.end();
  }
}

// Run the migration
runMigration();
