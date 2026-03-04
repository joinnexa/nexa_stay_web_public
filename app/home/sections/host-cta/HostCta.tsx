"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const bullets = [
  "Verified guests + declared occupants",
  "Walkthrough video = fewer disputes",
  "Balanced protection for damage & no-shows",
  "Faster onboarding for multi-unit operators",
];

export const HostCtaSection = () => {
  return (
    <section className="py-24">
      <div className="max-w-[1280px] mx-auto px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-nexa-ink to-nexa-ink-2 rounded-[32px] p-18 px-20 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12 items-center"
        >
          <div>
            <span className="text-xs font-semibold tracking-[0.12em] uppercase text-nexa-primary-light mb-3 block">
              For Property Owners
            </span>
            <h2 className="text-3xl font-semibold text-white mb-3">
              List your property. Keep more of your revenue.
            </h2>
            <p className="text-white/65 max-w-[500px] mb-6">
              Lower fees than traditional platforms, plus verified guests and
              clearer rules.
            </p>
            <div className="flex flex-col gap-2.5 mt-6">
              {bullets.map((bullet) => (
                <div
                  key={bullet}
                  className="flex items-center gap-2.5 text-white/80 text-sm"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-nexa-primary-light shrink-0" />
                  {bullet}
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3 items-start shrink-0">
            <Button variant="white" size="lg" asChild>
              <Link href="/host">Start Hosting</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white/30 text-white/80 hover:bg-white/10 hover:text-white"
              asChild
            >
              <Link href="/contact">Talk to Partnerships</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
