export type VehicleStatus = 'Draft' | 'Active' | 'Reserved' | 'Sold' | 'Archived';
export type VehicleAvailability = 'Available' | 'Reserved' | 'Sold';
export type FuelType = 'Petrol' | 'Diesel' | 'CNG' | 'Electric' | 'Hybrid' | 'LPG';
export type TransmissionType = 'Manual' | 'Automatic' | 'AMT' | 'CVT' | 'DCT';
export type BodyType = 'Sedan' | 'Hatchback' | 'SUV' | 'MUV' | 'Coupe' | 'Convertible' | 'Van' | 'Pickup' | 'Wagon';
export type VehicleCategory = 'Car' | 'SUV' | 'Taxi' | 'Commercial' | 'Van' | 'Truck';
export type ServiceHistory = 'Full' | 'Partial' | 'None' | 'Not Available';
export type InsuranceStatus = 'Valid' | 'Expired' | 'Third Party' | 'Comprehensive' | 'Not Available';

export interface VehicleImage {
  id: string;
  vehicle_id: string;
  url: string;
  storage_path?: string;
  thumbnail_url?: string;
  caption?: string;
  alt_text?: string;
  is_main: boolean;
  sort_order: number;
  created_at: string;
}

export interface VehicleFeature {
  id: string;
  vehicle_id: string;
  category: 'Safety' | 'Comfort' | 'Entertainment' | 'Exterior' | 'Interior' | 'General';
  feature: string;
}

export interface Vehicle {
  id: string;
  slug: string;
  make: string;
  model: string;
  variant?: string;
  year: number;
  registration_year?: number;
  price: number;
  original_price?: number;
  mileage: number;
  fuel_type: FuelType;
  transmission: TransmissionType;
  body_type?: BodyType;
  colour?: string;
  seating_capacity?: number;
  engine_cc?: number;
  engine_description?: string;
  location?: string;
  registration_state?: string;
  ownership?: number;
  insurance_status?: InsuranceStatus;
  insurance_valid_until?: string;
  rc_available?: boolean;
  puc_available?: boolean;
  accident_history?: boolean;
  service_history?: ServiceHistory;
  warranty_available?: boolean;
  warranty_description?: string;
  vehicle_category?: VehicleCategory;
  main_image_url?: string;
  video_url?: string;
  description?: string;
  additional_info?: string;
  is_featured: boolean;
  is_new_arrival: boolean;
  is_hot_deal: boolean;
  is_price_drop: boolean;
  seo_title?: string;
  seo_description?: string;
  status: VehicleStatus;
  availability: VehicleAvailability;
  view_count: number;
  enquiry_count: number;
  whatsapp_click_count: number;
  added_by?: string;
  created_at: string;
  updated_at: string;
  // Joined
  vehicle_images?: VehicleImage[];
  vehicle_features?: VehicleFeature[];
}

export type EnquiryStatus = 'NEW' | 'CONTACTED' | 'FOLLOW_UP' | 'NEGOTIATION' | 'CONVERTED' | 'CLOSED';
export type LeadType = 'ENQUIRY' | 'TEST_DRIVE' | 'CALLBACK' | 'CONTACT' | 'WHATSAPP';

export interface VehicleEnquiry {
  id: string;
  enquiry_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  customer_city?: string;
  vehicle_id?: string;
  vehicle_snapshot?: Partial<Vehicle>;
  message?: string;
  preferred_contact?: 'Phone' | 'WhatsApp' | 'Email' | 'Any';
  preferred_time?: string;
  test_drive_requested?: boolean;
  lead_type: LeadType;
  status: EnquiryStatus;
  admin_notes?: string;
  assigned_to?: string;
  source?: string;
  user_id?: string;
  created_at: string;
  updated_at: string;
  // Joined
  vehicle?: Partial<Vehicle>;
}

export type SellRequestStatus = 'NEW' | 'UNDER_REVIEW' | 'INSPECTION_SCHEDULED' | 'OFFER_MADE' | 'NEGOTIATION' | 'COMPLETED' | 'REJECTED' | 'CLOSED';

export interface SellRequest {
  id: string;
  request_id: string;
  owner_name: string;
  owner_phone: string;
  owner_email?: string;
  owner_city?: string;
  make: string;
  model: string;
  variant?: string;
  manufacturing_year: number;
  registration_year?: number;
  fuel_type?: string;
  transmission?: string;
  kms_driven?: number;
  number_of_owners?: number;
  expected_price?: number;
  vehicle_condition?: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  accident_history?: boolean;
  insurance_status?: string;
  rc_available?: boolean;
  additional_info?: string;
  photo_urls?: string[];
  photo_storage_paths?: string[];
  status: SellRequestStatus;
  admin_notes?: string;
  offered_price?: number;
  user_id?: string;
  created_at: string;
  updated_at: string;
}

export type TestDriveStatus = 'NEW' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED';

export interface TestDriveRequest {
  id: string;
  request_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  vehicle_id?: string;
  vehicle_snapshot?: Partial<Vehicle>;
  preferred_date: string;
  preferred_time?: string;
  location?: string;
  message?: string;
  status: TestDriveStatus;
  admin_notes?: string;
  user_id?: string;
  created_at: string;
  updated_at: string;
  vehicle?: Partial<Vehicle>;
}

export interface ContactMessage {
  id: string;
  message_id: string;
  name: string;
  phone?: string;
  email: string;
  subject?: string;
  message: string;
  status: 'NEW' | 'READ' | 'REPLIED' | 'CLOSED';
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  customer_name: string;
  customer_location?: string;
  review: string;
  rating: number;
  image_url?: string;
  vehicle_purchased?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface SiteSetting {
  id: string;
  key: string;
  value?: string;
  value_json?: Record<string, unknown>;
  type: 'text' | 'json' | 'image' | 'boolean' | 'number';
  label?: string;
  group_name?: string;
}

export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'super_admin';
  is_active: boolean;
  last_login_at?: string;
  created_at: string;
}

export interface AdminActivityLog {
  id: string;
  admin_id?: string;
  admin_email?: string;
  action: string;
  entity_type?: string;
  entity_id?: string;
  entity_label?: string;
  metadata?: Record<string, unknown>;
  ip_address?: string;
  created_at: string;
}

export interface MediaItem {
  id: string;
  filename: string;
  original_filename: string;
  url: string;
  storage_path: string;
  mime_type: string;
  size_bytes?: number;
  width?: number;
  height?: number;
  alt_text?: string;
  tags?: string[];
  uploaded_by?: string;
  created_at: string;
}

// API Response types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface ApiResponse<T = undefined> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Filter types for vehicle search
export interface VehicleFilters {
  search?: string;
  make?: string;
  model?: string;
  fuel_type?: FuelType;
  transmission?: TransmissionType;
  body_type?: BodyType;
  vehicle_category?: VehicleCategory;
  min_price?: number;
  max_price?: number;
  min_year?: number;
  max_year?: number;
  min_mileage?: number;
  max_mileage?: number;
  location?: string;
  availability?: VehicleAvailability;
  is_featured?: boolean;
  status?: VehicleStatus;
}

export type VehicleSortOption = 'price_asc' | 'price_desc' | 'newest' | 'oldest' | 'mileage_asc' | 'mileage_desc' | 'recommended';

export interface DashboardStats {
  active_vehicles: number;
  sold_vehicles: number;
  draft_vehicles: number;
  new_enquiries: number;
  sell_requests: number;
  test_drive_requests: number;
  total_leads: number;
  vehicle_views_today: number;
}
