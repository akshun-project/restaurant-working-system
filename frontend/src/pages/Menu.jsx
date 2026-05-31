 import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

import API from "../services/api";
import { useCart } from "../context/CartContext";

import MenuGrid     from "../components/menu/MenuGrid";
import MenuFilters  from "../components/menu/MenuFilters";
import FloatingCartBar from "../components/menu/FloatingCart";

/* ─── tiny helpers ─────────────────────────────────────────── */
const LiveDot = () => (
  <span className="relative flex h-2 w-2">
    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
  </span>
);

const StatPill = ({ children, className = "" }) => (
  <div className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold ${className}`}>
    {children}
  </div>
);

/* ─── EMPTY STATE ───────────────────────────────────────────── */
const EmptyState = ({ search, onClear }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-24 text-center"
  >
    <div className="mb-5 text-6xl">🍽️</div>
    <h3 className="text-[20px] font-black tracking-tight text-zinc-800">
      {search ? `No results for "${search}"` : "Nothing here yet"}
    </h3>
    <p className="mt-2 max-w-xs text-[14px] text-zinc-400">
      {search
        ? "Try a different dish name or browse a category below."
        : "Try selecting a different category or clearing your filters."}
    </p>
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClear}
      className="mt-6 rounded-2xl bg-[#FF5722] px-6 py-3 text-[13px] font-black text-white shadow-[0_4px_20px_rgba(255,87,34,0.35)] hover:bg-[#e64a19] transition-colors"
    >
      Clear Filters
    </motion.button>
  </motion.div>
);

/* ─── ERROR STATE ───────────────────────────────────────────── */
const ErrorState = ({ onRetry }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-24 text-center"
  >
    <div className="mb-4 text-5xl">⚠️</div>
    <h3 className="text-[18px] font-black text-zinc-800">Couldn't load the menu</h3>
    <p className="mt-2 text-[13px] text-zinc-400">Check your connection and try again.</p>
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onRetry}
      className="mt-5 rounded-2xl bg-zinc-900 px-6 py-3 text-[13px] font-black text-white"
    >
      Retry
    </motion.button>
  </motion.div>
);

/* ─── RESULTS HEADER ────────────────────────────────────────── */
const ResultsHeader = ({ category, count, search }) => {
  const title = search
    ? `Results for "${search}"`
    : category === "All"
    ? "Recommended For You"
    : category;

  return (
    <motion.div
      key={title}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-6 flex items-end justify-between"
    >
      <div>
        <h2
          className="text-[20px] font-black tracking-[-0.03em] text-zinc-900 sm:text-[22px]"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          {title}
        </h2>
        <p className="mt-0.5 text-[13px] text-zinc-400">
          {count === 0
            ? "No items found"
            : `${count} item${count !== 1 ? "s" : ""} available`}
        </p>
      </div>

      <div className="hidden items-center gap-1.5 rounded-full border border-zinc-100 bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-zinc-400 shadow-sm sm:flex">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        Freshly prepared
      </div>
    </motion.div>
  );
};

/* ─── PAGE ──────────────────────────────────────────────────── */
const Menu = () => {
  const [menuItems,        setMenuItems]        = useState([]);
  const [loading,          setLoading]          = useState(true);
  const [error,            setError]            = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search,           setSearch]           = useState("");
  const [vegOnly,          setVegOnly]          = useState(false);
  const [sortBy,           setSortBy]           = useState("default");

  const contentRef = useRef(null);
 const { addToCart, cartItems } = useCart();

  /* ── FETCH ────────────────────────────────────────────────── */
  const fetchMenu = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await API.get("/menu");
      setMenuItems(res.data.data ?? []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMenu(); }, [fetchMenu]);

  /* ── FILTER + SORT ──────────────────────────────────────────── */
  const filteredItems = useMemo(() => {
    let items = [...menuItems];

    if (selectedCategory !== "All")
      items = items.filter((i) => i.category === selectedCategory);

    if (search.trim())
      items = items.filter((i) =>
        i.name.toLowerCase().includes(search.toLowerCase()) ||
        i.description?.toLowerCase().includes(search.toLowerCase())
      );

    if (vegOnly) items = items.filter((i) => i.isVeg !== false);
 if (sortBy === "low")
  items.sort(
    (a, b) =>
      Number(a.price_full || a.price) -
      Number(b.price_full || b.price)
  );

else if (sortBy === "high")
  items.sort(
    (a, b) =>
      Number(b.price_full || b.price) -
      Number(a.price_full || a.price)
  );
    else if (sortBy === "rating")
      items.sort((a, b) => Number(b.rating ?? 0) - Number(a.rating ?? 0));

    return items;
  }, [menuItems, selectedCategory, search, vegOnly, sortBy]);

  /* ── CLEAR ALL FILTERS ──────────────────────────────────────── */
  const clearFilters = () => {
    setSelectedCategory("All");
    setSearch("");
    setVegOnly(false);
    setSortBy("default");
  };

  /* ── STAGGER VARIANTS ───────────────────────────────────────── */
  const pageVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.09 },
    },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <div className="min-h-screen bg-[#F7F6F3] pb-36">

      {/* ══════════════════════════════════════════════════════
          HERO HEADER
      ══════════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#FFF8F2] via-white to-[#FFF3E8]">

        {/* decorative blobs */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-orange-200 opacity-25 blur-3xl" />
        <div className="pointer-events-none absolute -left-10 bottom-0 h-48 w-48 rounded-full bg-amber-200 opacity-20 blur-3xl" />

        <motion.div
          variants={pageVariants}
          initial="hidden"
          animate="show"
          className="mx-auto max-w-7xl px-4 pb-8 pt-10 sm:px-6 sm:pt-12"
        >
          {/* ── TOP ROW ──────────────────────────────────────── */}
          <motion.div variants={fadeUp} className="flex items-start justify-between gap-4">
            {/* LEFT: brand */}
            <div className="flex-1">
              {/* live status */}
              <div className="mb-3 flex items-center gap-2">
                <LiveDot />
                <span className="text-[11px] font-black uppercase tracking-[0.14em] text-emerald-600">
                  Accepting Orders
                </span>
              </div>

              {/* restaurant name */}
              <h1
                className="text-[30px] font-black leading-[1.05] tracking-[-0.04em] text-zinc-900 sm:text-[40px]"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                Mittal{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg,#FF5722,#FF8A00)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Dhaba
                </span>
              </h1>

              <p className="mt-2 max-w-md text-[14px] leading-relaxed text-zinc-500">
                Authentic pure-veg Indian meals — crafted with love, served hot.
              </p>

              {/* meta pills */}
              <motion.div
                variants={fadeUp}
                className="mt-4 flex flex-wrap items-center gap-2"
              >
                {/* rating */}
                <StatPill className="bg-emerald-600 text-white">
                  <span>★</span>
                  <span>4.7</span>
                </StatPill>

                <StatPill className="bg-white border border-zinc-200 text-zinc-600 shadow-sm">
                  <span>😊</span>
                  <span>5k+ happy customers</span>
                </StatPill>

                <StatPill className="bg-white border border-zinc-200 text-zinc-600 shadow-sm">
                  <svg className="h-3.5 w-3.5 text-[#FF5722]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>25–30 min</span>
                </StatPill>

                {/* pure veg badge */}
                <div className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5">
                  <div className="flex h-3.5 w-3.5 items-center justify-center rounded-[3px] border-2 border-emerald-600">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-wide text-emerald-700">
                    Pure Veg
                  </span>
                </div>
              </motion.div>
            </div>

            {/* RIGHT: today's special card — hidden on small screens */}
            <motion.div
              variants={fadeUp}
              className="hidden shrink-0 xl:block"
            >
              <div
                className="relative overflow-hidden rounded-3xl border border-orange-100 bg-white px-6 py-5 shadow-[0_8px_32px_rgba(255,87,34,0.08)]"
                style={{ minWidth: 240 }}
              >
                {/* glow */}
                <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-orange-300 opacity-20 blur-2xl" />

                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-orange-500">
                  Today's Special ✦
                </p>
                <p className="mt-1.5 text-[16px] font-black leading-snug text-zinc-900">
                  Paneer Butter<br />Masala Combo
                </p>
                <p className="mt-1 text-[12px] text-zinc-400">
                  Free sweet dish included 🍮
                </p>
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1.5 text-[12px] font-bold text-orange-600">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-orange-500" />
                  </span>
                  Limited Time
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* bottom fade into page bg */}
        <div className="h-6 bg-gradient-to-b from-transparent to-[#F7F6F3]" />
      </div>

      {/* ══════════════════════════════════════════════════════
          STICKY FILTERS
      ══════════════════════════════════════════════════════ */}
      <MenuFilters
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        search={search}
        setSearch={setSearch}
        vegOnly={vegOnly}
        setVegOnly={setVegOnly}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {/* ══════════════════════════════════════════════════════
          CONTENT
      ══════════════════════════════════════════════════════ */}
      <div ref={contentRef} className="mx-auto mt-6 max-w-7xl px-4 sm:px-6">

        {/* ── LOADING ────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
             
            </motion.div>
          )}

          {/* ── ERROR ─────────────────────────────────────────── */}
          {!loading && error && (
            <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ErrorState onRetry={fetchMenu} />
            </motion.div>
          )}

          {/* ── RESULTS ───────────────────────────────────────── */}
          {!loading && !error && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35 }}
            >
              <ResultsHeader
                category={selectedCategory}
                count={filteredItems.length}
                search={search}
              />

              {filteredItems.length === 0 ? (
                <EmptyState search={search} onClear={clearFilters} />
              ) : (
             <MenuGrid items={filteredItems} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ══════════════════════════════════════════════════════
          FLOATING CART
      ══════════════════════════════════════════════════════ */}
      <FloatingCartBar />
    </div>
  );
};

export default Menu;