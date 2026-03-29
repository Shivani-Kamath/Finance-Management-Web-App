# 🚀 Deployment Guide

## Pre-Deployment Checklist

### Code Review
- [ ] All console errors resolved
- [ ] No `console.log()` statements in production code
- [ ] Sensitive data removed from code
- [ ] All features tested locally
- [ ] Dark mode works on all components
- [ ] Responsive design verified on mobile

### Security Review
- [ ] `.env` files NOT in git
- [ ] All passwords hashed with bcrypt
- [ ] CORS properly configured
- [ ] JWT secrets are strong (>20 chars)
- [ ] No sensitive data in console or localStorage
- [ ] API validation in place
- [ ] Rate limiting configured (recommended)

### Backend Preparation
- [ ] MongoDB Atlas account created or hosting planned
- [ ] Node.js compatible with hosting provider
- [ ] All environment variables documented
- [ ] Error handling tested
- [ ] Database backups configured

### Frontend Preparation
- [ ] Build optimized: `npm run build` tested locally
- [ ] API URL points to production backend
- [ ] No hardcoded localhost URLs
- [ ] Assets compressed and optimized
- [ ] Third-party scripts loaded safely

---

## Backend Deployment (Node.js + MongoDB Atlas)

### Option 1: Deploy to Render.com (Recommended for Beginners)

#### Step 1: Prepare Backend
```bash
cd backend

# Ensure all dependencies are in package.json
npm install

# Remove dev dependencies if only needed locally
# Keep production dependencies only
```

#### Step 2: Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub account (easier deployment)
3. Connect your GitHub repository

#### Step 3: Create New Web Service
1. Click "New +" → "Web Service"
2. Select your Git repository
3. Configure:
   - **Name:** expense-tracker-backend
   - **Environment:** Node
   - **Region:** Choose nearest to users
   - **Build Command:** `npm install`
   - **Start Command:** `node index.js`

#### Step 4: Add Environment Variables
In Render dashboard → Environment:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/expense_tracker
JWT_SECRET=your_super_secret_jwt_key_min_20_chars
REFRESH_JWT_SECRET=another_super_secret_key_min_20_chars
PORT=8080
FRONTEND_URL=https://your-frontend-url.com
NODE_ENV=production
```

#### Step 5: Deploy
- Click "Deploy"
- Wait for build to complete
- Check "Logs" for errors
- Note your deployed URL: `https://expense-tracker-backend.onrender.com`

---

### Option 2: Deploy to Railway.app (Alternative)

