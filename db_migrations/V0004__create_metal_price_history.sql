CREATE TABLE IF NOT EXISTS metal_price_history (
    id SERIAL PRIMARY KEY,
    symbol VARCHAR(50) NOT NULL,
    price NUMERIC(18, 4) NOT NULL,
    recorded_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_metal_price_history_symbol ON metal_price_history (symbol, recorded_at DESC);