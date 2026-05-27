CREATE TABLE IF NOT EXISTS metals_prices_cache (
    symbol VARCHAR(50) PRIMARY KEY,
    price NUMERIC(18, 4),
    open_price NUMERIC(18, 4),
    updated_at TIMESTAMP DEFAULT NOW()
);