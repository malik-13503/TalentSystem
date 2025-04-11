import { db, pool } from './server/db';
import { sql } from 'drizzle-orm';

async function runMigration() {
  try {
    console.log('Starting migration to add email column...');
    
    // Add email column with a default value and then remove the default constraint
    await db.execute(sql`
      ALTER TABLE "promoters" 
      ADD COLUMN IF NOT EXISTS "email" text NOT NULL DEFAULT 'placeholder@example.com';
    `);
    
    console.log('Email column added with default value');
    
    await db.execute(sql`
      ALTER TABLE "promoters" 
      ALTER COLUMN "email" DROP DEFAULT;
    `);
    
    console.log('Default constraint removed');
    console.log('Migration completed successfully');
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    await pool.end();
    process.exit(1);
  }
}

runMigration();