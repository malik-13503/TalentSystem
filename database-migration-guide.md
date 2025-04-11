# Database Migration Guide for Railway Deployment

When deploying your Footprint Talent System to Railway, properly setting up the database migration is crucial. This guide explains how to ensure your PostgreSQL database is correctly initialized and migrated.

## Understanding Database Migration

In this project, we use Drizzle ORM with its "push" migration strategy, which automatically synchronizes your database schema with your code when you run `npm run db:push`. This approach is perfect for Railway deployment.

## Step 1: Database Provisioning on Railway

1. In your Railway project dashboard, click on "New" and select "Database" → "PostgreSQL"
2. Wait for the database to be provisioned (this usually takes about 1-2 minutes)
3. Railway will automatically add the `DATABASE_URL` environment variable to your project

## Step 2: Configure Your Deployment

In your Railway project Settings tab, set the following:

1. **Build Command**: `npm run build`
2. **Start Command**: `npm run db:push && npm start`

The key is that `npm run db:push` runs before the application starts, ensuring your database is properly set up.

## Step 3: Verify Database Connection

After deployment, verify that your application is connecting to the database:

1. Check deployment logs for any database connection errors
2. Try accessing the admin dashboard and adding a new talent
3. Verify that the new talent appears in the dashboard

## Common Issues and Solutions

### Database Connection Errors

If you see errors like "cannot connect to database" or "relation does not exist":

1. **Check environment variables**:
   - Make sure `DATABASE_URL` is set correctly
   - It should look like: `postgresql://username:password@hostname:port/database_name`

2. **Migration not running**:
   - Verify that your start command includes `npm run db:push`
   - Check logs to see if the migration is running before the app starts

3. **Schema issues**:
   - If you see errors about invalid database objects, it might be due to schema changes
   - You might need to drop and recreate the database (Railway makes this easy)

## Backup and Restore

Railway automatically backs up your PostgreSQL database, but you can also:

1. **Create manual backup**:
   - Go to your database dashboard in Railway
   - Click on "Backup" and then "Create Backup"

2. **Restore from backup**:
   - Go to your database dashboard
   - Click on "Backups" and select the backup you want to restore
   - Click "Restore"

## Advanced: Custom Migration Scripts

If you need more control over migrations in the future:

1. Create a separate migration script in your `package.json`:

```json
"scripts": {
  "migrate": "drizzle-kit push",
  "migrate:dev": "drizzle-kit push:pg",
  "migrate:reset": "drizzle-kit drop --out=drizzle && drizzle-kit push"
}
```

2. Update your Railway start command:

```
npm run migrate && npm start
```

This approach gives you more flexibility with complex database changes in the future.