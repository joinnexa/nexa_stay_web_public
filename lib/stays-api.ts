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
} from "./stays-types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:3000/api/v1";

const client = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

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

export const staysApi = {
  searchListings,
  getListing,
  createBooking,
  getBooking,
  getHostVerification,
  submitHostVerification,
};
