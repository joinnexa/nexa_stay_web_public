/**
 * Nexa Stays API client
 * Base: /api/v1/stays
 */

import axios, { AxiosError } from "axios";
import type {
  SearchListingsParams,
  StaysListing,
  CreateBookingDto,
  StaysBooking,
  HostVerificationStatus,
  SubmitHostVerificationBody,
  HostListingSummary,
  CreateHostListingBody,
} from "./stays-types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:3000/api/v1";

const client = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// For FormData uploads, remove Content-Type so the browser sets multipart/form-data with boundary.
client.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }
  return config;
});

/** Retry on 429 with backoff; show friendly message if still failing */
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 1500;

client.interceptors.response.use(
  (res) => res,
  async (err) => {
    const config = err.config;
    if (!config || config.__retryCount >= MAX_RETRIES) {
      return Promise.reject(err);
    }
    if (err.response?.status === 429) {
      config.__retryCount = (config.__retryCount || 0) + 1;
      await new Promise((r) => setTimeout(r, RETRY_DELAY_MS * config.__retryCount));
      return client.request(config);
    }
    return Promise.reject(err);
  }
);

/** Attach JWT for authenticated requests */
function getAuthHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("nexa_access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function unwrap<T>(res: { data?: unknown }): T {
  const d = res.data;
  return (d && typeof d === "object" && "data" in d ? (d as { data: T }).data : d) as T;
}

function handleError(err: unknown): never {
  if (axios.isAxiosError(err)) {
    const e = err as AxiosError<{ message?: string; error?: string }>;
    if (e.response?.status === 429) {
      throw new Error("Please wait a moment and try again.");
    }
    const msg = e.response?.data?.message ?? e.response?.data?.error ?? e.message ?? "Request failed";
    throw new Error(msg);
  }
  throw err;
}

/** Search listings (public) */
export async function searchListings(
  params: SearchListingsParams
): Promise<StaysListing[]> {
  const q = new URLSearchParams();
  if (params.city) q.set("city", params.city);
  if (params.checkin_date) q.set("checkin_date", params.checkin_date);
  if (params.checkout_date) q.set("checkout_date", params.checkout_date);
  if (params.guests != null) q.set("guests", String(params.guests));
  if (params.verified_walkthrough_only != null)
    q.set("verified_walkthrough_only", String(params.verified_walkthrough_only));
  if (params.instant_booking_only != null)
    q.set("instant_booking_only", String(params.instant_booking_only));

  const res = await client
    .get(`/stays/listings/search?${q.toString()}`)
    .catch(handleError);
  const data = unwrap<StaysListing[]>(res);
  return Array.isArray(data) ? data : [];
}

/** Get listing by ID (public; address/contact masked unless eligible) */
export async function getListing(
  id: string,
  token?: string | null
): Promise<StaysListing> {
  const headers = token ? { Authorization: `Bearer ${token}` } : getAuthHeaders();
  const res = await client
    .get(`/stays/listings/${id}`, { headers })
    .catch(handleError);
  return unwrap<StaysListing>(res);
}

/** Create booking (requires JWT, verified guest) */
export async function createBooking(
  dto: CreateBookingDto,
  token?: string | null
): Promise<StaysBooking> {
  const headers = token ? { Authorization: `Bearer ${token}` } : getAuthHeaders();
  const res = await client
    .post("/stays/bookings", dto, { headers })
    .catch(handleError);
  return unwrap<StaysBooking>(res);
}

/** Get booking by ID (requires JWT) */
export async function getBooking(
  id: string,
  token?: string | null
): Promise<StaysBooking> {
  const headers = token ? { Authorization: `Bearer ${token}` } : getAuthHeaders();
  const res = await client
    .get(`/stays/bookings/${id}`, { headers })
    .catch(handleError);
  return unwrap<StaysBooking>(res);
}

/** Get host's listings (requires JWT, approved host) */
export async function getHostListings(
  token?: string | null
): Promise<HostListingSummary[]> {
  const headers = token ? { Authorization: `Bearer ${token}` } : getAuthHeaders();
  const res = await client
    .get("/stays/host/listings", { headers })
    .catch(handleError);
  const data = unwrap<HostListingSummary[]>(res);
  return Array.isArray(data) ? data : [];
}

