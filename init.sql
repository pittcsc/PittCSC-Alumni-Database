-- Initial database setup for Pitt CSC Alumni Database
-- This file is automatically executed when the PostgreSQL container starts

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- The application will handle table creation through SQLModel/SQLAlchemy
-- This file is here for any future manual database setup if needed

-- Set timezone
SET timezone = 'UTC';

-- Log the initialization
SELECT 'Database initialized successfully' as status;