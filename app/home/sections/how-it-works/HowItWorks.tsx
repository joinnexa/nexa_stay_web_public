"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const steps = [
  {
    num: "1",
    title: "Search and choose",
    desc: "Find stays with verified walkthrough videos and clear rules.",
  },
  {
    num: "2",
    title: "Book instantly",
    desc: "Availability is real-time. No double booking. No hidden fees.",
  },
  {
    num: "3",
    title: "Arrive with confidence",
    desc: "Exact location + check-in contact shared after confirmation.",
  },
];

export const HowItWorksSection = () => {
  return (
    <section id="how" className="py-16 sm:py-20 md:py-24 bg-nexa-bg-2">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="block text-xs font-semibold tracking-[0.12em] uppercase text-nexa-primary mb-4">
              How It Works
            </span>
            <div className="w-12 h-0.5 bg-gradient-to-r from-nexa-primary to-nexa-accent rounded-sm my-5" />
            <h2 className="text-2xl sm:text-3xl font-semibold text-nexa-ink mb-4">
              Simple to book.
              <br />
              Serious about trust.
            </h2>
            <p className="mb-10">
              No confusion, no double bookings, no awkward surprises at
              check-in.
            </p>
            <div className="flex flex-col gap-8">
              {steps.map((step, i) => (
                <div key={step.num} className="flex gap-5">
                  <div className="shrink-0 w-11 h-11 rounded-full bg-nexa-primary text-white font-bold text-base flex items-center justify-center shadow-[0_4px_12px_rgba(232,80,122,.32)]">
                    {step.num}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-nexa-ink mb-1">
                      {step.title}
                    </h3>
                    <p className="text-sm">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button className="mt-9" asChild>
              <Link href="/listings">Start Exploring</Link>
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl sm:rounded-[32px] overflow-hidden shadow-nexa-lg h-[320px] sm:h-[400px] lg:h-[480px] relative min-h-[280px]"
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=700&q=80')",
              }}
            />
            <div className="absolute bottom-6 left-6 right-6 bg-[rgba(253,251,252,0.95)] backdrop-blur-md rounded-xl p-5 px-6 flex items-center gap-3 shadow-nexa-md">
              <div className="w-10 h-10 rounded-full bg-nexa-primary-soft flex items-center justify-center text-nexa-primary font-bold">
                ✓
              </div>
              <div>
                <div className="font-bold text-sm">Check-in confirmed</div>
                <div className="text-xs text-nexa-ink-3">
                  Contact details shared · Meet at 14:00
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
