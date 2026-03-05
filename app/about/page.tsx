import React from "react";
import { NavBar } from "@/components/navbar/NavBar";
import { Footer } from "@/components/footer/Footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function AboutPage() {
  return (
    <>
      <NavBar />
      <main>
        <section className="min-h-[60vh] flex items-center pt-[72px] bg-gradient-to-br from-nexa-primary-soft to-nexa-bg">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
            <div className="max-w-[700px]">
              <span className="block text-xs font-semibold tracking-[0.12em] uppercase text-nexa-primary mb-4">
                Our Story
              </span>
              <div className="w-12 h-0.5 bg-gradient-to-r from-nexa-primary to-nexa-accent rounded-sm my-4" />
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-nexa-ink mb-5">
                We built Nexa Stays because booking in Morocco shouldn&apos;t feel
                risky.
              </h1>
              <p className="text-lg max-w-[560px]">
                A stay should be exciting — not stressful. We exist to fix the
                real problems that keep happening — for guests and owners alike.
              </p>
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div>
                <span className="block text-xs font-semibold tracking-[0.12em] uppercase text-nexa-primary mb-4">
                  The Problem
                </span>
                <div className="w-12 h-0.5 bg-gradient-to-r from-nexa-primary to-nexa-accent rounded-sm my-4" />
                <h2 className="text-2xl font-semibold text-nexa-ink mb-4">
                  Too often, the same problems keep happening.
                </h2>
                <p className="mb-7">
                  We built Nexa Stays from repeating real-life situations that
                  leave both guests and hosts feeling unprotected.
                </p>
                <Button asChild>
                  <Link href="/listings">See Our Solution →</Link>
                </Button>
              </div>
              <div className="bg-nexa-bg-2 rounded-[32px] p-10">
                <h3 className="font-semibold mb-1">For guests:</h3>
                <div className="flex flex-col gap-3 mt-5">
                  {[
                    "🏠 Places that don't match the photos",
                    "📍 Locations that \"move\" after you arrive",
                    "💸 Surprise fees added at the last minute",
                    "👤 Awkward check-ins with unexpected people",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-2.5 py-3 px-4 bg-white rounded-xl border-l-[3px] border-nexa-primary text-sm text-nexa-ink-3"
                    >
                      {item}
                    </div>
                  ))}
                </div>
                <h3 className="font-semibold mb-1 mt-4">For hosts:</h3>
                <div className="flex flex-col gap-3 mt-5">
                  {[
                    "🔍 Damage impossible to prove",
                    "👥 Extra undeclared guests creating issues",
                    "🏢 Long task lists after high platform fees",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-2.5 py-3 px-4 bg-white rounded-xl border-l-[3px] border-nexa-primary text-sm text-nexa-ink-3"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-nexa-bg-2">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
            <div className="text-center mb-14">
              <span className="block text-xs font-semibold tracking-[0.12em] uppercase text-nexa-primary mb-3">
                Our Approach
              </span>
              <h2 className="text-3xl font-semibold text-nexa-ink mb-4">
                Verify people, verify places, protect both sides.
              </h2>
              <p className="max-w-[520px] mx-auto">
                Most platforms focus on volume. Nexa Stays focuses on predictable
                stays.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
              {[
                {
                  num: "01",
                  title: "Security that feels normal",
                  desc: "Identity verification for all: full legal name, phone, email, government ID, and profile photo. This standard protects everyone.",
                },
                {
                  num: "02",
                  title: "Trust you can actually see",
                  desc: "Verified walkthrough videos — face → door → walkthrough — removing the biggest fear: \"will it look like the pictures?\"",
                },
                {
                  num: "03",
                  title: "Comfort for both sides",
                  desc: "Clear house rules, transparent pricing, a known check-in contact, declared occupants, and fair resolution when something goes wrong.",
                },
              ].map((pillar) => (
                <div
                  key={pillar.num}
                  className="bg-white rounded-[22px] border border-nexa-line p-9 pt-8 shadow-nexa-card hover:-translate-y-1 hover:shadow-nexa-md transition-all"
                >
                  <div className="font-display text-4xl font-bold text-nexa-primary opacity-20 leading-none mb-3">
                    {pillar.num}
                  </div>
                  <h3 className="text-lg font-semibold text-nexa-ink mb-2.5">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-nexa-ink-3">{pillar.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
            <div className="bg-gradient-to-br from-nexa-ink to-nexa-ink-2 rounded-2xl sm:rounded-[32px] p-8 sm:p-12 md:p-16 lg:px-20 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
              <div>
                <span className="text-xs font-semibold tracking-[0.12em] uppercase text-nexa-primary-light block mb-4">
                  Privacy by Design
                </span>
                <h2 className="text-2xl font-semibold text-white mb-4">
                  Privacy is part of safety.
                </h2>
                <p className="text-white/65 mb-7">
                  We protect privacy with a strict rule: contact details are
                  masked until both sides are verified and the booking is
                  confirmed.
                </p>
                <div className="flex flex-col gap-3 mt-7">
                  {[
                    "🔒 No direct phone numbers before confirmation",
                    "🔒 No emails used to bypass the platform",
                    "🔒 No exact address shared before confirmation",
                    "🔒 Communication stays inside Nexa until booking is real",
                  ].map((rule) => (
                    <div
                      key={rule}
                      className="flex items-center gap-2.5 text-white/80 text-sm"
                    >
                      {rule}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col justify-center gap-6">
                <div className="bg-nexa-primary-soft border border-nexa-primary/20 rounded-[22px] p-10 text-center">
                  <div className="font-display text-6xl font-bold text-nexa-primary leading-none">
                    2%
                  </div>
                  <div className="text-base text-nexa-ink-3 mt-2">
                    Guest fee — among the lowest in the market
                  </div>
                </div>
                <div className="bg-white/10 rounded-[22px] p-6">
                  <p className="text-white/70 text-sm">
                    We split fees fairly. Guests pay less. Owners keep more.
                    Bookings grow faster.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-nexa-bg-2">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="relative rounded-[32px] overflow-hidden shadow-nexa-lg aspect-[4/3]">
                <Image
                  src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=700&q=80"
                  alt="Stay"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div>
                <span className="block text-xs font-semibold tracking-[0.12em] uppercase text-nexa-primary mb-4">
                  Better Matching
                </span>
                <div className="w-12 h-0.5 bg-gradient-to-r from-nexa-primary to-nexa-accent rounded-sm my-4" />
                <h2 className="text-2xl font-semibold text-nexa-ink mb-4">
                  More than booking: better matching.
                </h2>
                <p className="mb-6">
                  A good stay is also about fit. Nexa Stays introduces a more
                  human layer so guests find places that truly suit them.
                </p>
                <div className="flex flex-wrap gap-2.5 mt-5">
                  {[
                    "🐾 Pet-friendly",
                    "🤫 Quiet building",
                    "👨‍👩‍👧 Family-ready",
                    "💑 Couples welcome",
                    "💻 Work-friendly Wi-Fi",
                  ].map((badge) => (
                    <span
                      key={badge}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-nexa-primary-soft text-nexa-primary"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
            <div className="bg-nexa-primary rounded-[32px] p-14 px-18 flex flex-col lg:flex-row items-center justify-between gap-12">
              <div>
                <h2 className="text-2xl font-semibold text-white mb-3">
                  Want to partner with us?
                </h2>
                <p className="text-white/75">
                  If you manage properties, hotels, or a portfolio of units, we
                  can onboard you as a featured partner.
                </p>
              </div>
              <div className="flex flex-col gap-3 shrink-0">
                <Button variant="white" size="lg" asChild>
                  <Link href="/contact">Contact Partnerships →</Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/40 text-white/85 hover:bg-white/10"
                  asChild
                >
                  <Link href="/host">Start Hosting</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
