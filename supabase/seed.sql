-- ============================================================
-- AutoCapital Wheels — Seed Data
-- Run AFTER 001_schema.sql
-- This creates realistic demo inventory for development
-- ============================================================

-- ============================================================
-- ADMIN USER (password: 12345678, bcrypt hashed)
-- ============================================================
INSERT INTO admin_users (id, email, password_hash, full_name, role) VALUES
(
  'a0000000-0000-0000-0000-000000000001',
  'autocapitalwheels@gmail.com',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TiGTbMHCqIqGEMwGgjlH/rCPFtoa', -- 12345678
  'AutoCapital Wheels Admin',
  'super_admin'
)
ON CONFLICT (email) DO NOTHING;

-- ============================================================
-- SITE SETTINGS
-- ============================================================
INSERT INTO site_settings (key, value, type, label, group_name) VALUES
('brand_name', 'AutoCapital Wheels', 'text', 'Brand Name', 'branding'),
('brand_tagline', 'TRUSTED CARS. TRUSTED DEALS.', 'text', 'Brand Tagline', 'branding'),
('business_phone', '+91 8800243707', 'text', 'Business Phone', 'contact'),
('business_whatsapp', '918800243707', 'text', 'WhatsApp Number', 'contact'),
('business_email', 'autocapitalwheels@gmail.com', 'text', 'Business Email', 'contact'),
('business_address', 'Delhi, India', 'text', 'Business Address', 'contact'),
('business_hours', 'Mon–Sat: 10:00 AM – 7:00 PM | Sunday: 11:00 AM – 5:00 PM', 'text', 'Business Hours', 'contact'),
('hero_heading', 'TRUSTED CARS. TRUSTED DEALS.', 'text', 'Hero Heading', 'homepage'),
('hero_subheading', 'Find your next pre-owned car with confidence. Explore available vehicles or sell your car directly to AutoCapital Wheels.', 'text', 'Hero Subheading', 'homepage'),
('hero_primary_cta', 'EXPLORE CARS', 'text', 'Hero Primary CTA', 'homepage'),
('hero_secondary_cta', 'SELL YOUR CAR', 'text', 'Hero Secondary CTA', 'homepage'),
('about_title', 'About AutoCapital Wheels', 'text', 'About Title', 'about'),
('about_content', 'AutoCapital Wheels is a trusted pre-owned car dealership based in Delhi, India. We specialise in buying and selling quality second-hand cars and taxis. Our approach is simple: transparent deals, honest information, and a customer-first experience. Whether you''re looking to buy your next car or sell your current one, our team is here to help.', 'text', 'About Content', 'about'),
('seo_title', 'AutoCapital Wheels — Trusted Pre-Owned Cars in Delhi', 'text', 'SEO Title', 'seo'),
('seo_description', 'Buy and sell trusted pre-owned cars in Delhi. AutoCapital Wheels offers a curated selection of quality second-hand cars with transparent pricing and honest deals.', 'text', 'SEO Description', 'seo'),
('trust_stat_cars_sold', '500+', 'text', 'Cars Sold Stat', 'homepage'),
('trust_stat_happy_customers', '450+', 'text', 'Happy Customers Stat', 'homepage'),
('trust_stat_years', '5+', 'text', 'Years in Business Stat', 'homepage'),
('social_instagram', '', 'text', 'Instagram URL', 'social'),
('social_facebook', '', 'text', 'Facebook URL', 'social'),
('social_youtube', '', 'text', 'YouTube URL', 'social')
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- VEHICLES — 15 Realistic Indian Used Cars
-- ============================================================

INSERT INTO vehicles (
  id, slug, make, model, variant, year, registration_year,
  price, original_price, mileage, fuel_type, transmission,
  body_type, colour, seating_capacity, engine_cc, engine_description,
  location, registration_state, ownership, insurance_status,
  rc_available, puc_available, accident_history, service_history,
  vehicle_category, description, is_featured, is_new_arrival, is_hot_deal,
  status, availability, view_count
) VALUES

-- 1. Maruti Suzuki Swift
(
  'a0000000-0000-0000-0000-000000000001',
  'maruti-suzuki-swift-vxi-2021',
  'Maruti Suzuki', 'Swift', 'VXI', 2021, 2021,
  595000, 650000, 28000, 'Petrol', 'Manual',
  'Hatchback', 'Magma Grey', 5, 1197, '1.2L K12N DualJet Petrol',
  'Delhi', 'Delhi', 1, 'Comprehensive',
  true, true, false, 'Full',
  'Car', 'Well-maintained first-owner Swift VXI. All service records available. Tyres 70% life remaining. Pristine interior condition.', 
  true, false, false, 'Active', 'Available', 45
),

