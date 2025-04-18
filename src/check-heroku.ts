import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

// This is a simple diagnostic script to check the Heroku environment
console.log('=== HEROKU ENVIRONMENT CHECK ===');
console.log('Current working directory:', process.cwd());
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('PORT:', process.env.PORT);

// Check if migrations directory exists
const drizzleDir = path.join(process.cwd(), 'drizzle');
console.log('Checking for drizzle directory at:', drizzleDir);
console.log('Directory exists:', fs.existsSync(drizzleDir));

// List all files in current directory
console.log('\nFiles in current directory:');
try {
  fs.readdirSync(process.cwd()).forEach((file) => {
    const filePath = path.join(process.cwd(), file);
    const stats = fs.statSync(filePath);
    console.log(`${file} (${stats.isDirectory() ? 'directory' : 'file'})`);
  });
} catch (error) {
  console.error('Error reading directory:', error);
}

// If drizzle directory exists, list its contents
if (fs.existsSync(drizzleDir)) {
  console.log('\nFiles in drizzle directory:');
  try {
    fs.readdirSync(drizzleDir).forEach((file) => {
      console.log(`- ${file}`);
    });
  } catch (error) {
    console.error('Error reading drizzle directory:', error);
  }
}

// Check dist directory if it exists
const distDir = path.join(process.cwd(), 'dist');
if (fs.existsSync(distDir)) {
  console.log('\nFiles in dist directory:');
  try {
    fs.readdirSync(distDir).forEach((file) => {
      console.log(`- ${file}`);
    });
  } catch (error) {
    console.error('Error reading dist directory:', error);
  }

  // Check for migrations in dist directory
  const distDrizzleDir = path.join(distDir, 'drizzle');
  if (fs.existsSync(distDrizzleDir)) {
    console.log('\nFiles in dist/drizzle directory:');
    try {
      fs.readdirSync(distDrizzleDir).forEach((file) => {
        console.log(`- ${file}`);
      });
    } catch (error) {
      console.error('Error reading dist/drizzle directory:', error);
    }
  } else {
    console.log('\ndist/drizzle directory does not exist');
  }
}

console.log('\n=== END OF ENVIRONMENT CHECK ===');
