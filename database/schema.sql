-- Aktifkan ekstensi
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabel kategori
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    color VARCHAR(7) DEFAULT '#00E5FF',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabel titik analisis utama
CREATE TABLE analysis_points (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    tools TEXT[],
    external_link VARCHAR(500),
    thumbnail_url VARCHAR(500),
    confidence_score INTEGER DEFAULT 0,
    location GEOMETRY(POINT, 4326) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabel admin user
CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Index spasial
CREATE INDEX idx_analysis_points_location 
ON analysis_points USING GIST(location);

CREATE INDEX idx_analysis_points_category 
ON analysis_points(category_id);