-- 2. Hyundai Creta
(
  'a0000000-0000-0000-0000-000000000002',
  'hyundai-creta-sx-2022',
  'Hyundai', 'Creta', 'SX', 2022, 2022,
  1350000, NULL, 22000, 'Petrol', 'Automatic',
  'SUV', 'Typhoon Silver', 5, 1497, '1.5L MPi Petrol',
  'Gurugram', 'Haryana', 1, 'Comprehensive',
  true, true, false, 'Full',
  'SUV', 'Single owner Creta SX Automatic. Excellent condition. Feature-packed with sunroof, connected car tech, and ADAS. All original accessories.',
  true, true, false, 'Active', 'Available', 89
),

-- 3. Maruti Suzuki Dzire
(
  'a0000000-0000-0000-0000-000000000003',
  'maruti-suzuki-dzire-vxi-2022',
  'Maruti Suzuki', 'Dzire', 'VXI', 2022, 2022,
  695000, 750000, 18500, 'Petrol', 'Manual',
  'Sedan', 'Oxford Blue', 5, 1197, '1.2L K12N DualJet Petrol',
  'Delhi', 'Delhi', 1, 'Comprehensive',
  true, true, false, 'Full',
  'Car', 'Pristine condition Dzire VXI. First owner, corporate used. All service records with Maruti service centre. No scratches, dents or modifications.',
  true, false, true, 'Active', 'Available', 67
),

-- 4. Honda City
(
  'a0000000-0000-0000-0000-000000000004',
  'honda-city-zx-2020',
  'Honda', 'City', 'ZX CVT', 2020, 2020,
  1095000, 1200000, 45000, 'Petrol', 'CVT',
  'Sedan', 'Radiant Red', 5, 1498, '1.5L i-VTEC Petrol',
  'Noida', 'Uttar Pradesh', 1, 'Comprehensive',
  true, true, false, 'Full',
  'Car', 'Top-spec Honda City ZX with CVT automatic. Honda Connect, lane watch, LaneWatch camera, sunroof. Excellent fuel economy. All service records.',
  false, false, true, 'Active', 'Available', 52
),

-- 5. Tata Nexon
(
  'a0000000-0000-0000-0000-000000000005',
  'tata-nexon-xz-plus-2021',
  'Tata', 'Nexon', 'XZ+ (S)', 2021, 2021,
  1050000, 1150000, 31000, 'Diesel', 'Manual',
  'SUV', 'Calgary White', 5, 1497, '1.5L Revotorq Diesel',
  'Delhi', 'Delhi', 1, 'Comprehensive',
  true, true, false, 'Full',
  'SUV', '5-star NCAP safety-rated Nexon XZ+ in top spec with sunroof, JBL audio, connected car, and fog lamps. Diesel for excellent city and highway mileage.',
  false, true, false, 'Active', 'Available', 38
),

-- 6. Maruti Suzuki Ertiga
(
  'a0000000-0000-0000-0000-000000000006',
  'maruti-suzuki-ertiga-vxi-2020',
  'Maruti Suzuki', 'Ertiga', 'VXI CNG', 2020, 2020,
  775000, NULL, 62000, 'CNG', 'Manual',
  'Van', 'Pearl Midnight Black', 7, 1462, '1.5L K15B CNG',
  'Delhi', 'Delhi', 2, 'Comprehensive',
  true, true, false, 'Partial',
  'Car', 'CNG-fitted 7-seater Ertiga. Ideal for family use. Second owner, well maintained. Factory-fitted CNG kit. Regular service history available.',
  false, false, false, 'Active', 'Available', 29
),

-- 7. Mahindra Scorpio
(
  'a0000000-0000-0000-0000-000000000007',
  'mahindra-scorpio-s11-2019',
  'Mahindra', 'Scorpio', 'S11', 2019, 2019,
  1175000, 1300000, 78000, 'Diesel', 'Manual',
  'SUV', 'Napoli Black', 7, 2179, '2.2L mHawk Diesel',
  'Delhi', 'Delhi', 1, 'Third Party',
  true, true, false, 'Partial',
  'SUV', 'Iconic Scorpio S11 in top spec. 4WD capable. 7-seater. Alloy wheels, touchscreen, airbags, ABS. Powerful mHawk engine for city and off-road use.',
  false, false, false, 'Active', 'Available', 33
),

