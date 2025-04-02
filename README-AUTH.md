# Electro-Shop Supabase Authentication Setup

This document explains how to set up Supabase authentication for the Electro-Shop application.

## Prerequisites

1. A Supabase account (https://supabase.com)
2. A Supabase project created for Electro-Shop
3. The Supabase URL and API Key (from your project's API settings)

## Environment Variables

Create or update your `.env` file with the following variables:

```
VITE_SUPABASE_URL=https://your-supabase-project-url.supabase.co
VITE_SUPABASE_KEY=your-supabase-anon-key
```

## Database Setup

You need to set up the database schema correctly. You can run the SQL commands in the Supabase SQL Editor:

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Create a new query and paste the contents of the `supabase-schema.sql` file
4. Run the query to create the necessary tables and policies

## Authentication Features

This implementation provides:

1. **User Registration**: New users can sign up with email and password
2. **User Login**: Existing users can log in securely
3. **Profile Management**: Users can view and update their profile information
4. **Order Association**: Orders are linked to the user who created them
5. **Security**: Row Level Security ensures users can only access their own data

## How Authentication Works

1. **Registration Flow**:

   - User enters email, password, and full name
   - Account is created in Supabase Auth
   - User profile is created in the `users` table
   - User is automatically logged in

2. **Login Flow**:

   - User enters email and password
   - Supabase verifies credentials
   - User session is established
   - User profile is loaded from the database

3. **Session Management**:

   - Sessions are maintained by Supabase
   - Application checks for existing sessions on startup
   - Session token is stored securely in the browser
   - User profile is loaded into Redux state

4. **User-Specific Data**:
   - Orders created by a user are linked to their user ID
   - Row Level Security (RLS) ensures users can only see their own orders
   - Profile page displays user-specific information

## User Table Structure

The `users` table contains:

- `id`: UUID (links to Supabase Auth)
- `full_name`: Text (user's full name)
- `email`: Text (user's email address)
- `phone`: Text (optional phone number)
- `address`: Text (optional address)
- `created_at`: Timestamp (when account was created)
- `updated_at`: Timestamp (when profile was last updated)

## Testing Authentication

To test the authentication system:

1. Register a new account with email, password, and name
2. Log out and log back in with the same credentials
3. Update profile information and verify it saves
4. Create orders while logged in and check they appear in your order history
5. Log in with a different account to verify each user only sees their own orders
