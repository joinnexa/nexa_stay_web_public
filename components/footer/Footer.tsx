"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";

export const Footer = () => {
  const { t, localePath } = useLanguage();
  return (
    <footer className="bg-nexa-ink text-white/70 py-12 sm:py-16">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-8 sm:gap-10 lg:gap-12 pb-10 sm:pb-12 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="relative w-9 h-9 rounded-lg overflow-hidden">
                <Image
                  src="/images/nexastays.png"
                  alt="Nexa Stays"
                  fill
                  sizes="36px"
                  className="object-cover"
                />
              </div>
              <span className="font-display text-xl font-bold text-white">
                Nexa Stays
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-[280px]">
              {t("footer.tagline")}
            </p>
            <div className="mt-5">
              <a
                href="tel:+212690283339"
                className="block text-nexa-primary-light text-sm mb-1.5 hover:underline"
              >
                📞 +212 6 9028 3339 — {t("footer.customerRelations")}
              </a>
              <a
                href="tel:+79955582175"
                className="block text-nexa-primary-light text-sm hover:underline"
              >
                📞 +7 995 558-21-75 — {t("footer.investments")}
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-5 font-sans">
              {t("footer.platform")}
            </h4>
            <Link href={localePath("/listings")} className="block text-sm mb-2.5 hover:text-nexa-primary-light transition-colors">
              {t("nav.stays")}
            </Link>
            <Link href={localePath("/host")} className="block text-sm mb-2.5 hover:text-nexa-primary-light transition-colors">
              {t("nav.becomeHost")}
            </Link>
            <Link href={localePath("/login")} className="block text-sm mb-2.5 hover:text-nexa-primary-light transition-colors">
              {t("common.signIn")}
            </Link>
            <Link href={localePath("/fees")} className="block text-sm mb-2.5 hover:text-nexa-primary-light transition-colors">
              {t("footer.fees")}
            </Link>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-5 font-sans">
              {t("footer.company")}
            </h4>
            <Link href={localePath("/about")} className="block text-sm mb-2.5 hover:text-nexa-primary-light transition-colors">
              {t("footer.aboutUs")}
            </Link>
            <Link href={localePath("/contact")} className="block text-sm mb-2.5 hover:text-nexa-primary-light transition-colors">
              {t("nav.contact")}
            </Link>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-5 font-sans">
              {t("footer.legal")}
            </h4>
            <Link href={localePath("/terms")} className="block text-sm mb-2.5 hover:text-nexa-primary-light transition-colors">
              {t("footer.terms")}
            </Link>
            <Link href={localePath("/privacy")} className="block text-sm mb-2.5 hover:text-nexa-primary-light transition-colors">
              {t("footer.privacy")}
            </Link>
            <Link href={localePath("/refund")} className="block text-sm mb-2.5 hover:text-nexa-primary-light transition-colors">
              {t("footer.refund")}
            </Link>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 sm:pt-7 text-sm text-center sm:text-left">
          <p className="text-white/40">{t("footer.copyright")}</p>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-1.5 text-white/50 text-sm">
            {t("footer.secured")}
          </div>
        </div>
      </div>
    </footer>
  );
};
