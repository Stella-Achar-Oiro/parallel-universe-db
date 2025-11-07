-- Parallel Universe Database - Seed Data
-- Generates realistic test data for e-commerce demo

-- Seed users (100,000 users)
INSERT INTO users (email, name, created_at)
SELECT
    'user' || i || '@' || (ARRAY['gmail.com', 'yahoo.com', 'outlook.com', 'example.com'])[1 + (i % 4)],
    'User ' || i,
    NOW() - (random() * INTERVAL '365 days')
FROM generate_series(1, 100000) i
ON CONFLICT DO NOTHING;

-- Seed products (1,000 products)
INSERT INTO products (name, description, price, category, stock, created_at)
SELECT
    'Product ' || i,
    'Description for product ' || i,
    ROUND((random() * 1000 + 10)::numeric, 2),
    (ARRAY['Electronics', 'Clothing', 'Books', 'Home', 'Sports'])[1 + (i % 5)],
    FLOOR(random() * 1000)::INT,
    NOW() - (random() * INTERVAL '730 days')
FROM generate_series(1, 1000) i
ON CONFLICT DO NOTHING;

-- Seed orders (500,000 orders)
INSERT INTO orders (user_id, total, status, created_at)
SELECT
    FLOOR(random() * 100000 + 1)::BIGINT,
    ROUND((random() * 500 + 10)::numeric, 2),
    (ARRAY['pending', 'processing', 'shipped', 'delivered', 'cancelled'])[1 + (i % 5)],
    NOW() - (random() * INTERVAL '180 days')
FROM generate_series(1, 500000) i;

-- Seed order items (1,000,000 items)
INSERT INTO order_items (order_id, product_id, quantity, price, created_at)
SELECT
    FLOOR(random() * 500000 + 1)::BIGINT,
    FLOOR(random() * 1000 + 1)::BIGINT,
    FLOOR(random() * 5 + 1)::INT,
    ROUND((random() * 200 + 10)::numeric, 2),
    NOW() - (random() * INTERVAL '180 days')
FROM generate_series(1, 1000000) i;

-- Seed optimization history (for hybrid search demo)
INSERT INTO optimization_history (problem_description, strategy, improvement, execution_time, baseline_time)
VALUES
    ('Slow queries on users table with email lookups', 'index', 84, 38, 234),
    ('High CPU usage on order aggregation queries', 'query', 67, 52, 158),
    ('Frequent access to product catalog data', 'cache', 73, 31, 115),
    ('Large table scans on orders table', 'schema', 56, 68, 155),
    ('Join performance issues between users and orders', 'index', 78, 42, 192),
    ('Slow dashboard queries for user statistics', 'cache', 82, 28, 156),
    ('Complex filtering on order status and dates', 'query', 61, 71, 182),
    ('Product search performance degradation', 'index', 89, 19, 172)
ON CONFLICT DO NOTHING;

-- Create some known slow queries for testing
-- These will show up in pg_stat_statements for agents to discover

-- Slow query 1: Users with gmail accounts and their order totals
DO $$
DECLARE
    i INT;
BEGIN
    FOR i IN 1..10 LOOP
        PERFORM
            u.email,
            COUNT(o.id) as order_count,
            SUM(o.total) as total_spent
        FROM users u
        LEFT JOIN orders o ON u.id = o.user_id
        WHERE u.email LIKE '%@gmail.com'
        GROUP BY u.id, u.email
        ORDER BY total_spent DESC NULLS LAST
        LIMIT 100;
    END LOOP;
END $$;

-- Slow query 2: Recent orders with user details
DO $$
DECLARE
    i INT;
BEGIN
    FOR i IN 1..10 LOOP
        PERFORM
            o.*,
            u.email,
            u.name
        FROM orders o
        JOIN users u ON o.user_id = u.id
        WHERE o.status = 'delivered'
        ORDER BY o.created_at DESC
        LIMIT 100;
    END LOOP;
END $$;

-- Slow query 3: Product order counts
DO $$
DECLARE
    i INT;
BEGIN
    FOR i IN 1..10 LOOP
        PERFORM
            p.name,
            COUNT(oi.id) as times_ordered,
            SUM(oi.quantity) as total_quantity
        FROM products p
        LEFT JOIN order_items oi ON p.id = oi.product_id
        GROUP BY p.id, p.name
        ORDER BY times_ordered DESC
        LIMIT 100;
    END LOOP;
END $$;

-- Display statistics
DO $$
DECLARE
    user_count BIGINT;
    order_count BIGINT;
    item_count BIGINT;
    product_count BIGINT;
BEGIN
    SELECT COUNT(*) INTO user_count FROM users;
    SELECT COUNT(*) INTO order_count FROM orders;
    SELECT COUNT(*) INTO item_count FROM order_items;
    SELECT COUNT(*) INTO product_count FROM products;

    RAISE NOTICE '';
    RAISE NOTICE '╔════════════════════════════════════════════════╗';
    RAISE NOTICE '║   🌌 Database Seeded Successfully!            ║';
    RAISE NOTICE '╚════════════════════════════════════════════════╝';
    RAISE NOTICE '';
    RAISE NOTICE 'Statistics:';
    RAISE NOTICE '  - Users:        %', user_count;
    RAISE NOTICE '  - Orders:       %', order_count;
    RAISE NOTICE '  - Order Items:  %', item_count;
    RAISE NOTICE '  - Products:     %', product_count;
    RAISE NOTICE '';
    RAISE NOTICE 'Slow queries executed to populate pg_stat_statements';
    RAISE NOTICE 'Ready for parallel universe optimization! 🚀';
    RAISE NOTICE '';
END $$;
