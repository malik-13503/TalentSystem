# Railway Deployment Guide for Footprint Talent System

This guide will walk you through deploying your Talent Management System on Railway.app. Railway offers a 21-day free trial, after which you'll need to subscribe to a paid plan (starting at $5/month).

## Prerequisites

1. A GitHub account
2. A Railway.app account (sign up at https://railway.app/)
3. Your project code uploaded to a GitHub repository

## Step 1: Prepare Your Project for GitHub

1. **Download your project from Replit**:
   - In the Replit sidebar, click on the "Files" tab
   - Click on the three dots (⋮) in the Files panel
   - Select "Download as ZIP"
   - Extract the ZIP file to a local folder on your computer

2. **Create a new GitHub repository**:
   - Go to GitHub.com and sign in to your account
   - Click on the "+" icon in the top-right corner and select "New repository"
   - Name your repository (e.g., "footprint-talent-system")
   - Choose "Public" visibility (or "Private" if preferred)
   - Click "Create repository"

3. **Upload your project to GitHub**:
   - Follow the instructions on the GitHub page to upload your existing files
   - You can use GitHub Desktop or the command line, whichever you prefer
   - Make sure to exclude node_modules/ and .env files as they contain sensitive information

## Step 2: Deploy on Railway

1. **Sign up or log in to Railway**:
   - Go to https://railway.app/ and sign up or log in
   - Railway allows you to log in using your GitHub account, which is recommended

2. **Create a new project**:
   - Click on the "New Project" button
   - Select "Deploy from GitHub repo"
   - Choose the GitHub repository you created earlier
   - Railway will automatically detect your project type

3. **Set up your database**:
   - Click on "New" button
   - Select "Database" and then "PostgreSQL"
   - Wait for the database to be provisioned
   - Once created, Railway will automatically add the DATABASE_URL variable to your project

4. **Configure environment variables**:
   - In your project dashboard, go to the "Variables" tab
   - You need to add these environment variables:
     - `SENDGRID_API_KEY`: Your SendGrid API key
     - `EMAIL_FROM`: Your verified sender email (ahsanglobalbusiness@gmail.com)
   - Railway automatically adds PORT and DATABASE_URL variables

5. **Deploy your project**:
   - Railway will automatically deploy your project when you push changes to your GitHub repository
   - You can also manually trigger a deployment from the Railway dashboard

6. **Run database migrations**:
   - In your project dashboard, go to the "Settings" tab
   - Scroll down to "Custom Deploy Command"
   - Enter: `npm run db:push && npm start`
   - This will ensure your database schema is applied before the application starts

7. **Access your deployed application**:
   - Once deployment is complete, Railway will provide a URL for your application
   - You can click on the "Generate Domain" button to get a custom railway.app subdomain

## Step 3: Verify Your Deployment

1. **Test your application**:
   - Navigate to the URL provided by Railway
   - Test both the talent registration form and admin dashboard
   - Verify that email notifications are working
   - Check that database operations are functioning correctly

2. **Monitor your application**:
   - Railway provides logs and metrics for your deployed application
   - You can view logs by clicking on the "Deployments" tab and selecting the latest deployment

## Step 4: Set Up Custom Domain (Optional)

1. **Add a custom domain**:
   - In your project dashboard, go to the "Settings" tab
   - Scroll down to "Domains"
   - Click "Add Domain" and enter your domain name
   - Follow the instructions to configure DNS settings for your domain

## Important Notes

1. **Railway Pricing**:
   - Railway offers a 21-day free trial
   - After the trial, you'll need to subscribe to a paid plan (starting at $5/month)
   - Billing is based on usage, so keeping your application efficient helps control costs

2. **Database Backups**:
   - Railway automatically backs up your PostgreSQL database
   - You can also create manual backups from the database dashboard

3. **Environment Variables**:
   - Never commit sensitive information like API keys to your repository
   - Always use environment variables for secrets and configuration

4. **Scaling**:
   - Railway allows you to adjust resources allocated to your application as needed
   - You can increase RAM and CPU from the project dashboard

## Troubleshooting

If you encounter issues during deployment:

1. **Check deployment logs**:
   - Go to the "Deployments" tab and view logs for the failed deployment
   - Look for error messages that can help identify the issue

2. **Verify environment variables**:
   - Make sure all required environment variables are correctly set

3. **Database connection issues**:
   - Verify that your application is using the DATABASE_URL provided by Railway
   - Check that your database schema has been properly applied

4. **Contact Railway support**:
   - Railway has excellent documentation and support if you need additional help