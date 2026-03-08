"use client";

import React, { useState } from "react";
import { NavBar } from "@/components/navbar/NavBar";
import { Footer } from "@/components/footer/Footer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ContactPage() {
  const { t } = useLanguage();
  const [reason, setReason] = useState("");

  return (
    <>
      <NavBar />
      <main className="pt-[72px]">
        <section className="bg-gradient-to-br from-nexa-primary-soft to-nexa-bg pt-[calc(72px+64px)] pb-16 border-b border-nexa-line">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
            <span className="block text-xs font-semibold tracking-[0.12em] uppercase text-nexa-primary mb-3">
              {t("contact.title")}
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-nexa-ink mb-4">
              {t("contact.heading")}
            </h1>
            <p className="max-w-[580px] text-lg">
              {t("contact.subtitle")}
            </p>
          </div>
        </section>

        <section className="py-24">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-20">
              <div>
                <span className="block text-xs font-semibold tracking-[0.12em] uppercase text-nexa-primary mb-4">
                  {t("contact.getInTouch")}
                </span>
                <div className="w-12 h-0.5 bg-gradient-to-r from-nexa-primary to-nexa-accent rounded-sm my-4" />
                <div className="flex flex-col gap-5">
                  <div className="bg-white border border-nexa-line rounded-[22px] p-8 shadow-nexa-card hover:-translate-y-0.5 hover:shadow-nexa-md hover:border-nexa-primary/20 transition-all">
                    <div className="text-3xl mb-3">🎧</div>
                    <h3 className="text-lg font-semibold text-nexa-ink mb-2">
                      {t("contact.customerSupport")}
                    </h3>
                    <p className="text-sm mb-4">
                      {t("contact.supportDesc")}
                    </p>
                    <div className="font-semibold text-nexa-primary text-[0.95rem] mb-3">
                      📞 +212 6 9028 3339
                    </div>
                    <Button
                      size="sm"
                      onClick={() => setReason("Support")}
                    >
                      {t("contact.sendSupport")}
                    </Button>
                  </div>
                  <div className="bg-white border border-nexa-line rounded-[22px] p-8 shadow-nexa-card hover:-translate-y-0.5 hover:shadow-nexa-md transition-all">
                    <div className="text-3xl mb-3">🏢</div>
                    <h3 className="text-lg font-semibold text-nexa-ink mb-2">
                      {t("contact.portfolioPartnership")}
                    </h3>
                    <p className="text-sm mb-4">
                      {t("contact.portfolioDesc")}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setReason("Partnership (10+ units)")}
                    >
                      {t("contact.requestPartnership")}
                    </Button>
                  </div>
                  <div className="bg-white border border-nexa-line rounded-[22px] p-8 shadow-nexa-card hover:-translate-y-0.5 hover:shadow-nexa-md transition-all">
                    <div className="text-3xl mb-3">📈</div>
                    <h3 className="text-lg font-semibold text-nexa-ink mb-2">
                      {t("contact.investmentsTitle")}
                    </h3>
                    <p className="text-sm mb-4">
                      {t("contact.investmentsDesc")}
                    </p>
                    <div className="font-semibold text-nexa-primary text-[0.95rem] mb-3">
                      📞 +7 995 558-21-75
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setReason("Investments")}
                    >
                      {t("contact.sendInvestment")}
                    </Button>
                  </div>
                </div>
              </div>
              <div>
                <div className="bg-white rounded-[32px] p-11 shadow-nexa-md border border-nexa-line">
                  <h2 className="text-2xl font-semibold mb-1.5">
                    {t("contact.sendMessage")}
                  </h2>
                  <p className="text-nexa-ink-3 text-sm mb-7">
                    {t("contact.replyNote")}
                  </p>
                  <form className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-nexa-ink-2 mb-2">
                        {t("contact.reasonRequired")}
                      </label>
                      <select
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="w-full py-3 px-4 border border-nexa-line rounded-xl font-sans text-sm text-nexa-ink bg-white outline-none focus:border-nexa-primary focus:ring-2 focus:ring-nexa-primary/20"
                      >
                        <option value="">{t("contact.selectReason")}</option>
                        <option value="Support">{t("contact.support")}</option>
                        <option value="Partnership (10+ units)">
                          {t("contact.partnership")}
                        </option>
                        <option value="Investments">{t("contact.investments")}</option>
                        <option value="Other">{t("contact.other")}</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-semibold text-nexa-ink-2 mb-2">
                          {t("contact.fullNameRequired")}
                        </label>
                        <input
                          type="text"
                          placeholder={t("contact.fullNamePlaceholder")}
                          className="w-full py-3 px-4 border border-nexa-line rounded-xl font-sans text-sm outline-none focus:border-nexa-primary focus:ring-2 focus:ring-nexa-primary/20"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-nexa-ink-2 mb-2">
                          {t("contact.phoneRequired")}
                        </label>
                        <input
                          type="tel"
                          placeholder={t("contact.phonePlaceholder")}
                          className="w-full py-3 px-4 border border-nexa-line rounded-xl font-sans text-sm outline-none focus:border-nexa-primary focus:ring-2 focus:ring-nexa-primary/20"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-semibold text-nexa-ink-2 mb-2">
                          {t("contact.emailRequired")}
                        </label>
                        <input
                          type="email"
                          placeholder={t("contact.emailPlaceholder")}
                          className="w-full py-3 px-4 border border-nexa-line rounded-xl font-sans text-sm outline-none focus:border-nexa-primary focus:ring-2 focus:ring-nexa-primary/20"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-nexa-ink-2 mb-2">
                          {t("contact.city")}
                        </label>
                        <input
                          type="text"
                          placeholder={t("contact.cityPlaceholder")}
                          className="w-full py-3 px-4 border border-nexa-line rounded-xl font-sans text-sm outline-none focus:border-nexa-primary focus:ring-2 focus:ring-nexa-primary/20"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-nexa-ink-2 mb-2">
                        {t("contact.messageRequired")}
                      </label>
                      <textarea
                        rows={4}
                        placeholder={t("contact.messagePlaceholder")}
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
                        🏢 {t("contact.partnershipDetails")}
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                        <div>
                          <label className="block text-sm font-semibold mb-2">
                            {t("contact.numberOfUnits")}
                          </label>
                          <input
                            type="number"
                            min={10}
                            placeholder={t("contact.unitsPlaceholder")}
                            className="w-full py-3 px-4 border border-nexa-line rounded-xl font-sans text-sm outline-none focus:border-nexa-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-2">
                            {t("contact.propertyType")}
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
                          {t("contact.citiesCovered")}
                        </label>
                        <input
                          type="text"
                          placeholder={t("contact.citiesPlaceholder")}
                          className="w-full py-3 px-4 border border-nexa-line rounded-xl font-sans text-sm outline-none focus:border-nexa-primary"
                        />
                      </div>
                    </div>
                    <Button size="lg" className="w-full justify-center mt-2">
                      {t("contact.sendMessageBtn")}
                    </Button>
                  </form>
                  <p className="text-[0.75rem] text-nexa-ink-4 text-center mt-3">
                    {t("contact.detailsNote")}
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
