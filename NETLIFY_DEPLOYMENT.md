# 🌐 Netlify Deployment Guide

This guide will help you deploy your Pitt CSC Alumni Database frontend to Netlify and backend to a separate service.

## 📋 Architecture Overview

**Frontend (Netlify):** React application with static hosting
**Backend (Separate Service):** Python FastAPI application
**Database:** PostgreSQL hosted with backend

## 🚀 Frontend Deployment to Netlify

### Option 1: GitHub Integration (Recommended)

1. **Login to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Sign up/login with your GitHub account

2. **Import from GitHub**
   - Click "Add new site" → "Import an existing project"
   - Choose "Deploy with GitHub"
   - Select your `Alumni` repository

3. **Configure Build Settings**
   ```
   Base directory: frontend
   Build command: npm run build
   Publish directory: frontend/dist
   ```

4. **Set Environment Variables**
   Go to Site Settings → Environment Variables and add:
   ```
   VITE_API_URL=https://your-backend-url.herokuapp.com/api/v1
   VITE_APP_NAME=Pitt CSC Alumni Network
   VITE_ENV=production
   ```

5. **Deploy**
   - Click "Deploy site"
   - Your site will be available at `https://amazing-name-123456.netlify.app`

### Option 2: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# From your project root
cd frontend

# Build the project
npm run build

# Deploy to Netlify
netlify deploy --prod --dir=dist
```

## 🔧 Backend Deployment Options

Since Netlify only hosts frontend, you need to deploy your backend separately:

### Option 1: Heroku (Easiest)

1. **Install Heroku CLI**
   ```bash
   # macOS
   brew tap heroku/brew && brew install heroku

   # Or download from heroku.com
   ```

2. **Create Heroku App**
   ```bash
   cd backend
   heroku create your-app-name-backend
   ```

3. **Add PostgreSQL**
   ```bash
   heroku addons:create heroku-postgresql:mini
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set SECRET_KEY=your-secret-key
   heroku config:set ENVIRONMENT=production
   heroku config:set FRONTEND_HOST=https://your-netlify-site.netlify.app
   heroku config:set FIRST_SUPERUSER=admin@pittcsc.org
   heroku config:set FIRST_SUPERUSER_PASSWORD=your-password
   heroku config:set FIRST_SUPERUSER_NAME="Admin User"
   ```

5. **Create Procfile**
   ```bash
   echo "web: uvicorn app.main:app --host 0.0.0.0 --port \$PORT" > Procfile
   ```

6. **Deploy**
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

### Option 2: Railway

1. **Go to [railway.app](https://railway.app)**
2. **Connect GitHub** and select your repository
3. **Add PostgreSQL** service
4. **Configure environment variables**
5. **Deploy automatically**

### Option 3: Render

1. **Go to [render.com](https://render.com)**
2. **Create Web Service** from GitHub
3. **Add PostgreSQL** database
4. **Set environment variables**
5. **Deploy**

## ⚙️ Environment Variables Setup

### Netlify Environment Variables

In Netlify Dashboard → Site Settings → Environment Variables:

```
VITE_API_URL=https://your-backend-domain.herokuapp.com/api/v1
VITE_APP_NAME=Pitt CSC Alumni Network
VITE_ENV=production
```

### Backend Environment Variables

For your backend service (Heroku/Railway/Render):

```
SECRET_KEY=your-32-character-secret-key
ENVIRONMENT=production
FRONTEND_HOST=https://your-netlify-site.netlify.app
DATABASE_URL=postgresql://user:pass@host:port/db
FIRST_SUPERUSER=admin@pittcsc.org
FIRST_SUPERUSER_PASSWORD=your-admin-password
FIRST_SUPERUSER_NAME=Admin User
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-email-app-password
EMAILS_FROM_EMAIL=noreply@pittcsc.org
```

## 🎯 Quick Start Commands

### Deploy Frontend to Netlify

```bash
# Method 1: Netlify CLI
cd frontend
npm run build
netlify deploy --prod --dir=dist

# Method 2: Git push (if connected to GitHub)
git add .
git commit -m "Deploy to Netlify"
git push origin main
```

### Deploy Backend to Heroku

```bash
cd backend
heroku create your-backend-name
heroku addons:create heroku-postgresql:mini
echo "web: uvicorn app.main:app --host 0.0.0.0 --port \$PORT" > Procfile
git add .
git commit -m "Deploy backend to Heroku"
git push heroku main
```

## 🔗 Connecting Frontend and Backend

1. **Deploy backend first** and get the URL
2. **Update frontend environment variables** with backend URL
3. **Redeploy frontend** with new API URL

## 🏷️ Custom Domain Setup

### Netlify Custom Domain

1. **Go to Site Settings** → Domain Management
2. **Add custom domain**
3. **Configure DNS** with your domain provider:
   ```
   Type: CNAME
   Name: www
   Value: your-site.netlify.app
   ```

### Backend Custom Domain (Optional)

Most backend services provide custom domain options in their dashboards.

## 🔧 Troubleshooting

### Common Issues

**CORS Errors:**
```python
# In backend/app/core/config.py
BACKEND_CORS_ORIGINS = [
    "https://your-netlify-site.netlify.app",
    "http://localhost:5173"  # for development
]
```

**API Not Found:**
- Verify `VITE_API_URL` in Netlify environment variables
- Check backend deployment logs
- Ensure backend is running and accessible

**Build Failures:**
```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 💰 Cost Estimate

**Netlify (Frontend):**
- Free tier: 100GB bandwidth, 300 build minutes
- Pro: $19/month for more features

**Backend Options:**
- **Heroku:** $7/month (Eco dyno) + $5/month (PostgreSQL)
- **Railway:** $5/month + database costs
- **Render:** $7/month + database costs

**Total Monthly Cost: ~$12-25/month**

## 🎉 Success Checklist

- [ ] Frontend deployed to Netlify
- [ ] Backend deployed to Heroku/Railway/Render
- [ ] Database connected and migrated
- [ ] Environment variables configured
- [ ] Custom domain setup (optional)
- [ ] SSL certificates active
- [ ] CORS configured properly
- [ ] Admin user created

## 📞 Next Steps

1. **Deploy backend** using one of the options above
2. **Get backend URL** from deployment service
3. **Update Netlify environment variables** with backend URL
4. **Test the application** end-to-end
5. **Set up custom domain** (optional)

Your **Pitt CSC Alumni Database** will be live and accessible worldwide! 🌐