/** Create listing (requires JWT, approved host) */
export async function createHostListing(
  body: CreateHostListingBody,
  token?: string | null
): Promise<{ id: string; status: string; message: string }> {
  const headers = token ? { Authorization: `Bearer ${token}` } : getAuthHeaders();
  const res = await client
    .post("/stays/host/listings", body, { headers })
    .catch(handleError);
  return unwrap<{ id: string; status: string; message: string }>(res);
}

/** Upload listing photo (returns asset_id) */
export async function uploadListingPhoto(
  file: File,
  token?: string | null
): Promise<{ asset_id: string }> {
  const headers = token ? { Authorization: `Bearer ${token}` } : getAuthHeaders();
  const form = new FormData();
  form.append("file", file);
  const res = await client
    .post("/stays/host/listings/media/photo", form, { headers })
    .catch(handleError);
  return unwrap<{ asset_id: string }>(res);
}

/** Upload listing walkthrough video (returns asset_id) */
export async function uploadListingWalkthrough(
  file: File,
  token?: string | null
): Promise<{ asset_id: string }> {
  const headers = token ? { Authorization: `Bearer ${token}` } : getAuthHeaders();
  const form = new FormData();
  form.append("file", file);
  const res = await client
    .post("/stays/host/listings/media/walkthrough", form, { headers })
    .catch(handleError);
  return unwrap<{ asset_id: string }>(res);
}

/** Get host verification status (requires JWT) */
export async function getHostVerification(
  token?: string | null
): Promise<HostVerificationStatus> {
  const headers = token ? { Authorization: `Bearer ${token}` } : getAuthHeaders();
  const res = await client
    .get("/stays/host/verification", { headers })
    .catch(handleError);
  return unwrap<HostVerificationStatus>(res);
}

/** Submit host verification (requires JWT) */
export async function submitHostVerification(
  body: SubmitHostVerificationBody,
  token?: string | null
): Promise<HostVerificationStatus> {
  const headers = token ? { Authorization: `Bearer ${token}` } : getAuthHeaders();
  const res = await client
    .post("/stays/host/verification", body, { headers })
    .catch(handleError);
  return unwrap<HostVerificationStatus>(res);
}

/** Upload host ID document front (requires JWT) */
export async function uploadHostDocumentFront(
  file: File,
  token?: string | null
): Promise<{ asset_id: string }> {
  const headers = token ? { Authorization: `Bearer ${token}` } : getAuthHeaders();
  const form = new FormData();
  form.append("file", file);
  const res = await client
    .post("/stays/host/verification/documents/front", form, { headers })
    .catch(handleError);
  return unwrap<{ asset_id: string }>(res);
}

/** Upload host ID document back (requires JWT) */
export async function uploadHostDocumentBack(
  file: File,
  token?: string | null
): Promise<{ asset_id: string }> {
  const headers = token ? { Authorization: `Bearer ${token}` } : getAuthHeaders();
  const form = new FormData();
  form.append("file", file);
  const res = await client
    .post("/stays/host/verification/documents/back", form, { headers })
    .catch(handleError);
  return unwrap<{ asset_id: string }>(res);
}

/** Upload host selfie (requires JWT) */
export async function uploadHostSelfie(
  file: File,
  token?: string | null
): Promise<{ asset_id: string }> {
  const headers = token ? { Authorization: `Bearer ${token}` } : getAuthHeaders();
  const form = new FormData();
  form.append("file", file);
  const res = await client
    .post("/stays/host/verification/documents/selfie", form, { headers })
    .catch(handleError);
  return unwrap<{ asset_id: string }>(res);
}

export const staysApi = {
  searchListings,
  getListing,
  createBooking,
  getBooking,
  getHostVerification,
  getHostListings,
  createHostListing,
  uploadListingPhoto,
  uploadListingWalkthrough,
  submitHostVerification,
  uploadHostDocumentFront,
  uploadHostDocumentBack,
  uploadHostSelfie,
};
