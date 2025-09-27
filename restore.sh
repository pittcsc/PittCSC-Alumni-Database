#!/bin/bash

# Pitt CSC Alumni Database Restore Script
set -e

if [ $# -eq 0 ]; then
    echo "❌ Usage: $0 <backup-file>"
    echo "Example: $0 ./backups/alumni_db_backup_20231127_143022.sql.gz"
    exit 1
fi

BACKUP_FILE=$1

if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Backup file not found: $BACKUP_FILE"
    exit 1
fi

echo "⚠️  WARNING: This will replace all data in the database!"
echo "Backup file: $BACKUP_FILE"
echo "Are you sure? (y/N)"
read -r confirmation

if [[ ! $confirmation =~ ^[Yy]$ ]]; then
    echo "❌ Restore cancelled."
    exit 1
fi

# Load environment variables
if [ -f .env ]; then
    source .env
else
    echo "❌ .env file not found. Please make sure it exists."
    exit 1
fi

echo "🗄️  Stopping application services..."
docker-compose stop backend frontend

echo "📤 Restoring database from backup..."

# Decompress if needed
if [[ $BACKUP_FILE == *.gz ]]; then
    echo "🗜️  Decompressing backup..."
    TEMP_FILE="/tmp/restore_temp.sql"
    gunzip -c "$BACKUP_FILE" > "$TEMP_FILE"
    RESTORE_FILE="$TEMP_FILE"
else
    RESTORE_FILE="$BACKUP_FILE"
fi

# Drop and recreate database
echo "🗑️  Dropping existing database..."
docker-compose exec database psql -U $POSTGRES_USER -c "DROP DATABASE IF EXISTS $POSTGRES_DB;"
docker-compose exec database psql -U $POSTGRES_USER -c "CREATE DATABASE $POSTGRES_DB;"

# Restore from backup
echo "📥 Restoring data..."
docker-compose exec -T database psql -U $POSTGRES_USER -d $POSTGRES_DB < "$RESTORE_FILE"

# Clean up temp file
if [[ $BACKUP_FILE == *.gz ]]; then
    rm -f "$TEMP_FILE"
fi

echo "🌐 Starting application services..."
docker-compose up -d backend frontend

echo "✅ Database restore completed successfully!"