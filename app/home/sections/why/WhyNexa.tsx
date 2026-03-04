"use client";

import React from "react";
import { motion } from "framer-motion";

const whyCards = [
  {
    icon: "🎬",
    title: "Verified Walkthrough",
    desc: "Owners record a real video — face → door → full walkthrough — so guests know exactly what they're booking.",
  },
  {
    icon: "🪪",
    title: "Verified Identity",
    desc: "Real names + ID verification for guests and hosts. Less fraud. Less awkward surprises.",
  },
  {
    icon: "🔑",
    title: "Clear Check-in",
    desc: "Know exactly who will meet you — name, phone, role — before you arrive. No mystery contacts.",
  },
  {
    icon: "⚖️",
    title: "Fair Protection",
    desc: "We protect guests and owners with evidence-based resolution — not one-sided policies.",
  },
];

export const WhyNexaSection = () => {
  return (
    <section className="py-24">
      <div className="max-w-[1280px] mx-auto px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="block text-xs font-semibold tracking-[0.12em] uppercase text-nexa-primary mb-3">
            Why Nexa Stays
          </span>
          <h2 className="text-3xl md:text-4xl font-semibold text-nexa-ink mb-4">
            Because &quot;booking&quot; shouldn&apos;t feel like gambling.
          </h2>
          <p className="max-w-[520px] mx-auto text-base">
            We built real trust into every step — for guests and property owners
            alike.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyCards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-[22px] p-8 pt-7 border border-nexa-line shadow-nexa-card hover:-translate-y-1.5 hover:shadow-nexa-md hover:border-nexa-primary/20 transition-all duration-250"
            >
              <div className="text-3xl mb-4">{card.icon}</div>
              <h3 className="text-lg font-semibold text-nexa-ink mb-2.5">
                {card.title}
              </h3>
              <p className="text-sm text-nexa-ink-3">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
