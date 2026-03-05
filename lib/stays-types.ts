/** Nexa Stays API types */

export interface SearchListingsParams {
  city?: string;
  checkin_date?: string;
  checkout_date?: string;
  guests?: number;
  verified_walkthrough_only?: boolean;
  instant_booking_only?: boolean;
}

export interface StaysListing {
  id: string;
  title: string;
  listing_type: "APARTMENT" | "HOTEL" | "RIAD" | "VILLA";
  city: string;
  geo_lat?: number | null;
  geo_lng?: number | null;
  address?: string | null;
  status: string;
  checkin_time: string;
  checkout_time: string;
  description?: string | null;
  instant_booking: boolean;
  rate_plan?: {
    base_price: number;
    weekend_price?: number | null;
    cleaning_fee: number;
    currency: string;
  } | null;
  rules?: {
    pets_policy?: string | null;
    smoking_policy?: string | null;
    max_guests?: number | null;
    amenities?: string | null;
  } | null;
  host?: {
    id: string;
    full_name?: string | null;
  } | null;
}

export interface CreateBookingDto {
  listing_id: string;
  checkin_date: string; // YYYY-MM-DD
  checkout_date: string;
  guest_count: number;
  idempotency_key?: string;
  occupants?: {
    full_name: string;
    id_number?: string;
    is_primary?: boolean;
  }[];
}

export interface StaysBooking {
  id: string;
  listing_id: string;
  status: string;
  checkin_date: string;
  checkout_date: string;
  guest_count: number;
  total_subtotal: number;
  guest_fee: number;
  host_fee: number;
  total_paid: number | null;
  payout_amount: number | null;
  currency: string;
  listing?: {
    id: string;
    title: string;
    city: string;
    address?: string | null;
    check_in_contact?: {
      full_name: string;
      phone: string;
      role?: string;
    } | null;
  } | null;
}

export interface HostVerificationStatus {
  status: "NOT_STARTED" | "PENDING" | "APPROVED" | "REJECTED";
  message?: string;
  submitted_at?: string | null;
  reviewed_at?: string | null;
  rejection_reason?: string | null;
}

export interface SubmitHostVerificationBody {
  document_type?: string;
  document_number_hash?: string;
  document_front_asset_id?: string;
  document_back_asset_id?: string;
  selfie_asset_id?: string;
  /** Use existing approved KYC identity (name, phone, email, DOB) - skips document upload */
  use_existing_kyc?: boolean;
}

export interface HostListingSummary {
  id: string;
  title: string;
  listing_type: string;
  city: string;
  status: string;
  description?: string | null;
  rate_plan?: {
    base_price: number;
    weekend_price?: number | null;
    cleaning_fee: number;
    currency: string;
  } | null;
  rules?: {
    max_guests?: number;
    pets_policy?: string | null;
    amenities?: string[] | null;
  } | null;
  created_at: string;
}

export interface CreateHostListingBody {
  title: string;
  listing_type: "APARTMENT" | "HOTEL" | "RIAD" | "VILLA";
  city: string;
  address?: string;
  description?: string;
  checkin_time?: string;
  checkout_time?: string;
  instant_booking?: boolean;
  rules?: {
    pets_policy?: "ALLOWED" | "DOGS_CATS" | "NO";
    smoking_policy?: "ALLOWED" | "NOT_ALLOWED";
    quiet_hours?: boolean;
    couples_welcome?: boolean;
    max_guests?: number;
    amenities?: string[];
    cancellation_policy?: "FLEXIBLE" | "MODERATE" | "STRICT";
  };
  rate_plan: {
    currency?: string;
    base_price: number;
    weekend_price?: number;
    cleaning_fee?: number;
    deposit_policy_text?: string;
  };
  check_in_contact: {
    full_name: string;
    phone: string;
    role: "OWNER" | "CO_HOST" | "AGENT";
  };
  media: { asset_id: string; kind: "PHOTO" | "WALKTHROUGH"; sort_order?: number }[];
}
