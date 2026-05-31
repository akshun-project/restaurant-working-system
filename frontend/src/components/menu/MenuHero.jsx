 import { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Search, MapPin, ChevronDown, Sparkles, X, Flame, Leaf, Clock } from "lucide-react";

/* ─── DATA ────────────────────────────────────────────────── */
const CATEGORIES = [
  { id: "all",       label: "All Items",    emoji: "🍽️" },
  { id: "thali",     label: "Thali",        emoji: "🍛" },
  { id: "dal",       label: "Dal & Sabzi",  emoji: "🥘" },
  { id: "roti",      label: "Breads",       emoji: "🫓" },
  { id: "rice",      label: "Rice",         emoji: "🍚" },
  { id: "chaat",     label: "Chaat",        emoji: "🥗" },
  { id: "sweets",    label: "Sweets",       emoji: "🍮" },
  { id: "drinks",    label: "Drinks",       emoji: "🥛" },
];

const TAGS = ["Fast Delivery", "Pure Veg", "Chef's Special", "Bestseller"];

/* ─── ANIMATED BACKGROUND BLOB ─────────────────────────────── */
const Blob = ({ className, delay = 0 }) => (
  <motion.div
    className={`absolute rounded-full blur-3xl opacity-30 pointer-events-none ${className}`}
    animate={{ scale: [1, 1.15, 1], x: [0, 12, 0], y: [0, -8, 0] }}
    transition={{ duration: 8 + delay, repeat: Infinity, ease: "easeInOut", delay }}
  />
);

/* ─── CATEGORY CHIP ─────────────────────────────────────────── */
const CategoryChip = ({ cat, active, onClick }) => (
  <motion.button
    onClick={() => onClick(cat.id)}
    whileTap={{ scale: 0.94 }}
    className={`relative flex shrink-0 items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 ${
      active
        ? "bg-[#FF5722] text-white shadow-[0_4px_20px_rgba(255,87,34,0.35)]"
        : "bg-white/80 text-zinc-600 hover:bg-orange-50 hover:text-orange-600 border border-zinc-100 shadow-sm backdrop-blur-sm"
    }`}
  >
    <span className="text-base leading-none">{cat.emoji}</span>
    <span>{cat.label}</span>
    {active && (
      <motion.div
        layoutId="chip-glow"
        className="absolute inset-0 rounded-2xl bg-[#FF5722]/20"
        initial={false}
        transition={{ type: "spring", stiffness: 380, damping: 30 }}
      />
    )}
  </motion.button>
);

