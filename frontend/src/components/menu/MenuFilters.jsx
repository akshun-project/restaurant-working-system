 import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { Search, SlidersHorizontal, Leaf, X, ChevronDown, Check, TrendingUp } from "lucide-react";

/* ─── DATA ──────────────────────────────────────────────────── */
 const CATEGORIES = [
  { id: "All", label: "All", emoji: "🍽️" },

  { id: "Main Course", label: "Main Course", emoji: "🥘" },

  { id: "Roti & Bread", label: "Roti & Bread", emoji: "🫓" },

  { id: "Rice & Biryani", label: "Rice & Biryani", emoji: "🍚" },

  { id: "Chinese", label: "Chinese", emoji: "🍜" },

  { id: "Snacks", label: "Snacks", emoji: "🥟" },

  { id: "Soups", label: "Soups", emoji: "🍲" },

  { id: "Raita", label: "Raita", emoji: "🥣" },

  { id: "Salad", label: "Salad", emoji: "🥗" },

  { id: "Drinks", label: "Drinks", emoji: "🥤" },

  { id: "Winter Special", label: "Winter Special", emoji: "🔥" },

  { id: "Thali", label: "Thali", emoji: "🍱" },
];
const SORT_OPTIONS = [
  { value: "default", label: "Recommended",      icon: "✦" },
  { value: "low",     label: "Price: Low → High", icon: "↑" },
  { value: "high",    label: "Price: High → Low", icon: "↓" },
  { value: "rating",  label: "Top Rated",         icon: "★" },
];

const QUICK_SEARCHES = ["Paneer", "Thali", "Dal Makhani", "Naan", "Lassi"];

/* ─── CATEGORY CHIP ─────────────────────────────────────────── */
const CategoryChip = ({ cat, isActive, onClick }) => (
  <motion.button
    layout
    whileTap={{ scale: 0.92 }}
    onClick={() => onClick(cat.id)}
    className="relative flex shrink-0 select-none items-center gap-2 rounded-[14px] px-4 py-3 text-[13px] font-bold transition-colors duration-200"
    style={{
      color: isActive ? "#fff" : "#52525b",
      background: isActive ? "transparent" : "#f4f4f5",
    }}
  >
    {/* active bg pill */}
    {isActive && (
      <motion.span
        layoutId="cat-pill"
        className="absolute inset-0 rounded-[14px] bg-[#FF5722]"
        style={{ zIndex: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 32 }}
      />
    )}
    {/* active glow */}
    {isActive && (
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 rounded-[14px]"
        style={{
          boxShadow: "0 6px 20px rgba(255,87,34,0.38)",
          zIndex: 0,
        }}
      />
    )}
    <span className="relative z-10 text-[15px] leading-none">{cat.emoji}</span>
    <span className="relative z-10 whitespace-nowrap">{cat.label}</span>
  </motion.button>
);

