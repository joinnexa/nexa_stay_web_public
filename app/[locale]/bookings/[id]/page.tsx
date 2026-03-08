"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { NavBar } from "@/components/navbar/NavBar";
import { Footer } from "@/components/footer/Footer";
import { Button } from "@/components/ui/button";
import {
  getBooking,
  createPaymentIntent,
  payWithWallet,
  simulateCardPayment,
} from "@/lib/stays-api";
import { getCurrentConsents, acceptMandatoryConsents } from "@/lib/consent-api";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import type { StaysBooking } from "@/lib/stays-types";

export default function BookingDetailPage() {
  const params = useParams();
  const { token } = useAuth();
  const { t, localePath } = useLanguage();
  const id = params.id as string;

  const [booking, setBooking] = useState<StaysBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paying, setPaying] = useState<"card" | "wallet" | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [consentAccepted, setConsentAccepted] = useState<boolean | null>(null);
  const [consentChecked, setConsentChecked] = useState(false);
  const [acceptingConsent, setAcceptingConsent] = useState(false);

  const refreshBooking = useCallback(() => {
    if (!token) return;
    getBooking(id, token)
      .then((b) => {
        setBooking(b);
        setError(null);
      })
      .catch((err) => setError(err instanceof Error ? err.message : t("bookings.failedLoad")));
  }, [id, token]);

  useEffect(() => {
    getBooking(id, token)
      .then(setBooking)
      .catch((err) => setError(err instanceof Error ? err.message : t("bookings.failedLoad")))
      .finally(() => setLoading(false));
  }, [id, token]);

  useEffect(() => {
    if (token && booking?.status === "PAYMENT_PENDING" && consentAccepted === null) {
      getCurrentConsents(token)
        .then((c) => setConsentAccepted(c.mandatoryAccepted))
        .catch(() => setConsentAccepted(false));
    }
  }, [token, booking?.status, consentAccepted]);

  if (loading) {
    return (
      <>
        <NavBar />
        <main className="pt-[72px] min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nexa-primary" />
        </main>
      </>
    );
  }

  if (error || !booking) {
    return (
      <>
        <NavBar />
        <main className="pt-[72px] min-h-screen flex flex-col items-center justify-center gap-4">
          <p className="text-nexa-ink-3">{error || t("bookings.bookingNotFound")}</p>
          <Button asChild><Link href={localePath("/listings")}>{t("common.browseStays")}</Link></Button>
        </main>
      </>
    );
  }

  const statusColors: Record<string, string> = {
    CONFIRMED: "bg-green-100 text-green-800",
    CHECKED_IN: "bg-blue-100 text-blue-800",
    COMPLETED: "bg-gray-100 text-gray-800",
    PAYMENT_PENDING: "bg-yellow-100 text-yellow-800",
    INITIATED: "bg-yellow-100 text-yellow-800",
    CANCELLED_BY_GUEST: "bg-red-100 text-red-800",
    CANCELLED_BY_HOST: "bg-red-100 text-red-800",
  };

  return (
    <>
      <NavBar />
      <main className="pt-[72px] min-h-screen">
        <div className="max-w-[640px] mx-auto px-6 py-12">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">✅</div>
            <h1 className="text-2xl font-bold text-nexa-ink mb-2">{t("bookings.bookingConfirmed")}</h1>
            <span className={`inline-flex px-4 py-1.5 rounded-full text-sm font-medium ${statusColors[booking.status] || "bg-gray-100 text-gray-800"}`}>
              {booking.status.replace(/_/g, " ")}
            </span>
          </div>

          <div className="bg-white rounded-[22px] border border-nexa-line p-6 space-y-6">
            {booking.listing && (
              <div>
                <h3 className="text-sm font-semibold text-nexa-ink-4 mb-2">{t("bookings.listing")}</h3>
                <p className="font-semibold">{booking.listing.title}</p>
                <p className="text-sm text-nexa-ink-4">{booking.listing.city}</p>
                {booking.listing.address && (
                  <p className="text-sm text-nexa-ink-3 mt-1">{t("bookings.address")}: {booking.listing.address}</p>
                )}
                {booking.listing.check_in_contact && (
                  <div className="mt-2 p-3 bg-nexa-primary-soft rounded-xl">
                    <p className="text-sm font-semibold text-nexa-primary-dark">{t("bookings.checkinContact")}</p>
                    <p>{booking.listing.check_in_contact.full_name}</p>
                    <p className="text-sm">{booking.listing.check_in_contact.phone}</p>
                  </div>
                )}
              </div>
            )}

            <div>
              <h3 className="text-sm font-semibold text-nexa-ink-4 mb-2">{t("bookings.dates")}</h3>
              <p>{new Date(booking.checkin_date).toLocaleDateString()} – {new Date(booking.checkout_date).toLocaleDateString()}</p>
              <p className="text-sm text-nexa-ink-4">{booking.guest_count} guest{booking.guest_count > 1 ? "s" : ""}</p>
            </div>

            {booking.occupants && booking.occupants.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-nexa-ink-4 mb-2">{t("bookings.occupants")}</h3>
                <ul className="space-y-1.5">
                  {booking.occupants.map((o, i) => (
                    <li key={i} className="text-sm">
                      <span className="font-medium text-nexa-ink">{o.full_name}</span>
                      {o.id_number && <span className="text-nexa-ink-4"> · ID: {o.id_number}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <h3 className="text-sm font-semibold text-nexa-ink-4 mb-2">{t("bookings.payment")}</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>{t("bookings.subtotal")}</span>
                  <span>{booking.total_subtotal} {booking.currency}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t("bookings.guestFee")}</span>
                  <span>{booking.guest_fee} {booking.currency}</span>
                </div>
                {booking.total_paid != null && (
                  <div className="flex justify-between font-bold pt-2">
                    <span>{t("bookings.total")}</span>
                    <span>{booking.total_paid} {booking.currency}</span>
                  </div>
                )}
              </div>

              {booking.status === "PAYMENT_PENDING" && (
                <div className="mt-6 pt-6 border-t border-nexa-line">
                  {consentAccepted === false && (
                    <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                      <p className="text-sm text-amber-800 mb-3">{t("bookings.acceptTerms")}</p>
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={consentChecked}
                          onChange={(e) => setConsentChecked(e.target.checked)}
                          className="mt-1 rounded border-nexa-line"
                        />
                        <span className="text-sm text-nexa-ink">
                          {t("bookings.agreeTerms")}{" "}
                          <Link href={localePath("/terms")} className="text-nexa-primary hover:underline font-medium" target="_blank">
                            Terms & Conditions
                          </Link>{" "}
                          {t("bookings.and")}{" "}
                          <Link href={localePath("/privacy")} className="text-nexa-primary hover:underline font-medium" target="_blank">
                            Privacy Policy
                          </Link>
                        </span>
                      </label>
                      <Button
                        onClick={async () => {
                          if (!token || !consentChecked) return;
                          setAcceptingConsent(true);
                          try {
                            await acceptMandatoryConsents(token);
                            setConsentAccepted(true);
                          } catch {
                            setPaymentError(t("bookings.acceptFailed"));
                          } finally {
                            setAcceptingConsent(false);
                          }
                        }}
                        disabled={!consentChecked || acceptingConsent}
                        className="mt-4"
                      >
                        {acceptingConsent ? t("bookings.accepting") : t("bookings.acceptContinue")}
                      </Button>
                    </div>
                  )}
                  <h4 className="text-sm font-semibold text-nexa-ink mb-3">{t("bookings.payNow")}</h4>
                  {paymentError && (
                    <p className="text-sm text-red-600 mb-3">{paymentError}</p>
                  )}
                  <div className="flex flex-col gap-3">
                    <Button
                      onClick={async () => {
                        if (!token) return;
                        if (consentAccepted !== true) {
                          setPaymentError(t("bookings.termsFirst"));
                          return;
                        }
                        setPaymentError(null);
                        setPaying("card");
                        try {
                          const intent = await createPaymentIntent(id, token);
                          await simulateCardPayment(intent.provider_intent_id!);
                          refreshBooking();
                        } catch (err) {
                          setPaymentError(err instanceof Error ? err.message : t("bookings.cardFailed"));
                        } finally {
                          setPaying(null);
                        }
                      }}
                      disabled={!!paying || consentAccepted !== true}
                      className="w-full justify-center"
                    >
                      {paying === "card" ? t("bookings.processing") : t("bookings.payWithCard")}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={async () => {
                        if (!token) return;
                        if (consentAccepted !== true) {
                          setPaymentError(t("bookings.termsFirst"));
                          return;
                        }
                        setPaymentError(null);
                        setPaying("wallet");
                        try {
                          await payWithWallet(id, token);
                          refreshBooking();
                        } catch (err) {
                          setPaymentError(err instanceof Error ? err.message : t("bookings.walletFailed"));
                        } finally {
                          setPaying(null);
                        }
                      }}
                      disabled={!!paying || consentAccepted !== true}
                      className="w-full justify-center"
                    >
                      {paying === "wallet" ? t("bookings.processing") : t("bookings.payWithWallet")}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <Button asChild className="w-full justify-center">
              <Link href={localePath("/listings")}>{t("bookings.browseMore")}</Link>
            </Button>
            <Button variant="outline" asChild className="w-full justify-center">
              <Link href={localePath("/")}>{t("bookings.backToHome")}</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
