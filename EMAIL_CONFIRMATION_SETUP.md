# Email Confirmation Setup Guide

## Overview
The email confirmation flow has been implemented for user signup. Here's how it works:

1. **User signs up** → Gets redirected to `/email-confirmation` page with "Check your email" message
2. **User clicks confirmation link in email** → Gets redirected to `/email-confirmation?token=...&type=signup`
3. **Email gets confirmed** → User sees success message and gets redirected to homepage

## Files Modified

### New Files
- `src/pages/EmailConfirmation.tsx` - Email confirmation page that handles both the "check email" state and actual confirmation

### Modified Files
- `src/App.tsx` - Added route for `/email-confirmation`
- `src/components/auth/AuthModal.tsx` - Updated signup flow to redirect to confirmation page
- `src/pages/Signup.tsx` - Updated signup flow to redirect to confirmation page
- `src/lib/auth.ts` - Added `emailRedirectTo` option to signup
- `src/integrations/supabase/client.ts` - Added `redirectTo` configuration

## Supabase Configuration Required

To make this work properly, you need to configure your Supabase project:

### 1. Email Templates
In your Supabase dashboard:
1. Go to Authentication → Email Templates
2. Update the "Confirm signup" template to include the correct redirect URL
3. The confirmation link should redirect to: `{SITE_URL}/email-confirmation`

### 2. Site URL Configuration
In your Supabase dashboard:
1. Go to Authentication → URL Configuration
2. Set the Site URL to your production domain (e.g., `https://yourdomain.com`)
3. Add your local development URL to Redirect URLs (e.g., `http://localhost:5173/email-confirmation`)

### 3. Email Settings
Make sure email confirmation is enabled:
1. Go to Authentication → Settings
2. Enable "Enable email confirmations"
3. Configure your email provider (SMTP settings)

## Testing the Flow

1. **Sign up a new user** - Should redirect to `/email-confirmation`
2. **Check email** - Should receive confirmation email
3. **Click confirmation link** - Should redirect to `/email-confirmation` with success message
4. **Auto-redirect** - Should redirect to homepage after 2 seconds

## Features Included

- ✅ Email sent confirmation page
- ✅ Email confirmation handling with token verification
- ✅ Success/error states with appropriate messaging
- ✅ Resend confirmation email functionality
- ✅ Auto-redirect to homepage after successful confirmation
- ✅ Proper error handling and user feedback
- ✅ Loading states and animations
- ✅ Responsive design matching the app's theme

## Vercel Configuration

For the email confirmation to work on Vercel, you need to configure client-side routing. The `vercel.json` file has been created with the proper configuration:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This ensures that all routes (including `/email-confirmation`) are handled by the React app instead of returning 404 errors.

## Environment Variables

Make sure your `.env` file has the correct Supabase configuration:
```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
VITE_SITE_URL=https://www.knowfounder.online
```

## Supabase Dashboard Configuration

You also need to configure your Supabase project to use the correct redirect URLs:

1. **Go to your Supabase dashboard** → Authentication → URL Configuration
2. **Set Site URL** to: `https://www.knowfounder.online`
3. **Add Redirect URLs**:
   - `https://www.knowfounder.online/email-confirmation`
   - `http://localhost:8080/email-confirmation` (for development)

## Deployment Steps

1. **Add environment variable** `VITE_SITE_URL` to your Vercel project with value: `https://www.knowfounder.online`
2. **Commit and push** all changes to your repository
3. **Redeploy** your Vercel application
4. **Test** the signup flow on the production site

## Troubleshooting

If email confirmation still redirects to localhost:
1. Check that `VITE_SITE_URL` is set correctly in Vercel environment variables
2. Verify Supabase URL Configuration has your production domain
3. Clear browser cache and try again
