"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { NavBar } from "@/components/navbar/NavBar";
import { Footer } from "@/components/footer/Footer";
import { Button } from "@/components/ui/button";
import { getBooking } from "@/lib/stays-api";
import { useAuth } from "@/contexts/AuthContext";
import type { StaysBooking } from "@/lib/stays-types";

export default function BookingDetailPage() {
  const params = useParams();
  const { token } = useAuth();
  const id = params.id as string;

  const [booking, setBooking] = useState<StaysBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getBooking(id, token)
      .then(setBooking)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, [id, token]);

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

  if (error || !booking) {
    return (
      <>
        <NavBar />
        <main className="pt-[72px] min-h-screen flex flex-col items-center justify-center gap-4">
          <p className="text-nexa-ink-3">{error || "Booking not found"}</p>
          <Button asChild><Link href="/listings">Browse Stays</Link></Button>
        </main>
      </>
    );
  }

  const statusColors: Record<string, string> = {
    CONFIRMED: "bg-green-100 text-green-800",
    CHECKED_IN: "bg-blue-100 text-blue-800",
    COMPLETED: "bg-gray-100 text-gray-800",
    PAYMENT_PENDING: "bg-yellow-100 text-yellow-800",
    INITIATED: "bg-yellow-100 text-yellow-800",
    CANCELLED_BY_GUEST: "bg-red-100 text-red-800",
    CANCELLED_BY_HOST: "bg-red-100 text-red-800",
  };

  return (
    <>
      <NavBar />
      <main className="pt-[72px] min-h-screen">
        <div className="max-w-[640px] mx-auto px-6 py-12">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">✅</div>
            <h1 className="text-2xl font-bold text-nexa-ink mb-2">Booking Confirmed</h1>
            <span className={`inline-flex px-4 py-1.5 rounded-full text-sm font-medium ${statusColors[booking.status] || "bg-gray-100 text-gray-800"}`}>
              {booking.status.replace(/_/g, " ")}
            </span>
          </div>

          <div className="bg-white rounded-[22px] border border-nexa-line p-6 space-y-6">
            {booking.listing && (
              <div>
                <h3 className="text-sm font-semibold text-nexa-ink-4 mb-2">Listing</h3>
                <p className="font-semibold">{booking.listing.title}</p>
                <p className="text-sm text-nexa-ink-4">{booking.listing.city}</p>
                {booking.listing.address && (
                  <p className="text-sm text-nexa-ink-3 mt-1">Address: {booking.listing.address}</p>
                )}
                {booking.listing.check_in_contact && (
                  <div className="mt-2 p-3 bg-nexa-primary-soft rounded-xl">
                    <p className="text-sm font-semibold text-nexa-primary-dark">Check-in Contact</p>
                    <p>{booking.listing.check_in_contact.full_name}</p>
                    <p className="text-sm">{booking.listing.check_in_contact.phone}</p>
                  </div>
                )}
              </div>
            )}

            <div>
              <h3 className="text-sm font-semibold text-nexa-ink-4 mb-2">Dates</h3>
              <p>{new Date(booking.checkin_date).toLocaleDateString()} – {new Date(booking.checkout_date).toLocaleDateString()}</p>
              <p className="text-sm text-nexa-ink-4">{booking.guest_count} guest{booking.guest_count > 1 ? "s" : ""}</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-nexa-ink-4 mb-2">Payment</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{booking.total_subtotal} {booking.currency}</span>
                </div>
                <div className="flex justify-between">
                  <span>Guest fee (2%)</span>
                  <span>{booking.guest_fee} {booking.currency}</span>
                </div>
                {booking.total_paid != null && (
                  <div className="flex justify-between font-bold pt-2">
                    <span>Total paid</span>
                    <span>{booking.total_paid} {booking.currency}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <Button asChild className="w-full justify-center">
              <Link href="/listings">Browse More Stays</Link>
            </Button>
            <Button variant="outline" asChild className="w-full justify-center">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
