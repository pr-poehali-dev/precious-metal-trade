CREATE TABLE IF NOT EXISTS usd_price_history (
    id SERIAL PRIMARY KEY,
    price NUMERIC(10, 4) NOT NULL,
    recorded_at TIMESTAMP DEFAULT NOW()
);