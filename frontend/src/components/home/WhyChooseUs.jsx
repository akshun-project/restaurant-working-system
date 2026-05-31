 

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  ShieldCheck,
  Truck,
  ChefHat,
  Flame,
  Clock3,
  Star,
  Leaf,
  ThumbsUp,
} from "lucide-react";

const STATS = [
  { value: "4.9 ★", label: "Customer Rating", sub: "Across 5,200+ reviews" },
  { value: "25m", label: "Avg Delivery", sub: "Real-time tracking" },
  { value: "10k+", label: "Happy Customers", sub: "And counting daily" },
  { value: "1984", label: "Est. Since", sub: "40 years of flavour" },
];

const FEATURES = [
  {
    icon: ChefHat,
    color: "orange",
    title: "Chef Crafted Daily",
    desc: "Every dish prepared fresh each morning — no reheated meals, no shortcuts. Authentic Indian spices, premium ingredients.",
    tag: "No Compromises",
  },
 
  {
    icon: ShieldCheck,
    color: "orange",
    title: "Hygiene Certified",
    desc: "FSSAI-certified kitchen, daily sanitation checks and gloved prep — you eat exactly what you'd cook at home.",
    tag: "FSSAI Certified",
  },
  {
    icon: Leaf,
    color: "green",
    title: "100% Pure Veg",
    desc: "Strict vegetarian kitchen with zero cross-contamination. Safe for every family, every festival, every day.",
    tag: "Pure Veg Promise",
  },
  {
    icon: Flame,
    color: "rose",
    title: "Authentic Dhaba Soul",
    desc: "Traditional recipes passed down generations — slow-cooked dals, hand-rolled rotis, and real ghee. Nothing artificial.",
    tag: "Since 1984",
  },
 
];

const COLOR_MAP = {
  orange: {
    bg: "bg-orange-500",
    glow: "bg-orange-500/15",
    border: "border-orange-500/25",
    tag: "bg-orange-500/10 text-orange-300 border-orange-500/20",
    shadow: "shadow-orange-500/20",
  },
  amber: {
    bg: "bg-amber-500",
    glow: "bg-amber-500/15",
    border: "border-amber-500/25",
    tag: "bg-amber-500/10 text-amber-300 border-amber-500/20",
    shadow: "shadow-amber-500/20",
  },
  green: {
    bg: "bg-emerald-500",
    glow: "bg-emerald-500/15",
    border: "border-emerald-500/25",
    tag: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
    shadow: "shadow-emerald-500/20",
  },
  rose: {
    bg: "bg-rose-500",
    glow: "bg-rose-500/15",
    border: "border-rose-500/25",
    tag: "bg-rose-500/10 text-rose-300 border-rose-500/20",
    shadow: "shadow-rose-500/20",
  },
};

// ─────────────────────────────────────────────
// ANIMATION VARIANTS
// ─────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

// ─────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────

