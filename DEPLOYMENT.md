# Deploying Footprint Talent System

This project can be deployed on Railway.app, which offers a 21-day free trial followed by affordable paid plans starting at $5/month.

## Deployment Guides

Comprehensive deployment guides are available in the `deployment-guides` directory:

1. Start by reading [deployment-guides/index.md](./deployment-guides/index.md) for an overview
2. For quick deployment, follow the [Railway Quickstart Guide](./deployment-guides/railway-quickstart.md)
3. For detailed instructions, see the [Complete Railway Deployment Guide](./deployment-guides/railway-deployment-guide.md)

## Project Preparation

Before deploying, prepare your project by:

1. Downloading the project files from Replit
2. Following the [GitHub Repository Checklist](./deployment-guides/github-repository-checklist.md)
3. Setting up required environment variables:
   - `DATABASE_URL`: PostgreSQL connection string (provided by Railway)
   - `SENDGRID_API_KEY`: Your SendGrid API key
   - `EMAIL_FROM`: Your verified sender email (ahsanglobalbusiness@gmail.com)

## Database Setup

For database setup instructions, see the [Database Migration Guide](./deployment-guides/database-migration-guide.md).

## Support

If you encounter any issues during deployment, refer to the troubleshooting sections in the relevant guides or consult Railway's official documentation at [docs.railway.app](https://docs.railway.app/).