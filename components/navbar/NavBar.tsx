"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { ChevronDown, User, LogOut } from "lucide-react";

const navLinks = [
  { href: "/listings", label: "Stays", id: "listings" },
  { href: "/host", label: "Become a Host", id: "host" },
  { href: "/#how", label: "How It Works", id: "home" },
  { href: "/about", label: "About", id: "about" },
  { href: "/contact", label: "Contact", id: "contact" },
];

export const NavBar = () => {
  const pathname = usePathname();
  const { isAuthenticated, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
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

  const isActive = (href: string, id: string) => {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/#")) return pathname === "/" && id === "home";
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-[72px] bg-[rgba(253,251,252,0.92)] backdrop-blur-xl border-b border-nexa-line flex items-center">
      <div className="w-full max-w-[1280px] mx-auto px-8 flex items-center gap-10">
        <Link
          href="/"
          className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition-opacity"
        >
          <div className="relative w-9 h-9 rounded-lg overflow-hidden border-2 border-nexa-primary-soft">
            <Image
              src="/images/nexastays.png"
              alt="Nexa Stays"
              fill
              className="object-cover"
            />
          </div>
          <span className="font-display text-xl font-bold text-nexa-ink">
            Nexa <span className="text-nexa-primary">Stays</span>
          </span>
        </Link>

        <div className="flex gap-7 ml-auto">
          {navLinks.map(({ href, label, id }) => (
            <Link
              key={id}
              href={href}
              className={cn(
                "text-sm font-medium py-1 border-b-2 border-transparent transition-colors",
                isActive(href, id)
                  ? "text-nexa-primary border-nexa-primary"
                  : "text-nexa-ink-3 hover:text-nexa-primary"
              )}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="flex gap-3 ml-5 relative" ref={menuRef}>
          {isAuthenticated ? (
            <>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-nexa-bg-2 transition-colors text-nexa-ink"
                aria-expanded={profileOpen}
                aria-haspopup="true"
              >
                <span className="w-8 h-8 rounded-full bg-nexa-primary/20 flex items-center justify-center">
                  <User className="h-4 w-4 text-nexa-primary" />
                </span>
                <span className="text-sm font-medium hidden sm:inline">Profile</span>
                <ChevronDown className={cn("h-4 w-4 transition-transform", profileOpen && "rotate-180")} />
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 py-1 bg-white rounded-lg shadow-lg border border-nexa-line z-50">
                  <Link
                    href="/listings"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-nexa-ink hover:bg-nexa-bg-2"
                    onClick={() => setProfileOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    My Stays
                  </Link>
                  <Link
                    href="/host"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-nexa-ink hover:bg-nexa-bg-2"
                    onClick={() => setProfileOpen(false)}
                  >
                    Become a Host
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setProfileOpen(false);
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-nexa-ink hover:bg-nexa-bg-2 text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              )}
            </>
          ) : (
            <Button variant="default" size="sm" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};
