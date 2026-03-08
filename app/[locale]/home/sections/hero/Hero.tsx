"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export const HeroSection = () => {
  const { t, tf, localePath } = useLanguage();
  return (
    <section className="min-h-screen pt-[72px] grid grid-cols-1 md:grid-cols-2 items-center overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_100%_50%,rgba(232,80,122,0.06)_0%,transparent_70%)] pointer-events-none" />
      <div className="p-6 sm:p-10 md:p-14 lg:p-16 xl:p-20 xl:pl-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-nexa-primary-soft border border-nexa-primary/20 rounded-full py-1.5 px-4 text-xs font-semibold text-nexa-primary mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-nexa-primary" />
          {t("home.hero.badge")}
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-nexa-ink mb-5 leading-tight [&>em]:not-italic [&>em]:text-nexa-primary"
          dangerouslySetInnerHTML={{ __html: tf("home.hero.title") }}
        />
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-base sm:text-lg text-nexa-ink-3 mb-9 max-w-[460px] leading-relaxed"
        >
          {t("home.hero.subtitle")}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex gap-3.5 mb-10"
        >
          <Button size="lg" asChild>
            <Link href={localePath("/listings")}>{t("home.hero.searchStays")}</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href={localePath("/host")}>{t("home.hero.becomeHost")}</Link>
          </Button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex gap-6 flex-wrap pt-7 border-t border-nexa-line"
        >
          {[
            t("home.hero.identityVerified"),
            t("home.hero.walkthroughVideos"),
            t("home.hero.fairProtection"),
            t("home.hero.clearCheckin"),
          ].map(
            (item, i) => (
              <div key={i} className="flex items-center gap-1.5 text-sm text-nexa-ink-4">
                <span className="text-nexa-primary">✓</span> {item}
              </div>
            )
          )}
        </motion.div>
      </div>
      <div className="h-screen bg-gradient-to-br from-[#f9d8e3] via-[#fce7d3] to-[#f8d4e3] flex items-center justify-center relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative w-full max-w-[340px] h-[360px] sm:h-[400px] md:h-[420px] mx-auto"
        >
          <div className="absolute inset-0 bg-white rounded-[22px] shadow-nexa-lg overflow-hidden">
            <div
              className="h-[70%] bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=600&q=80')",
              }}
            />
            <div className="p-4">
              <h4 className="font-display text-base font-semibold mb-1 flex justify-between">
                Rooftop Riad Escape{" "}
                <span className="text-nexa-primary font-bold">600 MAD</span>
              </h4>
              <span className="text-sm text-nexa-ink-3">
                Marrakech Medina · ⭐ 4.9
              </span>
            </div>
          </div>
          <div className="absolute -bottom-20 -right-5 bg-white rounded-full py-2.5 px-4 shadow-nexa-md flex items-center gap-2 text-xs font-semibold whitespace-nowrap">
            <span>🎬</span> Verified Walkthrough
          </div>
          <div className="absolute -top-20 -left-5 bg-white rounded-full py-2.5 px-4 shadow-nexa-md flex items-center gap-2 text-xs font-semibold whitespace-nowrap">
            <span>⚡</span> Instant Booking
          </div>
        </motion.div>
      </div>
    </section>
  );
};
