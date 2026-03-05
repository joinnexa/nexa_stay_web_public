import React from "react";
import Link from "next/link";
import Image from "next/image";

export const Footer = () => {
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
              Verified stays built for Morocco. Security, trust, and comfort.
            </p>
            <div className="mt-5">
              <a
                href="tel:+212690283339"
                className="block text-nexa-primary-light text-sm mb-1.5 hover:underline"
              >
                📞 +212 6 9028 3339 — Customer Relations
              </a>
              <a
                href="tel:+79955582175"
                className="block text-nexa-primary-light text-sm hover:underline"
              >
                📞 +7 995 558-21-75 — Investments
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-5 font-sans">
              Platform
            </h4>
            <Link href="/listings" className="block text-sm mb-2.5 hover:text-nexa-primary-light transition-colors">
              Stays
            </Link>
            <Link href="/host" className="block text-sm mb-2.5 hover:text-nexa-primary-light transition-colors">
              Become a Host
            </Link>
            <Link href="/login" className="block text-sm mb-2.5 hover:text-nexa-primary-light transition-colors">
              Sign In
            </Link>
            <Link href="/fees" className="block text-sm mb-2.5 hover:text-nexa-primary-light transition-colors">
              Fees
            </Link>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-5 font-sans">
              Company
            </h4>
            <Link href="/about" className="block text-sm mb-2.5 hover:text-nexa-primary-light transition-colors">
              About Us
            </Link>
            <Link href="/contact" className="block text-sm mb-2.5 hover:text-nexa-primary-light transition-colors">
              Contact
            </Link>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-5 font-sans">
              Legal
            </h4>
            <Link href="/terms" className="block text-sm mb-2.5 hover:text-nexa-primary-light transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/privacy" className="block text-sm mb-2.5 hover:text-nexa-primary-light transition-colors">
              Privacy Policy
            </Link>
            <Link href="/refund" className="block text-sm mb-2.5 hover:text-nexa-primary-light transition-colors">
              Refund Policy
            </Link>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 sm:pt-7 text-sm text-center sm:text-left">
          <p className="text-white/40">© 2026 Nexa. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-1.5 text-white/50 text-sm">
            <span className="text-nexa-primary-light font-semibold">Secured by Nexa.</span> Operated by Nexa.
          </div>
        </div>
      </div>
    </footer>
  );
};
