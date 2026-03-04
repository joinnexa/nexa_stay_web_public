"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { NavBar } from "@/components/navbar/NavBar";
import { Footer } from "@/components/footer/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getListing, createBooking } from "@/lib/stays-api";
import { getCurrentUserOrNull } from "@/lib/kyc-api";
import { useAuth } from "@/contexts/AuthContext";
import type { StaysListing } from "@/lib/stays-types";

const placeholderImg = "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=800&q=80";

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { token, isAuthenticated } = useAuth();
  const id = params.id as string;

  const [listing, setListing] = useState<StaysListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [booking, setBooking] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<{ kyc_status: string } | null>(null);

  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [guests, setGuests] = useState(1);

  useEffect(() => {
    if (isAuthenticated && token) {
      getCurrentUserOrNull(() => token).then(setUserProfile);
    }
  }, [isAuthenticated, token]);

  useEffect(() => {
    getListing(id, token)
      .then(setListing)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, [id, token]);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listing) return;
    if (!isAuthenticated || !token) {
      router.push(`/login?redirect=/listings/${id}`);
      return;
    }
    setBookingError(null);
    setBooking(true);
    try {
      const b = await createBooking(
        {
          listing_id: id,
          checkin_date: checkin,
          checkout_date: checkout,
          guest_count: guests,
        },
        token
      );
      router.push(`/bookings/${b.id}`);
    } catch (err) {
      setBookingError(err instanceof Error ? err.message : "Booking failed");
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <>
        <NavBar />
        <main className="pt-[72px] min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nexa-primary" />
        </main>
      </>
    );
  }

  if (error || !listing) {
    return (
      <>
        <NavBar />
        <main className="pt-[72px] min-h-screen flex flex-col items-center justify-center gap-4">
          <p className="text-nexa-ink-3">{error || "Listing not found"}</p>
          <Button asChild><Link href="/listings">Back to Listings</Link></Button>
        </main>
      </>
    );
  }

  const price = listing.rate_plan?.base_price ?? 0;
  const cleaningFee = listing.rate_plan?.cleaning_fee ?? 0;
  const nights = checkin && checkout
    ? Math.ceil((new Date(checkout).getTime() - new Date(checkin).getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  const subtotal = nights * price + cleaningFee;
  const guestFee = Math.round(subtotal * 0.02 * 100) / 100;
  const total = subtotal + guestFee;

  return (
    <>
      <NavBar />
      <main className="pt-[72px] min-h-screen">
        <div className="max-w-[1280px] mx-auto px-6 py-8">
          <Link href="/listings" className="text-nexa-primary hover:underline text-sm mb-6 inline-block">
            ← Back to Listings
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="relative h-[400px] rounded-[22px] overflow-hidden mb-6">
                <Image src={placeholderImg} alt={listing.title} fill className="object-cover" />
              </div>
              <h1 className="text-2xl font-bold text-nexa-ink mb-2">{listing.title}</h1>
              <p className="text-nexa-ink-4 mb-4">{listing.city} · {listing.listing_type}</p>
              {listing.description && (
                <p className="text-nexa-ink-3 mb-6">{listing.description}</p>
              )}
              <div className="border-t border-nexa-line pt-6">
                <h3 className="font-semibold mb-2">What this place offers</h3>
                <div className="flex flex-wrap gap-2 text-sm text-nexa-ink-3">
                  {listing.rules?.amenities ? (
                    <span>{listing.rules.amenities}</span>
                  ) : (
                    <>
                      <span>✓ Check-in {listing.checkin_time}</span>
                      <span>✓ Check-out {listing.checkout_time}</span>
                      {listing.instant_booking && <span>✓ Instant booking</span>}
                    </>
                  )}
                </div>
              </div>
            </div>

            <div>
              <div className="sticky top-[100px] bg-white rounded-[22px] border border-nexa-line p-6 shadow-nexa-md">
                <div className="text-2xl font-bold text-nexa-ink mb-2">
                  {price} <span className="text-base font-normal text-nexa-ink-4">{(listing.rate_plan?.currency || "MAD")}/night</span>
                </div>
                <form onSubmit={handleBook} className="space-y-4 mt-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Check-in</label>
                    <Input
                      type="date"
                      value={checkin}
                      onChange={(e) => setCheckin(e.target.value)}
                      required
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Check-out</label>
                    <Input
                      type="date"
                      value={checkout}
                      onChange={(e) => setCheckout(e.target.value)}
                      required
                      min={checkin || new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Guests</label>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(parseInt(e.target.value, 10))}
                      className="w-full h-11 rounded-xl border-2 border-nexa-line px-4 py-2 text-sm"
                    >
                      {[1, 2, 3, 4, 5, 6].map((n) => (
                        <option key={n} value={n}>{n} guest{n > 1 ? "s" : ""}</option>
                      ))}
                    </select>
                  </div>
                  {nights > 0 && (
                    <div className="border-t border-nexa-line pt-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>{price} × {nights} nights</span>
                        <span>{price * nights} MAD</span>
                      </div>
                      {cleaningFee > 0 && (
                        <div className="flex justify-between">
                          <span>Cleaning fee</span>
                          <span>{cleaningFee} MAD</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Guest fee (2%)</span>
                        <span>{guestFee} MAD</span>
                      </div>
                      <div className="flex justify-between font-bold text-base pt-2">
                        <span>Total</span>
                        <span>{total.toFixed(2)} MAD</span>
                      </div>
                    </div>
                  )}
                  {userProfile && userProfile.kyc_status !== "APPROVED" && isAuthenticated && (
                    <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800">
                      Verification pending. You can browse — booking unlocks after approval.{" "}
                      <Link href="/registration" className="text-nexa-primary font-medium hover:underline">
                        Complete verification
                      </Link>
                    </div>
                  )}
                  {bookingError && (
                    <p className="text-sm text-red-600">{bookingError}</p>
                  )}
                  <Button
                    type="submit"
                    className="w-full justify-center"
                    disabled={
                      booking ||
                      !checkin ||
                      !checkout ||
                      (isAuthenticated && userProfile && userProfile.kyc_status !== "APPROVED")
                    }
                  >
                    {booking ? "Booking…" : isAuthenticated ? "Request to Book" : "Sign in to Book"}
                  </Button>
                  {!isAuthenticated && (
                    <p className="text-xs text-nexa-ink-4 text-center">
                      Identity verification required. Sign in to book.
                    </p>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
