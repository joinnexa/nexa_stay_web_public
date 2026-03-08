"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { NavBar } from "@/components/navbar/NavBar";
import { Footer } from "@/components/footer/Footer";
import { Button } from "@/components/ui/button";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { getGuestBookings, cancelBooking } from "@/lib/stays-api";
import type { StaysBooking } from "@/lib/stays-types";
import {
  CalendarCheck,
  MapPin,
  MessageCircle,
  XCircle,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

function MyBookingsContent() {
  const { token } = useAuth();
  const { t, localePath } = useLanguage();
  const [bookings, setBookings] = useState<StaysBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const fetchBookings = useCallback(() => {
    if (!token) return;
    setLoading(true);
    setError(null);
    getGuestBookings(token)
      .then(setBookings)
      .catch((e) => setError(e instanceof Error ? e.message : t("myBookings.failedLoad")))
      .finally(() => setLoading(false));
  }, [token, t]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleCancel = async (id: string) => {
    if (!token) return;
    if (!window.confirm(t("myBookings.cancelConfirm"))) return;
    setCancellingId(id);
    try {
      await cancelBooking(id, "guest", undefined, token);
      fetchBookings();
    } catch (e) {
      setError(e instanceof Error ? e.message : t("myBookings.cancellationFailed"));
    } finally {
      setCancellingId(null);
    }
  };

  const statusColors: Record<string, string> = {
    CONFIRMED: "bg-green-100 text-green-800",
    CHECKED_IN: "bg-blue-100 text-blue-800",
    COMPLETED: "bg-gray-100 text-gray-800",
    PAYMENT_PENDING: "bg-amber-100 text-amber-800",
    INITIATED: "bg-amber-100 text-amber-800",
    CANCELLED_BY_GUEST: "bg-red-100 text-red-800",
    CANCELLED_BY_HOST: "bg-red-100 text-red-800",
    EXPIRED: "bg-red-100 text-red-800",
  };

  const canCancel = (b: StaysBooking) =>
    ["INITIATED", "PAYMENT_PENDING", "CONFIRMED"].includes(b.status);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nexa-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-nexa-ink">{t("myBookings.title")}</h1>
        <p className="text-nexa-ink-3 mt-1">
          {t("myBookings.subtitle")}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-red-800">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-sm text-red-600 underline mt-1"
            >
              {t("myBookings.dismiss")}
            </button>
          </div>
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-nexa-line bg-nexa-bg-1 p-12 text-center">
          <CalendarCheck className="h-14 w-14 text-nexa-ink-4 mx-auto mb-4" />
          <p className="text-nexa-ink font-medium">{t("myBookings.noBookingsYet")}</p>
          <p className="text-nexa-ink-3 text-sm mt-1">
            {t("myBookings.browseFirst")}
          </p>
          <Button asChild className="mt-4">
            <Link href={localePath("/listings")}>{t("myBookings.browseStays")}</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="rounded-2xl border border-nexa-line bg-white overflow-hidden"
            >
              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-nexa-ink truncate">
                      {b.listing?.title ?? t("bookings.listing")}
                    </p>
                    <p className="text-sm text-nexa-ink-4 flex items-center gap-1 mt-0.5">
                      <MapPin className="h-4 w-4 shrink-0" />
                      {b.listing?.city ?? "—"}
                    </p>
                    <p className="text-sm text-nexa-ink-3 mt-2">
                      {new Date(b.checkin_date).toLocaleDateString()} –{" "}
                      {new Date(b.checkout_date).toLocaleDateString()} ·{" "}
                      {b.guest_count} guest{b.guest_count !== 1 ? "s" : ""}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                          statusColors[b.status] ?? "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {b.status.replace(/_/g, " ")}
                      </span>
                      {b.total_paid != null && (
                        <span className="text-sm font-medium text-nexa-ink">
                          {b.total_paid} {b.currency}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 shrink-0">
                    <Button variant="default" size="sm" asChild>
                      <Link href={localePath(`/bookings/${b.id}`)} className="flex items-center gap-1">
                        {t("myBookings.view")} <ChevronRight className="h-4 w-4" />
                      </Link>
                    </Button>
                    {canCancel(b) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancel(b.id)}
                        disabled={!!cancellingId}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        {cancellingId === b.id ? t("myBookings.cancelling") : (
                          <>
                            <XCircle className="h-4 w-4 mr-1" />
                            {t("myBookings.cancel")}
                          </>
                        )}
                      </Button>
                    )}
                    {["CONFIRMED", "CHECKED_IN", "COMPLETED"].includes(
                      b.status
                    ) && (
                      <Button variant="outline" size="sm" asChild>
                        <Link
                          href={`/contact?booking=${b.id}&subject=Complaint about booking ${b.id}`}
                          className="flex items-center gap-1"
                        >
                          <MessageCircle className="h-4 w-4" />
                          {t("myBookings.complain")}
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 flex gap-3">
        <Button variant="outline" asChild>
          <Link href={localePath("/listings")}>{t("myBookings.browseMore")}</Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link href={localePath("/")}>{t("myBookings.backToHome")}</Link>
        </Button>
      </div>
    </div>
  );
}

export default function MyBookingsPage() {
  return (
    <>
      <NavBar />
      <main className="pt-[72px] min-h-screen bg-nexa-bg-1">
        <ProtectedRoute>
          <MyBookingsContent />
        </ProtectedRoute>
      </main>
      <Footer />
    </>
  );
}
