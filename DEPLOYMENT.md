# ShopEase Deployment Guide

This guide covers deploying ShopEase to production environments with recommended platforms and configurations.

## 🏗 Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   (Vercel)      │◄──►│   (Render)      │◄──►│  (Supabase)     │
│   Next.js       │    │   Express.js    │    │  PostgreSQL     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🗄 Database Setup (Supabase)

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note down your project URL and API keys

### 2. Database Schema
Run the following SQL in Supabase SQL Editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Stores table
CREATE TABLE stores (
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
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Offers table
CREATE TABLE offers (
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
CREATE TABLE qr_scans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID REFERENCES stores(id),
  section_id VARCHAR(100),
  user_id UUID,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Feedback questions
CREATE TABLE feedback_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_slug VARCHAR(255),
  question TEXT NOT NULL,
  question_type VARCHAR(50) DEFAULT 'rating', -- 'rating' or 'text'
  order_index INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Feedback responses
CREATE TABLE feedback_responses (
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
CREATE TABLE sales_data (
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

-- Users table (for customer data)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample categories
INSERT INTO categories (name, description) VALUES
('Jewelry', 'Rings, necklaces, earrings and more'),
('Fashion', 'Clothing and accessories'),
('Kids', 'Children''s products and toys'),
('Electronics', 'Gadgets and electronic devices'),
('Home Decor', 'Furniture and home accessories'),
('Sports', 'Sports equipment and activewear'),
('Beauty', 'Cosmetics and personal care');

-- Insert sample feedback questions
INSERT INTO feedback_questions (store_slug, question, question_type, order_index) VALUES
('demo-store', 'How would you rate the product quality?', 'rating', 1),
('demo-store', 'How satisfied are you with our customer service?', 'rating', 2),
('demo-store', 'Would you recommend our store to friends?', 'rating', 3),
('demo-store', 'How easy was it to find what you were looking for?', 'rating', 4),
('demo-store', 'Any additional comments or suggestions?', 'text', 5);
```

### 3. Row Level Security (RLS)
Enable RLS for production:

```sql
-- Enable RLS on all tables
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_data ENABLE ROW LEVEL SECURITY;

-- Create policies (example for offers table)
CREATE POLICY "Public offers are viewable by everyone" ON offers
  FOR SELECT USING (is_active = true);

CREATE POLICY "Store managers can manage their offers" ON offers
  FOR ALL USING (auth.uid() IN (
    SELECT user_id FROM store_managers WHERE store_id = offers.store_id
  ));
```

## 🚀 Backend Deployment (Render)

### 1. Prepare for Deployment
Create `backend/.env.production`:
```env
NODE_ENV=production
SUPABASE_URL=your_production_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
CORS_ORIGIN=https://your-frontend-domain.vercel.app
PORT=10000
```

### 2. Deploy to Render
1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Configure build and start commands:
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
4. Add environment variables from `.env.production`
5. Deploy

### 3. Alternative: Railway Deployment
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
cd backend
railway deploy
```

## 🌐 Frontend Deployment (Vercel)

### 1. Prepare Environment Variables
Create `frontend/.env.production`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
NEXT_PUBLIC_API_URL=https://your-backend-url.render.com
```

### 2. Deploy to Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel --prod
```

### 3. Configure Vercel Project
1. Go to Vercel dashboard
2. Add environment variables
3. Configure custom domain (optional)
4. Enable automatic deployments from GitHub

## 🔧 Production Configuration

### 1. Security Headers
Add to `frontend/next.config.js`:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
```

### 2. Backend Security
Update `backend/server.js`:
```javascript
// Add security middleware
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);
```

### 3. Database Optimization
```sql
-- Add indexes for better performance
CREATE INDEX idx_offers_store_id ON offers(store_id);
CREATE INDEX idx_offers_section_id ON offers(section_id);
CREATE INDEX idx_offers_category_id ON offers(category_id);
CREATE INDEX idx_qr_scans_store_id ON qr_scans(store_id);
CREATE INDEX idx_qr_scans_created_at ON qr_scans(created_at);
CREATE INDEX idx_feedback_responses_store_id ON feedback_responses(store_id);
```

## 📊 Monitoring & Analytics

### 1. Application Monitoring
- **Frontend**: Vercel Analytics
- **Backend**: Render metrics or custom monitoring
- **Database**: Supabase dashboard

### 2. Error Tracking
Add Sentry for error tracking:
```bash
npm install @sentry/nextjs @sentry/node
```

### 3. Performance Monitoring
- Core Web Vitals tracking
- API response time monitoring
- Database query performance

## 🔄 CI/CD Pipeline

### 1. GitHub Actions
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: ./frontend

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Render
        # Add Render deployment action
```

## 🧪 Testing in Production

### 1. Health Checks
- Frontend: Check main pages load correctly
- Backend: Test API endpoints
- Database: Verify connections and queries

### 2. QR Code Testing
- Generate test QR codes
- Verify scanning works on mobile devices
- Test section-specific routing

### 3. Performance Testing
- Load testing with tools like Artillery
- Mobile performance testing
- Database performance under load

## 🔐 Security Checklist

- [ ] Environment variables secured
- [ ] HTTPS enabled on all domains
- [ ] CORS properly configured
- [ ] Rate limiting implemented
- [ ] Input validation on all endpoints
- [ ] SQL injection protection
- [ ] XSS protection enabled
- [ ] Authentication tokens secured
- [ ] File upload restrictions
- [ ] Error messages don't leak sensitive info

## 📈 Scaling Considerations

### 1. Database Scaling
- Connection pooling
- Read replicas for analytics
- Database indexing optimization

### 2. Backend Scaling
- Horizontal scaling with load balancers
- Caching with Redis
- CDN for static assets

### 3. Frontend Optimization
- Image optimization
- Code splitting
- Service worker for offline support

## 🆘 Troubleshooting

### Common Issues
1. **CORS errors**: Check CORS_ORIGIN environment variable
2. **Database connection**: Verify Supabase credentials
3. **QR codes not working**: Check URL generation logic
4. **File uploads failing**: Verify Multer configuration

### Debugging Tools
- Vercel function logs
- Render application logs
- Supabase dashboard logs
- Browser developer tools

---

For additional support, refer to the main README.md or create an issue in the repository.
