CREATE TABLE IF NOT EXISTS favorite_locations (
                                                  id SERIAL PRIMARY KEY,
                                                  city VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
    );
