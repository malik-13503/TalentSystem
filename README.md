# Footprint Advertising Solutions LLC - Talent Management System

A modern Talent Registration and Management System designed for Footprint Advertising Solutions LLC to streamline the onboarding process for talents and efficiently manage talent profiles.

## Features

- **Talent Registration**: Comprehensive registration form collecting personal information, professional details, and required documents
- **Admin Dashboard**: Powerful dashboard for company representatives to manage talent data
- **Talent Presentations**: Generate professional presentations of talents' profiles for clients
- **Document Management**: Upload and manage talent documents with expiry dates
- **Email Notifications**: Automated email confirmations to talents and notifications to admins

## Tech Stack

- **Frontend**: React with TypeScript, Tailwind CSS, Shadcn UI
- **Backend**: Node.js, Express
- **Database**: PostgreSQL with Drizzle ORM
- **Email**: SendGrid integration
- **Authentication**: Custom authentication system

## Getting Started

### Prerequisites

- Node.js (v16+)
- PostgreSQL database
- SendGrid API key (for email functionality)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/footprint-talent-system.git
   cd footprint-talent-system
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/footprint_talent
   SENDGRID_API_KEY=your_sendgrid_api_key
   EMAIL_FROM=your_verified_sender_email
   ```

4. Push schema to database:
   ```
   npm run db:push
   ```

5. Start the development server:
   ```
   npm run dev
   ```

## Deployment

This application can be deployed on various platforms:

- Railway.app (recommended)
- Render
- Fly.io
- Replit

## Admin Access

Default admin credentials:
- Username: admin
- Password: admin123

*Note: Change these credentials in production.*

## License

[MIT License](LICENSE)