/** Animated stat pill */
function StatPill({ value, label, sub, delay }) {
  return (
    <motion.div
      variants={fadeUp}
      custom={delay}
      className="relative overflow-hidden rounded-2xl border border-white/8 bg-white/[0.045] p-5 backdrop-blur-sm"
    >
      {/* subtle inner glow */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent rounded-2xl" />
      <p className="text-[30px] font-black tracking-tight text-white leading-none">
        {value}
      </p>
      <p className="mt-1.5 text-[13px] font-semibold text-white/70">{label}</p>
      <p className="mt-0.5 text-[11px] text-white/35">{sub}</p>
    </motion.div>
  );
}

/** Feature card */
function FeatureCard({ feature, index }) {
  const c = COLOR_MAP[feature.color];
  const Icon = feature.icon;

  return (
    <motion.div
      variants={cardVariant}
      whileHover={{ y: -5, transition: { duration: 0.25 } }}
      className={`
        group relative overflow-hidden rounded-3xl border border-white/8 bg-white/[0.04]
        p-6 backdrop-blur-sm transition-colors duration-300
        hover:border-white/14 hover:bg-white/[0.07]
      `}
    >
      {/* Corner glow */}
      <div
        className={`pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full blur-2xl transition-opacity duration-500 ${c.glow} opacity-60 group-hover:opacity-100`}
      />

      {/* Icon */}
      <div
        className={`relative inline-flex h-14 w-14 items-center justify-center rounded-2xl ${c.bg} shadow-lg ${c.shadow} text-white`}
      >
        <Icon size={24} strokeWidth={2} />
      </div>

      {/* Title */}
      <h3 className="relative mt-5 text-[20px] font-black tracking-tight text-white leading-snug">
        {feature.title}
      </h3>

      {/* Desc */}
      <p className="relative mt-3 text-[14px] leading-[1.85] text-zinc-400">
        {feature.desc}
      </p>

      {/* Tag */}
      <div className="relative mt-5">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold ${c.tag}`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
          {feature.tag}
        </span>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// MARQUEE STRIP
// ─────────────────────────────────────────────

const MARQUEE_ITEMS = [
  "🔥 Bestseller: Dal Baati Churma",
  "⭐ Rated 4.9 by 5,200+ customers",
  "🌿 100% Pure Vegetarian Kitchen",
  "⚡ Delivery in under 30 minutes",
  "🎖️ FSSAI Certified & Hygiene Verified",
  "👨‍🍳 Authentic recipes since 1984",
];

function MarqueeStrip() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="relative overflow-hidden border-y border-white/6 bg-white/[0.03] py-3">
      {/* Fade edges */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-[#111111] to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-[#111111] to-transparent" />

      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        className="flex whitespace-nowrap"
      >
        {items.map((item, i) => (
          <span
            key={i}
            className="mx-8 text-[13px] font-medium text-zinc-400"
          >
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN SECTION
// ─────────────────────────────────────────────

const WhyChooseUs = () => {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative overflow-hidden bg-[#111111]"
      aria-labelledby="why-heading"
    >
      {/* ── Background atmosphere */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Ambient blobs */}
        <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-orange-500/8 blur-[80px]" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-amber-500/8 blur-[80px]" />
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-600/5 blur-[100px]" />
        {/* Fine grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:48px_48px]" />
        {/* Radial vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,#f9731608_0%,transparent_70%)]" />
      </div>

      {/* ── Top marquee strip */}
      <MarqueeStrip />

      {/* ── Main content */}
      <div className="relative z-10 mx-auto max-w-7xl px-5  py-20 md:py-24">

        {/* ── Header block */}
        <motion.div
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          variants={stagger}
          className="mb-14 max-w-3xl"
        >
          {/* Badge */}
          <motion.div
            variants={fadeUp}
            custom={0}
            className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-orange-500/20 bg-orange-500/8 px-4 py-2"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500" />
            </span>
            <span className="text-[13px] font-bold tracking-wide text-orange-300 uppercase">
              Why Choose Mittal Dhaba
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h2
            id="why-heading"
            variants={fadeUp}
            custom={0.1}
            className="text-[42px] font-black leading-[0.92] tracking-[-0.04em] text-white sm:text-[60px] lg:text-[76px]"
          >
            Not Just Food.
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400 mt-1">
              A Promise.
            </span>
          </motion.h2>

          {/* Sub */}
          <motion.p
            variants={fadeUp}
            custom={0.2}
            className="mt-6 max-w-xl text-[16px] leading-[1.85] text-zinc-400 sm:text-[17px]"
          >
            Mittal Dhaba has been feeding families with love,
            tradition, and uncompromising quality. Here's why over 8,000
            customers keep coming back — meal after meal.
          </motion.p>
        </motion.div>

        {/* ── Stats row */}
        <motion.div
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          variants={stagger}
          className="mb-20 grid grid-cols-2 gap-3 sm:grid-cols-4"
        >
          {STATS.map((s, i) => (
            <StatPill key={i} {...s} delay={i * 0.08} />
          ))}
        </motion.div>

        {/* ── Features grid */}
        <motion.div
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          variants={stagger}
          className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-2"
        >
          {FEATURES.map((feature, i) => (
            <FeatureCard key={i} feature={feature} index={i} />
          ))}
        </motion.div>

       
      </div>
    </section>
  );
};

export default WhyChooseUs;