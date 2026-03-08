"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { NavBar } from "@/components/navbar/NavBar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { getHostVerification, getHostListings, getHostBookings } from "@/lib/stays-api";
import type { HostVerificationStatus, HostListingSummary, HostBooking } from "@/lib/stays-types";
import { AppLoader } from "@/components/AppLoader";
import {
  Home,
  PlusCircle,
  FileCheck,
  Clock,
  XCircle,
  LayoutDashboard,
  Building2,
  CalendarCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

function HostDashboardContent() {
  const { token } = useAuth();
  const { t, localePath } = useLanguage();
  const [hostStatus, setHostStatus] = useState<HostVerificationStatus | null>(null);
  const [listings, setListings] = useState<HostListingSummary[]>([]);
  const [listingsLoading, setListingsLoading] = useState(false);
  const [bookings, setBookings] = useState<HostBooking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    setError(null);
    getHostVerification(token)
      .then(setHostStatus)
      .catch((e) => setError(e instanceof Error ? e.message : t("hostDashboard.failedLoad")))
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    if (!token || (hostStatus?.status ?? "") !== "APPROVED") return;
    setListingsLoading(true);
    getHostListings(token)
      .then(setListings)
      .catch(() => setListings([]))
      .finally(() => setListingsLoading(false));
  }, [token, hostStatus?.status]);

  useEffect(() => {
    if (!token) return;
    setBookingsLoading(true);
    getHostBookings(token)
      .then(setBookings)
      .catch(() => setBookings([]))
      .finally(() => setBookingsLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <AppLoader />
      </div>
    );
  }

  const status = hostStatus?.status ?? "NOT_STARTED";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-nexa-ink flex items-center gap-2">
            <LayoutDashboard className="h-8 w-8 text-nexa-primary" />
            {t("hostDashboard.title")}
          </h1>
          <p className="text-nexa-ink-3 mt-1">
            {status === "APPROVED"
              ? t("hostDashboard.manageListings")
              : t("hostDashboard.applicationStatus")}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={localePath("/")}>{t("hostDashboard.home")}</Link>
          </Button>
          {status === "APPROVED" && (
            <Button size="sm" asChild>
              <Link href={localePath("/host")} className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                {t("hostDashboard.addListing")}
              </Link>
            </Button>
          )}
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-red-800 text-sm mb-6">
          {error}
        </div>
      )}

      {/* Status card */}
      <div className="rounded-2xl border border-nexa-line bg-white overflow-hidden mb-8">
        <div className="p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-nexa-ink mb-4">{t("hostDashboard.hostStatus")}</h2>
          {status === "NOT_STARTED" && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-nexa-ink-1 text-nexa-ink-4 shrink-0">
                <Building2 className="h-8 w-8" />
              </div>
              <div className="flex-1">
                <p className="text-nexa-ink font-medium">{t("hostDashboard.notAppliedYet")}</p>
                <p className="text-nexa-ink-3 text-sm mt-1">
                  {t("hostDashboard.completeApplication")}
                </p>
                <Button className="mt-4" asChild>
                  <Link href={localePath("/host")}>{t("hostDashboard.becomeHost")}</Link>
                </Button>
              </div>
            </div>
          )}

          {status === "PENDING" && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 text-amber-700 shrink-0">
                <Clock className="h-8 w-8" />
              </div>
              <div className="flex-1">
                <p className="text-nexa-ink font-medium">{t("hostDashboard.underReview")}</p>
                <p className="text-nexa-ink-3 text-sm mt-1">
                  {hostStatus?.message ?? t("hostDashboard.reviewMessage")}
                </p>
                <p className="text-nexa-ink-4 text-xs mt-2">
                  {t("hostDashboard.meanwhileBrowse")}
                </p>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={localePath("/listings")}>{t("hostDashboard.browseStays")}</Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={localePath("/profile")}>{t("common.profile")}</Link>
                  </Button>
                </div>
              </div>
            </div>
          )}

          {status === "REJECTED" && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-700 shrink-0">
                <XCircle className="h-8 w-8" />
              </div>
              <div className="flex-1">
                <p className="text-nexa-ink font-medium">{t("hostDashboard.notApproved")}</p>
                <p className="text-nexa-ink-3 text-sm mt-1">
                  {hostStatus?.rejection_reason ?? hostStatus?.message ?? t("hostDashboard.reapplyMessage")}
                </p>
                <Button className="mt-4" asChild>
                  <Link href={localePath("/host")}>{t("hostDashboard.applyAgain")}</Link>
                </Button>
              </div>
            </div>
          )}

          {status === "APPROVED" && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-700 shrink-0">
                <FileCheck className="h-8 w-8" />
              </div>
              <div className="flex-1">
                <p className="text-nexa-ink font-medium">{t("hostDashboard.approvedHost")}</p>
                <p className="text-nexa-ink-3 text-sm mt-1">
                  {t("hostDashboard.addListingDesc")}
                </p>
                <Button className="mt-4" asChild>
                  <Link href={localePath("/host")} className="flex items-center gap-2">
                    <PlusCircle className="h-4 w-4" />
                    {t("hostDashboard.addListing")}
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Your bookings - for approved hosts */}
      {status === "APPROVED" && (
        <div className="rounded-2xl border border-nexa-line bg-white overflow-hidden mb-8">
          <div className="p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-nexa-ink mb-4 flex items-center gap-2">
              <CalendarCheck className="h-5 w-5 text-nexa-primary" />
              {t("hostDashboard.yourBookings")}
            </h2>
            {bookingsLoading ? (
              <div className="py-12 text-center text-nexa-ink-4">{t("hostDashboard.loadingBookings")}</div>
            ) : bookings.length > 0 ? (
              <div className="space-y-4">
                {bookings.map((b) => (
                  <div
                    key={b.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border border-nexa-line hover:border-nexa-primary/30"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-nexa-ink">{b.listing?.title ?? t("hostDashboard.listing")}</p>
                      <p className="text-sm text-nexa-ink-3">
                        {b.guest_name ?? t("hostDashboard.guest")} · {b.checkin_date} – {b.checkout_date}
                      </p>
                      <p className="text-xs text-nexa-ink-4 mt-1">
                        Status: <span className={b.status === "CONFIRMED" ? "text-green-600" : "text-amber-600"}>{b.status}</span>
                        {b.total_paid != null && ` · ${b.total_paid} ${b.currency}`}
                      </p>
                    </div>
                    <Link href={localePath(`/bookings/${b.id}`)} className="text-sm text-nexa-primary font-medium shrink-0 hover:underline">
                      {t("hostDashboard.viewDetails")} →
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border-2 border-dashed border-nexa-line bg-nexa-bg-1 p-6 text-center">
                <CalendarCheck className="h-10 w-10 text-nexa-ink-4 mx-auto mb-2" />
                <p className="text-nexa-ink-3 text-sm">{t("hostDashboard.noBookingsYet")}</p>
                <p className="text-nexa-ink-4 text-xs mt-1">
                  {t("hostDashboard.bookingsAppearHere")}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Your listings - only for approved hosts */}
      {status === "APPROVED" && (
        <div className="rounded-2xl border border-nexa-line bg-white overflow-hidden">
          <div className="p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-nexa-ink mb-4">{t("hostDashboard.yourListings")}</h2>
            {listingsLoading ? (
              <div className="py-12 text-center text-nexa-ink-4">{t("hostDashboard.loadingListings")}</div>
            ) : listings.length > 0 ? (
              <div className="space-y-4">
                {listings.map((l) => (
                  <div
                    key={l.id}
                    className={cn(
                      "flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border border-nexa-line",
                      l.status === "LIVE" && "hover:border-nexa-primary/30 hover:bg-nexa-primary-soft/30"
                    )}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-nexa-ink truncate">{l.title}</p>
                      <p className="text-sm text-nexa-ink-3">{l.city} · {l.listing_type}</p>
                      <p className="text-xs text-nexa-ink-4 mt-1">
                        Status: <span className={l.status === "LIVE" ? "text-green-600" : l.status === "SUBMITTED" ? "text-amber-600" : "text-nexa-ink-4"}>{l.status}</span>
                        {l.rate_plan && ` · ${l.rate_plan.base_price} ${l.rate_plan.currency}/night`}
                      </p>
                    </div>
                    {l.status === "LIVE" ? (
                      <Link href={localePath(`/listings/${l.id}`)} className="text-sm text-nexa-primary font-medium shrink-0 hover:underline">{t("hostDashboard.view")} →</Link>
                    ) : (
                      <span className="text-sm text-nexa-ink-4 shrink-0">{l.status === "SUBMITTED" ? t("hostDashboard.pendingReview") : l.status}</span>
                    )}
                  </div>
                ))}
                <Button variant="outline" className="mt-2" asChild>
                  <Link href={localePath("/host")} className="flex items-center gap-2">
                    <PlusCircle className="h-4 w-4" />
                    {t("hostDashboard.addAnotherListing")}
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="rounded-xl border-2 border-dashed border-nexa-line bg-nexa-bg-1 p-8 text-center">
                <Building2 className="h-12 w-12 text-nexa-ink-4 mx-auto mb-3" />
              <p className="text-nexa-ink font-medium">{t("hostDashboard.noListingsYet")}</p>
              <p className="text-nexa-ink-3 text-sm mt-1 max-w-sm mx-auto">
                {t("hostDashboard.addFirstProperty")}
              </p>
              <Button className="mt-4" asChild>
                <Link href={localePath("/host")} className="flex items-center gap-2">
                  <PlusCircle className="h-4 w-4" />
                  {t("hostDashboard.addListing")}
                </Link>
              </Button>
            </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-8 flex justify-center">
        <Button variant="ghost" asChild>
          <Link href={localePath("/")} className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            {t("hostDashboard.backToHome")}
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default function HostDashboardPage() {
  return (
    <>
      <NavBar />
      <main className="pt-[72px] min-h-screen bg-nexa-bg-1">
        <ProtectedRoute>
          <HostDashboardContent />
        </ProtectedRoute>
      </main>
    </>
  );
}
