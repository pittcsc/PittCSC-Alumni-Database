# 🚀 Quick Start: Deploy to Netlify

## ⚡ Super Fast Deployment (5 minutes)

### Step 1: Deploy Frontend to Netlify

1. **Go to [netlify.com](https://netlify.com)** and login with GitHub
2. **Click "Add new site"** → "Import an existing project"
3. **Choose GitHub** and select your `Alumni` repository
4. **Configure build settings:**
   ```
   Base directory: frontend
   Build command: npm run build
   Publish directory: frontend/dist
   ```
5. **Deploy** - Your frontend will be live at `https://[random-name].netlify.app`

### Step 2: Deploy Backend to Heroku

```bash
# Install Heroku CLI if you haven't
brew install heroku/brew/heroku

# Login to Heroku
heroku login

# Navigate to backend
cd backend

# Create Heroku app
heroku create your-app-name-backend

# Add PostgreSQL database
heroku addons:create heroku-postgresql:mini

# Set environment variables
heroku config:set SECRET_KEY=$(python -c "import secrets; print(secrets.token_urlsafe(32))")
heroku config:set ENVIRONMENT=production
heroku config:set FRONTEND_HOST=https://[your-netlify-url].netlify.app
heroku config:set FIRST_SUPERUSER=admin@pittcsc.org
heroku config:set FIRST_SUPERUSER_PASSWORD=your-secure-password
heroku config:set FIRST_SUPERUSER_NAME="Admin User"

# Deploy to Heroku
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

### Step 3: Connect Frontend to Backend

1. **Copy your Heroku backend URL** (e.g., `https://your-app-backend.herokuapp.com`)
2. **In Netlify:** Go to Site Settings → Environment Variables
3. **Add environment variable:**
   ```
   Key: VITE_API_URL
   Value: https://your-app-backend.herokuapp.com/api/v1
   ```
4. **Trigger redeploy** in Netlify

## 🎉 You're Live!

- **Frontend:** `https://[your-site].netlify.app`
- **Backend:** `https://[your-app]-backend.herokuapp.com`
- **Admin Panel:** `https://[your-site].netlify.app/admin`

## 🔧 Environment Variables Checklist

### Netlify (Frontend)
```
VITE_API_URL=https://your-backend.herokuapp.com/api/v1
VITE_APP_NAME=Pitt CSC Alumni Network
VITE_ENV=production
```

### Heroku (Backend)
```
SECRET_KEY=your-32-character-secret
ENVIRONMENT=production
FRONTEND_HOST=https://your-netlify-site.netlify.app
DATABASE_URL=(automatically set by Heroku PostgreSQL)
FIRST_SUPERUSER=admin@pittcsc.org
FIRST_SUPERUSER_PASSWORD=your-password
FIRST_SUPERUSER_NAME=Admin User
```

## 🆘 Quick Fixes

**CORS Error?**
Make sure `FRONTEND_HOST` in backend matches your Netlify URL exactly.

**API Not Found?**
Check that `VITE_API_URL` in Netlify points to your Heroku backend URL with `/api/v1`.

**Build Failed?**
Ensure `Base directory` is set to `frontend` in Netlify build settings.

## 💰 Cost
- **Netlify:** Free
- **Heroku:** ~$12/month (backend + database)
- **Total:** ~$12/month

---

**That's it! Your Pitt CSC Alumni Database is now live on the internet! 🌐**