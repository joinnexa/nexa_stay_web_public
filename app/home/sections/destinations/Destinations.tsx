"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const destinations = [
  {
    img: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=600&q=80",
    title: "Marrakech",
    subtitle: "Riads & city stays",
    span: 2,
  },
  {
    img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80",
    title: "Agadir",
    subtitle: "Beach & calm",
    span: 1,
  },
  {
    img: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&q=80",
    title: "Tangier",
    subtitle: "Weekend escapes",
    span: 1,
  },
  {
    img: "https://images.unsplash.com/photo-1580281657527-47f249e8f4df?w=600&q=80",
    title: "Casablanca",
    subtitle: "Modern city stays",
    span: 1,
  },
  {
    img: "https://images.unsplash.com/photo-1549877452-9c387954fbc2?w=600&q=80",
    title: "Fes",
    subtitle: "Culture & authenticity",
    span: 1,
  },
];

export const DestinationsSection = () => {
  return (
    <section className="py-16 sm:py-20 md:py-24">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-9"
        >
          <span className="block text-xs font-semibold tracking-[0.12em] uppercase text-nexa-primary mb-3">
            Destinations
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-nexa-ink">
            Where do you want to stay next?
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {destinations.map((dest, i) => (
            <motion.div
              key={dest.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className={`rounded-[22px] overflow-hidden relative cursor-pointer hover:scale-[1.02] transition-transform ${
                dest.span === 2 ? "sm:row-span-2 min-h-[440px]" : ""
              }`}
            >
              <Link href={`/listings?city=${dest.title}`}>
                <div className="relative h-[220px] sm:h-full min-h-[220px]">
                  <Image
                    src={dest.img}
                    alt={dest.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-nexa-ink/65 to-transparent" />
                  <div className="absolute bottom-5 left-5">
                    <h3 className="font-display text-xl font-semibold text-white">
                      {dest.title}
                    </h3>
                    <span className="text-white/80 text-sm">{dest.subtitle}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-9"
        >
          <Button variant="outline" asChild>
            <Link href="/listings">Explore All Destinations →</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