-- 8. Toyota Innova Crysta
(
  'a0000000-0000-0000-0000-000000000008',
  'toyota-innova-crysta-gx-2020',
  'Toyota', 'Innova Crysta', 'GX 2.4', 2020, 2020,
  1875000, 2000000, 55000, 'Diesel', 'Manual',
  'MUV', 'Super White', 8, 2393, '2.4L GD Diesel',
  'Gurugram', 'Haryana', 1, 'Comprehensive',
  true, true, false, 'Full',
  'Car', 'First owner Innova Crysta GX 8-seater. Toyota service history. Captain seats, touchscreen infotainment, rear AC, push-button start. Immaculate condition.',
  true, false, false, 'Active', 'Available', 71
),

-- 9. Hyundai i20
(
  'a0000000-0000-0000-0000-000000000009',
  'hyundai-i20-asta-2023',
  'Hyundai', 'i20', 'Asta (O)', 2023, 2023,
  950000, NULL, 12000, 'Petrol', 'DCT',
  'Hatchback', 'Titan Grey', 5, 1197, '1.2L Kappa Turbo GDi',
  'Delhi', 'Delhi', 1, 'Comprehensive',
  true, true, false, 'Full',
  'Car', 'Near-new top-spec i20 Asta (O) with 7-speed DCT. Sunroof, Bose sound, 10.25" display, connected car, wireless charger. Under warranty.',
  true, true, false, 'Active', 'Available', 95
),

-- 10. Kia Seltos
(
  'a0000000-0000-0000-0000-000000000010',
  'kia-seltos-htx-plus-2021',
  'Kia', 'Seltos', 'HTX+', 2021, 2021,
  1425000, 1550000, 35000, 'Petrol', 'Automatic',
  'SUV', 'Glacier White Pearl', 5, 1497, '1.5L MPi Petrol',
  'Noida', 'Uttar Pradesh', 1, 'Comprehensive',
  true, true, false, 'Full',
  'SUV', 'Premium Seltos HTX+ with panoramic sunroof, Bose sound system, ventilated seats, connected car tech, and heads-up display. First owner with full service history.',
  false, false, true, 'Active', 'Available', 58
),

-- 11. Maruti Suzuki Alto K10
(
  'a0000000-0000-0000-0000-000000000011',
  'maruti-suzuki-alto-k10-vxi-2022',
  'Maruti Suzuki', 'Alto K10', 'VXI+', 2022, 2022,
  425000, NULL, 15000, 'Petrol', 'AMT',
  'Hatchback', 'Sizzling Orange', 5, 998, '1.0L K10C DualJet',
  'Delhi', 'Delhi', 1, 'Comprehensive',
  true, true, false, 'Full',
  'Car', 'Entry-level Alto K10 in top spec with AMT automatic. Perfect first car or city runabout. Excellent fuel economy. Low mileage, like new condition.',
  false, true, false, 'Active', 'Available', 22
),

-- 12. Ford EcoSport (Taxi / Commercial)
(
  'a0000000-0000-0000-0000-000000000012',
  'ford-ecosport-titanium-2019',
  'Ford', 'EcoSport', 'Titanium', 2019, 2019,
  695000, 800000, 89000, 'Diesel', 'Manual',
  'SUV', 'Smoke Grey', 5, 1499, '1.5L TDCi Diesel',
  'Delhi', 'Delhi', 2, 'Third Party',
  true, true, false, 'Partial',
  'Car', 'Second owner EcoSport Titanium diesel. Well-maintained. Alloy wheels, touchscreen, reverse parking sensors, sunroof. Ideal budget SUV.',
  false, false, false, 'Active', 'Available', 27
),

-- 13. Maruti Suzuki Wagon R (CNG Taxi)
(
  'a0000000-0000-0000-0000-000000000013',
  'maruti-suzuki-wagon-r-lxi-cng-2020',
  'Maruti Suzuki', 'Wagon R', 'LXI CNG', 2020, 2020,
  445000, 500000, 112000, 'CNG', 'Manual',
  'Hatchback', 'Superior White', 5, 998, '1.0L K10B CNG',
  'Delhi', 'Delhi', 2, 'Third Party',
  true, true, false, 'None',
  'Taxi', 'Former taxi / cab-aggregator vehicle. Regular CNG service done. New tyres fitted. Ideal for second taxi or personal low-budget use. Priced to sell.',
  false, false, true, 'Active', 'Available', 31
),

