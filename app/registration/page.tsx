"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { NavBar } from "@/components/navbar/NavBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { completeRegistration } from "@/lib/auth-api";
import { updateProfile, submitKyc, uploadDocument, uploadSelfie, getCurrentUserOrNull } from "@/lib/kyc-api";
import { normalizeError } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { validateEmail, validateDateOfBirth } from "@/lib/validators";

const steps = [
  { id: 1, label: "Personal Info" },
  { id: 2, label: "ID Document" },
  { id: 3, label: "Selfie" },
  { id: 4, label: "Done" },
];

export default function RegistrationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/listings";
  const { token, tokenType, isAuthenticated, setAuthJwt } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [nationality, setNationality] = useState("MA");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [idType, setIdType] = useState("CNIE");
  const [phone, setPhone] = useState("");
  const [idFrontFile, setIdFrontFile] = useState<File | null>(null);
  const [idBackFile, setIdBackFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const p = searchParams.get("phone");
    if (p) setPhone(p);
  }, [searchParams]);

  useEffect(() => {
    if (typeof window !== "undefined" && !token && !isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(`/registration?redirect=${redirect}`)}`);
    }
  }, [token, isAuthenticated, router, redirect]);

  useEffect(() => {
    if (tokenType === "jwt" && token && step === 1) {
      getCurrentUserOrNull(() => token).then((u) => {
        if (u?.kyc_status === "APPROVED") {
          router.replace(redirect);
        }
      });
    }
  }, [tokenType, token, step, router, redirect]);

  const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();

  const handleSubmitKyc = async () => {
    if (!phone) {
      setError("Phone number is required");
      return;
    }
    const emailRes = validateEmail(email);
    if (!emailRes.valid) {
      setError(emailRes.error ?? "Invalid email");
      return;
    }
    if (dateOfBirth) {
      const dobRes = validateDateOfBirth(dateOfBirth);
      if (!dobRes.valid) {
        setError(dobRes.error ?? "Invalid date of birth");
        return;
      }
    }
    if (!fullName) {
      setError("Full name is required");
      return;
    }
    if (!idFrontFile) {
      setError("ID document front is required");
      return;
    }
    if (idType === "CNIE" && !idBackFile) {
      setError("ID document back is required for CNIE");
      return;
    }
    if (!selfieFile) {
      setError("Selfie is required");
      return;
    }

    setLoading(true);
    setError("");
    const getToken = () => token;
    try {
      await submitKyc(
        {
          phone_number: phone,
          full_name: fullName,
          email: email || undefined,
          city: city || undefined,
          nationality: nationality || undefined,
          date_of_birth: dateOfBirth || undefined,
          national_id_number: idNumber || undefined,
          documents: { id_document: true, selfie: true },
          source: "STAYS",
        },
        getToken
      );

      await uploadDocument(
        idFrontFile,
        {
          side: "front",
          document_type: idType,
          document_country: nationality || "MA",
          national_id_number: idNumber || undefined,
        },
        getToken
      );

      if (idBackFile) {
        await uploadDocument(
          idBackFile,
          {
            side: "back",
            document_type: idType,
            document_country: nationality || "MA",
          },
          getToken
        );
      }

      await uploadSelfie(selfieFile, getToken);

      if (fullName) {
        await updateProfile(
          {
            full_name: fullName,
            email: email || undefined,
            city: city || undefined,
            nationality: nationality || undefined,
            date_of_birth: dateOfBirth || undefined,
          },
          getToken
        );
      }

      // Exchange OTP session for JWT. Only when we have OTP token.
      if (tokenType === "otp_session" && token) {
        const result = await completeRegistration(token);
        if (result?.access_token) {
          setAuthJwt(result.access_token);
        }
      }

      setSubmitted(true);
      setStep(4);
    } catch (err: unknown) {
      const apiErr = normalizeError(err);
      setError(apiErr.message || "KYC submission failed");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return null;
  }

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
              Complete your profile
            </h2>
            <p className="text-white/75 text-base mb-10">
              Identity verification protects everyone. Your documents will be
              reviewed by our team — you can browse listings while we verify.
            </p>
            <div className="flex flex-col gap-3.5">
              {[
                { icon: "🪪", text: "ID verified for real trust" },
                { icon: "🔒", text: "Data used only for verification" },
                { icon: "✓", text: "Booking unlocks after approval" },
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
          <div className="w-full max-w-[460px]">
            <div className="flex gap-0 mb-10">
              {steps.map((s, i) => (
                <div
                  key={s.id}
                  className={cn(
                    "flex-1 text-center relative",
                    i < steps.length - 1 &&
                      "after:content-[''] after:absolute after:top-4 after:left-1/2 after:right-[-50%] after:h-0.5 after:bg-nexa-line after:z-0",
                    step > s.id && "after:bg-nexa-primary"
                  )}
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-2 relative z-10 transition-all",
                      step > s.id
                        ? "border-nexa-primary bg-nexa-primary text-white"
                        : step === s.id
                        ? "border-nexa-primary text-nexa-primary border-2 bg-nexa-bg"
                        : "border-2 border-nexa-line text-nexa-ink-4 bg-nexa-bg"
                    )}
                  >
                    {step > s.id ? "✓" : s.id}
                  </div>
                  <div
                    className={cn(
                      "text-[0.72rem]",
                      step === s.id
                        ? "text-nexa-primary font-semibold"
                        : "text-nexa-ink-4"
                    )}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            {step === 1 && (
              <div>
                <h2 className="text-2xl font-semibold mb-2">
                  Your information
                </h2>
                <p className="text-nexa-ink-3 text-sm mb-7">
                  Required for identity verification. Same account as Nexa Pay
                  and Nexa Go.
                </p>
                <div className="grid grid-cols-2 gap-3.5 mb-5">
                  <div>
                    <label className="block text-sm font-semibold text-nexa-ink-2 mb-2">
                      First Name <span className="text-nexa-primary">*</span>
                    </label>
                    <Input
                      placeholder="Youssef"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-nexa-ink-2 mb-2">
                      Last Name <span className="text-nexa-primary">*</span>
                    </label>
                    <Input
                      placeholder="Ait Omar"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-nexa-ink-2 mb-2">
                    Phone
                  </label>
                  <Input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+212 6 XX XX XX XX"
                    readOnly
                    className="bg-nexa-bg-2"
                  />
                </div>
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-nexa-ink-2 mb-2">
                    Email <span className="text-nexa-primary">*</span>
                  </label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-nexa-ink-2 mb-2">
                    City
                  </label>
                  <Input
                    placeholder="Casablanca"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3.5 mb-5">
                  <div>
                    <label className="block text-sm font-semibold text-nexa-ink-2 mb-2">
                      Nationality
                    </label>
                    <select
                      className="w-full h-11 rounded-xl border-2 border-nexa-line bg-white px-4 py-3 text-sm font-sans text-nexa-ink outline-none focus:border-nexa-primary"
                      value={nationality}
                      onChange={(e) => setNationality(e.target.value)}
                    >
                      <option value="MA">Morocco</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-nexa-ink-2 mb-2">
                      Date of Birth
                    </label>
                    <Input
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                    />
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-nexa-ink-2 mb-2">
                    ID Number
                  </label>
                  <Input
                    placeholder="CNIE or passport number"
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                  />
                </div>
                <Button
                  className="w-full justify-center"
                  onClick={() => setStep(2)}
                  disabled={!firstName || !lastName}
                >
                  Continue →
                </Button>
                <p className="text-[0.78rem] text-nexa-ink-4 text-center mt-4">
                  You can browse while verification is pending. Booking unlocks
                  after approval.
                </p>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-2xl font-semibold mb-2">
                  ID document
                </h2>
                <p className="text-nexa-ink-3 text-sm mb-7">
                  Upload a clear photo of your ID. For Moroccan CNIE, front and
                  back required.
                </p>
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-nexa-ink-2 mb-2">
                    ID Type
                  </label>
                  <select
                    className="w-full h-11 rounded-xl border-2 border-nexa-line bg-white px-4 py-3 text-sm font-sans text-nexa-ink outline-none focus:border-nexa-primary"
                    value={idType}
                    onChange={(e) => setIdType(e.target.value)}
                  >
                    <option value="CNIE">CNIE (Moroccan ID)</option>
                    <option value="PASSPORT">Passport</option>
                    <option value="NATIONAL_ID">National ID</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3.5 mb-5">
                  <div>
                    <label className="block text-sm font-semibold text-nexa-ink-2 mb-2">
                      ID Front <span className="text-nexa-primary">*</span>
                    </label>
                    <div className="border-2 border-dashed border-nexa-line rounded-xl p-5 text-center cursor-pointer hover:border-nexa-primary hover:bg-nexa-primary-soft transition-colors">
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        id="id-front"
                        onChange={(e) => setIdFrontFile(e.target.files?.[0] ?? null)}
                      />
                      <label
                        htmlFor="id-front"
                        className="cursor-pointer block"
                      >
                        <div className="text-3xl mb-2">📄</div>
                        <div className="text-sm text-nexa-ink-4">
                          {idFrontFile ? idFrontFile.name : "Upload front"}
                        </div>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-nexa-ink-2 mb-2">
                      ID Back {idType === "CNIE" && <span className="text-nexa-primary">*</span>}
                    </label>
                    <div className="border-2 border-dashed border-nexa-line rounded-xl p-5 text-center cursor-pointer hover:border-nexa-primary hover:bg-nexa-primary-soft transition-colors">
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        id="id-back"
                        onChange={(e) => setIdBackFile(e.target.files?.[0] ?? null)}
                      />
                      <label htmlFor="id-back" className="cursor-pointer block">
                        <div className="text-3xl mb-2">📄</div>
                        <div className="text-sm text-nexa-ink-4">
                          {idBackFile ? idBackFile.name : "Upload back"}
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="ghost"
                    className="flex-1"
                    onClick={() => setStep(1)}
                  >
                    ← Back
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => setStep(3)}
                    disabled={!idFrontFile || (idType === "CNIE" && !idBackFile)}
                  >
                    Continue →
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="text-2xl font-semibold mb-2">Selfie</h2>
                <p className="text-nexa-ink-3 text-sm mb-7">
                  A clear photo of your face for verification.
                </p>
                <div className="mb-6">
                  <div className="border-2 border-dashed border-nexa-line rounded-xl p-8 text-center cursor-pointer hover:border-nexa-primary hover:bg-nexa-primary-soft transition-colors">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      id="selfie"
                      onChange={(e) => setSelfieFile(e.target.files?.[0] ?? null)}
                    />
                    <label htmlFor="selfie" className="cursor-pointer block">
                      <div className="text-4xl mb-2">🤳</div>
                      <div className="text-sm text-nexa-ink-4">
                        {selfieFile ? selfieFile.name : "Upload selfie"}
                      </div>
                    </label>
                  </div>
                </div>
                {error && (
                  <p className="text-red-600 text-sm mb-4" role="alert">
                    {error}
                  </p>
                )}
                <div className="flex gap-3">
                  <Button
                    variant="ghost"
                    className="flex-1"
                    onClick={() => setStep(2)}
                  >
                    ← Back
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleSubmitKyc}
                    disabled={!selfieFile || loading}
                  >
                    {loading ? "Submitting…" : "Submit & Finish →"}
                  </Button>
                </div>
              </div>
            )}

            {step === 4 && submitted && (
              <div className="text-center py-5">
                <div className="text-5xl mb-4">⏳</div>
                <h2 className="text-2xl font-semibold mb-2">
                  Verification submitted
                </h2>
                <p className="text-nexa-ink-3 text-sm mb-6">
                  Your documents are under review. They will appear in the Nexa
                  Stays admin dashboard. You can browse while we verify.
                </p>
                <div className="flex flex-col gap-2.5 mb-6 text-left">
                  <div className="flex items-center gap-2.5 py-3 px-4 rounded-xl text-sm bg-green-50 text-green-800">
                    ✅ Browse listings
                  </div>
                  <div className="flex items-center gap-2.5 py-3 px-4 rounded-xl text-sm bg-green-50 text-green-800">
                    ✅ Save favorites
                  </div>
                  <div className="flex items-center gap-2.5 py-3 px-4 rounded-xl text-sm bg-nexa-bg-2 text-nexa-ink-4">
                    🔒 Book stays — unlocks after approval
                  </div>
                </div>
                <Button className="w-full justify-center" asChild>
                  <Link href={redirect}>Browse Stays →</Link>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-center mt-2.5"
                  asChild
                >
                  <Link href="/">Go to Home</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
