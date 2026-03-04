"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { AppLoader } from "./AppLoader";

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** Require JWT (full auth). If false, allows OTP session (registration) too. */
  requireJwt?: boolean;
}

/**
 * Protects routes that need authentication.
 * - If !ready → show loader
 * - If no JWT → redirect to /login?redirect=currentPath
 * - If requireJwt and only OTP session → redirect to /registration
 */
export function ProtectedRoute({
  children,
  requireJwt = true,
}: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { ready, tokenType, token } = useAuth();

  useEffect(() => {
    if (!ready) return;
    const redirectPath = pathname || "/";
    if (!token) {
      router.replace(`/login?redirect=${encodeURIComponent(redirectPath)}`);
      return;
    }
    if (requireJwt && tokenType !== "jwt") {
      router.replace(
        `/registration?redirect=${encodeURIComponent(redirectPath)}`
      );
    }
  }, [ready, token, tokenType, requireJwt, router, pathname]);

  if (!ready) {
    return <AppLoader />;
  }

  if (!token) {
    return <AppLoader />;
  }

  if (requireJwt && tokenType !== "jwt") {
    return <AppLoader />;
  }

  return <>{children}</>;
}
