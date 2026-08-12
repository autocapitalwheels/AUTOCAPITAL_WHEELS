-- ============================================================
-- AutoCapital Wheels — Supabase Database Schema
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- for full-text search

-- ============================================================
-- ADMIN USERS
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL DEFAULT 'Admin',
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- SITE SETTINGS (CMS key-value store)
-- ============================================================
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  value_json JSONB,
  type TEXT NOT NULL DEFAULT 'text' CHECK (type IN ('text', 'json', 'image', 'boolean', 'number')),
  label TEXT,
  group_name TEXT DEFAULT 'general',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- MEDIA LIBRARY
-- ============================================================
CREATE TABLE IF NOT EXISTS media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  url TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size_bytes BIGINT,
  width INTEGER,
  height INTEGER,
  alt_text TEXT,
  tags TEXT[] DEFAULT '{}',
  uploaded_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- VEHICLES
-- ============================================================
CREATE TABLE IF NOT EXISTS vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,

  -- Basic Details
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  variant TEXT,
  year INTEGER NOT NULL,
  registration_year INTEGER,
  price DECIMAL(12,2) NOT NULL,
  original_price DECIMAL(12,2),
  mileage INTEGER NOT NULL, -- in km
  fuel_type TEXT NOT NULL CHECK (fuel_type IN ('Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid', 'LPG')),
  transmission TEXT NOT NULL CHECK (transmission IN ('Manual', 'Automatic', 'AMT', 'CVT', 'DCT')),
  body_type TEXT CHECK (body_type IN ('Sedan', 'Hatchback', 'SUV', 'MUV', 'Coupe', 'Convertible', 'Van', 'Pickup', 'Wagon')),
  colour TEXT,
  seating_capacity INTEGER,
  engine_cc INTEGER,
  engine_description TEXT,

  -- Location
  location TEXT,
  registration_state TEXT,

  -- Ownership & Documents
  ownership INTEGER DEFAULT 1 CHECK (ownership BETWEEN 1 AND 6), -- number of owners
  insurance_status TEXT CHECK (insurance_status IN ('Valid', 'Expired', 'Third Party', 'Comprehensive', 'Not Available')),
  insurance_valid_until DATE,
  rc_available BOOLEAN DEFAULT true,
  puc_available BOOLEAN DEFAULT true,
  accident_history BOOLEAN DEFAULT false,
  service_history TEXT CHECK (service_history IN ('Full', 'Partial', 'None', 'Not Available')),
  warranty_available BOOLEAN DEFAULT false,
  warranty_description TEXT,

  -- Category
  vehicle_category TEXT DEFAULT 'Car' CHECK (vehicle_category IN ('Car', 'SUV', 'Taxi', 'Commercial', 'Van', 'Truck')),

  -- Media
  main_image_url TEXT,
  video_url TEXT,

  -- Content
  description TEXT,
  additional_info TEXT,

  -- Marketing flags
  is_featured BOOLEAN DEFAULT false,
  is_new_arrival BOOLEAN DEFAULT false,
  is_hot_deal BOOLEAN DEFAULT false,
  is_price_drop BOOLEAN DEFAULT false,

  -- SEO
  seo_title TEXT,
  seo_description TEXT,

  -- Status
  status TEXT NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'Active', 'Reserved', 'Sold', 'Archived')),
  availability TEXT NOT NULL DEFAULT 'Available' CHECK (availability IN ('Available', 'Reserved', 'Sold')),

  -- Analytics
  view_count INTEGER DEFAULT 0,
  enquiry_count INTEGER DEFAULT 0,
  whatsapp_click_count INTEGER DEFAULT 0,

  -- Admin
  added_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for search and filtering
