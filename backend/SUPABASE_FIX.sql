
-- ShopEase Database Setup and RLS Fix
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create or update users table with correct structure
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  verified BOOLEAN DEFAULT false,
  otp_code VARCHAR(10),
  otp_expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users insert (service role)" ON public.users;
DROP POLICY IF EXISTS "Users update (service role)" ON public.users;

-- Create more permissive policies for demo
CREATE POLICY "Allow user registration" ON public.users
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow user updates" ON public.users
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Create other required tables if they don't exist

-- Stores table
CREATE TABLE IF NOT EXISTS stores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  address TEXT,
  phone VARCHAR(50),
  email VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enforce unique category names to prevent duplicates
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'categories_name_key'
  ) THEN
    ALTER TABLE categories ADD CONSTRAINT categories_name_key UNIQUE (name);
  END IF;
END $$;


-- Offers table
CREATE TABLE IF NOT EXISTS offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category_id UUID REFERENCES categories(id),
  original_price DECIMAL(10,2),
  offer_price DECIMAL(10,2),
  discount_percentage INTEGER,
  image_url TEXT,
  store_id UUID REFERENCES stores(id),
  section_id VARCHAR(100),
  valid_from DATE,
  valid_until DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- QR Scans tracking
CREATE TABLE IF NOT EXISTS qr_scans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID REFERENCES stores(id),
  section_id VARCHAR(100),
  user_id UUID,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Feedback questions
CREATE TABLE IF NOT EXISTS feedback_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_slug VARCHAR(255),
  question TEXT NOT NULL,
  question_type VARCHAR(50) DEFAULT 'rating',
  order_index INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Feedback responses
CREATE TABLE IF NOT EXISTS feedback_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID REFERENCES stores(id),
  section_id VARCHAR(100),
  user_id UUID,
  question_id UUID REFERENCES feedback_questions(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  text_answer TEXT,
  overall_rating INTEGER CHECK (overall_rating >= 1 AND overall_rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sales data
CREATE TABLE IF NOT EXISTS sales_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID REFERENCES stores(id),
  product_id VARCHAR(255),
  product_name VARCHAR(255),
  quantity INTEGER,
  unit_price DECIMAL(10,2),
  total_amount DECIMAL(10,2),
  sale_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disable RLS on all tables for demo purposes
ALTER TABLE stores DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE offers DISABLE ROW LEVEL SECURITY;
ALTER TABLE qr_scans DISABLE ROW LEVEL SECURITY;
ALTER TABLE feedback_questions DISABLE ROW LEVEL SECURITY;
ALTER TABLE feedback_responses DISABLE ROW LEVEL SECURITY;
ALTER TABLE sales_data DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;


-- Remove any rows with duplicate category names keeping the newest
WITH ranked AS (
  SELECT id, name, created_at,
         ROW_NUMBER() OVER (PARTITION BY LOWER(name) ORDER BY created_at DESC, id DESC) AS rn
  FROM categories
)
DELETE FROM categories c
USING ranked r
WHERE c.id = r.id AND r.rn > 1;

-- Sample seed removed to keep database clean for production/demo
-- If you need demo data, put it in SAMPLE_DATA.sql and run manually.

-- Ensure at least some baseline categories exist (idempotent) - OPTIONAL
-- INSERT INTO categories (name, description) VALUES
-- ('Jewelry', 'Rings, necklaces, earrings and more')
-- ON CONFLICT (name) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_offers_store_id ON offers(store_id);
CREATE INDEX IF NOT EXISTS idx_offers_section_id ON offers(section_id);
CREATE INDEX IF NOT EXISTS idx_offers_category_id ON offers(category_id);
CREATE INDEX IF NOT EXISTS idx_qr_scans_store_id ON qr_scans(store_id);
CREATE INDEX IF NOT EXISTS idx_qr_scans_created_at ON qr_scans(created_at);
CREATE INDEX IF NOT EXISTS idx_feedback_responses_store_id ON feedback_responses(store_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Success message
SELECT 'ShopEase database setup completed successfully! RLS has been disabled for demo purposes.' as message;