/* ─── SORT DROPDOWN ─────────────────────────────────────────── */
const SortDropdown = ({ sortBy, setSortBy }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const current = SORT_OPTIONS.find((o) => o.value === sortBy);

  return (
    <div ref={ref} className="relative shrink-0">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((v) => !v)}
        className={`flex h-10 items-center gap-2 rounded-[12px] border px-4 text-[12px] font-bold transition-all duration-200 ${
          open || sortBy !== "default"
            ? "border-orange-300 bg-orange-50 text-orange-600"
            : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300"
        }`}
      >
        <SlidersHorizontal size={13} strokeWidth={2.5} />
        <span>{sortBy === "default" ? "Sort" : current?.label.split(":")[0]}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={12} />
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={  { opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute right-0 top-[46px] z-[60] w-[210px] overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-[0_16px_48px_rgba(0,0,0,0.10)]"
          >
            <div className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">
              Sort By
            </div>
            {SORT_OPTIONS.map((opt, i) => (
              <motion.button
                key={opt.value}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0  }}
                transition={{ delay: i * 0.04 }}
                onClick={() => { setSortBy(opt.value); setOpen(false); }}
                className={`flex w-full items-center gap-3 px-4 py-3 text-left text-[13px] font-semibold transition-colors duration-150 ${
                  sortBy === opt.value
                    ? "bg-orange-50 text-orange-600"
                    : "text-zinc-700 hover:bg-zinc-50"
                }`}
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-zinc-100 text-[11px] font-black text-zinc-500">
                  {opt.icon}
                </span>
                <span className="flex-1">{opt.label}</span>
                {sortBy === opt.value && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <Check size={14} className="text-orange-500" />
                  </motion.span>
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─── ACTIVE FILTERS PILL ───────────────────────────────────── */
const FilterBadge = ({ count, onClear }) => (
  <AnimatePresence>
    {count > 0 && (
      <motion.button
        initial={{ opacity: 0, scale: 0.7, width: 0 }}
        animate={{ opacity: 1, scale: 1,   width: "auto" }}
        exit={  { opacity: 0, scale: 0.7, width: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
        onClick={onClear}
        className="flex shrink-0 items-center gap-1.5 overflow-hidden rounded-full bg-orange-100 px-3 py-1.5 text-[11px] font-black text-orange-600"
      >
        <span>{count} active</span>
        <X size={11} strokeWidth={3} />
      </motion.button>
    )}
  </AnimatePresence>
);

/* ─── MAIN COMPONENT ─────────────────────────────────────────── */
const MenuFilters = ({
  selectedCategory,
  setSelectedCategory,
  search,
  setSearch,
  vegOnly,
  setVegOnly,
  sortBy,
  setSortBy,
}) => {
  const inputRef = useRef(null);
  const [focused, setFocused] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  /* detect if page has scrolled past hero */
  useEffect(() => {
    const el = document.querySelector("#menu-section") || window;
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const activeFilterCount = (vegOnly ? 1 : 0) + (sortBy !== "default" ? 1 : 0);

  const clearAll = () => {
    setVegOnly(false);
    setSortBy("default");
  };

  return (
    <motion.div
      animate={{
        boxShadow: scrolled
          ? "0 4px 32px rgba(0,0,0,0.08), 0 1px 0 rgba(0,0,0,0.04)"
          : "0 1px 0 rgba(0,0,0,0.04)",
      }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-40 bg-white/95 backdrop-blur-md"
    >
      {/* ── TOP DIVIDER LINE ─────────────────────────────────── */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-zinc-100 to-transparent" />

      <div className="px-4 pb-3 pt-4 sm:px-5">

        {/* ── SEARCH ───────────────────────────────────────────── */}
        <motion.div
          animate={{
            boxShadow: focused
              ? "0 0 0 2.5px rgba(255,87,34,0.25), 0 4px 20px rgba(255,87,34,0.10)"
              : "0 0 0 1.5px rgba(0,0,0,0.07)",
          }}
          transition={{ duration: 0.2 }}
          className="relative flex items-center gap-3 rounded-2xl bg-[#f9f9f9] px-4 py-0"
          style={{ height: 52 }}
        >
          <motion.span
            animate={{ color: focused ? "#FF5722" : "#a1a1aa" }}
            transition={{ duration: 0.2 }}
          >
            <Search size={18} strokeWidth={2.2} />
          </motion.span>

          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Search dishes, combos, breads…"
            className="flex-1 bg-transparent text-[14px] font-semibold text-zinc-800 outline-none placeholder:font-medium placeholder:text-zinc-400"
          />

          <AnimatePresence>
            {search ? (
              <motion.button
                key="clear"
                initial={{ opacity: 0, scale: 0.6, rotate: -45 }}
                animate={{ opacity: 1, scale: 1,   rotate: 0   }}
                exit={  { opacity: 0, scale: 0.6, rotate: 45  }}
                transition={{ duration: 0.18 }}
                onClick={() => { setSearch(""); inputRef.current?.focus(); }}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-200 text-zinc-500 hover:bg-zinc-300 transition-colors"
              >
                <X size={13} strokeWidth={2.5} />
              </motion.button>
            ) : (
              <motion.span
                key="icon"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-1 rounded-lg bg-white px-2 py-1 text-[10px] font-black uppercase tracking-wider text-zinc-400 shadow-sm border border-zinc-100"
              >
                <TrendingUp size={9} /> Hot
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── QUICK SEARCHES ───────────────────────────────────── */}
        <AnimatePresence>
          {!search && !scrolled && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 10 }}
              exit={  { opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-2 overflow-x-auto pb-0.5" style={{ scrollbarWidth: "none" }}>
                <span className="shrink-0 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                  Try
                </span>
                {QUICK_SEARCHES.map((term, i) => (
                  <motion.button
                    key={term}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileTap={{ scale: 0.93 }}
                    onClick={() => setSearch(term)}
                    className="shrink-0 rounded-full border border-orange-100 bg-orange-50 px-3 py-1.5 text-[11px] font-bold text-orange-600 transition-all hover:bg-orange-100 active:scale-95"
                  >
                    {term}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      

        {/* ── CATEGORY CHIPS ───────────────────────────────────── */}
        <div
          className="mt-2 flex gap-2 overflow-x-auto pb-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {CATEGORIES.map((cat) => (
            <CategoryChip
              key={cat.id}
              cat={cat}
              isActive={selectedCategory === cat.id}
              onClick={setSelectedCategory}
            />
          ))}
        </div>
      </div>

      {/* ── BOTTOM DIVIDER ───────────────────────────────────── */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-zinc-100 to-transparent" />
    </motion.div>
  );
};

export default MenuFilters;