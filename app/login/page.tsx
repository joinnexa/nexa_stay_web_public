"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { NavBar } from "@/components/navbar/NavBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { sendOtp, verifyOtp } from "@/lib/auth-api";
import { validatePhone } from "@/lib/validators";
import { normalizeError } from "@/lib/api-client";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/listings";
  const { setAuthJwt, setAuthOtpSession } = useAuth();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const normalized = phone.replace(/\s/g, "");
    const vr = validatePhone(normalized);
    if (!vr.valid) {
      setError(vr.error ?? "Enter a valid phone number");
      return;
    }
    setLoading(true);
    try {
      await sendOtp(normalized);
      setPhone(normalized);
      setStep("otp");
    } catch (err: unknown) {
      const apiErr = normalizeError(err);
      setError(apiErr.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!otp || otp.length < 4) {
      setError("Enter the code we sent");
      return;
    }
    setLoading(true);
    try {
      const res = await verifyOtp(phone, otp);
      const data = res && typeof res === "object" ? res : {};
      const accessToken =
        "access_token" in data
          ? (data as { access_token?: string }).access_token
          : undefined;
      const otpSessionToken =
        "otp_session_token" in data
          ? (data as { otp_session_token?: string }).otp_session_token
          : undefined;
      const accounts =
        "accounts" in data
          ? (data as { accounts?: unknown[] }).accounts
          : undefined;
      const isExistingUser = Array.isArray(accounts) && accounts.length > 0;

      if (accessToken) {
        setAuthJwt(accessToken);
        if (isExistingUser) {
          router.push(redirect);
        } else {
          router.push(
            `/registration?redirect=${encodeURIComponent(redirect)}&phone=${encodeURIComponent(phone)}`
          );
        }
        return;
      }
      if (otpSessionToken) {
        setAuthOtpSession(otpSessionToken);
        router.push(
          `/registration?redirect=${encodeURIComponent(redirect)}&phone=${encodeURIComponent(phone)}`
        );
        return;
      }
      setError("Could not complete sign in");
    } catch (err: unknown) {
      const apiErr = normalizeError(err);
      if (
        apiErr.status === 404 ||
        apiErr.message?.toLowerCase().includes("not found")
      ) {
        router.push(
          `/registration?redirect=${encodeURIComponent(redirect)}&phone=${encodeURIComponent(phone)}`
        );
        return;
      }
      setError(apiErr.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavBar />
      <main className="pt-[72px] min-h-screen grid grid-cols-1 lg:grid-cols-2">
        <div className="bg-gradient-to-br from-nexa-primary to-nexa-primary-dark flex items-center justify-center p-20 pl-16 relative overflow-hidden min-h-[calc(100vh-72px)]">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 max-w-[400px]">
            <Link
              href="/"
              className="flex items-center gap-2.5 mb-12 cursor-pointer hover:opacity-90"
            >
              <div className="relative w-11 h-11 rounded-lg overflow-hidden">
                <Image
                  src="/images/nexastays.png"
                  alt="Nexa Stays"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="font-display text-2xl font-bold text-white">
                Nexa Stays
              </span>
            </Link>
            <h2 className="text-white text-2xl font-semibold mb-4">
              Sign in with your phone
            </h2>
            <p className="text-white/75 text-base mb-10">
              We&apos;ll send a one-time code to verify your number.
            </p>
            <div className="flex flex-col gap-3.5">
              {[
                { icon: "📱", text: "Enter your phone number" },
                { icon: "✉️", text: "Receive a one-time code" },
                { icon: "✓", text: "Confirm and sign in" },
              ].map((item) => (
                <div
                  key={item.text}
                  className="flex items-center gap-3 text-white/85 text-sm"
                >
                  <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-sm shrink-0">
                    {item.icon}
                  </div>
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-nexa-bg flex items-center justify-center p-10 pl-16">
          <div className="w-full max-w-[400px]">
            {step === "phone" && (
              <form onSubmit={handleSendOtp}>
                <h2 className="text-2xl font-semibold mb-2">Enter your phone</h2>
                <p className="text-nexa-ink-3 text-sm mb-6">
                  We&apos;ll send a 6-digit code to verify your number.
                </p>
                <div className="mb-5">
                  <Input
                    type="tel"
                    placeholder="+212 6 XX XX XX XX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    autoFocus
                  />
                </div>
                {error && (
                  <p className="text-red-600 text-sm mb-4" role="alert">
                    {error}
                  </p>
                )}
                <Button
                  type="submit"
                  className="w-full justify-center"
                  disabled={loading}
                >
                  {loading ? "Sending…" : "Send code"}
                </Button>
              </form>
            )}

            {step === "otp" && (
              <form onSubmit={handleVerifyOtp}>
                <h2 className="text-2xl font-semibold mb-2">Enter the code</h2>
                <p className="text-nexa-ink-3 text-sm mb-6">
                  We sent a 6-digit code to {phone}
                </p>
                <div className="mb-5">
                  <Input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="000000"
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, ""))
                    }
                    autoFocus
                  />
                </div>
                {error && (
                  <p className="text-red-600 text-sm mb-4" role="alert">
                    {error}
                  </p>
                )}
                <Button
                  type="submit"
                  className="w-full justify-center"
                  disabled={loading}
                >
                  {loading ? "Verifying…" : "Sign in"}
                </Button>
                <button
                  type="button"
                  onClick={() => {
                    setStep("phone");
                    setOtp("");
                    setError("");
                  }}
                  className="w-full mt-4 text-sm text-nexa-ink-4 hover:text-nexa-primary"
                >
                  Use a different number
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