/* ─── MAIN COMPONENT ─────────────────────────────────────────── */
const MenuHero = ({ onSearch, onCategoryChange }) => {
  const [query, setQuery]       = useState("");
  const [active, setActive]     = useState("all");
  const [focused, setFocused]   = useState(false);
  const [tagIndex, setTagIndex] = useState(0);
  const inputRef = useRef(null);

  const heroRef = useRef(null);
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 200], [1, 0.6]);
  const heroY       = useTransform(scrollY, [0, 200], [0, -30]);

  /* rotate floating tag every 2.5s */
  useState(() => {
    const t = setInterval(() => setTagIndex(i => (i + 1) % TAGS.length), 2500);
    return () => clearInterval(t);
  });

  const handleCategory = (id) => {
    setActive(id);
    onCategoryChange?.(id);
  };

  const handleSearch = (val) => {
    setQuery(val);
    onSearch?.(val);
  };

  const clearSearch = () => {
    setQuery("");
    inputRef.current?.focus();
    onSearch?.("");
  };

  /* stagger container */
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.10 } },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show:   { opacity: 1, y: 0,  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <motion.section
      ref={heroRef}
      style={{ opacity: heroOpacity, y: heroY }}
      className="relative overflow-hidden bg-gradient-to-b from-[#FFF8F3] via-[#FFF3EA] to-white px-4 pb-6 pt-10 sm:px-6 sm:pt-14"
    >
      {/* ── DECORATIVE BLOBS ─────────────────────────────────── */}
      <Blob className="h-72 w-72 bg-orange-300 -top-16 -right-20"   delay={0} />
      <Blob className="h-56 w-56 bg-amber-200  top-20   -left-12"   delay={2} />
      <Blob className="h-40 w-40 bg-red-200    bottom-0 right-1/3"  delay={4} />

      {/* ── SUBTLE GRAIN OVERLAY ─────────────────────────────── */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative mx-auto max-w-2xl"
      >
        {/* ── LOCATION ROW ─────────────────────────────────────── */}
        <motion.div variants={fadeUp} className="mb-6 flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 shadow-sm backdrop-blur-md border border-orange-100">
            <MapPin size={13} className="text-[#FF5722]" />
            <span className="text-xs font-semibold text-zinc-700">Meerut, UP</span>
            <ChevronDown size={12} className="text-zinc-400" />
          </div>

          {/* floating rotating tag */}
          <div className="ml-auto">
            <AnimatePresence mode="wait">
              <motion.span
                key={tagIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
                className="flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-orange-600"
              >
                <Sparkles size={11} />
                {TAGS[tagIndex]}
              </motion.span>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ── HEADING ──────────────────────────────────────────── */}
        <motion.div variants={fadeUp} className="mb-7">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-3xl">🍛</span>
            <span className="text-sm font-bold tracking-widest uppercase text-orange-500">
              Mittal Dhaba
            </span>
          </div>

          <h1
            className="text-[2.1rem] sm:text-[2.6rem] font-black leading-[1.12] tracking-[-0.03em] text-zinc-900"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Desi Flavours,{" "}
            <span
              className="relative inline-block"
              style={{
                background: "linear-gradient(135deg, #FF5722 0%, #FF8A00 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Dil Se.
            </span>
          </h1>

          <p className="mt-3 text-[15px] leading-relaxed text-zinc-500 max-w-sm">
            Authentic home-style Indian food — served hot, fresh &amp; fast.
          </p>

          {/* quick stats */}
          <div className="mt-4 flex items-center gap-4 text-xs font-semibold text-zinc-500">
            {[
              { icon: <Clock size={12} className="text-orange-400" />, label: "25–35 min" },
              { icon: <Leaf size={12} className="text-green-500" />,   label: "Pure Veg" },
              { icon: <Flame size={12} className="text-red-400" />,    label: "Freshly Made" },
            ].map(({ icon, label }) => (
              <span key={label} className="flex items-center gap-1">
                {icon} {label}
              </span>
            ))}
          </div>
        </motion.div>

        {/* ── SEARCH BAR ───────────────────────────────────────── */}
        <motion.div variants={fadeUp} className="mb-5">
          <motion.div
            animate={{
              boxShadow: focused
                ? "0 8px 40px rgba(255,87,34,0.18), 0 0 0 3px rgba(255,87,34,0.12)"
                : "0 4px 24px rgba(0,0,0,0.07)",
            }}
            transition={{ duration: 0.25 }}
            className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3.5 border border-zinc-100"
          >
            {/* search icon */}
            <motion.div
              animate={{ color: focused ? "#FF5722" : "#9ca3af" }}
              transition={{ duration: 0.2 }}
            >
              <Search size={20} strokeWidth={2.2} />
            </motion.div>

            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Search dal makhani, paneer, thali…"
              className="flex-1 bg-transparent text-[15px] font-medium text-zinc-800 placeholder-zinc-400 outline-none"
            />

            {/* clear */}
            <AnimatePresence>
              {query && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.15 }}
                  onClick={clearSearch}
                  className="rounded-full bg-zinc-100 p-1 text-zinc-400 hover:bg-zinc-200"
                >
                  <X size={13} />
                </motion.button>
              )}
            </AnimatePresence>

            {/* search CTA */}
            <motion.button
              whileTap={{ scale: 0.93 }}
              className="hidden sm:flex items-center gap-2 rounded-xl bg-[#FF5722] px-5 py-2 text-sm font-bold text-white shadow-[0_4px_16px_rgba(255,87,34,0.35)] transition-all hover:bg-[#e64a19]"
            >
              Search
            </motion.button>
          </motion.div>

          {/* popular searches */}
          <AnimatePresence>
            {!query && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="mt-2.5 flex flex-wrap gap-2"
              >
                {["Dal Makhani", "Paneer Butter Masala", "Mix Veg Thali", "Lassi"].map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSearch(s)}
                    className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-zinc-500 border border-zinc-100 backdrop-blur-sm hover:text-orange-600 hover:border-orange-200 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── CATEGORY CHIPS ───────────────────────────────────── */}
        <motion.div variants={fadeUp}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">
              Browse Menu
            </p>
            <span className="text-xs text-zinc-400">{CATEGORIES.length} categories</span>
          </div>

          {/* horizontal scroll, no scrollbar */}
          <div
            className="flex gap-2.5 overflow-x-auto pb-1"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {CATEGORIES.map((cat) => (
              <CategoryChip
                key={cat.id}
                cat={cat}
                active={active === cat.id}
                onClick={handleCategory}
              />
            ))}
          </div>
        </motion.div>

        {/* ── ACTIVE CATEGORY INDICATOR ─────────────────────────── */}
        <AnimatePresence>
          {active !== "all" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.25 }}
              className="mt-4 flex items-center gap-2 rounded-2xl bg-orange-50 border border-orange-100 px-4 py-2.5"
            >
              <span className="text-base">
                {CATEGORIES.find((c) => c.id === active)?.emoji}
              </span>
              <span className="text-sm font-semibold text-orange-700">
                Showing:{" "}
                <span className="font-black">
                  {CATEGORIES.find((c) => c.id === active)?.label}
                </span>
              </span>
              <button
                onClick={() => handleCategory("all")}
                className="ml-auto rounded-full bg-orange-100 p-1 text-orange-500 hover:bg-orange-200 transition-colors"
              >
                <X size={12} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.section>
  );
};

export default MenuHero;