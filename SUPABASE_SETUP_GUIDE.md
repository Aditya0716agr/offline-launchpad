# 🚀 Supabase Setup Guide for Offline Launchpad

This guide will help you set up your own Supabase instance for the offline-launchpad project.

## 📋 Prerequisites

- A Supabase account (sign up at https://supabase.com)
- Your project files ready

## 🔧 Step-by-Step Setup

### 1. Create New Supabase Project

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard
2. **Click "New Project"**
3. **Fill in project details**:
   - **Name**: `offline-launchpad`
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is perfect for development

### 2. Get Your Project Credentials

Once your project is created:

1. **Go to Settings** → **API**
2. **Copy these values**:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **anon/public key** (starts with `eyJhbGciOiJIUzI1NiIs...`)
   - **service_role key** (keep this secret!)

### 3. Update Environment Variables

1. **Open your `.env` file**
2. **Replace the values** with your new project credentials:

```env
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-public-key-here"
VITE_SUPABASE_PROJECT_ID="your-project-id"
```

### 4. Set Up Database Schema

1. **Go to SQL Editor** in your Supabase dashboard
2. **Copy the entire contents** of `scripts/setup-new-supabase.sql`
3. **Paste and run** the script
4. **Wait for completion** (should show "Database setup completed successfully! 🎉")

### 5. Create Your Founder Account

1. **Go to Authentication** → **Users** in Supabase dashboard
2. **Click "Add User"**
3. **Create a user** with:
   - **Email**: your email
   - **Password**: your password
   - **User Metadata**: 
     ```json
     {
       "full_name": "Your Name",
       "role": "founder"
     }
     ```

### 6. Seed Sample Data

1. **Go back to SQL Editor**
2. **Copy the contents** of `scripts/seed-new-supabase.sql`
3. **Paste and run** the script
4. **Verify** you see "Startups inserted successfully! 🎉"

### 7. Test Your Setup

1. **Restart your development server**:
   ```bash
   npm run dev
   ```
2. **Visit your app**: http://localhost:8080/
3. **Sign in** with your founder account
4. **Check the Explore page** - you should see all 15 startups with logos!

## 🎯 What You'll Have After Setup

- ✅ **15 sample startups** with proper logo URLs
- ✅ **11 categories** for organizing startups
- ✅ **User authentication** system
- ✅ **Voting and bookmarking** functionality
- ✅ **Comments system**
- ✅ **Admin capabilities**

## 🔍 Troubleshooting

### If you see "No startups found":
- Check that the seed script ran successfully
- Verify your founder profile was created
- Make sure the startups have `status = 'approved'`

### If logos don't load:
- Check that the logo URLs are correct (`/logos/brand-name.jpg`)
- Verify the images exist in your `public/logos/` folder
- Check browser console for 404 errors

### If authentication fails:
- Verify your environment variables are correct
- Check that the Supabase URL and keys match your project
- Make sure you're using the anon/public key, not the service role key

## 📁 File Structure

After setup, your project will have:
```
scripts/
├── setup-new-supabase.sql    # Database schema setup
├── seed-new-supabase.sql     # Sample data insertion
└── check-database.js         # Database verification script

public/
└── logos/                    # Startup logo images
    ├── blue-tokai.jpg
    ├── epigamia.jpg
    └── ... (15 total logos)
```

## 🎉 Success!

Once everything is set up, you'll have a fully functional startup launchpad with:
- User registration and authentication
- Startup listings with logos
- Voting and bookmarking
- Comments system
- Admin panel for managing startups

Your app will be running on http://localhost:8080/ with all the sample data loaded!
