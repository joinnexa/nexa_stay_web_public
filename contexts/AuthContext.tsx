"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const JWT_KEY = "nexa_access_token";
const OTP_SESSION_KEY = "nexa_otp_session_token";

export type TokenType = "jwt" | "otp_session" | "none";

export interface User {
  id: string;
  phone_number?: string;
  full_name?: string;
  email?: string;
  kyc_status?: string;
  account_type?: string;
  [key: string]: unknown;
}

interface AuthContextValue {
  token: string | null;
  tokenType: TokenType;
  user: User | null;
  ready: boolean;
  isAuthenticated: boolean;
  /** Set JWT after login or registration complete */
  setAuthJwt: (accessToken: string) => void;
  /** Set OTP session token for registration flow */
  setAuthOtpSession: (otpSessionToken: string) => void;
  logout: () => void;
  /** For backward compat during migration */
  userId: string | null;
  setAuth: (token: string, userId: string) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/** Fetch current user when we have JWT. Used internally. */
async function fetchCurrentUser(
  baseUrl: string,
  jwt: string
): Promise<User | null> {
  const res = await fetch(`${baseUrl}/users/me`, {
    headers: { Authorization: `Bearer ${jwt}` },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data?.id ? data : null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [tokenType, setTokenType] = useState<TokenType>("none");
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  const apiBase =
    typeof window !== "undefined"
      ? process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:3000/api/v1"
      : "";

  useEffect(() => {
    if (typeof window === "undefined") return;
    const jwt = localStorage.getItem(JWT_KEY);
    const otp = localStorage.getItem(OTP_SESSION_KEY);
    if (jwt) {
      setToken(jwt);
      setTokenType("jwt");
      fetchCurrentUser(apiBase, jwt).then(setUser);
    } else if (otp) {
      setToken(otp);
      setTokenType("otp_session");
      setUser(null);
    } else {
      setToken(null);
      setTokenType("none");
      setUser(null);
    }
    setReady(true);
  }, [apiBase]);

  const setAuthJwt = useCallback((accessToken: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(JWT_KEY, accessToken);
      localStorage.removeItem(OTP_SESSION_KEY);
    }
    setToken(accessToken);
    setTokenType("jwt");
    setUser(null);
    const base =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:3000/api/v1";
    fetchCurrentUser(base, accessToken).then(setUser);
  }, []);

  const setAuthOtpSession = useCallback((otpSessionToken: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(OTP_SESSION_KEY, otpSessionToken);
      localStorage.removeItem(JWT_KEY);
    }
    setToken(otpSessionToken);
    setTokenType("otp_session");
    setUser(null);
  }, []);

  const logout = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(JWT_KEY);
      localStorage.removeItem(OTP_SESSION_KEY);
    }
    setToken(null);
    setTokenType("none");
    setUser(null);
  }, []);

  /** Legacy: treats token as JWT if userId looks like UUID, else OTP session */
  const setAuth = useCallback((t: string, userId: string) => {
    const looksLikeUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        userId
      );
    if (looksLikeUuid) {
      setAuthJwt(t);
    } else {
      setAuthOtpSession(t);
    }
  }, [setAuthJwt, setAuthOtpSession]);

  const value: AuthContextValue = {
    token,
    tokenType,
    user,
    ready,
    isAuthenticated: tokenType === "jwt" && !!token,
    setAuthJwt,
    setAuthOtpSession,
    logout,
    userId: user?.id ?? null,
    setAuth,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
