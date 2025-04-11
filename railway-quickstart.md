# Railway Quickstart Guide

This guide provides the essential steps to get your Footprint Talent System up and running on Railway in the shortest possible time.

## Step 1: Create Railway Account

1. Go to [Railway.app](https://railway.app/)
2. Sign up with your GitHub account

## Step 2: Deploy from GitHub

1. Create a new project in Railway
2. Choose "Deploy from GitHub repo"
3. Select your repository
4. Railway will automatically detect your project

## Step 3: Add PostgreSQL Database

1. Click "New" → "Database" → "PostgreSQL"
2. Wait for provisioning (about 1-2 minutes)

## Step 4: Set Environment Variables

Add these to your project's Variables tab:

```
SENDGRID_API_KEY=your_sendgrid_api_key
EMAIL_FROM=ahsanglobalbusiness@gmail.com
```

Note: Railway automatically adds DATABASE_URL variable

## Step 5: Configure Build & Start Commands

In your project Settings tab:

1. Build Command: `npm run build`
2. Start Command: `npm run db:push && npm start`

## Step 6: Generate Domain

1. Go to your project's Settings tab
2. Click "Generate Domain"
3. Your app will be available at the generated URL

## Step 7: First-Time Setup

1. Visit your application URL
2. Login to admin dashboard (admin/admin123)
3. Begin adding talents

## Troubleshooting

If your app doesn't deploy correctly:

1. Check deployment logs for errors
2. Verify all environment variables are set
3. Make sure there are no errors in your code
4. Confirm PostgreSQL database is running

## Railway Pricing

- Free trial: 21 days
- After trial: $5/month starter plan
- Usage-based billing after that

After 21 days, add a payment method in Railway dashboard to avoid service interruption.