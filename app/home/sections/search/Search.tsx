"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export const SearchSection = () => {
  const router = useRouter();
  const [destination, setDestination] = useState("");
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [guests, setGuests] = useState("1");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (destination.trim()) params.set("city", destination.trim());
    if (checkin) params.set("checkin_date", checkin);
    if (checkout) params.set("checkout_date", checkout);
    if (guests) params.set("guests", guests);
    router.push(`/listings?${params.toString()}`);
  };

  const goToListings = (extra?: { verified?: boolean; instant?: boolean }) => {
    const params = new URLSearchParams();
    if (destination.trim()) params.set("city", destination.trim());
    if (checkin) params.set("checkin_date", checkin);
    if (checkout) params.set("checkout_date", checkout);
    if (guests) params.set("guests", guests);
    if (extra?.verified) params.set("verified_walkthrough_only", "true");
    if (extra?.instant) params.set("instant_booking_only", "true");
    router.push(`/listings?${params.toString()}`);
  };

  return (
    <section className="py-16 bg-nexa-bg-2 border-b border-nexa-line">
      <div className="max-w-[1280px] mx-auto px-16">
        <motion.form
          onSubmit={handleSearch}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-[32px] shadow-nexa-lg border border-nexa-line p-2 flex items-center max-w-[900px] mx-auto"
        >
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-x divide-nexa-line">
            <div className="p-3.5 px-5">
              <label className="block text-[0.7rem] font-bold uppercase tracking-wider text-nexa-ink-3 mb-1">
                Destination
              </label>
              <input
                type="text"
                placeholder="Marrakech, Casablanca..."
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full border-none outline-none bg-transparent font-sans text-sm text-nexa-ink"
              />
            </div>
            <div className="p-3.5 px-5">
              <label className="block text-[0.7rem] font-bold uppercase tracking-wider text-nexa-ink-3 mb-1">
                Check-in
              </label>
              <input
                type="date"
                placeholder="Add dates"
                value={checkin}
                onChange={(e) => setCheckin(e.target.value)}
                className="w-full border-none outline-none bg-transparent font-sans text-sm text-nexa-ink"
              />
            </div>
            <div className="p-3.5 px-5">
              <label className="block text-[0.7rem] font-bold uppercase tracking-wider text-nexa-ink-3 mb-1">
                Check-out
              </label>
              <input
                type="date"
                placeholder="Add dates"
                value={checkout}
                onChange={(e) => setCheckout(e.target.value)}
                className="w-full border-none outline-none bg-transparent font-sans text-sm text-nexa-ink"
              />
            </div>
            <div className="p-3.5 px-5">
              <label className="block text-[0.7rem] font-bold uppercase tracking-wider text-nexa-ink-3 mb-1">
                Guests
              </label>
              <select
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="w-full border-none outline-none bg-transparent font-sans text-sm text-nexa-ink appearance-none cursor-pointer"
              >
                <option value="1">1 guest</option>
                <option value="2">2 guests</option>
                <option value="3">3 guests</option>
                <option value="4">4 guests</option>
                <option value="5">5+ guests</option>
              </select>
            </div>
          </div>
          <Button type="submit" size="lg" className="m-1 mx-2 shrink-0">
            🔍 Search
          </Button>
        </motion.form>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="flex gap-2.5 flex-wrap justify-center mt-5"
        >
          <button
            type="button"
            onClick={() => goToListings({ verified: true })}
            className="rounded-full py-1.5 px-4 text-sm font-medium border border-nexa-line text-nexa-ink-3 hover:border-nexa-primary hover:text-nexa-primary hover:bg-nexa-primary-soft transition-colors"
          >
            🎬 Verified Walkthrough
          </button>
          <button
            type="button"
            onClick={() => goToListings({ instant: true })}
            className="rounded-full py-1.5 px-4 text-sm font-medium border border-nexa-line text-nexa-ink-3 hover:border-nexa-primary hover:text-nexa-primary hover:bg-nexa-primary-soft transition-colors"
          >
            ⚡ Instant Booking
          </button>
        </motion.div>
      </div>
    </section>
  );
};