CREATE INDEX IF NOT EXISTS vehicles_status_idx ON vehicles(status);
CREATE INDEX IF NOT EXISTS vehicles_make_idx ON vehicles(make);
CREATE INDEX IF NOT EXISTS vehicles_model_idx ON vehicles(model);
CREATE INDEX IF NOT EXISTS vehicles_price_idx ON vehicles(price);
CREATE INDEX IF NOT EXISTS vehicles_year_idx ON vehicles(year);
CREATE INDEX IF NOT EXISTS vehicles_fuel_type_idx ON vehicles(fuel_type);
CREATE INDEX IF NOT EXISTS vehicles_featured_idx ON vehicles(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS vehicles_search_idx ON vehicles USING GIN (to_tsvector('english', make || ' ' || model || ' ' || COALESCE(variant, '')));

-- ============================================================
-- VEHICLE IMAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS vehicle_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  storage_path TEXT,
  thumbnail_url TEXT,
  caption TEXT,
  alt_text TEXT,
  is_main BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS vehicle_images_vehicle_idx ON vehicle_images(vehicle_id);

-- ============================================================
-- VEHICLE FEATURES
-- ============================================================
CREATE TABLE IF NOT EXISTS vehicle_features (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  category TEXT NOT NULL DEFAULT 'General' CHECK (category IN ('Safety', 'Comfort', 'Entertainment', 'Exterior', 'Interior', 'General')),
  feature TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS vehicle_features_vehicle_idx ON vehicle_features(vehicle_id);

-- ============================================================
-- VEHICLE ENQUIRIES
-- ============================================================
CREATE TABLE IF NOT EXISTS vehicle_enquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  enquiry_id TEXT NOT NULL UNIQUE DEFAULT 'ENQ-' || UPPER(SUBSTRING(uuid_generate_v4()::text, 1, 8)),

  -- Customer details
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  customer_city TEXT,

  -- Vehicle
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  vehicle_snapshot JSONB, -- snapshot of vehicle at time of enquiry

  -- Enquiry details
  message TEXT,
  preferred_contact TEXT DEFAULT 'Phone' CHECK (preferred_contact IN ('Phone', 'WhatsApp', 'Email', 'Any')),
  preferred_time TEXT,
  test_drive_requested BOOLEAN DEFAULT false,
  lead_type TEXT NOT NULL DEFAULT 'ENQUIRY' CHECK (lead_type IN ('ENQUIRY', 'TEST_DRIVE', 'CALLBACK', 'CONTACT', 'WHATSAPP')),

  -- Status management
  status TEXT NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW', 'CONTACTED', 'FOLLOW_UP', 'NEGOTIATION', 'CONVERTED', 'CLOSED')),
  admin_notes TEXT,
  assigned_to UUID REFERENCES admin_users(id) ON DELETE SET NULL,

  -- Meta
  source TEXT DEFAULT 'website',
  ip_address TEXT,
  user_agent TEXT,
  user_id UUID, -- if logged-in customer

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS enquiries_status_idx ON vehicle_enquiries(status);
CREATE INDEX IF NOT EXISTS enquiries_created_idx ON vehicle_enquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS enquiries_vehicle_idx ON vehicle_enquiries(vehicle_id);

-- ============================================================
-- SELL REQUESTS
-- ============================================================
CREATE TABLE IF NOT EXISTS sell_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id TEXT NOT NULL UNIQUE DEFAULT 'SELL-' || UPPER(SUBSTRING(uuid_generate_v4()::text, 1, 8)),

  -- Owner details
  owner_name TEXT NOT NULL,
  owner_phone TEXT NOT NULL,
  owner_email TEXT,
  owner_city TEXT,

  -- Vehicle details
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  variant TEXT,
  manufacturing_year INTEGER NOT NULL,
  registration_year INTEGER,
  fuel_type TEXT,
  transmission TEXT,
  kms_driven INTEGER,
  number_of_owners INTEGER DEFAULT 1,
  expected_price DECIMAL(12,2),
  vehicle_condition TEXT CHECK (vehicle_condition IN ('Excellent', 'Good', 'Fair', 'Poor')),
  accident_history BOOLEAN DEFAULT false,
  insurance_status TEXT,
  rc_available BOOLEAN DEFAULT true,
  additional_info TEXT,

  -- Photos
  photo_urls TEXT[] DEFAULT '{}',
  photo_storage_paths TEXT[] DEFAULT '{}',

  -- Status
  status TEXT NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW', 'UNDER_REVIEW', 'INSPECTION_SCHEDULED', 'OFFER_MADE', 'NEGOTIATION', 'COMPLETED', 'REJECTED', 'CLOSED')),
  admin_notes TEXT,
  offered_price DECIMAL(12,2),

  -- Meta
  user_id UUID,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS sell_requests_status_idx ON sell_requests(status);
CREATE INDEX IF NOT EXISTS sell_requests_created_idx ON sell_requests(created_at DESC);

-- ============================================================
-- TEST DRIVE REQUESTS
-- ============================================================
CREATE TABLE IF NOT EXISTS test_drive_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id TEXT NOT NULL UNIQUE DEFAULT 'TD-' || UPPER(SUBSTRING(uuid_generate_v4()::text, 1, 8)),

  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,

  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  vehicle_snapshot JSONB,

  preferred_date DATE NOT NULL,
  preferred_time TEXT,
  location TEXT,
  message TEXT,

  status TEXT NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED')),
  admin_notes TEXT,

  user_id UUID,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS test_drives_status_idx ON test_drive_requests(status);
CREATE INDEX IF NOT EXISTS test_drives_created_idx ON test_drive_requests(created_at DESC);

-- ============================================================
-- CONTACT MESSAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message_id TEXT NOT NULL UNIQUE DEFAULT 'MSG-' || UPPER(SUBSTRING(uuid_generate_v4()::text, 1, 8)),

  name TEXT NOT NULL,
  phone TEXT,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,

  status TEXT NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW', 'READ', 'REPLIED', 'CLOSED')),
  admin_notes TEXT,

  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- WISHLISTS (for logged-in customers via Supabase Auth)
-- ============================================================
CREATE TABLE IF NOT EXISTS wishlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wishlist_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wishlist_id UUID NOT NULL REFERENCES wishlists(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(wishlist_id, vehicle_id)
);

-- ============================================================
-- TESTIMONIALS
-- ============================================================
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name TEXT NOT NULL,
  customer_location TEXT,
  review TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  image_url TEXT,
  vehicle_purchased TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- FAQs
-- ============================================================
CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ADMIN ACTIVITY LOGS
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  admin_email TEXT,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id TEXT,
  entity_label TEXT,
  metadata JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS activity_logs_admin_idx ON admin_activity_logs(admin_id);
CREATE INDEX IF NOT EXISTS activity_logs_created_idx ON admin_activity_logs(created_at DESC);

-- ============================================================
-- ANALYTICS EVENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type TEXT NOT NULL CHECK (event_type IN (
    'vehicle_view', 'search', 'filter', 'whatsapp_click',
    'enquiry_submitted', 'sell_submitted', 'test_drive_submitted',
    'contact_submitted', 'wishlist_add', 'compare_add'
  )),
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  metadata JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS analytics_event_type_idx ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS analytics_vehicle_idx ON analytics_events(vehicle_id);
CREATE INDEX IF NOT EXISTS analytics_created_idx ON analytics_events(created_at DESC);

-- ============================================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all relevant tables
CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON vehicles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_enquiries_updated_at BEFORE UPDATE ON vehicle_enquiries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sell_requests_updated_at BEFORE UPDATE ON sell_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_test_drives_updated_at BEFORE UPDATE ON test_drive_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contact_updated_at BEFORE UPDATE ON contact_messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON testimonials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_faqs_updated_at BEFORE UPDATE ON faqs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
