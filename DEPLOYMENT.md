# 🚀 Pitt CSC Alumni Database - Deployment Guide

This guide will help you deploy the Pitt CSC Alumni Database to production using Docker.

## 📋 Prerequisites

- **Docker** (version 20.10+)
- **Docker Compose** (version 2.0+)
- **Domain name** (for production)
- **Email account** (for SMTP notifications)

## 🏠 Local Development Deployment

### Quick Start
```bash
# 1. Copy environment template
cp .env.production .env

# 2. Edit .env with your local values
# 3. Run deployment script
./deploy.sh
```

Your application will be available at:
- Frontend: http://localhost
- Backend API: http://localhost:8000

## 🌐 Production Deployment

### Step 1: Server Setup

**Recommended Server Specs:**
- 2+ CPU cores
- 4GB+ RAM
- 20GB+ storage
- Ubuntu 20.04+ or similar

**Install Docker:**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Add user to docker group
sudo usermod -aG docker $USER
```

### Step 2: Environment Configuration

1. **Copy the repository to your server:**
```bash
git clone <your-repository-url>
cd CSC/Alumni
```

2. **Create production environment file:**
```bash
cp .env.production .env
```

3. **Edit `.env` with your production values:**
```bash
nano .env
```

**Required Environment Variables:**

```env
# Security - CHANGE THESE!
SECRET_KEY=your-super-secure-secret-key-minimum-32-characters
ENVIRONMENT=production

# Domain Configuration
FRONTEND_HOST=https://alumni.pittcsc.org
VITE_API_URL=https://alumni.pittcsc.org/api/v1
VITE_APP_NAME=Pitt CSC Alumni Network
VITE_ENV=production

# Database (PostgreSQL)
POSTGRES_DB=alumni_db
POSTGRES_USER=alumni_user
POSTGRES_PASSWORD=your-super-secure-database-password
DATABASE_URL=postgresql://alumni_user:your-super-secure-database-password@database:5432/alumni_db

# Admin User
FIRST_SUPERUSER=admin@pittcsc.org
FIRST_SUPERUSER_PASSWORD=your-admin-password
FIRST_SUPERUSER_NAME=Admin User

# Email Configuration (Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-gmail-app-password
EMAILS_FROM_EMAIL=noreply@pittcsc.org
EMAILS_FROM_NAME=Pitt CSC Alumni Network
```

### Step 3: Deploy

```bash
# Make deploy script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

### Step 4: SSL/HTTPS Setup (Production)

For production, you'll need SSL certificates. Here are two options:

#### Option A: Using Nginx Proxy Manager (Recommended)
```bash
# Add to your docker-compose.yml
services:
  nginx-proxy-manager:
    image: 'jc21/nginx-proxy-manager:latest'
    ports:
      - '80:80'
      - '81:81'
      - '443:443'
    volumes:
      - ./data/nginx-proxy-manager:/data
      - ./letsencrypt:/etc/letsencrypt
    restart: unless-stopped
```

#### Option B: Using Certbot
```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renew
echo "0 12 * * * /usr/bin/certbot renew --quiet" | sudo crontab -
```

## 📊 Monitoring & Maintenance

### Health Checks
```bash
# Check service status
docker-compose ps

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f database

# Check application health
curl http://localhost:8000/api/v1/utils/health-check/
```

### Database Backup
```bash
# Create backup
./backup.sh

# Restore from backup
./restore.sh ./backups/alumni_db_backup_20231127_143022.sql.gz
```

### Updates
```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## 🏃‍♂️ Hosting Options

### Option 1: DigitalOcean Droplet
- **Cost:** ~$12/month (2GB RAM)
- **Setup:** Use Docker Marketplace image
- **Domain:** Point your domain to droplet IP

### Option 2: AWS EC2
- **Cost:** ~$15/month (t3.small)
- **Setup:** Use Amazon Linux 2 AMI
- **Domain:** Use Route 53 or your DNS provider

### Option 3: Railway/Render
- **Cost:** ~$5-20/month
- **Setup:** Connect GitHub repository
- **Domain:** Automatic SSL included

### Option 4: VPS Providers (Linode, Vultr, etc.)
- **Cost:** ~$10-20/month
- **Setup:** Similar to DigitalOcean

## 🔒 Security Checklist

- [ ] Changed default SECRET_KEY
- [ ] Strong database passwords
- [ ] Admin user password changed
- [ ] Firewall configured (only ports 80, 443, 22)
- [ ] SSL certificates installed
- [ ] Regular backups scheduled
- [ ] Email notifications configured
- [ ] Server monitoring setup

## 🐛 Troubleshooting

### Common Issues

**Database connection failed:**
```bash
# Check database logs
docker-compose logs database

# Verify environment variables
docker-compose exec backend env | grep DATABASE
```

**Frontend not loading:**
```bash
# Check nginx logs
docker-compose logs frontend

# Verify API URL
docker-compose exec frontend env | grep VITE_API_URL
```

**Email not working:**
```bash
# Test SMTP connection
docker-compose exec backend python -c "
import smtplib
server = smtplib.SMTP('smtp.gmail.com', 587)
server.starttls()
server.login('your-email@gmail.com', 'your-app-password')
print('Email connection successful')
"
```

### Performance Optimization

**For high traffic:**
```yaml
# In docker-compose.yml
services:
  backend:
    deploy:
      replicas: 3
    environment:
      - WORKERS=4

  frontend:
    deploy:
      replicas: 2
```

## 📞 Support

For deployment issues:
1. Check the logs: `docker-compose logs`
2. Review this guide
3. Check GitHub issues
4. Contact: admin@pittcsc.org

---

**🎉 Congratulations! Your Pitt CSC Alumni Database is now live!**