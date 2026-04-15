-- ============================================================
-- COMPLETE SETUP — Akalwadi's Shri Krishna Farms
-- Run this once in Supabase SQL Editor (safe to run on a fresh project)
-- ============================================================

-- Clean slate (safe on first run — CASCADE handles dependencies)
DROP TABLE IF EXISTS payment_confirmations CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS product_variants CASCADE;
DROP TABLE IF EXISTS inventory CASCADE;

-- ── 1. ORDERS ──────────────────────────────────────────────
CREATE TABLE orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  customer_name text NOT NULL,
  mobile text NOT NULL,
  address text NOT NULL,
  district text NOT NULL,
  delivery_charge numeric NOT NULL DEFAULT 0,
  total_amount numeric NOT NULL,
  payment_mode text NOT NULL CHECK (payment_mode IN ('cod', 'online')),
  payment_status text NOT NULL DEFAULT 'pending',
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'confirmed', 'delivered', 'cancelled'))
);

-- ── 2. ORDER ITEMS ─────────────────────────────────────────
CREATE TABLE order_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  mango_id integer NOT NULL,
  mango_name text NOT NULL,
  quantity_dozens integer NOT NULL,
  price_per_dozen numeric NOT NULL,
  subtotal numeric NOT NULL,
  box_type text NOT NULL DEFAULT '5kg',
  size text
);

-- ── 3. PAYMENT CONFIRMATIONS ───────────────────────────────
CREATE TABLE payment_confirmations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  utr_number text NOT NULL,
  screenshot_url text NOT NULL,
  verified boolean NOT NULL DEFAULT false
);

-- ── 4. PRODUCT VARIANTS ────────────────────────────────────
CREATE TABLE product_variants (
  id serial PRIMARY KEY,
  mango_id integer NOT NULL,
  box_type text NOT NULL CHECK (box_type IN ('dozen', '5kg')),
  size text CHECK (size IN ('medium', 'large')),
  price numeric NOT NULL,
  label text NOT NULL,
  active boolean DEFAULT true,
  UNIQUE(mango_id, box_type, size)
);

-- ── 5. INVENTORY ───────────────────────────────────────────
CREATE TABLE inventory (
  mango_id integer PRIMARY KEY,
  in_stock boolean NOT NULL DEFAULT true
);

-- ── 6. ROW LEVEL SECURITY ──────────────────────────────────
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_confirmations ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

-- Orders & items: anyone can insert, only service role can read
CREATE POLICY "Allow insert orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow insert items" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow insert confirmations" ON payment_confirmations FOR INSERT WITH CHECK (true);
CREATE POLICY "Block select orders" ON orders FOR SELECT USING (false);
CREATE POLICY "Block select items" ON order_items FOR SELECT USING (false);
CREATE POLICY "Block select confirmations" ON payment_confirmations FOR SELECT USING (false);

-- Product variants & inventory: publicly readable
CREATE POLICY "Public read variants" ON product_variants FOR SELECT USING (true);
CREATE POLICY "Public read inventory" ON inventory FOR SELECT USING (true);

-- ── 7. SEED DATA ───────────────────────────────────────────

-- Inventory (all in stock)
INSERT INTO inventory (mango_id, in_stock) VALUES
  (1, true), (2, true), (3, true), (5, true);

-- Product variants — 5 kg boxes at ₹1500 (dozen discontinued)
INSERT INTO product_variants (mango_id, box_type, size, price, label, active) VALUES
  -- Kesar (id: 2) — medium & large
  (2, '5kg', 'medium', 1500, '5 Kg – Medium (20-24 pcs)', true),
  (2, '5kg', 'large',  1500, '5 Kg – Large (18-20 pcs)',  true),
  -- Alphonso (id: 3) — medium & large
  (3, '5kg', 'medium', 1500, '5 Kg – Medium (20-24 pcs)', true),
  (3, '5kg', 'large',  1500, '5 Kg – Large (18-20 pcs)',  true);

-- ── 8. PRICE UPDATE (₹2000 → ₹1500) ─────────────────────────
-- Re-runnable: updates existing rows if seed data was inserted at the old price.
UPDATE product_variants SET price = 1500 WHERE price = 2000;

-- ============================================================
-- MANUAL STEP — Storage bucket for payment screenshots:
--   1. Go to Supabase Dashboard → Storage → New Bucket
--   2. Name: payment-screenshots
--   3. Make it PUBLIC
--   4. Save
-- ============================================================
