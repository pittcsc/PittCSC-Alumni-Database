#!/bin/bash
set -e

echo "Initializing database..."
python -m app.initial_data

echo "Starting application..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 1
