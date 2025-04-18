import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import { getDbConfig } from './db';
import * as path from 'path';
import * as fs from 'fs';

dotenv.config();

async function runMigrations() {
  console.log('Running migrations...');
  console.log('Current directory:', process.cwd());
  console.log('Node environment:', process.env.NODE_ENV);

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
    // Determine migrations folder path based on environment
    // In production, we're running from the dist directory so we need to look there
    const isProd = process.env.NODE_ENV === 'production';
    const migrationsFolder = isProd
      ? path.join(process.cwd(), 'drizzle')
      : path.join(process.cwd(), 'drizzle');

    console.log('Looking for migrations in:', migrationsFolder);

    // Check if migrations directory exists
    if (fs.existsSync(migrationsFolder)) {
      console.log('Migrations directory found');
      const files = fs.readdirSync(migrationsFolder);
      console.log('Files in migrations directory:', files);
    } else {
      console.error('Migrations directory not found!');
      console.log('Files in current directory:', fs.readdirSync(process.cwd()));

      // List all directories to help debug
      console.log('Directories in current location:');
      fs.readdirSync(process.cwd()).forEach((file) => {
        const filePath = path.join(process.cwd(), file);
        const stats = fs.statSync(filePath);
        console.log(
          `${file} ${stats.isDirectory() ? '(directory)' : '(file)'}`,
        );
      });
    }

    // Run migrations using the correct path
    await migrate(db, { migrationsFolder });
    console.log('Migrations completed successfully!');
  } catch (error) {
    console.error('Error running migrations:', error);
    if (error instanceof Error) {
      console.error('Error stack:', error.stack);
    }
    process.exit(1);
  } finally {
    // Close the pool
    await pool.end();
  }
}

// Run migrations
runMigrations();