-- 14. Hyundai Venue
(
  'a0000000-0000-0000-0000-000000000014',
  'hyundai-venue-sx-plus-2022',
  'Hyundai', 'Venue', 'SX+ Turbo DCT', 2022, 2022,
  1125000, 1250000, 24000, 'Petrol', 'DCT',
  'SUV', 'Denim Blue', 5, 998, '1.0L Turbo GDi Petrol',
  'Delhi', 'Delhi', 1, 'Comprehensive',
  true, true, false, 'Full',
  'SUV', 'Sporty Venue SX+ Turbo with 7-speed DCT. Sunroof, BlueLink connected car, ventilated seats, Bose sound. Low mileage first-owner car.',
  true, false, false, 'Active', 'Available', 62
),

-- 15. Tata Tiago (Budget)
(
  'a0000000-0000-0000-0000-000000000015',
  'tata-tiago-xz-plus-2021',
  'Tata', 'Tiago', 'XZ+', 2021, 2021,
  545000, 600000, 33000, 'Petrol', 'AMT',
  'Hatchback', 'Flame Red', 5, 1199, '1.2L Revotron Petrol',
  'Faridabad', 'Haryana', 1, 'Comprehensive',
  true, true, false, 'Full',
  'Car', 'Feature-loaded Tiago XZ+ AMT. Harman audio, touchscreen, reverse camera, AMT automatic. Well-maintained first owner car from Faridabad.',
  false, false, false, 'Active', 'Available', 19
);

-- ============================================================
-- VEHICLE IMAGES (using Unsplash/placeholder for dev)
-- ============================================================
-- Note: Admin must replace with actual vehicle images via Media Library

