-- Parallel Universe Database - E-commerce Demo Schema
-- Intentionally missing indexes for demo purposes - agents will discover optimization opportunities

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
CREATE EXTENSION IF NOT EXISTS pgvector;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table (no index on user_id - intentional for demo)
CREATE TABLE IF NOT EXISTS orders (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    total DECIMAL(10,2),
    status VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT REFERENCES orders(id),
    product_id BIGINT,
    quantity INT,
    price DECIMAL(10,2),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2),
    category VARCHAR(100),
    stock INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Optimization history table (for hybrid search feature)
CREATE TABLE IF NOT EXISTS optimization_history (
    id SERIAL PRIMARY KEY,
    problem_description TEXT NOT NULL,
    strategy VARCHAR(50),
    improvement FLOAT,
    execution_time INT,
    baseline_time INT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    embedding VECTOR(1536)
);

-- Create indexes for hybrid search
CREATE INDEX IF NOT EXISTS idx_optimization_history_bm25
    ON optimization_history
    USING GIN(to_tsvector('english', problem_description));

CREATE INDEX IF NOT EXISTS idx_optimization_history_vector
    ON optimization_history
    USING ivfflat(embedding vector_cosine_ops)
    WITH (lists = 100);

-- Comments explaining intentional design choices
COMMENT ON TABLE users IS 'User accounts - intentionally missing index on email for demo';
COMMENT ON TABLE orders IS 'Customer orders - intentionally missing index on user_id and status for demo';
COMMENT ON TABLE order_items IS 'Order line items - intentionally missing index on product_id for demo';

-- Create a view for dashboard queries (this will be slow without optimization)
CREATE OR REPLACE VIEW user_order_summary AS
SELECT
    u.id as user_id,
    u.email,
    u.name,
    COUNT(o.id) as total_orders,
    SUM(o.total) as total_spent,
    MAX(o.created_at) as last_order_date
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.email, u.name;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Reset pg_stat_statements to start fresh
SELECT pg_stat_statements_reset();

-- Display schema summary
DO $$
BEGIN
    RAISE NOTICE 'Parallel Universe Database schema created successfully!';
    RAISE NOTICE 'Tables: users, orders, order_items, products, optimization_history';
    RAISE NOTICE 'Extensions: pg_stat_statements, pgvector';
    RAISE NOTICE 'Ready for optimization testing 🚀';
END $$;
