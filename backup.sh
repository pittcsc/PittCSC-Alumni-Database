#!/bin/bash

# Pitt CSC Alumni Database Backup Script
set -e

BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="alumni_db_backup_${TIMESTAMP}.sql"

echo "📦 Starting database backup..."

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Load environment variables
if [ -f .env ]; then
    source .env
else
    echo "❌ .env file not found. Please make sure it exists."
    exit 1
fi

# Create database backup
echo "🗄️  Creating backup of database..."
docker-compose exec -T database pg_dump -U $POSTGRES_USER -d $POSTGRES_DB > "$BACKUP_DIR/$BACKUP_FILE"

# Compress backup
echo "🗜️  Compressing backup..."
gzip "$BACKUP_DIR/$BACKUP_FILE"

echo "✅ Backup completed: $BACKUP_DIR/${BACKUP_FILE}.gz"

# Clean up old backups (keep last 7 days)
echo "🧹 Cleaning up old backups..."
find $BACKUP_DIR -name "alumni_db_backup_*.sql.gz" -mtime +7 -delete

echo "📊 Backup summary:"
ls -lh $BACKUP_DIR/alumni_db_backup_*.sql.gz | tail -5