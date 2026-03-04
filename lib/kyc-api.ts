/**
 * Nexa KYC API (shared with Pay/Go)
 * Profile update, document upload, selfie, submit
 */

import axios from "axios";
import { getApiBaseUrl } from "./env";
import { unwrapResponse } from "./api-client";
import { normalizeError } from "./api-client";
import { validateImageFile } from "./validators";

const API_BASE = getApiBaseUrl();

function getAuthHeaders(getToken: () => string | null): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export interface UserProfile {
  id: string;
  phone_number?: string;
  full_name?: string;
  email?: string;
  kyc_status: string;
  account_type?: string;
  [key: string]: unknown;
}

export type GetCurrentUserResult =
  | { ok: true; user: UserProfile }
  | { ok: false; kind: "UNAUTHORIZED" | "NETWORK" | "SERVER" | "UNKNOWN" };

/**
 * Get current user. Only call when JWT exists.
 * Returns structured result - never swallows errors.
 */
export async function getCurrentUser(
  getJwt: () => string | null
): Promise<GetCurrentUserResult> {
  const token = getJwt();
  if (!token) {
    return { ok: false, kind: "UNAUTHORIZED" };
  }
  try {
    const res = await axios.get(`${API_BASE}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 15000,
    });
    const data = unwrapResponse(res) ?? res.data;
    const user = data?.id ? data : null;
    if (!user) {
      return { ok: false, kind: "UNKNOWN" };
    }
    return { ok: true, user: user as UserProfile };
  } catch (err: unknown) {
    const apiErr = normalizeError(err);
    if (apiErr.status === 401) return { ok: false, kind: "UNAUTHORIZED" };
    if (apiErr.status >= 500) return { ok: false, kind: "SERVER" };
    if (apiErr.status === 0 || apiErr.message?.toLowerCase().includes("network")) {
      return { ok: false, kind: "NETWORK" };
    }
    return { ok: false, kind: "UNKNOWN" };
  }
}

/** Legacy: get user or null. Use getCurrentUser for structured handling. */
export async function getCurrentUserOrNull(
  getJwt: () => string | null
): Promise<UserProfile | null> {
  const r = await getCurrentUser(getJwt);
  return r.ok ? r.user : null;
}

const jsonClient = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

/** Update user profile (name, email, etc.) - requires JWT */
export async function updateProfile(
  data: {
    full_name?: string;
    email?: string;
    city?: string;
    nationality?: string;
    date_of_birth?: string;
  },
  getJwt: () => string | null
): Promise<void> {
  await jsonClient.patch("/users/profile", data, {
    headers: getAuthHeaders(getJwt),
  });
}

/** Submit KYC data - creates/updates KYC profile. Use OTP or JWT. */
export async function submitKyc(
  data: {
    phone_number: string;
    full_name?: string;
    email?: string;
    city?: string;
    nationality?: string;
    date_of_birth?: string;
    national_id_number?: string;
    documents?: { id_document?: boolean; selfie?: boolean; liveness?: boolean };
    source?: "PAY" | "GO" | "STAYS";
  },
  getToken: () => string | null
): Promise<unknown> {
  const res = await jsonClient.post("/kyc/submit", data, {
    headers: {
      ...getAuthHeaders(getToken),
      "X-Nexa-Product": "STAYS",
    },
  });
  return unwrapResponse(res) ?? res.data;
}

/** Upload ID document - validates file first */
export async function uploadDocument(
  file: File,
  options: {
    side?: "front" | "back";
    document_type?: string;
    document_country?: string;
    national_id_number?: string;
    national_id_number_extracted?: string;
  } = {},
  getToken: () => string | null
): Promise<{ url: string }> {
  const vr = validateImageFile(file);
  if (!vr.valid) throw new Error(vr.error);

  const form = new FormData();
  form.append("file", file);
  form.append("side", options.side ?? "front");
  if (options.document_type) form.append("document_type", options.document_type);
  if (options.document_country)
    form.append("document_country", options.document_country);
  if (options.national_id_number)
    form.append("national_id_number", options.national_id_number);
  if (options.national_id_number_extracted)
    form.append("national_id_number_extracted", options.national_id_number_extracted);

  const res = await axios.post(`${API_BASE}/kyc/upload/document`, form, {
    headers: {
      ...getAuthHeaders(getToken),
      "Content-Type": "multipart/form-data",
    },
    timeout: 30000,
  });
  return (unwrapResponse(res) ?? res.data) ?? { url: "" };
}

/** Upload selfie - validates file first */
export async function uploadSelfie(
  file: File,
  getToken: () => string | null
): Promise<{ url: string }> {
  const vr = validateImageFile(file);
  if (!vr.valid) throw new Error(vr.error);

  const form = new FormData();
  form.append("file", file);

  const res = await axios.post(`${API_BASE}/kyc/upload/selfie`, form, {
    headers: {
      ...getAuthHeaders(getToken),
      "Content-Type": "multipart/form-data",
    },
    timeout: 30000,
  });
  return (unwrapResponse(res) ?? res.data) ?? { url: "" };
}
