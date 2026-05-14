"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NEXA_STAYS_LOGO_SRC } from "@/lib/brand-assets";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSelector } from "@/components/ui/LanguageSelector";
import { ChevronDown, User, LogOut, Menu, X, LayoutDashboard } from "lucide-react";
import { ProfileAvatar } from "@/components/ProfileAvatar";

const navLinks = [
  { href: "/listings", labelKey: "nav.stays", id: "listings" },
  { href: "/host", labelKey: "nav.becomeHost", id: "host" },
  { href: "/#how", labelKey: "nav.howItWorks", id: "home" },
  { href: "/about", labelKey: "nav.about", id: "about" },
  { href: "/contact", labelKey: "nav.contact", id: "contact" },
];

export const NavBar = () => {
  const pathname = usePathname();
  const { t, localePath } = useLanguage();
  const { isAuthenticated, user, token, tokenType, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const isActive = (href: string, id: string) => {
    if (href === "/" || href.startsWith("/#")) {
      return pathname.match(/^\/[a-z]{2}\/?$/) != null && id === "home";
    }
    const fullHref = localePath(href);
    return pathname === fullHref || pathname.startsWith(fullHref + "/");
  };

  return (
    <>
    <nav className="fixed top-0 left-0 right-0 z-50 h-[72px] bg-[rgba(253,251,252,0.92)] backdrop-blur-xl border-b border-nexa-line flex items-center">
      <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 flex items-center gap-4 md:gap-10">
        <Link
          href={localePath("/")}
          className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition-opacity shrink-0"
        >
          <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-lg overflow-hidden border-2 border-nexa-primary-soft">
            <Image
              src={NEXA_STAYS_LOGO_SRC}
              alt="Nexa Stays"
              fill
              sizes="36px"
              className="object-cover"
            />
          </div>
          <span className="font-display text-lg sm:text-xl font-bold text-nexa-ink">
            Nexa <span className="text-nexa-primary">Stays</span>
          </span>
        </Link>

        <div className="hidden lg:flex gap-7 items-center ml-auto">
          {navLinks.map(({ href, labelKey, id }) => (
            <Link
              key={id}
              href={href.startsWith("/#") ? localePath("/") + href.slice(1) : localePath(href)}
              className={cn(
                "text-sm font-medium py-1 border-b-2 border-transparent transition-colors",
                isActive(href, id)
                  ? "text-nexa-primary border-nexa-primary"
                  : "text-nexa-ink-3 hover:text-nexa-primary"
              )}
            >
              {t(labelKey)}
            </Link>
          ))}
          <LanguageSelector />
        </div>

        <div className="flex gap-2 sm:gap-3 ml-auto lg:ml-5 relative" ref={menuRef}>
          {isAuthenticated ? (
            <>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-nexa-bg-2 transition-colors text-nexa-ink"
                aria-expanded={profileOpen}
                aria-haspopup="true"
              >
                <ProfileAvatar
                  hasPhoto={!!(user?.profile_photo_url && String(user.profile_photo_url).trim().length > 0)}
                  token={tokenType === "jwt" ? token : null}
                  size="sm"
                />
                <span className="text-sm font-medium hidden sm:inline">{t("common.profile")}</span>
                <ChevronDown className={cn("h-4 w-4 transition-transform", profileOpen && "rotate-180")} />
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 py-1 bg-white rounded-lg shadow-lg border border-nexa-line z-50">
                  <Link
                    href={localePath("/profile")}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-nexa-ink hover:bg-nexa-bg-2"
                    onClick={() => setProfileOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    {t("common.profile")}
                  </Link>
                  <Link
                    href={localePath("/my-bookings")}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-nexa-ink hover:bg-nexa-bg-2"
                    onClick={() => setProfileOpen(false)}
                  >
                    {t("nav.myBookings")}
                  </Link>
                  <Link
                    href={localePath("/host/dashboard")}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-nexa-ink hover:bg-nexa-bg-2"
                    onClick={() => setProfileOpen(false)}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    {t("nav.hostDashboard")}
                  </Link>
                  <Link
                    href={localePath("/host")}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-nexa-ink hover:bg-nexa-bg-2"
                    onClick={() => setProfileOpen(false)}
                  >
                    {t("nav.becomeHost")}
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setProfileOpen(false);
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-nexa-ink hover:bg-nexa-bg-2 text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    {t("common.signOut")}
                  </button>
                </div>
              )}
            </>
          ) : (
            <Button variant="default" size="sm" className="min-h-[44px] sm:min-h-0" asChild>
              <Link href={localePath("/login")}>{t("common.signIn")}</Link>
            </Button>
          )}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden flex items-center justify-center w-11 h-11 min-w-[44px] min-h-[44px] rounded-lg hover:bg-nexa-bg-2 text-nexa-ink transition-colors"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </nav>

    {/* Mobile menu overlay */}
    <div
      className={cn(
        "fixed inset-0 z-[60] lg:hidden transition-opacity duration-300",
        mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
      aria-hidden={!mobileMenuOpen}
    >
      <div
        className="absolute inset-0 bg-nexa-ink/40 backdrop-blur-sm"
        onClick={() => setMobileMenuOpen(false)}
      />
      <div
        className={cn(
          "absolute top-0 right-0 w-full max-w-[320px] h-full bg-white shadow-xl flex flex-col transition-transform duration-300 ease-out",
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-nexa-line">
          <span className="font-display text-lg font-bold text-nexa-ink">{t("common.menu")}</span>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-center w-11 h-11 min-w-[44px] min-h-[44px] rounded-lg hover:bg-nexa-bg-2 text-nexa-ink"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex flex-col p-4 gap-1 overflow-y-auto">
          {navLinks.map(({ href, labelKey, id }) => (
            <Link
              key={id}
              href={href.startsWith("/#") ? localePath("/") + href.slice(1) : localePath(href)}
              className={cn(
                "px-4 py-3 min-h-[44px] flex items-center rounded-xl text-base font-medium transition-colors",
                isActive(href, id) ? "text-nexa-primary bg-nexa-primary-soft" : "text-nexa-ink hover:bg-nexa-bg-2"
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              {t(labelKey)}
            </Link>
          ))}
          <div className="mt-2 px-4 py-2">
            <LanguageSelector />
          </div>
          <div className="mt-4 pt-4 border-t border-nexa-line">
            {isAuthenticated ? (
              <>
                <Link
                  href={localePath("/profile")}
                  className="flex items-center gap-2 px-4 py-3 min-h-[44px] rounded-xl text-nexa-ink hover:bg-nexa-bg-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="h-4 w-4" />
                  {t("common.profile")}
                </Link>
                <Link
                  href={localePath("/my-bookings")}
                  className="flex items-center gap-2 px-4 py-3 min-h-[44px] rounded-xl text-nexa-ink hover:bg-nexa-bg-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t("nav.myBookings")}
                </Link>
                <Link
                  href={localePath("/host/dashboard")}
                  className="flex items-center gap-2 px-4 py-3 min-h-[44px] rounded-xl text-nexa-ink hover:bg-nexa-bg-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  {t("nav.hostDashboard")}
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-3 min-h-[44px] rounded-xl text-nexa-ink hover:bg-nexa-bg-2 text-left"
                >
                  <LogOut className="h-4 w-4" />
                  {t("common.signOut")}
                </button>
              </>
            ) : (
              <Link
                href={localePath("/login")}
                className="flex items-center justify-center px-4 py-3 min-h-[44px] rounded-xl bg-nexa-primary text-white font-semibold"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("common.signIn")}
              </Link>
            )}
          </div>
        </nav>
      </div>
    </div>
    </>
  );
};
