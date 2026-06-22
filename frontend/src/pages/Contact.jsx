 /**
 * Contact.jsx — Mittal Dhaba
 * Premium contact & visit page — production-level redesign.
 * Stack: React + Framer Motion + Tailwind CSS + Lucide React
 *
 * Sections:
 *  1. Premium Intro
 *  2. Quick Contact Strip
 *  3. Visit Information
 *  4. Google Map
 *  5. Trust Badges Footer Band
 */

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  MapPin,
  Phone,
  Clock3,
  Bike,
  UtensilsCrossed,
  ArrowUpRight,
  CheckCircle2,
  PartyPopper,
  Users,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

// ─────────────────────────────────────────────
// ANIMATION HELPERS
// ─────────────────────────────────────────────

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
  },
});

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};

// ─────────────────────────────────────────────
// 1. PREMIUM INTRO SECTION
// ─────────────────────────────────────────────

function useIsOpen() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const h = new Date().getHours();
    setOpen(h >= 10 && h < 23);
  }, []);
  return open;
}

function IntroSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const isOpen = useIsOpen();

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-[#FAFAF8] pt-28 pb-12 px-5"
    >
      {/* Subtle top texture */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_40%_at_50%_0%,#FFF7ED_0%,transparent_65%)]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-200 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.div
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          variants={stagger}
          className="max-w-3xl"
        >
          {/* Operating status pill */}
          <motion.div variants={fadeUp(0)} className="mb-7 flex items-center gap-3">
            <div
              className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[12px] font-bold uppercase tracking-wider
                ${isOpen
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-red-200 bg-red-50 text-red-600"
                }`}
            >
              <span className="relative flex h-2 w-2">
                {isOpen && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-60" />
                )}
                <span className={`relative inline-flex h-2 w-2 rounded-full ${isOpen ? "bg-green-500" : "bg-red-500"}`} />
              </span>
              {isOpen ? "Open Now · Closes 11 PM" : "Currently Closed · Opens 10 AM"}
            </div>

            <span className="hidden sm:inline text-[12px] text-zinc-400 font-medium">
              Mon – Sun, 10:00 AM – 11:00 PM
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp(0.08)}
            className="text-[52px] sm:text-[68px] lg:text-[82px] font-black leading-[0.9] tracking-[-0.04em] text-zinc-900"
          >
            Come Visit
            <span className="block mt-1 text-orange-500">Mittal Dhaba.</span>
          </motion.h1>

          {/* Brand story */}
          <motion.p
            variants={fadeUp(0.16)}
            className="mt-7 max-w-xl text-[16px] sm:text-[17px] leading-[1.85] text-zinc-500"
          >
           Authentic North Indian flavours, freshly prepared in Meerut Cantt and delivered straight to your doorstep.
          </motion.p>

          {/* Inline CTA row */}
          <motion.div
            variants={fadeUp(0.22)}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <a
              href="tel:7457071114"
              className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-3 text-[14px] font-bold text-white hover:bg-zinc-800 active:scale-95 transition-all"
            >
              <Phone size={15} />
              Call to Order
            </a>
            <a
              href="https://maps.google.com/?q=Rajban+Bazar+Meerut+Cantt"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-5 py-3 text-[14px] font-bold text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50 active:scale-95 transition-all"
            >
              <MapPin size={15} className="text-orange-500" />
              Get Directions
              <ArrowUpRight size={13} className="text-zinc-400" />
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// 2. QUICK CONTACT STRIP
// ─────────────────────────────────────────────

const QUICK_INFO = [
  {
    icon: Phone,
    label: "Call Us",
    primary: "7457-071-114",
    secondary: "8791-723-722 · 9758-399-797",
    href: "tel:7457071114",
    cta: "Tap to Call",
  },
  {
    icon: MapPin,
    label: "Address",
    primary: "Rajban Bazar",
    secondary: "Behind Atithi Bhawan, Meerut Cantt",
    href: "https://maps.google.com/?q=Rajban+Bazar+Meerut+Cantt",
    cta: "Open in Maps",
  },
  {
    icon: Clock3,
    label: "Hours",
    primary: "10 AM – 11 PM",
    secondary: "Monday to Sunday, all year",
    href: null,
    cta: null,
  },
  {
    icon: Bike,
    label: "Home Delivery",
    primary: "Free above ₹400",
    secondary: "Within 2 km radius · 25–35 min",
    href: null,
    cta: null,
  },
];

function QuickStrip() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <section ref={ref} className="bg-white border-y border-zinc-100 px-5 py-0">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          variants={stagger}
          className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-zinc-100"
        >
          {QUICK_INFO.map((item, i) => {
            const Icon = item.icon;
            const inner = (
              <motion.div
                key={i}
                variants={fadeUp(i * 0.07)}
                className={`group flex flex-col gap-3 px-6 py-8 transition-colors duration-200
                  ${item.href ? "cursor-pointer hover:bg-orange-50/60" : ""}
                `}
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                    <Icon size={20} />
                  </div>
                  {item.href && (
                    <ChevronRight
                      size={16}
                      className="text-zinc-300 group-hover:text-orange-400 group-hover:translate-x-0.5 transition-all mt-1"
                    />
                  )}
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-1">
                    {item.label}
                  </p>
                  <p className="text-[15px] font-extrabold text-zinc-900 leading-tight">
                    {item.primary}
                  </p>
                  <p className="mt-1 text-[12px] text-zinc-400 leading-snug">
                    {item.secondary}
                  </p>
                  {item.cta && (
                    <p className="mt-2 text-[11px] font-bold text-orange-500 group-hover:underline">
                      {item.cta} →
                    </p>
                  )}
                </div>
              </motion.div>
            );

            return item.href ? (
              <a
                key={i}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
              >
                {inner}
              </a>
            ) : (
              <div key={i}>{inner}</div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// 3. VISIT INFORMATION SECTION
// ─────────────────────────────────────────────

const EVENTS = [
  { icon: PartyPopper, label: "Birthday Parties" },
  { icon: Users,       label: "Kitty Parties" },
  { icon: UtensilsCrossed, label: "Anniversary Celebrations" },
  { icon: Users,       label: "Family Dining" },
];

function VisitInfo() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="bg-[#FAFAF8] px-5 py-20">
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <motion.div
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          variants={stagger}
          className="mb-14"
        >
          <motion.p
            variants={fadeUp(0)}
            className="text-[11px] font-bold uppercase tracking-[0.22em] text-orange-500 mb-3"
          >
            Plan Your Visit
          </motion.p>
          <motion.h2
            variants={fadeUp(0.08)}
            className="text-[36px] sm:text-[48px] font-black tracking-[-0.04em] text-zinc-900 leading-none"
          >
            Everything You Need to Know
          </motion.h2>
        </motion.div>

        {/* Two-column layout */}
        <motion.div
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          variants={stagger}
          className="grid lg:grid-cols-2 gap-6"
        >
          {/* LEFT: Address + Delivery */}
          <div className="flex flex-col gap-6">
            {/* Address block */}
            <motion.div
              variants={fadeUp(0.05)}
              className="rounded-3xl border border-zinc-200 bg-white p-8 hover:shadow-lg hover:shadow-zinc-100 transition-shadow duration-300"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                      <MapPin size={18} />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">
                      Our Location
                    </span>
                  </div>
                  <h3 className="text-[22px] font-extrabold text-zinc-900 leading-tight">
                    Rajban Bazar,
                    <br />
                    Behind Atithi Bhawan,
                    <br />
                    Meerut Cantt
                  </h3>
                  <p className="mt-3 text-[13px] text-zinc-400">
                    Uttar Pradesh · India
                  </p>
                </div>
                <a
                  href="https://maps.google.com/?q=Rajban+Bazar+Meerut+Cantt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 inline-flex items-center gap-1 rounded-xl border border-zinc-200 px-3.5 py-2 text-[12px] font-bold text-zinc-600 hover:bg-zinc-50 hover:border-zinc-300 transition-colors"
                >
                  <ExternalLink size={12} />
                  Maps
                </a>
              </div>

              {/* Subtle divider */}
              <div className="mt-6 pt-6 border-t border-zinc-100">
                <div className="flex items-center gap-2 text-[13px] text-zinc-500">
                  <Clock3 size={14} className="text-orange-400 flex-shrink-0" />
                  <span>
                    <span className="font-bold text-zinc-700">Mon – Sun</span>
                    &nbsp;&nbsp;10:00 AM – 11:00 PM
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Delivery block */}
            <motion.div
              variants={fadeUp(0.12)}
              className="rounded-3xl border border-zinc-200 bg-white p-8 hover:shadow-lg hover:shadow-zinc-100 transition-shadow duration-300"
            >
              <div className="flex items-center gap-2 mb-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                  <Bike size={18} />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">
                  Home Delivery
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-orange-50 p-4">
                  <p className="text-[24px] font-black text-orange-500 leading-none">Free</p>
                  <p className="mt-1.5 text-[12px] text-orange-700 font-medium">
                    on orders above ₹400
                  </p>
                </div>
                <div className="rounded-2xl bg-zinc-50 p-4">
                  <p className="text-[24px] font-black text-zinc-800 leading-none">2 km</p>
                  <p className="mt-1.5 text-[12px] text-zinc-500 font-medium">
                    delivery radius
                  </p>
                </div>
                <div className="rounded-2xl bg-zinc-50 p-4">
                  <p className="text-[24px] font-black text-zinc-800 leading-none">25m</p>
                  <p className="mt-1.5 text-[12px] text-zinc-500 font-medium">
                    average delivery time
                  </p>
                </div>
                <div className="rounded-2xl bg-green-50 p-4">
                  <p className="text-[24px] font-black text-green-600 leading-none">₹400</p>
                  <p className="mt-1.5 text-[12px] text-green-700 font-medium">
                    minimum order
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT: Phone + Events */}
          <div className="flex flex-col gap-6">
            {/* Phone block */}
            <motion.div
              variants={fadeUp(0.08)}
              className="rounded-3xl border border-zinc-200 bg-white p-8 hover:shadow-lg hover:shadow-zinc-100 transition-shadow duration-300"
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                  <Phone size={18} />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">
                  Call to Order
                </span>
              </div>

              <div className="space-y-3">
                {["7457071114", "8791723722", "9758399797"].map((num) => (
                  <a
                    key={num}
                    href={`tel:${num}`}
                    className="group flex items-center justify-between rounded-2xl border border-zinc-100 bg-zinc-50 px-5 py-4 hover:border-orange-200 hover:bg-orange-50 transition-all duration-200"
                  >
                    <span className="text-[18px] font-extrabold tracking-tight text-zinc-800 group-hover:text-orange-600 transition-colors">
                      {num.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3")}
                    </span>
                    <span className="text-[12px] font-bold text-zinc-400 group-hover:text-orange-500 flex items-center gap-1 transition-colors">
                      Call <ArrowUpRight size={13} />
                    </span>
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Events block */}
            <motion.div
              variants={fadeUp(0.15)}
              className="rounded-3xl border border-zinc-200 bg-white p-8 hover:shadow-lg hover:shadow-zinc-100 transition-shadow duration-300"
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                  <PartyPopper size={18} />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">
                  Special Events & Dining
                </span>
              </div>

              <p className="text-[14px] text-zinc-500 leading-relaxed mb-6">
                Planning something special? We host private gatherings and
                celebrations with dedicated service.
              </p>

              <div className="grid grid-cols-2 gap-3">
                {EVENTS.map((ev, i) => {
                  const Icon = ev.icon;
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-2.5 rounded-2xl border border-zinc-100 bg-zinc-50 px-4 py-3"
                    >
                      <Icon size={14} className="text-orange-400 flex-shrink-0" />
                      <span className="text-[13px] font-semibold text-zinc-700">
                        {ev.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              <a
                href="tel:7457071114"
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-zinc-900 px-5 py-3.5 text-[13px] font-bold text-white hover:bg-zinc-800 transition-colors"
              >
                <Phone size={14} />
                Call to Book an Event
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// 4. MAP SECTION
// ─────────────────────────────────────────────

function MapSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="bg-white px-5 py-20">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          variants={stagger}
        >
          {/* Header */}
          <motion.div variants={fadeUp(0)} className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-8">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-orange-500 mb-3">
                Location
              </p>
              <h2 className="text-[36px] sm:text-[44px] font-black tracking-[-0.04em] text-zinc-900 leading-none">
                Find Us in Meerut Cantt
              </h2>
            </div>
            <a
              href="https://maps.google.com/?q=Rajban+Bazar+Meerut+Cantt"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 inline-flex items-center gap-2 rounded-xl border border-zinc-200 px-4 py-2.5 text-[13px] font-bold text-zinc-700 hover:bg-zinc-50 transition-colors"
            >
              <ExternalLink size={14} className="text-orange-500" />
              Open in Google Maps
            </a>
          </motion.div>

          {/* Address strip above map */}
          <motion.div
            variants={fadeUp(0.08)}
            className="mb-0 flex items-center gap-3 rounded-t-3xl border border-b-0 border-zinc-200 bg-zinc-50 px-6 py-4"
          >
            <MapPin size={16} className="text-orange-500 flex-shrink-0" />
            <span className="text-[14px] font-semibold text-zinc-700">
              Rajban Bazar, Behind Atithi Bhawan, Meerut Cantt — UP, India
            </span>
          </motion.div>

          {/* Map */}
          <motion.div
            variants={fadeUp(0.12)}
            className="overflow-hidden rounded-b-3xl border border-zinc-200"
          >
            <iframe
              title="Mittal Dhaba Location"
              src="https://www.google.com/maps?q=Rajban+Bazar+Meerut+Cantt&output=embed"
              className="w-full h-[420px] sm:h-[480px] border-0"
              loading="lazy"
              allowFullScreen
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// 5. TRUST BADGES BAND
// ─────────────────────────────────────────────

const TRUST_ITEMS = [
  { icon: "🌿", label: "100% Pure Vegetarian" },
  { icon: "👨‍👩‍👧‍👦", label: "Family Friendly" },
  { icon: "🛵", label: "Home Delivery Available" },
  { icon: "🍲", label: "Fresh Ingredients Daily" },
  { icon: "🎖️", label: "FSSAI Certified Kitchen" },
  { icon: "⭐", label: "4.9 Star Rated" },
  { icon: "🕙", label: "Open Every Day" },
  { icon: "🧑‍🍳", label: "Chef Crafted Meals" },
];

function TrustBand() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <section
      ref={ref}
      className="border-t border-zinc-100 bg-[#FAFAF8] px-5 py-14"
    >
      <div className="mx-auto max-w-7xl">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center text-[11px] font-bold uppercase tracking-[0.22em] text-zinc-400 mb-8"
        >
          Our Promise to You
        </motion.p>

        <motion.div
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          variants={stagger}
          className="flex flex-wrap justify-center gap-3"
        >
          {TRUST_ITEMS.map((item, i) => (
            <motion.div
              key={i}
              variants={fadeUp(i * 0.05)}
              className="flex items-center gap-2.5 rounded-full border border-zinc-200 bg-white px-4 py-2.5 shadow-sm"
            >
              <span className="text-[16px] leading-none">{item.icon}</span>
              <span className="text-[13px] font-semibold text-zinc-700">
                {item.label}
              </span>
              <CheckCircle2 size={13} className="text-green-500" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// PAGE ROOT
// ─────────────────────────────────────────────

const Contact = () => {
  return (
    <div className="bg-[#FAFAF8]">
      <IntroSection />
      <QuickStrip />
      <VisitInfo />
      <MapSection />
      <TrustBand />
    </div>
  );
};

export default Contact;