CREATE TABLE IF NOT EXISTS manual_prices (
  id VARCHAR(50) PRIMARY KEY,
  price_buy NUMERIC(12,2),
  price_sell NUMERIC(12,2),
  updated_at TIMESTAMP DEFAULT NOW()
);