#### Step 1: Create Railway Account
1. Visit [railway.app](https://railway.app)
2. Sign up with GitHub

#### Step 2: Create New Project
1. Click "New Project"
2. Select "GitHub Repo"
3. Connect your expense tracker repo

#### Step 3: Configure Variables
1. Create `.env` file with production values
2. Railway will read and use these

#### Step 4: Deploy
- Railway auto-detects Node.js
- Auto-builds and deploys on git push

---

### Option 3: Deploy to DigitalOcean App Platform

#### Step 1: Create DigitalOcean Account
1. Visit [digitalocean.com](https://digitalocean.com)
2. Create account

#### Step 2: Create App
1. Click "Create" → "Apps"
2. Connect GitHub repository
3. Select `backend` folder as deployment path

#### Step 3: Set Environment
Add variables same as above

#### Step 4: Deploy
- DigitalOcean builds and deploys automatically

---

## Frontend Deployment (React)

### Option 1: Deploy to Vercel (Recommended)

#### Step 1: Create Vercel Account
1. Visit [vercel.com](https://vercel.com)
2. Sign up with GitHub

#### Step 2: Import Project
1. Click "Import Project"
2. Select your Git repository
3. Select `frontend` folder

#### Step 3: Configure Environment
1. Add environment variable:
```
REACT_APP_API_URL=https://your-backend-url.onrender.com
```
(Use actual backend URL from deployment above)

#### Step 4: Deploy
- Click "Deploy"
- Vercel builds and auto-deploys on git push
- Get your frontend URL: `https://expense-tracker.vercel.app`

---

### Option 2: Deploy to Netlify (Alternative)

#### Step 1: Create Netlify Account
1. Visit [netlify.com](https://netlify.com)
2. Sign up with GitHub

#### Step 2: Connect Repository
1. Click "New site from Git"
2. Select your GitHub repo
3. Click "Connect"

#### Step 3: Configure Build
- **Build command:** `npm run build`
- **Publish directory:** `build`
- Add environment variable:
```
REACT_APP_API_URL=https://your-backend-url.com
```

#### Step 4: Deploy
- Click "Deploy site"
- Netlify builds automatically

---

### Option 3: Deploy to GitHub Pages (Free)

#### Prerequisites
- Repo must be public
- Limited to static content and 1GB storage

#### Step 1: Update Package.json
In `frontend/package.json`:
```json
"homepage": "https://yourusername.github.io/expense-tracker"
```

#### Step 2: Add Deploy Script
```bash
npm install --save-dev gh-pages
```

Add to `package.json` scripts:
```json
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}
```

#### Step 3: Deploy
```bash
npm run deploy
```

---

## MongoDB Setup (Atlas - Cloud)

### Step 1: Create Account
1. Visit [mongodb.com/atlas](https://mongodb.com/atlas)
2. Click "Start Free"
3. Sign up

### Step 2: Create Cluster
1. Click "Create"
2. Select "Serverless" or "Dedicated" (Serverless free for testing)
3. Choose region nearest to most users
4. Click "Create"

### Step 3: Setup Database User
1. Go to "Database Access"
2. Click "Add New Database User"
3. Create username and password
4. **Save this password - you'll need it only once**
5. Click "Create User"

### Step 4: Setup IP Whitelist
1. Go to "Network Access"
2. Click "Add IP Address"
3. Add `0.0.0.0/0` (allows all, or specific IP)
4. Click "Confirm"

### Step 5: Get Connection String
1. Click "Databases" → Your Cluster
2. Click "Connect"
3. Select "Drivers" → "Node.js"
4. Copy connection string (URI)
5. Replace `<username>`, `<password>`, and `myFirstDatabase`

### Step 6: Use in Backend
In `backend/.env`:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/expense_tracker
```

---

## Post-Deployment Testing

### 1. Backend Health Check
```bash
curl https://your-backend-url/auth/login

Expected: 
{
  "success": false,
  "message": "All fields are required"
}
```

### 2. Frontend Load Test
1. Visit frontend URL
2. Should load login page without errors
3. Check browser console: no CORS errors

### 3. Full Flow Test
1. Sign up with new account
2. Log in
3. Add an expense
4. View analytics
5. Toggle dark mode
6. Verify all features work

### 4. Network Check
1. Open Developer Tools (F12)
2. Go to Network tab
3. Refresh page
4. Check API calls are to production URL
5. No calls to localhost

---

## Monitoring & Maintenance

### Setting Up Logging
```bash
# Backend - consider using service like LogRocket or Sentry
npm install sentry-node

# Then in index.js
import Sentry from '@sentry/node';
Sentry.init({ dsn: 'your-sentry-dsn' });
```

### Monitor Performance
1. **Render/Railway:** Check Dashboard for CPU/Memory usage
2. **Vercel/Netlify:** Check Analytics for speed metrics
3. **MongoDB Atlas:** Monitor in Cluster → Metrics

### Database Maintenance
1. Set up automatic backups in Atlas
2. Monitor database storage usage
3. Delete old test data periodically

### Error Monitoring
```bash
# Create alerts for errors
# In Render: Settings → Notifications
# In Vercel: Settings → Monitoring
```

---

## Scaling (When Your App Grows)

### Backend Scaling
1. **Switch from Serverless to Dedicated** MongoDB cluster
2. **Add caching:** Implement Redis for frequently accessed data
3. **Database optimization:** Add indexes to frequently queried fields
4. **Load balancing:** Upgrade to paid Render/Railway plan

### Frontend Scaling
1. **Code splitting:** Lazy load components
2. **Image optimization:** Compress images before upload
3. **CDN:** Already handled by Vercel/Netlify
4. **Service Worker:** Add PWA capabilities

---

## Security Hardening for Production

### Backend
```javascript
// Add rate limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Add HELMET for headers
const helmet = require('helmet');
app.use(helmet());

// Sanitize inputs
const mongoSanitize = require('express-mongo-sanitize');
app.use(mongoSanitize());
```

### Frontend
```javascript
// Use HTTPS only
// Implement Content Security Policy
// Never store sensitive data in localStorage
// Regular dependency updates
```

---

## Environment Variables Checklist

### Backend (.env)
```
✅ MONGO_URI - Production MongoDB Atlas URI
✅ JWT_SECRET - Strong random string (>20 chars)
✅ REFRESH_JWT_SECRET - Another strong random string
✅ FRONTEND_URL - Production frontend URL
✅ PORT - Should be 8080 or provided by host
✅ NODE_ENV - Set to "production"
```

### Frontend (.env)
```
✅ REACT_APP_API_URL - Production backend URL
```

**⚠️ NEVER COMMIT THESE FILES TO GIT**

Add to `.gitignore`:
```
.env
.env.local
.env.*.local
```

---

## Troubleshooting Deployment Issues

| Issue | Solution |
|-------|----------|
| CORS errors | Check FRONTEND_URL in backend .env |
| 404 on API calls | Verify backend URL in frontend .env |
| Database connection fails | Check IP whitelisting in MongoDB Atlas |
| Deploy fails | Check logs, ensure node_modules not in git |
| Page shows blank | Check browser console for JS errors |
| Slow performance | Check database indexes, consider caching |

---

## Rollback Plan

If something goes wrong in production:

### Vercel/Netlify
1. Go to Deployments
2. Find previous successful deployment
3. Click "Promote to Production"

### Render/Railway
1. Go to Logs
2. Find last working commit
3. Click "Rollback"

---

## Cost Estimates (Monthly)

### Minimal Setup (Free Tier)
- Render Web Service: Free
- Vercel: Free
- MongoDB Atlas: Free (500MB)
- **Total: $0**

### Small App (< 100 users)
- Render Web Service (Starter): $7
- Vercel Pro: $20
- MongoDB Atlas (Shared M10): $57
- **Total: ~$84/month**

### Medium App (100-1000 users)
- Render Web Service (Standard): $19
- Vercel Pro: $20
- MongoDB Atlas (Dedicated M30): $200+
- **Total: $240+/month**

---

## Domain Setup (Optional)

### Connect Custom Domain
1. **Render/Vercel:** Paste domain nameservers
2. **MongoDB Atlas:** No domain needed
3. **DNS Provider:** Point to hosting provider

Example for Vercel:
```
Nameservers from Vercel:
1. ns1.vercel-dns.com
2. ns2.vercel-dns.com
```

---

## Final Checklist Before Going Live

- [ ] All tests passing
- [ ] No console errors
- [ ] Performance acceptable
- [ ] Database backups enabled
- [ ] Error monitoring setup
- [ ] Logging configured
- [ ] Environment variables set correctly
- [ ] CORS properly configured
- [ ] HTTPS enabled everywhere
- [ ] SSL certificate valid
- [ ] Custom domain working (if used)
- [ ] Email verification ready (optional)
- [ ] Backup and recovery plan created

---

## Next Steps

1. **Day 1:** Deploy backend and test API
2. **Day 2:** Deploy frontend and test end-to-end
3. **Week 1:** Monitor logs for errors
4. **Week 2:** Optimize performance if needed
5. **Month 1:** Review user feedback and make improvements

---

**Congratulations! Your app is now live! 🎉**

Share your app URL and get feedback from users!

---

## Support Resources

- [Render Docs](https://render.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)
- [React Production Build](https://react.dev/learn/optimizing-performance)

---

**Ready to deploy? Let's make it happen! 🚀**