INSERT INTO vehicle_images (vehicle_id, url, is_main, sort_order, alt_text, caption) VALUES
-- Swift
('a0000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=1200', true, 0, '2021 Maruti Suzuki Swift VXI', 'Front Exterior'),
('a0000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1605559424843-9073c6e12a5a?w=1200', false, 1, '2021 Maruti Suzuki Swift VXI Interior', 'Interior'),
-- Creta
('a0000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1623869675781-80aa31012a5a?w=1200', true, 0, '2022 Hyundai Creta SX', 'Front Exterior'),
('a0000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1548207487-d361c2e81555?w=1200', false, 1, '2022 Hyundai Creta SX Side', 'Side View'),
-- Dzire
('a0000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1555652736-e92021d28a11?w=1200', true, 0, '2022 Maruti Suzuki Dzire VXI', 'Front Exterior'),
-- Honda City
('a0000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=1200', true, 0, '2020 Honda City ZX CVT', 'Front Exterior'),
-- Nexon
('a0000000-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1551830820-330a71b99659?w=1200', true, 0, '2021 Tata Nexon XZ+', 'Front Exterior'),
-- Ertiga
('a0000000-0000-0000-0000-000000000006', 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1200', true, 0, '2020 Maruti Suzuki Ertiga VXI CNG', 'Front Exterior'),
-- Scorpio
('a0000000-0000-0000-0000-000000000007', 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=1200', true, 0, '2019 Mahindra Scorpio S11', 'Front Exterior'),
-- Innova
('a0000000-0000-0000-0000-000000000008', 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200', true, 0, '2020 Toyota Innova Crysta GX', 'Front Exterior'),
-- i20
('a0000000-0000-0000-0000-000000000009', 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1200', true, 0, '2023 Hyundai i20 Asta', 'Front Exterior'),
-- Seltos
('a0000000-0000-0000-0000-000000000010', 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=1200', true, 0, '2021 Kia Seltos HTX+', 'Front Exterior'),
-- Alto
('a0000000-0000-0000-0000-000000000011', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200', true, 0, '2022 Maruti Suzuki Alto K10', 'Front Exterior'),
-- EcoSport
('a0000000-0000-0000-0000-000000000012', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200', true, 0, '2019 Ford EcoSport Titanium', 'Front Exterior'),
-- Wagon R
('a0000000-0000-0000-0000-000000000013', 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=1200', true, 0, '2020 Maruti Suzuki Wagon R CNG', 'Front Exterior'),
-- Venue
('a0000000-0000-0000-0000-000000000014', 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=1200', true, 0, '2022 Hyundai Venue SX+', 'Front Exterior'),
-- Tiago
('a0000000-0000-0000-0000-000000000015', 'https://images.unsplash.com/photo-1471444928139-48c5bf5173f8?w=1200', true, 0, '2021 Tata Tiago XZ+', 'Front Exterior');

-- Also update vehicles with main_image_url
UPDATE vehicles SET main_image_url = (
  SELECT url FROM vehicle_images WHERE vehicle_id = vehicles.id AND is_main = true LIMIT 1
);

-- ============================================================
-- VEHICLE FEATURES
-- ============================================================
INSERT INTO vehicle_features (vehicle_id, category, feature) VALUES
-- Hyundai Creta SX features
('a0000000-0000-0000-0000-000000000002', 'Safety', 'Level 2 ADAS (Forward Collision Warning, Lane Keep Assist)'),
('a0000000-0000-0000-0000-000000000002', 'Comfort', 'Electric Sunroof'),
('a0000000-0000-0000-0000-000000000002', 'Comfort', 'Ventilated Front Seats'),
('a0000000-0000-0000-0000-000000000002', 'Entertainment', '10.25" Touchscreen with Bluelink'),
('a0000000-0000-0000-0000-000000000002', 'Safety', '6 Airbags'),
-- Hyundai i20 Asta features
('a0000000-0000-0000-0000-000000000009', 'Comfort', 'Electric Sunroof'),
('a0000000-0000-0000-0000-000000000009', 'Entertainment', 'Bose Premium Sound System'),
('a0000000-0000-0000-0000-000000000009', 'Entertainment', '10.25" Touchscreen Display'),
('a0000000-0000-0000-0000-000000000009', 'Comfort', 'Wireless Charging'),
-- Kia Seltos HTX+ features
('a0000000-0000-0000-0000-000000000010', 'Comfort', 'Panoramic Sunroof'),
('a0000000-0000-0000-0000-000000000010', 'Entertainment', 'Bose Premium Sound System'),
('a0000000-0000-0000-0000-000000000010', 'Comfort', 'Ventilated Front Seats'),
('a0000000-0000-0000-0000-000000000010', 'Safety', 'Heads-Up Display');

-- ============================================================
-- TESTIMONIALS
-- ============================================================
INSERT INTO testimonials (customer_name, customer_location, review, rating, vehicle_purchased, is_active, sort_order) VALUES
(
  'Rahul Sharma',
  'Delhi',
  'Excellent experience buying my Hyundai i20 from AutoCapital Wheels. The team was honest, transparent and made the entire process smooth. No hidden costs, no surprises. Highly recommended.',
  5, 'Hyundai i20 Asta', true, 0
),
(
  'Priya Mehta',
  'Gurugram',
  'I sold my old car through AutoCapital Wheels. They gave me a fair price and handled all the paperwork. The process was quick and professional. Will definitely use them again.',
  5, NULL, true, 1
),
(
  'Vikram Singh',
  'Noida',
  'Bought a Toyota Innova Crysta for my family. The car was exactly as described. Good condition, service history provided, and the price was fair. Great team to deal with.',
  4, 'Toyota Innova Crysta', true, 2
);

-- ============================================================
-- FAQs
-- ============================================================
INSERT INTO faqs (question, answer, category, is_active, sort_order) VALUES
(
  'How can I buy a car from AutoCapital Wheels?',
  'Browse our available inventory, find a car you like, and click "Get Quotation". Fill in your details and our team will contact you within 24 hours to discuss next steps, pricing, and a test drive.',
  'Buying', true, 0
),
(
  'How can I sell my car to AutoCapital Wheels?',
  'Click "Sell Your Car" and submit your vehicle details and photos. Our team will review your submission and contact you to discuss the price and next steps. We do not promise an instant valuation — our team carefully evaluates each vehicle.',
  'Selling', true, 1
),
(
  'Can I request a test drive?',
  'Yes! On any available vehicle''s detail page, click "Request Test Drive". Fill in your preferred date, time and location. Our team will confirm the test drive details with you.',
  'Buying', true, 2
),
(
  'How do I contact AutoCapital Wheels directly?',
  'You can WhatsApp us on +91 8800243707, email us at autocapitalwheels@gmail.com, or use the Contact form on our website. We typically respond within a few hours during business hours.',
  'General', true, 3
),
(
  'Are the vehicles inspected before listing?',
  'Each vehicle is reviewed by our team before being listed. Vehicle details including service history, ownership, insurance and RC status are provided as supplied by the seller and verified where possible. We recommend a final inspection before purchase.',
  'General', true, 4
),
(
  'Is it mandatory to create an account to browse cars?',
  'No. You can browse all available vehicles, search, filter and view vehicle details without creating an account. An account is optional and unlocks features like saving cars to your wishlist and tracking your enquiries.',
  'General', true, 5
);
