"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { NavBar } from "@/components/navbar/NavBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { getHostVerification, submitHostVerification } from "@/lib/stays-api";
import { useAuth } from "@/contexts/AuthContext";

const hostSteps = [
  "Host Type",
  "Create Account",
  "Confirm Contact",
  "Identity Verification",
  "Property Basics",
  "Description & Rules",
  "Pricing",
  "Check-in Contact",
  "Photos",
  "Walkthrough Video",
  "Submit Listing",
];

const progressWidths: Record<number, number> = {
  1: 8, 2: 18, 3: 27, 4: 36, 5: 45, 6: 55, 7: 64, 8: 73, 9: 82, 10: 91, 11: 100,
};

function HostVerificationStep({
  token,
  isAuthenticated,
  hostStatus,
  hostLoading,
  hostSubmitLoading,
  hostError,
  docType,
  docNumber,
  onDocTypeChange,
  onDocNumberChange,
  onLoadStatus,
  onSubmit,
  onBack,
  onContinue,
  onLoginRedirect,
}: {
  token: string | null;
  isAuthenticated: boolean;
  hostStatus: { status: string; message?: string } | null;
  hostLoading: boolean;
  hostSubmitLoading: boolean;
  hostError: string | null;
  docType: string;
  docNumber: string;
  onDocTypeChange: (v: string) => void;
  onDocNumberChange: (v: string) => void;
  onLoadStatus: () => void;
  onSubmit: () => Promise<void>;
  onBack: () => void;
  onContinue: () => void;
  onLoginRedirect: () => void;
}) {
  useEffect(() => {
    if (isAuthenticated && token) onLoadStatus();
  }, [isAuthenticated, token]);

  if (!isAuthenticated || !token) {
    return (
      <div>
        <span className="text-xs font-semibold uppercase text-nexa-primary">Step 4 of 11</span>
        <h2 className="text-2xl font-semibold mt-2 mb-2">Identity Verification</h2>
        <p className="text-nexa-ink-3 mb-8">
          Sign in or create an account to submit host verification.
        </p>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={onBack}>← Back</Button>
          <Button onClick={onLoginRedirect}>Sign in to continue</Button>
        </div>
      </div>
    );
  }

  if (hostStatus?.status === "APPROVED") {
    return (
      <div>
        <span className="text-xs font-semibold uppercase text-nexa-primary">Step 4 of 11</span>
        <h2 className="text-2xl font-semibold mt-2 mb-2">Identity Verification</h2>
        <div className="mb-6 p-4 rounded-xl bg-green-50 text-green-800">
          ✓ Your host identity is verified. You can publish listings.
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={onBack}>← Back</Button>
          <Button onClick={onContinue}>Continue →</Button>
        </div>
      </div>
    );
  }

  if (hostStatus?.status === "PENDING") {
    return (
      <div>
        <span className="text-xs font-semibold uppercase text-nexa-primary">Step 4 of 11</span>
        <h2 className="text-2xl font-semibold mt-2 mb-2">Identity Verification</h2>
        <div className="mb-6 p-4 rounded-xl bg-yellow-50 text-yellow-800">
          ⏳ Your verification is under review. You can continue the setup.
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={onBack}>← Back</Button>
          <Button onClick={onContinue}>Continue →</Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <span className="text-xs font-semibold uppercase text-nexa-primary">Step 4 of 11</span>
      <h2 className="text-2xl font-semibold mt-2 mb-2">Verify your identity</h2>
      <p className="text-nexa-ink-3 mb-8">
        This protects guests and property owners. Required to publish listings.
      </p>
      {hostLoading ? (
        <div className="py-8 text-center text-nexa-ink-4">Loading status…</div>
      ) : (
        <>
          {hostError && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-800 text-sm">{hostError}</div>
          )}
          <div className="grid grid-cols-2 gap-3.5 mb-5">
            <div>
              <label className="block text-sm font-semibold mb-2">ID Type *</label>
              <select
                value={docType}
                onChange={(e) => onDocTypeChange(e.target.value)}
                className="w-full h-11 rounded-xl border-2 border-nexa-line bg-white px-4 py-3 text-sm"
              >
                <option value="CNIE">CNIE</option>
                <option value="PASSPORT">Passport</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">ID Number</label>
              <Input
                placeholder="Your ID number"
                value={docNumber}
                onChange={(e) => onDocNumberChange(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3.5 mb-5">
            <div className="border-2 border-dashed border-nexa-line rounded-xl p-7 text-center cursor-pointer hover:border-nexa-primary hover:bg-nexa-primary-soft transition-colors">
              <div className="text-3xl mb-2">📄</div>
              <div className="text-sm text-nexa-ink-4">ID Front* (upload coming soon)</div>
            </div>
            <div className="border-2 border-dashed border-nexa-line rounded-xl p-7 text-center cursor-pointer hover:border-nexa-primary hover:bg-nexa-primary-soft transition-colors">
              <div className="text-3xl mb-2">📄</div>
              <div className="text-sm text-nexa-ink-4">ID Back* (upload coming soon)</div>
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">Profile Photo *</label>
            <div className="border-2 border-dashed border-nexa-line rounded-xl p-7 text-center cursor-pointer hover:border-nexa-primary hover:bg-nexa-primary-soft transition-colors">
              <div className="text-3xl mb-2">🤳</div>
              <div className="text-sm text-nexa-ink-3">Clear face photo (upload coming soon)</div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={onBack}>← Back</Button>
            <Button onClick={onSubmit} disabled={hostSubmitLoading}>
              {hostSubmitLoading ? "Submitting…" : "Submit & Continue →"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default function HostPage() {
  const router = useRouter();
  const { token, isAuthenticated } = useAuth();
  const [step, setStep] = useState(1);
  const [hostType, setHostType] = useState<"apartment" | "hotel">("apartment");
  const [hostStatus, setHostStatus] = useState<{ status: string; message?: string } | null>(null);
  const [hostLoading, setHostLoading] = useState(false);
  const [hostSubmitLoading, setHostSubmitLoading] = useState(false);
  const [hostError, setHostError] = useState<string | null>(null);
  const [docType, setDocType] = useState("CNIE");
  const [docNumber, setDocNumber] = useState("");

  return (
    <>
      <NavBar />
      <main className="pt-[72px] min-h-screen grid grid-cols-1 lg:grid-cols-[340px_1fr]">
        <aside className="bg-gradient-to-br from-nexa-ink to-nexa-ink-2 p-10 overflow-y-auto sticky top-[72px] h-[calc(100vh-72px)]">
          <Link
            href="/"
            className="flex items-center gap-2.5 mb-10 cursor-pointer hover:opacity-90"
          >
            <div className="relative w-9 h-9 rounded-lg overflow-hidden">
              <Image
                src="/images/nexastays.png"
                alt="Nexa Stays"
                fill
                className="object-cover"
              />
            </div>
            <span className="font-display text-xl font-bold text-white">
              Host Setup
            </span>
          </Link>
          <div className="mb-8">
            <div className="text-xs font-bold uppercase tracking-wider text-white/40 mb-3">
              Progress
            </div>
            <div className="h-1 bg-white/15 rounded-sm">
              <div
                className="h-full rounded-sm bg-gradient-to-r from-nexa-primary to-nexa-primary-light transition-all duration-400"
                style={{ width: `${progressWidths[step]}%` }}
              />
            </div>
          </div>
          <nav className="flex flex-col gap-1.5">
            {hostSteps.map((label, i) => (
              <button
                key={label}
                onClick={() => setStep(i + 1)}
                className={cn(
                  "flex items-center gap-3 py-2.5 px-3.5 rounded-xl transition-colors text-left",
                  step === i + 1
                    ? "bg-nexa-primary/20"
                    : "hover:bg-white/5"
                )}
              >
                <div
                  className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center text-[0.78rem] font-bold border shrink-0",
                    step > i + 1
                      ? "border-nexa-primary bg-nexa-primary text-white"
                      : step === i + 1
                      ? "border-nexa-primary text-nexa-primary bg-nexa-primary/15"
                      : "border-white/20 text-white/40"
                  )}
                >
                  {step > i + 1 ? "✓" : i + 1}
                </div>
                <span
                  className={cn(
                    "text-sm",
                    step === i + 1 ? "text-white font-semibold" : "text-white/50",
                    step > i + 1 && "text-white/70"
                  )}
                >
                  {label}
                </span>
              </button>
            ))}
          </nav>
          <div className="mt-6 bg-white/5 rounded-xl p-4 text-xs text-white/50">
            <strong className="text-white/80 block mb-1">🔒 Privacy & Safety</strong>
            Phone, email, and exact address are masked until both sides are
            verified and reservation is confirmed.
          </div>
        </aside>

        <div className="bg-nexa-bg py-12 px-20 pb-16">
          <div className="max-w-[600px]">
            {step === 1 && (
              <div>
                <span className="text-xs font-semibold tracking-[0.12em] uppercase text-nexa-primary">
                  Step 1 of 11
                </span>
                <h2 className="text-2xl font-semibold mt-2 mb-2">
                  Become a Host on Nexa Stays
                </h2>
                <p className="text-nexa-ink-3 mb-8">
                  Safer hosting, verified guests, and lower fees.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <button
                    onClick={() => setHostType("apartment")}
                    className={cn(
                      "border-2 rounded-[22px] p-7 text-center cursor-pointer transition-all",
                      hostType === "apartment"
                        ? "border-nexa-primary bg-nexa-primary-soft"
                        : "border-nexa-line hover:border-nexa-primary"
                    )}
                  >
                    <div className="text-4xl mb-3">🏠</div>
                    <h3 className="font-semibold mb-1">Apartment Owner</h3>
                    <p className="text-sm text-nexa-ink-3">
                      Apartments, villas, single units
                    </p>
                  </button>
                  <button
                    onClick={() => setHostType("hotel")}
                    className={cn(
                      "border-2 rounded-[22px] p-7 text-center cursor-pointer transition-all",
                      hostType === "hotel"
                        ? "border-nexa-primary bg-nexa-primary-soft"
                        : "border-nexa-line hover:border-nexa-primary"
                    )}
                  >
                    <div className="text-4xl mb-3">🏨</div>
                    <h3 className="font-semibold mb-1">Hotel Owner / Manager</h3>
                    <p className="text-sm text-nexa-ink-3">Hotels, multiple rooms</p>
                  </button>
                </div>
                <Button onClick={() => setStep(2)}>Continue →</Button>
              </div>
            )}

            {step === 2 && (
              <div>
                <span className="text-xs font-semibold uppercase text-nexa-primary">
                  Step 2 of 11
                </span>
                <h2 className="text-2xl font-semibold mt-2 mb-2">
                  Create your host account
                </h2>
                <p className="text-nexa-ink-3 mb-8">
                  Identity verification is required to protect hosts and guests.
                </p>
                <div className="space-y-5 mb-8">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Full Legal Name <span className="text-nexa-primary">*</span>
                    </label>
                    <Input placeholder="As on your ID" />
                  </div>
                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Phone <span className="text-nexa-primary">*</span>
                      </label>
                      <Input type="tel" placeholder="+212 6 XX XX XX XX" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Email <span className="text-nexa-primary">*</span>
                      </label>
                      <Input type="email" placeholder="you@example.com" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Password <span className="text-nexa-primary">*</span>
                    </label>
                    <Input type="password" placeholder="Create a strong password" />
                  </div>
                  <label className="flex items-start gap-2.5 text-sm cursor-pointer">
                    <input type="checkbox" className="accent-nexa-primary mt-1" />
                    I agree to the{" "}
                    <Link href="/terms" className="text-nexa-primary hover:underline">
                      Terms
                    </Link>{" "}
                    &{" "}
                    <Link href="/privacy" className="text-nexa-primary hover:underline">
                      Privacy
                    </Link>
                  </label>
                </div>
                <div className="flex gap-3">
                  <Button variant="ghost" onClick={() => setStep(1)}>
                    ← Back
                  </Button>
                  <Button onClick={() => setStep(3)}>Continue →</Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <span className="text-xs font-semibold uppercase text-nexa-primary">
                  Step 3 of 11
                </span>
                <h2 className="text-2xl font-semibold mt-2 mb-2">
                  Confirm Contact
                </h2>
                <p className="text-nexa-ink-3 mb-8">
                  Please complete this step to continue.
                </p>
                <div className="flex gap-3">
                  <Button variant="ghost" onClick={() => setStep(2)}>← Back</Button>
                  <Button onClick={() => setStep(4)}>Continue →</Button>
                </div>
              </div>
            )}

            {step === 4 && (
              <HostVerificationStep
                token={token}
                isAuthenticated={isAuthenticated}
                hostStatus={hostStatus}
                hostLoading={hostLoading}
                hostSubmitLoading={hostSubmitLoading}
                hostError={hostError}
                docType={docType}
                docNumber={docNumber}
                onDocTypeChange={setDocType}
                onDocNumberChange={setDocNumber}
                onLoadStatus={() => {
                  setHostLoading(true);
                  setHostError(null);
                  getHostVerification(token)
                    .then(setHostStatus)
                    .catch((e) => setHostError(e instanceof Error ? e.message : "Failed to load"))
                    .finally(() => setHostLoading(false));
                }}
                onSubmit={async () => {
                  setHostSubmitLoading(true);
                  setHostError(null);
                  try {
                    await submitHostVerification(
                      {
                        document_type: docType,
                        document_number_hash: docNumber ? btoa(docNumber).slice(0, 64) : undefined,
                      },
                      token
                    );
                    setHostStatus({ status: "PENDING", message: "Verification submitted. Your host application will be reviewed shortly." });
                    setStep(5);
                  } catch (e) {
                    setHostError(e instanceof Error ? e.message : "Submission failed");
                  } finally {
                    setHostSubmitLoading(false);
                  }
                }}
                onBack={() => setStep(3)}
                onContinue={() => setStep(5)}
                onLoginRedirect={() => router.push("/registration?redirect=/host")}
              />
            )}

            {step >= 5 && step <= 10 && (
              <div>
                <span className="text-xs font-semibold uppercase text-nexa-primary">
                  Step {step} of 11
                </span>
                <h2 className="text-2xl font-semibold mt-2 mb-2">
                  {hostSteps[step - 1]}
                </h2>
                <p className="text-nexa-ink-3 mb-8">
                  Please complete this step to continue.
                </p>
                <div className="flex gap-3">
                  <Button variant="ghost" onClick={() => setStep(step - 1)}>
                    ← Back
                  </Button>
                  <Button onClick={() => setStep(step + 1)}>
                    {step === 10 ? "Submit for Approval →" : "Continue →"}
                  </Button>
                </div>
              </div>
            )}

            {step === 11 && (
              <div>
                <span className="text-xs font-semibold uppercase text-nexa-primary">
                  Step 11 of 11
                </span>
                <h2 className="text-2xl font-semibold mt-2 mb-2">
                  Submit your listing
                </h2>
                <p className="text-nexa-ink-3 mb-8">
                  Review your checklist before going live.
                </p>
                <div className="space-y-2.5 mb-6">
                  {[
                    "✅ Host identity verified (or pending review)",
                    "✅ Photos uploaded (12 minimum)",
                    "✅ Walkthrough video uploaded",
                    "✅ Pricing set",
                    "✅ House rules set",
                    "✅ Check-in contact added",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2.5 py-3 px-4 rounded-xl text-sm bg-green-50 text-green-800"
                    >
                      {item}
                    </div>
                  ))}
                </div>
                <div className="bg-nexa-primary-soft rounded-xl p-4 text-sm text-nexa-primary-dark mb-7">
                  After submission, your listing is reviewed by Nexa. You&apos;ll
                  be notified once it&apos;s approved and ready to go live.
                </div>
                <div className="flex gap-3">
                  <Button variant="ghost" onClick={() => setStep(10)}>
                    ← Back
                  </Button>
                  <Button size="lg">🚀 Submit for Review</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
