CREATE TABLE IF NOT EXISTS margin_settings (
    id TEXT PRIMARY KEY,
    margin_percent NUMERIC(5,2) NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);