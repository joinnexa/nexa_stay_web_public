"use client";

import React, { useState } from "react";
import { NavBar } from "@/components/navbar/NavBar";
import { Footer } from "@/components/footer/Footer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ContactPage() {
  const [reason, setReason] = useState("");

  return (
    <>
      <NavBar />
      <main className="pt-[72px]">
        <section className="bg-gradient-to-br from-nexa-primary-soft to-nexa-bg pt-[calc(72px+64px)] pb-16 border-b border-nexa-line">
          <div className="max-w-[1280px] mx-auto px-16">
            <span className="block text-xs font-semibold tracking-[0.12em] uppercase text-nexa-primary mb-3">
              Contact
            </span>
            <h1 className="text-4xl font-bold text-nexa-ink mb-4">
              We&apos;re here to help
            </h1>
            <p className="max-w-[580px] text-lg">
              Have a question, need support, or want to partner with Nexa Stays?
            </p>
          </div>
        </section>

        <section className="py-24">
          <div className="max-w-[1280px] mx-auto px-16">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-20">
              <div>
                <span className="block text-xs font-semibold tracking-[0.12em] uppercase text-nexa-primary mb-4">
                  Get in touch
                </span>
                <div className="w-12 h-0.5 bg-gradient-to-r from-nexa-primary to-nexa-accent rounded-sm my-4" />
                <div className="flex flex-col gap-5">
                  <div className="bg-white border border-nexa-line rounded-[22px] p-8 shadow-nexa-card hover:-translate-y-0.5 hover:shadow-nexa-md hover:border-nexa-primary/20 transition-all">
                    <div className="text-3xl mb-3">🎧</div>
                    <h3 className="text-lg font-semibold text-nexa-ink mb-2">
                      Customer Support
                    </h3>
                    <p className="text-sm mb-4">
                      For booking questions, account help, verification, or
                      reporting an issue.
                    </p>
                    <div className="font-semibold text-nexa-primary text-[0.95rem] mb-3">
                      📞 +212 6 9028 3339
                    </div>
                    <Button
                      size="sm"
                      onClick={() => setReason("Support")}
                    >
                      Send a Support Message
                    </Button>
                  </div>
                  <div className="bg-white border border-nexa-line rounded-[22px] p-8 shadow-nexa-card hover:-translate-y-0.5 hover:shadow-nexa-md transition-all">
                    <div className="text-3xl mb-3">🏢</div>
                    <h3 className="text-lg font-semibold text-nexa-ink mb-2">
                      Portfolio Host Partnership (10+ Units)
                    </h3>
                    <p className="text-sm mb-4">
                      Manage 10+ apartments/hotel rooms? We can onboard you as a
                      priority partner with faster setup and dedicated support.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setReason("Partnership (10+ units)")}
                    >
                      Request a Partnership Call
                    </Button>
                  </div>
                  <div className="bg-white border border-nexa-line rounded-[22px] p-8 shadow-nexa-card hover:-translate-y-0.5 hover:shadow-nexa-md transition-all">
                    <div className="text-3xl mb-3">📈</div>
                    <h3 className="text-lg font-semibold text-nexa-ink mb-2">
                      Investments & Strategic Partnerships
                    </h3>
                    <p className="text-sm mb-4">
                      For investment discussions and strategic partnerships.
                    </p>
                    <div className="font-semibold text-nexa-primary text-[0.95rem] mb-3">
                      📞 +7 995 558-21-75
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setReason("Investments")}
                    >
                      Send an Investment Proposal
                    </Button>
                  </div>
                </div>
              </div>
              <div>
                <div className="bg-white rounded-[32px] p-11 shadow-nexa-md border border-nexa-line">
                  <h2 className="text-2xl font-semibold mb-1.5">
                    Send us a message
                  </h2>
                  <p className="text-nexa-ink-3 text-sm mb-7">
                    We&apos;ll get back to you as soon as possible.
                  </p>
                  <form className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-nexa-ink-2 mb-2">
                        Reason <span className="text-nexa-primary">*</span>
                      </label>
                      <select
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="w-full py-3 px-4 border border-nexa-line rounded-xl font-sans text-sm text-nexa-ink bg-white outline-none focus:border-nexa-primary focus:ring-2 focus:ring-nexa-primary/20"
                      >
                        <option value="">Select a reason</option>
                        <option value="Support">Support</option>
                        <option value="Partnership (10+ units)">
                          Partnership (10+ units)
                        </option>
                        <option value="Investments">Investments</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-semibold text-nexa-ink-2 mb-2">
                          Full Name <span className="text-nexa-primary">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Your full name"
                          className="w-full py-3 px-4 border border-nexa-line rounded-xl font-sans text-sm outline-none focus:border-nexa-primary focus:ring-2 focus:ring-nexa-primary/20"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-nexa-ink-2 mb-2">
                          Phone <span className="text-nexa-primary">*</span>
                        </label>
                        <input
                          type="tel"
                          placeholder="+212 6 XX XX XX XX"
                          className="w-full py-3 px-4 border border-nexa-line rounded-xl font-sans text-sm outline-none focus:border-nexa-primary focus:ring-2 focus:ring-nexa-primary/20"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-semibold text-nexa-ink-2 mb-2">
                          Email <span className="text-nexa-primary">*</span>
                        </label>
                        <input
                          type="email"
                          placeholder="you@example.com"
                          className="w-full py-3 px-4 border border-nexa-line rounded-xl font-sans text-sm outline-none focus:border-nexa-primary focus:ring-2 focus:ring-nexa-primary/20"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-nexa-ink-2 mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          placeholder="Optional"
                          className="w-full py-3 px-4 border border-nexa-line rounded-xl font-sans text-sm outline-none focus:border-nexa-primary focus:ring-2 focus:ring-nexa-primary/20"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-nexa-ink-2 mb-2">
                        Message <span className="text-nexa-primary">*</span>
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Tell us how we can help..."
                        className="w-full py-3 px-4 border border-nexa-line rounded-xl font-sans text-sm outline-none focus:border-nexa-primary focus:ring-2 focus:ring-nexa-primary/20 resize-y min-h-[120px]"
                      />
                    </div>
                    <div
                      className={cn(
                        "rounded-xl p-5 mb-4 border border-nexa-primary/15 bg-nexa-primary-soft",
                        reason !== "Partnership (10+ units)" && "hidden"
                      )}
                    >
                      <h4 className="text-sm font-bold text-nexa-primary-dark mb-3">
                        🏢 Partnership Details
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                        <div>
                          <label className="block text-sm font-semibold mb-2">
                            Number of units <span className="text-nexa-primary">*</span>
                          </label>
                          <input
                            type="number"
                            min={10}
                            placeholder="Min 10"
                            className="w-full py-3 px-4 border border-nexa-line rounded-xl font-sans text-sm outline-none focus:border-nexa-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-2">
                            Property type <span className="text-nexa-primary">*</span>
                          </label>
                          <select className="w-full py-3 px-4 border border-nexa-line rounded-xl font-sans text-sm outline-none focus:border-nexa-primary">
                            <option>Apartments</option>
                            <option>Hotels</option>
                            <option>Mixed</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">
                          Cities covered <span className="text-nexa-primary">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Marrakech, Casablanca"
                          className="w-full py-3 px-4 border border-nexa-line rounded-xl font-sans text-sm outline-none focus:border-nexa-primary"
                        />
                      </div>
                    </div>
                    <Button size="lg" className="w-full justify-center mt-2">
                      Send Message →
                    </Button>
                  </form>
                  <p className="text-[0.75rem] text-nexa-ink-4 text-center mt-3">
                    Your details are used only to respond to your request.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
