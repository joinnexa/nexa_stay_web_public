/**
 * Nexa unified auth API (phone OTP + PIN)
 * Used for guest/host login. Stays uses same auth as Pay/Go.
 */

import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:3000/api/v1";

const client = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

/** Send OTP to phone */
export async function sendOtp(phone_number: string): Promise<{ sent: boolean }> {
  const res = await client.post("/auth/otp/send", { phone_number });
  return res.data?.data ?? res.data ?? { sent: true };
}

/** Verify OTP; returns access_token for sign-in, or otp_session_token for new users to set PIN */
export async function verifyOtp(
  phone_number: string,
  otp: string
): Promise<{
  verified: boolean;
  otp_session_token?: string;
  access_token?: string;
  refresh_token?: string;
  user_id?: string;
  accounts?: Array<{ id: string; account_type: string }>;
}> {
  const res = await client.post("/auth/otp/verify", { phone_number, otp });
  const raw = res.data?.data ?? res.data ?? {};
  return {
    verified: !!raw.verified,
    otp_session_token: raw.otp_session_token,
    access_token: raw.access_token,
    refresh_token: raw.refresh_token,
    user_id: raw.user_id,
    accounts: raw.accounts,
  };
}

/** Set PIN (new users, requires otp_session_token from verifyOtp) */
export async function setPin(
  otp_session_token: string,
  pin: string
): Promise<{ success: boolean }> {
  const res = await client.post("/auth/pin/set", { otp_session_token, pin });
  return res.data?.data ?? res.data ?? { success: true };
}

/** Exchange OTP session for access_token after KYC submission (user created on KYC) */
export async function completeRegistration(
  otp_session_token: string
): Promise<{ access_token: string; refresh_token?: string; user_id: string }> {
  const res = await client.post("/auth/registration/complete", {
    otp_session_token,
  });
  const raw = res.data?.data ?? res.data ?? {};
  return {
    access_token: raw.access_token,
    refresh_token: raw.refresh_token,
    user_id: raw.user_id,
  };
}

/** Verify PIN; returns access_token and user_id for logged-in session */
export async function verifyPin(
  phone_number: string,
  pin: string,
  account_type: string = "CONSUMER"
): Promise<{ verified: boolean; access_token?: string; user_id?: string }> {
  const res = await client.post("/auth/verify-pin", {
    phone_number,
    pin,
    account_type,
  });
  return res.data?.data ?? res.data ?? { verified: false };
}
