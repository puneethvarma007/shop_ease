# ShopEase Backend Troubleshooting Guide

## 🚨 Row Level Security (RLS) Error Fix

### Error Message
```
{
  "error": "new row violates row-level security policy for table \"users\"",
  "code": "42501"
}
```

### ✅ Your Schema is Already Set Up!

Great news! You already have a comprehensive database schema with proper RLS policies. The backend has been updated to work with your schema structure.

### If You're Still Getting RLS Errors:

1. **Verify Your Backend Environment**
   Make sure you're using the **SERVICE_ROLE_KEY** (not the anon key) in your backend `.env`:
   ```env
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

2. **Add Sample Data**
   Run the sample data script to populate your database:
   ```sql
   -- Copy and paste the content from SAMPLE_DATA.sql
   -- This will create a demo store with offers and sample data
   ```

### Production Fix (For Live Deployment)

For production environments, you should keep RLS enabled and create proper policies:

```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow public registration
CREATE POLICY "Allow user registration" ON users
  FOR INSERT 
  WITH CHECK (true);

-- Allow users to read their own data
CREATE POLICY "Users can read own data" ON users
  FOR SELECT 
  USING (auth.uid()::text = id::text);

-- Allow users to update their own data
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE 
  USING (auth.uid()::text = id::text)
  WITH CHECK (auth.uid()::text = id::text);
```

## 🔧 Common Backend Issues

### 1. CORS Errors
**Error**: `Access to fetch at 'http://localhost:5000/api/...' from origin 'http://localhost:3000' has been blocked by CORS policy`

**Fix**: Check your backend `.env` file:
```env
CORS_ORIGIN=http://localhost:3000
```

### 2. Supabase Connection Issues
**Error**: `Invalid API key` or `Project not found`

**Fix**: Verify your `.env` file:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. File Upload Issues
**Error**: `Cannot read properties of undefined (reading 'filename')`

**Fix**: Ensure you're sending files with the correct form field name:
```javascript
// Frontend
const formData = new FormData();
formData.append('file', selectedFile);
```

### 4. Database Table Not Found
**Error**: `relation "users" does not exist`

**Fix**: Run the complete database setup script in `SUPABASE_FIX.sql`

## 🚀 Environment Setup Checklist

### Backend Environment Variables
Create `backend/.env`:
```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Server Configuration
PORT=5000
CORS_ORIGIN=http://localhost:3000
NODE_ENV=development
```

### Frontend Environment Variables
Create `frontend/.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## 🔍 Debugging Steps

### 1. Check Backend Logs
```bash
cd backend
npm run dev
# Look for any error messages in the console
```

### 2. Test API Endpoints
```bash
# Test signup endpoint
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","phone":"1234567890"}'
```

### 3. Check Database Connection
```bash
# In your backend console, you should see:
# "Connected to Supabase successfully"
```

### 4. Verify Table Structure
In Supabase SQL Editor:
```sql
-- Check if users table exists and has correct structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users';
```

## 📊 Database Schema Verification

Run this query in Supabase to verify all tables exist:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;
```

Expected tables:
- categories
- feedback_questions
- feedback_responses
- offers
- qr_scans
- sales_data
- stores
- users

## 🛠 Development Workflow

1. **Start Backend**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Start Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Test Registration Flow**
   - Go to http://localhost:3000
   - Navigate to sign-up page
   - Fill in the form
   - Use OTP: 123456

## 🆘 Still Having Issues?

### Check These Common Mistakes:

1. **Wrong Supabase Keys**: Make sure you're using the SERVICE_ROLE_KEY in backend, not the anon key
2. **Port Conflicts**: Ensure ports 3000 and 5000 are available
3. **Node Version**: Use Node.js 18+ for best compatibility
4. **Case Sensitivity**: Database table and column names are case-sensitive

### Get Help:

1. Check the browser console for frontend errors
2. Check the terminal console for backend errors
3. Check Supabase logs in the dashboard
4. Verify all environment variables are set correctly

### Quick Test Commands:

```bash
# Test if backend is running
curl http://localhost:5000/api/health

# Test if frontend can reach backend
# (Check browser network tab when making requests)
```

## ✅ Success Indicators

When everything is working correctly, you should see:

1. **Backend Console**: "Server running on port 5000" and "Connected to Supabase successfully"
2. **Frontend**: No CORS errors in browser console
3. **Registration**: Users can sign up and verify with OTP 123456
4. **Database**: New user records appear in Supabase users table

---

If you're still experiencing issues after following this guide, the problem might be specific to your Supabase project configuration. Double-check your project URL and API keys in the Supabase dashboard.
