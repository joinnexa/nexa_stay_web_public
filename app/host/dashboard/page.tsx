"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { NavBar } from "@/components/navbar/NavBar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { getHostVerification, getHostListings } from "@/lib/stays-api";
import type { HostVerificationStatus, HostListingSummary } from "@/lib/stays-types";
import { AppLoader } from "@/components/AppLoader";
import {
  Home,
  PlusCircle,
  FileCheck,
  Clock,
  XCircle,
  LayoutDashboard,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";

function HostDashboardContent() {
  const { token } = useAuth();
  const [hostStatus, setHostStatus] = useState<HostVerificationStatus | null>(null);
  const [listings, setListings] = useState<HostListingSummary[]>([]);
  const [listingsLoading, setListingsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    setError(null);
    getHostVerification(token)
      .then(setHostStatus)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
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
            Host dashboard
          </h1>
          <p className="text-nexa-ink-3 mt-1">
            {status === "APPROVED"
              ? "Manage your listings and bookings"
              : "Your host application status"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/">Home</Link>
          </Button>
          {status === "APPROVED" && (
            <Button size="sm" asChild>
              <Link href="/host" className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Add listing
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
          <h2 className="text-lg font-semibold text-nexa-ink mb-4">Host status</h2>
          {status === "NOT_STARTED" && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-nexa-ink-1 text-nexa-ink-4 shrink-0">
                <Building2 className="h-8 w-8" />
              </div>
              <div className="flex-1">
                <p className="text-nexa-ink font-medium">You haven’t applied to host yet</p>
                <p className="text-nexa-ink-3 text-sm mt-1">
                  Complete the host application to list your property. You’ll need to verify your identity and add your first listing.
                </p>
                <Button className="mt-4" asChild>
                  <Link href="/host">Become a host</Link>
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
                <p className="text-nexa-ink font-medium">Application under review</p>
                <p className="text-nexa-ink-3 text-sm mt-1">
                  {hostStatus?.message ?? "We’re reviewing your application. You’ll be notified once you’re approved as a host."}
                </p>
                <p className="text-nexa-ink-4 text-xs mt-2">
                  In the meantime, you can still browse stays and complete your profile.
                </p>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/listings">Browse stays</Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/profile">Profile</Link>
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
                <p className="text-nexa-ink font-medium">Application not approved</p>
                <p className="text-nexa-ink-3 text-sm mt-1">
                  {hostStatus?.rejection_reason ?? hostStatus?.message ?? "Your host application was not approved. You can reapply with updated information."}
                </p>
                <Button className="mt-4" asChild>
                  <Link href="/host">Apply again</Link>
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
                <p className="text-nexa-ink font-medium">You’re an approved host</p>
                <p className="text-nexa-ink-3 text-sm mt-1">
                  You can add and manage your listings. New listings go through a quick review before going live.
                </p>
                <Button className="mt-4" asChild>
                  <Link href="/host" className="flex items-center gap-2">
                    <PlusCircle className="h-4 w-4" />
                    Add your first listing
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Your listings - only for approved hosts */}
      {status === "APPROVED" && (
        <div className="rounded-2xl border border-nexa-line bg-white overflow-hidden">
          <div className="p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-nexa-ink mb-4">Your listings</h2>
            {listingsLoading ? (
              <div className="py-12 text-center text-nexa-ink-4">Loading listings…</div>
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
                      <Link href={`/listings/${l.id}`} className="text-sm text-nexa-primary font-medium shrink-0 hover:underline">View →</Link>
                    ) : (
                      <span className="text-sm text-nexa-ink-4 shrink-0">{l.status === "SUBMITTED" ? "Pending review" : l.status}</span>
                    )}
                  </div>
                ))}
                <Button variant="outline" className="mt-2" asChild>
                  <Link href="/host" className="flex items-center gap-2">
                    <PlusCircle className="h-4 w-4" />
                    Add another listing
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="rounded-xl border-2 border-dashed border-nexa-line bg-nexa-bg-1 p-8 text-center">
                <Building2 className="h-12 w-12 text-nexa-ink-4 mx-auto mb-3" />
              <p className="text-nexa-ink font-medium">No listings yet</p>
              <p className="text-nexa-ink-3 text-sm mt-1 max-w-sm mx-auto">
                Add your first property to start receiving bookings. You’ll set details, photos, pricing, and a walkthrough video.
              </p>
              <Button className="mt-4" asChild>
                <Link href="/host" className="flex items-center gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Add listing
                </Link>
              </Button>
            </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-8 flex justify-center">
        <Button variant="ghost" asChild>
          <Link href="/" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Back to home
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
