import React from "react";
import { NavBar } from "@/components/navbar/NavBar";
import { Footer } from "@/components/footer/Footer";

export default function FeesPage() {
  return (
    <>
      <NavBar />
      <main className="pt-[72px]">
        <section className="bg-gradient-to-br from-nexa-primary-soft to-nexa-bg pt-[calc(72px+64px)] pb-16 border-b border-nexa-line">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
            <span className="block text-xs font-semibold tracking-[0.12em] uppercase text-nexa-primary mb-3">
              Transparent Fees
            </span>
            <h1 className="text-4xl font-bold text-nexa-ink mb-4">
              Split Fair — 2% + 2%
            </h1>
            <p className="max-w-[580px] text-lg">
              Guests pay less than most platforms. Hosts keep more revenue. Both
              sides contribute a small, balanced amount.
            </p>
          </div>
        </section>

        <section className="py-24">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-nexa-primary mb-3">
                  Total Platform Fee
                </p>
                <div className="font-display text-8xl font-bold text-nexa-primary leading-none">
                  <span className="text-4xl">Only </span> 4%
                </div>
                <p className="mt-4 text-lg">
                  Shared fairly between guests and hosts. No hidden charges.
                </p>
              </div>
              <div>
                <div className="grid grid-cols-2 gap-5 mt-8">
                  <div className="rounded-[22px] p-7 bg-nexa-primary-soft border border-nexa-primary/20">
                    <div className="text-xs font-bold uppercase tracking-wider text-nexa-primary mb-1.5">
                      👤 Guest pays
                    </div>
                    <div className="font-display text-4xl font-bold text-nexa-primary mb-2">
                      2%
                    </div>
                    <p className="text-sm text-nexa-ink-3">
                      of the booking subtotal. Added transparently at checkout.
                    </p>
                  </div>
                  <div className="rounded-[22px] p-7 bg-nexa-accent-soft border border-nexa-accent/20">
                    <div className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-1.5">
                      🏠 Host pays
                    </div>
                    <div className="font-display text-4xl font-bold text-nexa-accent mb-2">
                      2%
                    </div>
                    <p className="text-sm text-nexa-ink-3">
                      of the booking subtotal. Deducted from payout.
                    </p>
                  </div>
                </div>
                <div className="mt-4 bg-nexa-bg-2 rounded-xl p-4 text-sm text-nexa-ink-3">
                  💡 Guests pay less than many platforms, and hosts keep more
                  revenue — while both sides contribute a small, balanced amount.
                </div>
              </div>
            </div>

            <div className="text-center mb-14">
              <span className="block text-xs font-semibold uppercase tracking-wider text-nexa-primary mb-3">
                Real Examples
              </span>
              <h2 className="text-3xl font-semibold text-nexa-ink mb-4">
                See exactly what you pay and receive.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
              <div className="bg-white rounded-[32px] border border-nexa-line overflow-hidden shadow-nexa-card">
                <div className="bg-gradient-to-r from-nexa-primary-soft to-nexa-accent-soft p-6 px-7 border-b border-nexa-line">
                  <h3 className="text-base font-semibold mb-1">Example 1 — 1 Night</h3>
                  <div className="font-display text-2xl font-bold text-nexa-primary">
                    600 MAD/night
                  </div>
                  <span className="text-sm text-nexa-ink-3">Subtotal: 600 MAD</span>
                </div>
                <div className="p-6 px-7 space-y-4">
                  <div>
                    <div className="text-[0.72rem] font-bold uppercase tracking-wider text-nexa-ink-4 mb-2.5">
                      👤 Guest pays
                    </div>
                    <table className="w-full text-sm">
                      <tbody>
                        <tr className="border-b border-nexa-line">
                          <td className="py-3.5">Subtotal</td>
                          <td className="text-right">600 MAD</td>
                        </tr>
                        <tr className="border-b border-nexa-line">
                          <td className="py-3.5">Guest fee (2%)</td>
                          <td className="text-right">12 MAD</td>
                        </tr>
                        <tr className="font-bold text-nexa-ink">
                          <td className="py-3.5 pt-4">Total</td>
                          <td className="text-right text-nexa-primary pt-4">
                            612 MAD
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div>
                    <div className="text-[0.72rem] font-bold uppercase tracking-wider text-nexa-ink-4 mb-2.5">
                      🏠 Host receives
                    </div>
                    <table className="w-full text-sm">
                      <tbody>
                        <tr className="border-b border-nexa-line">
                          <td className="py-3.5">Subtotal</td>
                          <td className="text-right">600 MAD</td>
                        </tr>
                        <tr className="border-b border-nexa-line">
                          <td className="py-3.5">Host fee (2%)</td>
                          <td className="text-right">−12 MAD</td>
                        </tr>
                        <tr className="font-bold text-nexa-ink">
                          <td className="py-3.5 pt-4">Host payout</td>
                          <td className="text-right text-green-700 pt-4">
                            588 MAD
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-[32px] border border-nexa-line overflow-hidden shadow-nexa-card">
                <div className="bg-gradient-to-r from-nexa-primary-soft to-nexa-accent-soft p-6 px-7 border-b border-nexa-line">
                  <h3 className="text-base font-semibold mb-1">Example 2 — 3 Nights</h3>
                  <div className="font-display text-2xl font-bold text-nexa-primary">
                    550 MAD/night
                  </div>
                  <span className="text-sm text-nexa-ink-3">
                    Subtotal: 1,650 MAD
                  </span>
                </div>
                <div className="p-6 px-7 space-y-4">
                  <div>
                    <div className="text-[0.72rem] font-bold uppercase tracking-wider text-nexa-ink-4 mb-2.5">
                      👤 Guest pays
                    </div>
                    <table className="w-full text-sm">
                      <tbody>
                        <tr className="border-b border-nexa-line">
                          <td className="py-3.5">Subtotal (3 × 550)</td>
                          <td className="text-right">1,650 MAD</td>
                        </tr>
                        <tr className="border-b border-nexa-line">
                          <td className="py-3.5">Guest fee (2%)</td>
                          <td className="text-right">33 MAD</td>
                        </tr>
                        <tr className="font-bold text-nexa-ink">
                          <td className="py-3.5 pt-4">Total</td>
                          <td className="text-right text-nexa-primary pt-4">
                            1,683 MAD
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div>
                    <div className="text-[0.72rem] font-bold uppercase tracking-wider text-nexa-ink-4 mb-2.5">
                      🏠 Host receives
                    </div>
                    <table className="w-full text-sm">
                      <tbody>
                        <tr className="border-b border-nexa-line">
                          <td className="py-3.5">Subtotal</td>
                          <td className="text-right">1,650 MAD</td>
                        </tr>
                        <tr className="border-b border-nexa-line">
                          <td className="py-3.5">Host fee (2%)</td>
                          <td className="text-right">−33 MAD</td>
                        </tr>
                        <tr className="font-bold text-nexa-ink">
                          <td className="py-3.5 pt-4">Host payout</td>
                          <td className="text-right text-green-700 pt-4">
                            1,617 MAD
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
              <div>
                <span className="block text-xs font-semibold uppercase tracking-wider text-nexa-primary mb-4">
                  How it looks at checkout
                </span>
                <div className="w-12 h-0.5 bg-gradient-to-r from-nexa-primary to-nexa-accent rounded-sm my-4" />
                <h2 className="text-2xl font-semibold text-nexa-ink mb-4">
                  Completely transparent. Zero hidden charges.
                </h2>
                <p>
                  Every fee is shown before you confirm. No charges added after
                  booking.
                </p>
              </div>
              <div className="bg-white rounded-[32px] p-9 shadow-nexa-md border border-nexa-line max-w-[400px]">
                <h3 className="text-sm font-bold mb-5 pb-3 border-b border-nexa-line">
                  Price breakdown
                </h3>
                <div className="flex justify-between text-sm mb-3 text-nexa-ink-3">
                  <span>Subtotal (2 nights × 600)</span>
                  <span>1,200 MAD</span>
                </div>
                <div className="flex justify-between text-sm mb-3 text-nexa-ink-3">
                  <span>Guest service fee (2%)</span>
                  <span>24 MAD</span>
                </div>
                <div className="flex justify-between font-bold text-nexa-ink pt-3 border-t-2 border-nexa-line mt-2">
                  <span>Total</span>
                  <span className="text-nexa-primary">1,224 MAD</span>
                </div>
                <div className="mt-5 pt-4 border-t border-nexa-line">
                  <div className="text-[0.72rem] font-bold uppercase tracking-wider text-nexa-ink-4 mb-2">
                    Host payout
                  </div>
                  <div className="flex justify-between text-sm mb-2 text-nexa-ink-3">
                    <span>Subtotal</span>
                    <span>1,200 MAD</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2 text-nexa-ink-3">
                    <span>Host fee (2%)</span>
                    <span>−24 MAD</span>
                  </div>
                  <div className="flex justify-between font-bold text-green-700 pt-3 border-t border-nexa-line">
                    <span>Estimated payout</span>
                    <span>1,176 MAD</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mb-7">
              <span className="block text-xs font-semibold uppercase tracking-wider text-nexa-primary mb-3">
                How we compare
              </span>
              <h2 className="text-3xl font-semibold text-nexa-ink mb-4">
                Nexa Stays vs. other platforms.
              </h2>
            </div>
            <div className="bg-nexa-bg-2 rounded-[32px] p-12 mb-16">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="text-center p-7 rounded-[22px] bg-nexa-primary-soft border border-nexa-primary/20">
                  <div className="text-xs font-bold uppercase tracking-wider text-nexa-primary mb-3">
                    Nexa Stays — Guest fee
                  </div>
                  <div className="font-display text-6xl font-bold text-nexa-primary mb-2">
                    2%
                  </div>
                  <div className="text-sm text-nexa-ink-3">
                    Among the lowest available
                  </div>
                </div>
                <div className="text-center p-7 rounded-[22px] bg-nexa-bg border border-nexa-line">
                  <div className="text-xs font-bold uppercase tracking-wider text-nexa-ink-4 mb-3">
                    Industry average — Guest fee
                  </div>
                  <div className="font-display text-6xl font-bold text-nexa-ink-3 mb-2">
                    3–15%
                  </div>
                  <div className="text-sm text-nexa-ink-3">
                    Most platforms charge significantly more
                  </div>
                </div>
              </div>
              <p className="text-center mt-7 text-sm text-nexa-ink-3">
                Booking platforms charge 3%–25% depending on model. We&apos;re at
                2% per side and show you everything upfront.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: "💸",
                  title: "Guests pay less",
                  desc: "Our 2% guest fee means you keep more of your budget for the experience itself.",
                },
                {
                  icon: "💰",
                  title: "Hosts earn more",
                  desc: "At just 2% from hosts, Nexa Stays lets you keep more of each booking.",
                },
                {
                  icon: "🤝",
                  title: "Both sides contribute",
                  desc: "A fair split means both parties have skin in the game — reducing misuse.",
                },
              ].map((box) => (
                <div
                  key={box.title}
                  className="bg-white rounded-[22px] p-7 border border-nexa-line shadow-nexa-card"
                >
                  <div className="text-3xl mb-3">{box.icon}</div>
                  <h3 className="text-lg font-semibold text-nexa-ink mb-2">
                    {box.title}
                  </h3>
                  <p className="text-sm text-nexa-ink-3">{box.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
