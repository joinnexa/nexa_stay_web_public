"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { NavBar } from "@/components/navbar/NavBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  getHostVerification,
  submitHostVerification,
  uploadHostDocumentFront,
  uploadHostDocumentBack,
  uploadHostSelfie,
  createHostListing,
  uploadListingPhoto,
  uploadListingWalkthrough,
} from "@/lib/stays-api";
import { useAuth } from "@/contexts/AuthContext";
import { Menu } from "lucide-react";

const hostSteps = [
  "Host Type",
  "Create Account",
  "Confirm Contact",
  "Identity Verification",
  "Verification Submitted",
  "Property Basics",
  "Description & Rules",
  "Pricing",
  "Check-in Contact",
  "Photos",
  "Walkthrough Video",
  "Submit Listing",
];

const progressWidths: Record<number, number> = {
  1: 8, 2: 16, 3: 25, 4: 33, 5: 41, 6: 50, 7: 58, 8: 66, 9: 75, 10: 83, 11: 91, 12: 100,
};

function HostVerificationStep({
  token,
  isAuthenticated,
  user,
  hostStatus,
  hostLoading,
  hostSubmitLoading,
  hostError,
  docType,
  docNumber,
  docFrontAssetId,
  docBackAssetId,
  selfieAssetId,
  docFrontLoading,
  docBackLoading,
  selfieLoading,
  onDocTypeChange,
  onDocNumberChange,
  onDocFrontUpload,
  onDocBackUpload,
  onSelfieUpload,
  onLoadStatus,
  onSubmit,
  onSubmitUseExistingKyc,
  onBack,
  onContinue,
  onLoginRedirect,
}: {
  token: string | null;
  isAuthenticated: boolean;
  user: { kyc_status?: string } | null;
  hostStatus: { status: string; message?: string } | null;
  hostLoading: boolean;
  hostSubmitLoading: boolean;
  hostError: string | null;
  docType: string;
  docNumber: string;
  docFrontAssetId: string | null;
  docBackAssetId: string | null;
  selfieAssetId: string | null;
  docFrontLoading: boolean;
  docBackLoading: boolean;
  selfieLoading: boolean;
  onDocTypeChange: (v: string) => void;
  onDocNumberChange: (v: string) => void;
  onDocFrontUpload: (file: File) => void;
  onDocBackUpload: (file: File) => void;
  onSelfieUpload: (file: File) => void;
  onLoadStatus: () => void;
  onSubmit: () => Promise<void>;
  onSubmitUseExistingKyc: () => Promise<void>;
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
        <span className="text-xs font-semibold uppercase text-nexa-primary">Step 4 of 12</span>
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
        <span className="text-xs font-semibold uppercase text-nexa-primary">Step 4 of 12</span>
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
        <span className="text-xs font-semibold uppercase text-nexa-primary">Step 4 of 12</span>
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

  const kycApproved = (user?.kyc_status || "").toUpperCase() === "APPROVED" || (user?.kyc_status || "").toUpperCase() === "VERIFIED";

  return (
    <div>
      <span className="text-xs font-semibold uppercase text-nexa-primary">Step 4 of 12</span>
      <h2 className="text-2xl font-semibold mt-2 mb-2">Verify your identity</h2>
      <p className="text-nexa-ink-3 mb-6">
        This protects guests and property owners. Required to publish listings.
      </p>
      {hostLoading ? (
        <div className="py-8 text-center text-nexa-ink-4">Loading status…</div>
      ) : (
        <>
          {kycApproved && (
            <div className="mb-6 p-5 rounded-xl bg-nexa-primary-soft border border-nexa-primary/20">
              <h3 className="font-semibold text-nexa-ink mb-2">Use your verified identity</h3>
              <p className="text-sm text-nexa-ink-3 mb-4">
                Your identity is already verified (name, phone, email, date of birth). We&apos;ll use the same information for host verification — no need to re-upload documents.
              </p>
              <Button onClick={onSubmitUseExistingKyc} disabled={hostSubmitLoading} className="w-full sm:w-auto">
                {hostSubmitLoading ? "Applying…" : "Apply as Host with My Verified Identity"}
              </Button>
            </div>
          )}
          {kycApproved && (
            <div className="mb-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-nexa-line" />
              <span className="text-xs font-medium text-nexa-ink-4">Or submit new documents</span>
              <div className="flex-1 h-px bg-nexa-line" />
            </div>
          )}
          {hostError && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-800 text-sm">{hostError}</div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-5">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-5">
            <label className="border-2 border-dashed border-nexa-line rounded-xl p-6 sm:p-7 text-center cursor-pointer hover:border-nexa-primary hover:bg-nexa-primary-soft transition-colors min-h-[120px] flex flex-col items-center justify-center">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) onDocFrontUpload(f);
                  e.target.value = "";
                }}
              />
              <div className="text-3xl mb-2">📄</div>
              <div className="text-sm text-nexa-ink-4">
                {docFrontLoading ? "Uploading…" : docFrontAssetId ? "✓ ID Front uploaded" : "ID Front *"}
              </div>
            </label>
            <label className="border-2 border-dashed border-nexa-line rounded-xl p-6 sm:p-7 text-center cursor-pointer hover:border-nexa-primary hover:bg-nexa-primary-soft transition-colors min-h-[120px] flex flex-col items-center justify-center">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) onDocBackUpload(f);
                  e.target.value = "";
                }}
              />
              <div className="text-3xl mb-2">📄</div>
              <div className="text-sm text-nexa-ink-4">
                {docBackLoading ? "Uploading…" : docBackAssetId ? "✓ ID Back uploaded" : "ID Back *"}
              </div>
            </label>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">Profile Photo *</label>
            <label className="block border-2 border-dashed border-nexa-line rounded-xl p-7 text-center cursor-pointer hover:border-nexa-primary hover:bg-nexa-primary-soft transition-colors">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) onSelfieUpload(f);
                  e.target.value = "";
                }}
              />
              <div className="text-3xl mb-2">🤳</div>
              <div className="text-sm text-nexa-ink-3">
                {selfieLoading ? "Uploading…" : selfieAssetId ? "✓ Selfie uploaded" : "Clear face photo"}
              </div>
            </label>
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
  const { token, isAuthenticated, user } = useAuth();
  const [step, setStep] = useState(1);
  const [hostType, setHostType] = useState<"apartment" | "hotel">("apartment");
  const [hostStatus, setHostStatus] = useState<{ status: string; message?: string } | null>(null);
  const [hostLoading, setHostLoading] = useState(false);
  const [hostSubmitLoading, setHostSubmitLoading] = useState(false);
  const [hostError, setHostError] = useState<string | null>(null);
  const [docType, setDocType] = useState("CNIE");
  const [docNumber, setDocNumber] = useState("");
  const [docFrontAssetId, setDocFrontAssetId] = useState<string | null>(null);
  const [docBackAssetId, setDocBackAssetId] = useState<string | null>(null);
  const [selfieAssetId, setSelfieAssetId] = useState<string | null>(null);
  const [docFrontLoading, setDocFrontLoading] = useState(false);
  const [docBackLoading, setDocBackLoading] = useState(false);
  const [selfieLoading, setSelfieLoading] = useState(false);
  const [mobileStepsOpen, setMobileStepsOpen] = useState(false);

  // Step 3: Confirm Contact
  const [smsCode, setSmsCode] = useState("");
  const [emailCode, setEmailCode] = useState("");

  // Step 6: Property Basics
  const PROPERTY_TYPES = ["Apartment", "Villa", "Hotel", "Full house", "Studio", "Guesthouse", "Riad", "House", "Chalet", "Other"] as const;
  const [propertyName, setPropertyName] = useState("");
  const [propertyType, setPropertyType] = useState<string>("Apartment");
  const [propertyCity, setPropertyCity] = useState("");
  const [propertyAddress, setPropertyAddress] = useState("");

  // Step 7: Description & Rules
  const [description, setDescription] = useState("");
  const [amenities, setAmenities] = useState<string[]>([]);
  const [petsPolicy, setPetsPolicy] = useState<"DOGS" | "CATS" | "NO">("NO");
  const [quietHours, setQuietHours] = useState(false);
  const [smokingAllowed, setSmokingAllowed] = useState(false);
  const [partiesAllowed, setPartiesAllowed] = useState(false);
  const [couplesWelcome, setCouplesWelcome] = useState(true);
  const [maxGuests, setMaxGuests] = useState(4);

  // Step 8: Pricing
  const [basePrice, setBasePrice] = useState("");
  const [weekendPrice, setWeekendPrice] = useState("");
  const [cleaningFee, setCleaningFee] = useState("");
  const [depositPolicy, setDepositPolicy] = useState("");

  // Step 9: Check-in Contact
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactRole, setContactRole] = useState<"OWNER" | "CO_HOST" | "AGENT">("OWNER");

  // Step 10: Photos
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);

  // Step 11: Walkthrough Video
  const [walkthroughVideo, setWalkthroughVideo] = useState<File | null>(null);
  const [listingSubmitting, setListingSubmitting] = useState(false);
  const [listingSubmitted, setListingSubmitted] = useState(false);
  const [listingError, setListingError] = useState<string | null>(null);

  const AMENITY_OPTIONS = ["Wi-Fi", "AC", "Heating", "Kitchen", "Parking", "Elevator", "Pool", "Balcony", "Washing machine", "TV", "Workspace"];

  const toggleAmenity = (a: string) => {
    setAmenities((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));
  };

  const handlePhotoAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const valid = files.filter((f) => f.type.startsWith("image/"));
    if (valid.length === 0) return;
    const nextPhotos = [...photos, ...valid].slice(0, 24);
    const newUrls = valid.map((f) => URL.createObjectURL(f));
    setPhotoPreviews((p) => [...p, ...newUrls].slice(0, 24));
    setPhotos(nextPhotos);
    e.target.value = "";
  };

  const removePhoto = (i: number) => {
    setPhotos((p) => p.filter((_, j) => j !== i));
    URL.revokeObjectURL(photoPreviews[i] || "");
    setPhotoPreviews((p) => p.filter((_, j) => j !== i));
  };

  const mapPropertyTypeToBackend = (t: string): "APARTMENT" | "HOTEL" | "RIAD" | "VILLA" => {
    const u = (t || "").toLowerCase();
    if (u === "villa" || u === "house" || u === "chalet" || u === "guesthouse" || u === "full house") return "VILLA";
    if (u === "hotel") return "HOTEL";
    if (u === "riad") return "RIAD";
    return "APARTMENT";
  };

  const handleSubmitListing = async () => {
    if (!token || photos.length < 12 || !walkthroughVideo) return;
    setListingSubmitting(true);
    setListingError(null);
    try {
      const photoAssetIds: string[] = [];
      for (const file of photos) {
        const res = await uploadListingPhoto(file, token);
        photoAssetIds.push(res.asset_id);
      }
      const walkthroughRes = await uploadListingWalkthrough(walkthroughVideo, token);

      const media = [
        ...photoAssetIds.map((asset_id, i) => ({ asset_id, kind: "PHOTO" as const, sort_order: i })),
        { asset_id: walkthroughRes.asset_id, kind: "WALKTHROUGH" as const, sort_order: photoAssetIds.length },
      ];

      const body = {
        title: propertyName,
        listing_type: mapPropertyTypeToBackend(propertyType),
        city: propertyCity,
        address: propertyAddress || undefined,
        description: description || undefined,
        instant_booking: false,
        rules: {
          pets_policy: petsPolicy === "NO" ? "NO" as const : "DOGS_CATS" as const,
          smoking_policy: smokingAllowed ? "ALLOWED" as const : "NOT_ALLOWED" as const,
          quiet_hours: quietHours,
          couples_welcome: couplesWelcome,
          max_guests: maxGuests,
          amenities,
        },
        rate_plan: {
          currency: "MAD",
          base_price: Number(basePrice) || 0,
          weekend_price: weekendPrice ? Number(weekendPrice) : undefined,
          cleaning_fee: cleaningFee ? Number(cleaningFee) : 0,
          deposit_policy_text: depositPolicy || undefined,
        },
        check_in_contact: {
          full_name: contactName,
          phone: contactPhone,
          role: contactRole,
        },
        media,
      };
      await createHostListing(body, token);
      setListingSubmitted(true);
    } catch (e) {
      setListingError(e instanceof Error ? e.message : "Failed to submit listing");
    } finally {
      setListingSubmitting(false);
    }
  };

  const stepsContent = (
    <>
      <Link href="/" className="flex items-center gap-2.5 mb-6 lg:mb-10 cursor-pointer hover:opacity-90">
        <div className="relative w-9 h-9 rounded-lg overflow-hidden shrink-0">
          <Image src="/images/nexastays.png" alt="Nexa Stays" fill sizes="36px" className="object-cover" />
        </div>
        <span className="font-display text-xl font-bold text-white">Host Setup</span>
      </Link>
      <div className="mb-6 lg:mb-8">
        <div className="text-xs font-bold uppercase tracking-wider text-white/40 mb-3">Progress</div>
        <div className="h-1 bg-white/15 rounded-sm">
          <div className="h-full rounded-sm bg-gradient-to-r from-nexa-primary to-nexa-primary-light transition-all duration-400" style={{ width: `${progressWidths[step]}%` }} />
        </div>
      </div>
      <nav className="flex flex-col gap-1.5">
        {hostSteps.map((label, i) => (
          <button
            key={label}
            onClick={() => { setStep(i + 1); setMobileStepsOpen(false); }}
            className={cn(
              "flex items-center gap-3 py-2.5 px-3.5 rounded-xl transition-colors text-left min-h-[44px]",
              step === i + 1 ? "bg-nexa-primary/20" : "hover:bg-white/5"
            )}
          >
            <div className={cn(
              "w-7 h-7 rounded-full flex items-center justify-center text-[0.78rem] font-bold border shrink-0",
              step > i + 1 ? "border-nexa-primary bg-nexa-primary text-white" : step === i + 1 ? "border-nexa-primary text-nexa-primary bg-nexa-primary/15" : "border-white/20 text-white/40"
            )}>{step > i + 1 ? "✓" : i + 1}</div>
            <span className={cn("text-sm", step === i + 1 ? "text-white font-semibold" : "text-white/50", step > i + 1 && "text-white/70")}>{label}</span>
          </button>
        ))}
      </nav>
      <div className="mt-6 bg-white/5 rounded-xl p-4 text-xs text-white/50">
        <strong className="text-white/80 block mb-1">🔒 Privacy & Safety</strong>
        Phone, email, and exact address are masked until both sides are verified and reservation is confirmed.
      </div>
    </>
  );

  return (
    <>
      <NavBar />
      <main className="pt-[72px] min-h-screen grid grid-cols-1 lg:grid-cols-[340px_1fr]">
        <aside className="hidden lg:block bg-gradient-to-br from-nexa-ink to-nexa-ink-2 p-10 overflow-y-auto sticky top-[72px] h-[calc(100vh-72px)]">
          {stepsContent}
        </aside>

        {/* Mobile steps button */}
        <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
          <button
            onClick={() => setMobileStepsOpen(true)}
            className="flex items-center gap-2 px-5 py-3 min-h-[48px] rounded-full bg-nexa-ink text-white shadow-lg font-semibold text-sm"
          >
            <Menu className="h-4 w-4" />
            Step {step} of 12
          </button>
        </div>

        {/* Mobile steps drawer */}
        <div
          className={cn(
            "fixed inset-0 z-50 lg:hidden transition-opacity duration-300",
            mobileStepsOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          aria-hidden={!mobileStepsOpen}
        >
          <div className="absolute inset-0 bg-nexa-ink/60" onClick={() => setMobileStepsOpen(false)} />
          <div
            className={cn(
              "absolute bottom-0 left-0 right-0 max-h-[85vh] bg-gradient-to-br from-nexa-ink to-nexa-ink-2 rounded-t-2xl p-6 overflow-y-auto transition-transform duration-300",
              mobileStepsOpen ? "translate-y-0" : "translate-y-full"
            )}
          >
            {stepsContent}
          </div>
        </div>

        <div className="bg-nexa-bg py-8 sm:py-10 lg:py-12 px-4 sm:px-6 md:px-10 lg:px-20 pb-20 lg:pb-16">
          <div className="max-w-[600px]">
            {step === 1 && (
              <div>
                <span className="text-xs font-semibold tracking-[0.12em] uppercase text-nexa-primary">
                  Step 1 of 12
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
                  Step 2 of 12
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
                <span className="text-xs font-semibold uppercase text-nexa-primary">Step 3 of 12</span>
                <h2 className="text-2xl font-semibold mt-2 mb-2">Confirm Contact</h2>
                <p className="text-nexa-ink-3 mb-6">We&apos;ll send a code to your phone and email. Enter both to verify your contact details.</p>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-nexa-ink mb-1">SMS verification code</label>
                    <Input
                      type="text"
                      placeholder="Enter 6-digit code from SMS"
                      value={smsCode}
                      onChange={(e) => setSmsCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      maxLength={6}
                      className="max-w-[200px]"
                    />
                    <button type="button" className="text-xs text-nexa-primary mt-1 hover:underline">Send code</button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-nexa-ink mb-1">Email verification</label>
                    <Input
                      type="text"
                      placeholder="Enter code or click link from email"
                      value={emailCode}
                      onChange={(e) => setEmailCode(e.target.value)}
                      className="max-w-[280px]"
                    />
                    <button type="button" className="text-xs text-nexa-primary mt-1 hover:underline">Send link/code</button>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="ghost" onClick={() => setStep(2)}>← Back</Button>
                  <Button onClick={() => setStep(4)} disabled={!smsCode || smsCode.length < 6 || !emailCode}>Continue →</Button>
                </div>
              </div>
            )}

            {step === 4 && (
              <HostVerificationStep
                token={token}
                isAuthenticated={isAuthenticated}
                user={user}
                hostStatus={hostStatus}
                hostLoading={hostLoading}
                hostSubmitLoading={hostSubmitLoading}
                hostError={hostError}
                docType={docType}
                docNumber={docNumber}
                docFrontAssetId={docFrontAssetId}
                docBackAssetId={docBackAssetId}
                selfieAssetId={selfieAssetId}
                docFrontLoading={docFrontLoading}
                docBackLoading={docBackLoading}
                selfieLoading={selfieLoading}
                onDocTypeChange={setDocType}
                onDocNumberChange={setDocNumber}
                onDocFrontUpload={async (file) => {
                  setDocFrontLoading(true);
                  try {
                    const res = await uploadHostDocumentFront(file, token);
                    setDocFrontAssetId(res.asset_id);
                  } catch (e) {
                    setHostError(e instanceof Error ? e.message : "Upload failed");
                  } finally {
                    setDocFrontLoading(false);
                  }
                }}
                onDocBackUpload={async (file) => {
                  setDocBackLoading(true);
                  try {
                    const res = await uploadHostDocumentBack(file, token);
                    setDocBackAssetId(res.asset_id);
                  } catch (e) {
                    setHostError(e instanceof Error ? e.message : "Upload failed");
                  } finally {
                    setDocBackLoading(false);
                  }
                }}
                onSelfieUpload={async (file) => {
                  setSelfieLoading(true);
                  try {
                    const res = await uploadHostSelfie(file, token);
                    setSelfieAssetId(res.asset_id);
                  } catch (e) {
                    setHostError(e instanceof Error ? e.message : "Upload failed");
                  } finally {
                    setSelfieLoading(false);
                  }
                }}
                onLoadStatus={() => {
                  setHostLoading(true);
                  setHostError(null);
                  getHostVerification(token)
                    .then(setHostStatus)
                    .catch((e) => setHostError(e instanceof Error ? e.message : "Failed to load"))
                    .finally(() => setHostLoading(false));
                }}
                onSubmitUseExistingKyc={async () => {
                  setHostSubmitLoading(true);
                  setHostError(null);
                  try {
                    const res = await submitHostVerification({ use_existing_kyc: true }, token);
                    setHostStatus(res);
                    if (res.status === "APPROVED") setStep(5);
                  } catch (e) {
                    setHostError(e instanceof Error ? e.message : "Application failed");
                  } finally {
                    setHostSubmitLoading(false);
                  }
                }}
                onSubmit={async () => {
                  setHostSubmitLoading(true);
                  setHostError(null);
                  try {
                    await submitHostVerification(
                      {
                        document_type: docType,
                        document_number_hash: docNumber ? btoa(docNumber).slice(0, 64) : undefined,
                        document_front_asset_id: docFrontAssetId ?? undefined,
                        document_back_asset_id: docBackAssetId ?? undefined,
                        selfie_asset_id: selfieAssetId ?? undefined,
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

            {step === 5 && (
              <div>
                <span className="text-xs font-semibold uppercase text-nexa-primary">Step 5 of 12</span>
                <h2 className="text-2xl font-semibold mt-2 mb-2">Verification Submitted</h2>
                <p className="text-nexa-ink-3 mb-6">Your identity verification has been submitted. We&apos;ll review it shortly.</p>
                <div className="space-y-4 mb-6">
                  <div className="rounded-xl bg-green-50 border border-green-200 p-4">
                    <h3 className="font-semibold text-green-800 mb-2">What you can do now</h3>
                    <ul className="text-sm text-green-700 space-y-1 list-disc list-inside">
                      <li>Complete your property listing</li>
                      <li>Add photos and walkthrough video</li>
                      <li>Set pricing and house rules</li>
                      <li>Add check-in contact</li>
                    </ul>
                  </div>
                  <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
                    <h3 className="font-semibold text-amber-800 mb-2">Locked until verified</h3>
                    <ul className="text-sm text-amber-700 space-y-1 list-disc list-inside">
                      <li>Listing goes live</li>
                      <li>Accept bookings</li>
                      <li>Full host dashboard access</li>
                    </ul>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="ghost" onClick={() => setStep(4)}>← Back</Button>
                  <Button onClick={() => setStep(6)}>Continue →</Button>
                </div>
              </div>
            )}

            {step === 6 && (
              <div>
                <span className="text-xs font-semibold uppercase text-nexa-primary">Step 6 of 12</span>
                <h2 className="text-2xl font-semibold mt-2 mb-2">Property Basics</h2>
                <p className="text-nexa-ink-3 mb-6">Tell us about your property.</p>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-nexa-ink mb-1">Property name *</label>
                    <Input value={propertyName} onChange={(e) => setPropertyName(e.target.value)} placeholder="e.g. Cozy Downtown Apartment" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-nexa-ink mb-1">Property type *</label>
                    <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)} className="w-full rounded-lg border border-nexa-ink-4 px-3 py-2 text-sm">
                      {PROPERTY_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-nexa-ink mb-1">City *</label>
                    <Input value={propertyCity} onChange={(e) => setPropertyCity(e.target.value)} placeholder="e.g. Marrakech" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-nexa-ink mb-1">Full address *</label>
                    <Input value={propertyAddress} onChange={(e) => setPropertyAddress(e.target.value)} placeholder="Street, number, postal code" required />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="ghost" onClick={() => setStep(5)}>← Back</Button>
                  <Button onClick={() => setStep(7)} disabled={!propertyName.trim() || !propertyCity.trim() || !propertyAddress.trim()}>Continue →</Button>
                </div>
              </div>
            )}

            {step === 7 && (
              <div>
                <span className="text-xs font-semibold uppercase text-nexa-primary">Step 7 of 12</span>
                <h2 className="text-2xl font-semibold mt-2 mb-2">Description & Rules</h2>
                <p className="text-nexa-ink-3 mb-6">Describe your space and set house rules.</p>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-nexa-ink mb-1">Description *</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your property, its highlights, and what guests will love..." rows={4} className="w-full rounded-lg border border-nexa-ink-4 px-3 py-2 text-sm resize-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-nexa-ink mb-1">Max guests *</label>
                    <Input type="number" min={1} max={20} value={maxGuests} onChange={(e) => setMaxGuests(Number(e.target.value) || 1)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-nexa-ink mb-2">Amenities</label>
                    <div className="flex flex-wrap gap-2">
                      {AMENITY_OPTIONS.map((a) => (
                        <button key={a} type="button" onClick={() => toggleAmenity(a)} className={cn("rounded-full px-4 py-2 text-sm border", amenities.includes(a) ? "border-nexa-primary bg-nexa-primary/10 text-nexa-primary" : "border-nexa-ink-4 text-nexa-ink-3")}>{a}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-nexa-ink mb-2">House rules</label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm"><input type="radio" checked={petsPolicy === "NO"} onChange={() => setPetsPolicy("NO")} /> No pets</label>
                      <label className="flex items-center gap-2 text-sm"><input type="radio" checked={petsPolicy === "DOGS"} onChange={() => setPetsPolicy("DOGS")} /> Dogs allowed</label>
                      <label className="flex items-center gap-2 text-sm"><input type="radio" checked={petsPolicy === "CATS"} onChange={() => setPetsPolicy("CATS")} /> Cats allowed</label>
                      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={quietHours} onChange={(e) => setQuietHours(e.target.checked)} /> Quiet hours</label>
                      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={smokingAllowed} onChange={(e) => setSmokingAllowed(e.target.checked)} /> Smoking allowed</label>
                      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={partiesAllowed} onChange={(e) => setPartiesAllowed(e.target.checked)} /> Parties allowed</label>
                      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={couplesWelcome} onChange={(e) => setCouplesWelcome(e.target.checked)} /> Couples welcome</label>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="ghost" onClick={() => setStep(6)}>← Back</Button>
                  <Button onClick={() => setStep(8)} disabled={!description.trim()}>Continue →</Button>
                </div>
              </div>
            )}

            {step === 8 && (
              <div>
                <span className="text-xs font-semibold uppercase text-nexa-primary">Step 8 of 12</span>
                <h2 className="text-2xl font-semibold mt-2 mb-2">Pricing</h2>
                <p className="text-nexa-ink-3 mb-6">Set your rates and fees.</p>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-nexa-ink mb-1">Base price per night (MAD) *</label>
                    <Input type="number" min={0} step="0.01" placeholder="0.00" value={basePrice} onChange={(e) => setBasePrice(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-nexa-ink mb-1">Weekend price per night (MAD) <span className="text-nexa-ink-4">optional</span></label>
                    <Input type="number" min={0} step="0.01" placeholder="0.00" value={weekendPrice} onChange={(e) => setWeekendPrice(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-nexa-ink mb-1">Cleaning fee (MAD)</label>
                    <Input type="number" min={0} step="0.01" placeholder="0.00" value={cleaningFee} onChange={(e) => setCleaningFee(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-nexa-ink mb-1">Deposit / security policy</label>
                    <textarea value={depositPolicy} onChange={(e) => setDepositPolicy(e.target.value)} placeholder="Describe your deposit policy if any..." rows={2} className="w-full rounded-lg border border-nexa-ink-4 px-3 py-2 text-sm resize-none" />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="ghost" onClick={() => setStep(7)}>← Back</Button>
                  <Button onClick={() => setStep(9)} disabled={!basePrice || Number(basePrice) <= 0}>Continue →</Button>
                </div>
              </div>
            )}

            {step === 9 && (
              <div>
                <span className="text-xs font-semibold uppercase text-nexa-primary">Step 9 of 12</span>
                <h2 className="text-2xl font-semibold mt-2 mb-2">Check-in Contact</h2>
                <p className="text-nexa-ink-3 mb-6">Who will greet guests? Add the primary contact for check-in.</p>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-nexa-ink mb-1">Contact name *</label>
                    <Input value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="Full name" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-nexa-ink mb-1">Phone number *</label>
                    <Input type="tel" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="+34 600 000 000" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-nexa-ink mb-1">Role</label>
                    <select value={contactRole} onChange={(e) => setContactRole(e.target.value as "OWNER" | "CO_HOST" | "AGENT")} className="w-full rounded-lg border border-nexa-ink-4 px-3 py-2 text-sm">
                      <option value="OWNER">Owner</option>
                      <option value="CO_HOST">Co-host</option>
                      <option value="AGENT">Agent</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="ghost" onClick={() => setStep(8)}>← Back</Button>
                  <Button onClick={() => setStep(10)} disabled={!contactName.trim() || !contactPhone.trim()}>Continue →</Button>
                </div>
              </div>
            )}

            {step === 10 && (
              <div>
                <span className="text-xs font-semibold uppercase text-nexa-primary">Step 10 of 12</span>
                <h2 className="text-2xl font-semibold mt-2 mb-2">Upload Photos</h2>
                <p className="text-nexa-ink-3 mb-4">Add at least 12 photos. Include: entrance, living room, bedroom(s), bathroom(s), kitchen, exterior, area reference.</p>
                <div className="mb-4 flex flex-wrap gap-3">
                  {photoPreviews.map((url, i) => (
                    <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden border border-nexa-ink-4 group shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removePhoto(i)} className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                    </div>
                  ))}
                  <label htmlFor="host-photos" className="w-24 h-24 rounded-lg border-2 border-dashed border-nexa-ink-4 flex items-center justify-center cursor-pointer hover:border-nexa-primary hover:bg-nexa-primary/5 transition-colors text-nexa-ink-4 text-2xl">+</label>
                  <input id="host-photos" type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoAdd} />
                </div>
                <p className="text-sm text-nexa-ink-4 mb-6">{photos.length} / 12 minimum</p>
                <div className="flex gap-3">
                  <Button variant="ghost" onClick={() => setStep(9)}>← Back</Button>
                  <Button onClick={() => setStep(11)} disabled={photos.length < 12}>Continue →</Button>
                </div>
              </div>
            )}

            {step === 11 && (
              <div>
                <span className="text-xs font-semibold uppercase text-nexa-primary">Step 11 of 12</span>
                <h2 className="text-2xl font-semibold mt-2 mb-2">Walkthrough Video</h2>
                <p className="text-nexa-ink-3 mb-6">Upload a 45-second to 2-minute walkthrough: face camera → door → full tour. Required for approval.</p>
                <div className="mb-6">
                  {walkthroughVideo ? (
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-nexa-primary-soft border border-nexa-primary/20">
                      <span className="text-sm font-medium text-nexa-primary-dark">{walkthroughVideo.name}</span>
                      <button type="button" onClick={() => setWalkthroughVideo(null)} className="text-sm text-red-600 hover:underline">Remove</button>
                    </div>
                  ) : (
                    <label htmlFor="walkthrough-video" className="flex flex-col items-center justify-center w-full h-32 rounded-xl border-2 border-dashed border-nexa-ink-4 cursor-pointer hover:border-nexa-primary hover:bg-nexa-primary/5 transition-colors text-nexa-ink-4">
                      <span className="text-sm font-medium">Click to upload video (45s–2min)</span>
                      <input id="walkthrough-video" type="file" accept="video/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) setWalkthroughVideo(f); e.target.value = ""; }} />
                    </label>
                  )}
                </div>
                <div className="flex gap-3">
                  <Button variant="ghost" onClick={() => setStep(10)}>← Back</Button>
                  <Button onClick={() => setStep(12)} disabled={!walkthroughVideo}>Continue →</Button>
                </div>
              </div>
            )}

            {step === 12 && !listingSubmitted && (
              <div>
                <span className="text-xs font-semibold uppercase text-nexa-primary">Step 12 of 12</span>
                <h2 className="text-2xl font-semibold mt-2 mb-2">Submit your listing</h2>
                <p className="text-nexa-ink-3 mb-6">Review your checklist before going live.</p>
                <div className="space-y-2.5 mb-6">
                  {[
                    { done: !!hostStatus, label: "Host identity verified (or pending review)" },
                    { done: photos.length >= 12, label: "Photos uploaded (12 minimum)" },
                    { done: !!walkthroughVideo, label: "Walkthrough video uploaded" },
                    { done: !!basePrice && Number(basePrice) > 0, label: "Pricing set" },
                    { done: !!description.trim(), label: "House rules set" },
                    { done: !!contactName.trim() && !!contactPhone.trim(), label: "Check-in contact added" },
                  ].map(({ done, label }) => (
                    <div key={label} className={cn("flex items-center gap-2.5 py-3 px-4 rounded-xl text-sm", done ? "bg-green-50 text-green-800" : "bg-nexa-ink-1 text-nexa-ink-4")}>
                      {done ? "✅" : "⬜"} {label}
                    </div>
                  ))}
                </div>
                <div className="bg-nexa-primary-soft rounded-xl p-4 text-sm text-nexa-primary-dark mb-7">
                  After submission, your listing is reviewed by Nexa. You&apos;ll be notified once it&apos;s approved and ready to go live.
                </div>
                {listingError && (
                  <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-red-800 text-sm mb-6">{listingError}</div>
                )}
                <div className="flex gap-3">
                  <Button variant="ghost" onClick={() => setStep(11)}>← Back</Button>
                  <Button
                    size="lg"
                    disabled={photos.length < 12 || !walkthroughVideo || listingSubmitting}
                    onClick={handleSubmitListing}
                  >
                    {listingSubmitting ? "Submitting…" : "🚀 Submit for Review"}
                  </Button>
                </div>
              </div>
            )}

            {step === 12 && listingSubmitted && (
              <div className="text-center py-8">
                <div className="inline-flex w-16 h-16 rounded-full bg-green-100 items-center justify-center text-3xl mb-6">✓</div>
                <h2 className="text-2xl font-semibold text-nexa-ink mb-2">Listing submitted for review</h2>
                <p className="text-nexa-ink-3 mb-6 max-w-md mx-auto">
                  Your listing has been submitted. Nexa will review it and you&apos;ll be notified once it&apos;s approved and ready to go live.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild>
                    <Link href="/host/dashboard">View your listings</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/">Back to home</Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
