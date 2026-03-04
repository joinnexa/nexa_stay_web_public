"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { NavBar } from "@/components/navbar/NavBar";
import { Footer } from "@/components/footer/Footer";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { searchListings } from "@/lib/stays-api";
import type { StaysListing } from "@/lib/stays-types";

const vibes = [
  { label: "Rooftop sunsets", img: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=300&q=70" },
  { label: "Riad magic", img: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=300&q=70" },
  { label: "Ocean view", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&q=70" },
  { label: "Cozy & quiet", img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&q=70" },
  { label: "Luxury minimal", img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&q=70" },
  { label: "Family-ready", img: "https://images.unsplash.com/photo-1585155770447-2f66e2a397b5?w=300&q=70" },
];

const placeholderImg = "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=400&q=80";

function ListingCard({ listing }: { listing: StaysListing }) {
  const price = listing.rate_plan?.base_price ?? 0;
  const verified = listing.instant_booking ? "⚡ Instant" : "🎬 Verified";

  return (
    <div className="bg-white rounded-[22px] border border-nexa-line overflow-hidden transition-all hover:-translate-y-1 hover:shadow-nexa-md group">
      <Link href={`/listings/${listing.id}`}>
        <div className="relative h-[180px]">
          <Image src={placeholderImg} alt={listing.title} fill className="object-cover" />
          <div className="absolute top-2.5 left-2.5 right-2.5 flex justify-between">
            <span className="inline-flex px-3 py-1 rounded-full text-[0.72rem] font-semibold bg-nexa-ink text-white">
              {listing.listing_type}
            </span>
            <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-sm cursor-pointer shadow-nexa-sm ml-auto">
              🤍
            </div>
          </div>
          <div className="absolute bottom-2.5 left-2.5">
            <span className="inline-flex px-3 py-1 rounded-full text-[0.72rem] font-semibold bg-nexa-primary-soft text-nexa-primary">
              {verified}
            </span>
          </div>
        </div>
      </Link>
      <div className="p-4">
        <div className="text-[0.78rem] text-nexa-ink-4 mb-1">{listing.city}</div>
        <div className="font-bold text-[0.95rem] text-nexa-ink mb-1">{listing.title}</div>
        <div className="text-[0.8rem] text-nexa-ink-3 mb-3 line-clamp-2">
          {listing.description || `${listing.listing_type} in ${listing.city}`}
        </div>
        <div className="flex items-center justify-between">
          <div className="font-bold text-[0.95rem] text-nexa-ink">
            {price} <span className="font-normal text-[0.8rem] text-nexa-ink-4">{(listing.rate_plan?.currency || "MAD")}/night</span>
          </div>
          <Button size="sm" asChild>
            <Link href={`/listings/${listing.id}`}>View Stay</Link>
          </Button>
        </div>
        <div className="text-[0.72rem] text-nexa-ink-4 text-center pt-2 mt-2.5 border-t border-nexa-line">
          🔒 Contact masked until confirmed
        </div>
      </div>
    </div>
  );
}

export default function ListingsPage() {
  const searchParams = useSearchParams();
  const [listings, setListings] = useState<StaysListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [verifiedOnly, setVerifiedOnly] = useState(
    searchParams.get("verified_walkthrough_only") === "true"
  );
  const [instantOnly, setInstantOnly] = useState(
    searchParams.get("instant_booking_only") === "true"
  );
  const [selectedType, setSelectedType] = useState<string>("Apartment");

  const city = searchParams.get("city") || "";
  const checkin = searchParams.get("checkin_date") || "";
  const checkout = searchParams.get("checkout_date") || "";
  const guests = searchParams.get("guests") ? parseInt(searchParams.get("guests")!, 10) : undefined;

  useEffect(() => {
    let cancelled = false;
    setError(null);
    setIsLoading(true);

    searchListings({
      city: city || undefined,
      checkin_date: checkin || undefined,
      checkout_date: checkout || undefined,
      guests,
      verified_walkthrough_only: verifiedOnly || undefined,
      instant_booking_only: instantOnly || undefined,
    })
      .then((data) => {
        if (!cancelled) setListings(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load listings");
          setListings([]);
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => { cancelled = true; };
  }, [city, checkin, checkout, guests, verifiedOnly, instantOnly]);

  const refreshWithFilters = (newVerified?: boolean, newInstant?: boolean) => {
    const v = newVerified ?? verifiedOnly;
    const i = newInstant ?? instantOnly;
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (checkin) params.set("checkin_date", checkin);
    if (checkout) params.set("checkout_date", checkout);
    if (guests) params.set("guests", String(guests));
    if (v) params.set("verified_walkthrough_only", "true");
    if (i) params.set("instant_booking_only", "true");
    window.history.replaceState({}, "", `/listings?${params.toString()}`);
    setVerifiedOnly(v);
    setInstantOnly(i);
  };

  const searchSummary = [city || "Anywhere", checkin && checkout ? `${checkin} – ${checkout}` : null, guests ? `${guests} guests` : null]
    .filter(Boolean)
    .join(" · ");

  const displayListings = selectedType === "all"
    ? listings
    : listings.filter((l) => l.listing_type.toUpperCase() === selectedType.toUpperCase());

  return (
    <>
      <NavBar />
      <main className="pt-[72px] min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr]">
          <aside className="bg-white border-r border-nexa-line p-7 px-6 sticky top-[72px] h-[calc(100vh-72px)] overflow-y-auto">
            <h3 className="mb-5">Filters</h3>
            <div className="mb-7">
              <h4 className="text-[0.78rem] font-bold uppercase tracking-wider text-nexa-ink-3 mb-3.5">
                Trust
              </h4>
              <label
                className={cn(
                  "flex items-center justify-between py-2.5 px-3.5 rounded-xl border cursor-pointer text-sm mb-2 transition-all",
                  verifiedOnly ? "border-nexa-primary text-nexa-primary bg-nexa-primary-soft" : "border-nexa-line text-nexa-ink-3"
                )}
                onClick={() => refreshWithFilters(!verifiedOnly, undefined)}
              >
                <span>🎬 Verified Walkthrough only</span>
                <input type="checkbox" checked={verifiedOnly} readOnly className="accent-nexa-primary" />
              </label>
              <label
                className={cn(
                  "flex items-center justify-between py-2.5 px-3.5 rounded-xl border cursor-pointer text-sm mb-2 transition-all",
                  instantOnly ? "border-nexa-primary text-nexa-primary bg-nexa-primary-soft" : "border-nexa-line text-nexa-ink-3 hover:border-nexa-primary"
                )}
                onClick={() => refreshWithFilters(undefined, !instantOnly)}
              >
                <span>⚡ Instant Booking</span>
                <input type="checkbox" checked={instantOnly} readOnly className="accent-nexa-primary" />
              </label>
            </div>
            <div className="mb-7">
              <h4 className="text-[0.78rem] font-bold uppercase tracking-wider text-nexa-ink-3 mb-3.5">
                Property Type
              </h4>
              <div className="flex flex-wrap gap-2">
                {["all", "APARTMENT", "HOTEL", "RIAD", "VILLA"].map((type) => (
                  <span
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={cn(
                      "py-1.5 px-3.5 rounded-full text-[0.78rem] border cursor-pointer transition-all",
                      selectedType === type ? "border-nexa-primary text-nexa-primary bg-nexa-primary-soft" : "border-nexa-line text-nexa-ink-3 hover:border-nexa-primary"
                    )}
                  >
                    {type === "all" ? "All" : type.charAt(0) + type.slice(1).toLowerCase()}
                  </span>
                ))}
              </div>
            </div>
          </aside>

          <div className="bg-nexa-bg">
            <div className="bg-white border-b border-nexa-line py-4 px-8 flex items-center gap-4 sticky top-[72px] z-10">
              <div className="flex-1 bg-nexa-bg-2 border border-nexa-line rounded-full py-2.5 px-5 flex items-center gap-2 text-sm text-nexa-ink-3">
                🔍 <span>{searchSummary || "Search stays"}</span>
              </div>
              <span className="text-[0.8rem] text-nexa-ink-4 whitespace-nowrap">
                {isLoading ? "Loading…" : `${displayListings.length} stays found`}
              </span>
            </div>

            <div className="p-7 px-8">
              <div className="bg-gradient-to-br from-nexa-ink to-nexa-ink-2 rounded-[32px] p-9 px-10 mb-7">
                <h1 className="text-white text-2xl font-semibold mb-2">
                  Stays in Morocco — verified and ready.
                </h1>
                <p className="text-white/65 text-sm max-w-[500px] mb-4">
                  Handpicked vibes: rooftops, riads, ocean views, calm apartments,
                  and hidden gems — with verified walkthroughs so you
                  don&apos;t get surprised.
                </p>
              </div>

              <div className="mb-2">
                <h3 className="text-base font-semibold mb-1">Choose your vibe</h3>
                <p className="text-[0.8rem] text-nexa-ink-4">
                  Tap a vibe to explore.
                </p>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-1 mb-7 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {vibes.map((vibe) => (
                  <div
                    key={vibe.label}
                    className="shrink-0 w-[140px] h-20 rounded-xl overflow-hidden relative cursor-pointer hover:scale-[1.02] transition-transform"
                  >
                    <div
                      className="w-full h-full flex items-end p-2.5 bg-cover bg-center"
                      style={{
                        backgroundImage: `linear-gradient(180deg,rgba(0,0,0,0.1),rgba(0,0,0,0.5)),url('${vibe.img}')`,
                      }}
                    >
                      <span className="text-white text-[0.78rem] font-bold drop-shadow">
                        {vibe.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm">
                  {error}
                </div>
              )}

              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="h-[320px] bg-gray-200 rounded-[22px] animate-pulse" />
                  ))}
                </div>
              ) : displayListings.length === 0 ? (
                <div className="text-center py-16 text-nexa-ink-4">
                  <p className="text-lg font-medium mb-2">No stays found</p>
                  <p className="text-sm">Try adjusting your filters or search.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-9">
                  {displayListings.map((l) => (
                    <ListingCard key={l.id} listing={l} />
                  ))}
                </div>
              )}

              <div className="bg-nexa-primary-soft border border-nexa-primary/15 rounded-[22px] p-6 px-7 flex items-center gap-8">
                <h3 className="text-[0.95rem] font-semibold text-nexa-primary-dark shrink-0">
                  No surprises. That&apos;s the whole point.
                </h3>
                <div className="flex gap-6 flex-wrap">
                  {[
                    "Verified walkthrough video",
                    "Verified identity",
                    "Accurate location",
                    "Clear check-in contact",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm text-nexa-ink-3">
                      <span className="w-2 h-2 rounded-full bg-nexa-primary" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
