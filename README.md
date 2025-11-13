# JurisGen

A full-stack web application that helps startups, SMEs, and legal firms identify and manage all their legal and regulatory compliance requirements.

## Features

- **AI-Powered Compliance Checklists**: Get personalized compliance requirements based on company type, state, and industry
- **Comprehensive Coverage**: Includes registrations, filings, labor laws, tax requirements, and more
- **Smart Reminder System**: Track filing dates and deadlines with an intelligent reminder system
- **Document Generation**: Generate essential legal documents (coming soon)
- **User Authentication**: Secure email/password authentication
- **Modern Dashboard**: Clean, professional interface with sidebar navigation

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, shadcn-ui
- **Backend**: Lovable Cloud (Supabase)
- **Database**: PostgreSQL with Row Level Security
- **Authentication**: Supabase Auth
- **API**: Edge Functions for serverless backend logic

## Getting Started

### Prerequisites

- Node.js & npm installed ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating))

### Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm i

# Start the development server
npm run dev
```

## Project Structure

- `/src/pages` - Application pages (Landing, Auth, Dashboard, etc.)
- `/src/components` - Reusable React components
- `/src/components/ui` - shadcn-ui components
- `/supabase/functions` - Edge functions for backend API logic

## Deployment

Simply open [Lovable](https://lovable.dev/projects/0412d306-219d-4cfb-a4a1-95ecc1e28aee) and click on Share → Publish.

## Custom Domain

To connect a custom domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
