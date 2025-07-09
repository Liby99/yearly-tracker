# Optional Authentication Setup Guide

This guide will help you set up NextAuth.js authentication for the Yearly Tracker app. The app is publicly accessible, and authentication is optional for data synchronization.

## 1. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Copy from env.example
cp env.example .env.local
```

Then edit `.env.local` with your actual values:

### Required Variables:
- `NEXTAUTH_SECRET`: Generate a random string (you can use `openssl rand -base64 32`)
- `DATABASE_URL`: Your PostgreSQL database connection string

### Optional Variables (for Google OAuth):
- `GOOGLE_CLIENT_ID`: From Google Cloud Console
- `GOOGLE_CLIENT_SECRET`: From Google Cloud Console

## 2. Database Setup

### Option A: Local PostgreSQL
1. Install PostgreSQL locally
2. Create a database: `createdb yearly-tracker`
3. Update `DATABASE_URL` in `.env.local`

### Option B: Cloud Database (Recommended)
- **Vercel Postgres**: Easy integration with Vercel deployment
- **Supabase**: Free tier available
- **Railway**: Simple setup

## 3. Run Database Migrations

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# (Optional) View your database
npx prisma studio
```

## 4. Google OAuth Setup (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Secret to `.env.local`

## 5. Test the Setup

```bash
npm run dev
```

Visit `http://localhost:3000` - the app is publicly accessible. Users can sign in optionally for data sync.

### Demo Credentials
- Email: `demo@example.com`
- Password: `demo`

## 6. Production Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production:
- `NEXTAUTH_URL`: Your production URL
- `NEXTAUTH_SECRET`: Same as development
- `DATABASE_URL`: Production database URL
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: Same as development

## Features Included

✅ **Authentication Methods**:
- Email/Password (demo credentials)
- Google OAuth
- Session management

✅ **Public Access**:
- App is publicly accessible without login
- Optional authentication for data sync
- No forced redirects

✅ **User Interface**:
- Optional sign-in button in navigation
- Sync button for logged-in users
- User info display when signed in
- Session persistence

✅ **Database Integration**:
- User accounts and sessions stored in PostgreSQL
- Calendar data linked to user accounts
- Prisma ORM for type-safe database access

## Next Steps

1. **Customize the sign-in page** styling
2. **Add user registration** functionality
3. **Implement password reset** feature
4. **Add more OAuth providers** (GitHub, etc.)
5. **Create user profile** management
6. **Add data sync** between localStorage and database

## Troubleshooting

### Common Issues:
- **"Invalid credentials"**: Check demo credentials or Google OAuth setup
- **Database connection errors**: Verify `DATABASE_URL` and database is running
- **"NEXTAUTH_SECRET not set"**: Generate and set the secret in `.env.local`
- **Google OAuth errors**: Check redirect URIs and API enablement 