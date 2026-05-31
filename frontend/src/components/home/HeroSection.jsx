
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";

/* ─────────────────── font injection ─────────────────── */
const FontStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,600;0,9..144,700;1,9..144,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
    .font-display { font-family: 'Fraunces', serif; }
    .font-ui      { font-family: 'Plus Jakarta Sans', sans-serif; }
  `}</style>
);

/* ─────────────────── static data ─────────────────── */
const CATEGORIES = [
  { emoji: "🍛", label: "Thali" },
  { emoji: "🫓", label: "Paratha" },
  { emoji: "🍲", label: "Dal" },
  { emoji: "🧆", label: "Salad" },
  { emoji: "🍵", label: "Coffee" },
  { emoji: "🥘", label: "Paneer" },
];

const DISHES = [
  {
    id: 1,
    name: "Mittal Dhaba special paneer",
    desc: "Slow-cooked overnight · must try",
    price: "₹320",
    tag: "🔥 Bestseller",
    tagColor: "bg-orange-100 text-orange-700",
    rating: "4.9",
    emoji: "🍛",
    bg: "from-amber-50 to-orange-50",
    accent: "#f97316",
  },
  {
    id: 2,
    name: "Paneer paratha",
    desc: "Hand-rolled · desi ghee · achaar",
    price: "₹120",
    tag: "⭐ Top Rated",
    tagColor: "bg-yellow-100 text-yellow-700",
    rating: "4.8",
    emoji: "🫓",
    bg: "from-yellow-50 to-amber-50",
    accent: "#d97706",
  },
  {
    id: 3,
    name: "Dal Makhani",
    desc: "Creamy · fresh dal",
    price: "₹220",
    tag: "✨ Chef's Pick",
    tagColor: "bg-rose-100 text-rose-700",
    rating: "4.9",
    emoji: "🧆",
    bg: "from-rose-50 to-orange-50",
    accent: "#e11d48",
  },
];

/* ─────────────────── tiny icon components ─────────────────── */
const StarIcon = ({ className = "w-3.5 h-3.5" }) => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
    <path
      fillRule="evenodd"
      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

const ClockIcon = () => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.7}
    className="w-4 h-4"
  >
    <circle cx="10" cy="10" r="8" />
    <path strokeLinecap="round" d="M10 6v4l2.5 2.5" />
  </svg>
);

const BikeIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    className="w-5 h-5"
  >
    <circle cx="5.5" cy="17.5" r="3.5" />
    <circle cx="18.5" cy="17.5" r="3.5" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 6h2l2 5.5M8.5 17.5H15l-3-8h-3.5L5.5 14"
    />
    <path strokeLinecap="round" d="M12 9.5l2.5 3H8.5" />
  </svg>
);

const VegDot = () => (
  <span className="inline-flex items-center justify-center w-3.5 h-3.5 border border-green-600 rounded-sm flex-shrink-0">
    <span className="w-2 h-2 rounded-full bg-green-600 block" />
  </span>
);

/* ─────────────────── animated counter ─────────────────── */
function AnimatedCounter({ from = 0, to, suffix = "" }) {
  const count = useMotionValue(from);
  const rounded = useTransform(
    count,
    (v) => Math.round(v).toLocaleString("en-IN") + suffix,
  );
  const [display, setDisplay] = useState(from + suffix);

  useEffect(() => {
    const unsub = rounded.onChange(setDisplay);
    const controls = animate(count, to, { duration: 2.2, ease: "easeOut" });
    return () => {
      controls.stop();
      unsub();
    };
  }, []);

  return <motion.span>{display}</motion.span>;
}

/* ─────────────────── dish card rotator ─────────────────── */
function DishCardStack() {
  const [active, setActive] = useState(0);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const t = setInterval(
      () => setActive((v) => (v + 1) % DISHES.length),
      3800,
    );
    return () => clearInterval(t);
  }, []);

  const dish = DISHES[active];

  return (
    <div className="relative w-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={dish.id}
          initial={
            prefersReduced ? { opacity: 0 } : { opacity: 0, y: 14, scale: 0.97 }
          }
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={
            prefersReduced
              ? { opacity: 0 }
              : { opacity: 0, y: -10, scale: 0.97 }
          }
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          className={`bg-gradient-to-br ${dish.bg} rounded-2xl p-4 border border-white/80 shadow-sm`}
        >
          <div className="flex items-start justify-between gap-3">
            {/* emoji plate */}
            <div className="w-16 h-16 rounded-xl bg-white shadow-sm flex items-center justify-center text-3xl flex-shrink-0">
              {dish.emoji}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <VegDot />
                <span
                  className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${dish.tagColor}`}
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  {dish.tag}
                </span>
              </div>
              <p
                className="text-stone-900 font-semibold text-[15px] truncate"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {dish.name}
              </p>
              <p
                className="text-stone-500 text-[11px] mt-0.5 truncate"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {dish.desc}
              </p>

              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-1 text-amber-500">
                  <StarIcon />
                  <span
                    className="text-stone-700 font-semibold text-[12px]"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    {dish.rating}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="text-stone-800 font-bold text-[15px]"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    {dish.price}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-lg font-light shadow-sm"
                    style={{ backgroundColor: dish.accent }}
                  >
                    +
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* dots */}
      <div className="flex items-center justify-center gap-1.5 mt-3">
        {DISHES.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`rounded-full transition-all duration-300 ${
              i === active
                ? "w-5 h-1.5 bg-amber-500"
                : "w-1.5 h-1.5 bg-stone-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/* ─────────────────── delivery eta card ─────────────────── */
function ETACard() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.7, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] p-3.5 border border-stone-100"
    >
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center text-green-600 flex-shrink-0">
          <BikeIcon />
        </div>
        <div>
          <p
            className="text-[11px] text-stone-500 font-medium"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Delivery in your area
          </p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span
              className="text-stone-900 font-bold text-[15px]"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Under 5 KM Radius
            </span>
            <span className="text-[10px] bg-green-100 text-green-700 font-semibold px-1.5 py-0.5 rounded-md">
              Delivery Available
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────── live order card ─────────────────── */
function LiveOrderCard() {
  const [dots, setDots] = useState(1);
  useEffect(() => {
    const t = setInterval(() => setDots((d) => (d % 3) + 1), 700);
    return () => clearInterval(t);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="bg-stone-900 text-white rounded-2xl p-3.5 shadow-[0_8px_32px_rgba(0,0,0,0.15)]"
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
          <span className="text-base">🛵</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p
              className="text-[11px] text-stone-400 font-medium"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Order #MD4821
            </p>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span
                className="text-[10px] text-green-400 font-semibold"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Live
              </span>
            </div>
          </div>
          <p
            className="text-[13px] font-semibold mt-0.5"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Out for delivery{"·".repeat(dots)}
          </p>

          {/* progress bar */}
          <div className="mt-2.5 h-1 bg-stone-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-amber-400 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "72%" }}
              transition={{ delay: 1, duration: 1.8, ease: "easeOut" }}
            />
          </div>

          <div className="flex items-center justify-between mt-1.5">
            <span
              className="text-[10px] text-stone-500"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Picked up
            </span>
            <span
              className="text-[10px] text-amber-400 font-medium"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              ~12 min away
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────── review snippet ─────────────────── */
function ReviewCard() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.85, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white rounded-2xl p-3.5 border border-stone-100 shadow-sm"
    >
      <div className="flex items-center gap-0.5 mb-1.5">
        {[...Array(5)].map((_, i) => (
          <StarIcon key={i} className="w-3 h-3 text-amber-400" />
        ))}
      </div>
      <p
        className="text-stone-700 text-[12px] leading-relaxed"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        "The dal makhani reminds me of home. Genuinely pure veg — my family
        trusts this place."
      </p>
      <div className="flex items-center gap-2 mt-2">
        <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center text-[9px] font-bold text-amber-700">
          P
        </div>
        <span
          className="text-[11px] text-stone-500 font-medium"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          Priya M. · Regular customer
        </span>
      </div>
    </motion.div>
  );
}

/* ─────────────────── trust badges ─────────────────── */
const TRUST = [
  { icon: "🌿", text: "100% Pure Veg" },
  { icon: "🏅", text: "FSSAI Certified" },
  { icon: "⏱️", text: "Fast Delivery"},
];

/* ─────────────────── main hero ─────────────────── */
export default function HeroSection() {
  const prefersReduced = useReducedMotion();

  const fadeUp = (delay = 0) => ({
    initial: prefersReduced ? { opacity: 0 } : { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
  });

  return (
    <>
      <FontStyle />

      <section className="relative min-h-[100svh] bg-[#FDFAF5] overflow-hidden pt-[72px]">
        {/* subtle bg texture — warm off-white grain */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "200px",
          }}
        />

        {/* warm radial glow top-right */}
        <div className="pointer-events-none absolute top-0 right-0 w-[55vw] h-[55vw] max-w-[700px] max-h-[700px] rounded-full bg-amber-100/60 blur-[80px] opacity-70" />
        <div className="pointer-events-none absolute bottom-0 left-0 w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full bg-orange-50/80 blur-[60px] opacity-60" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* ═══════════════ LEFT ═══════════════ */}
            <div className="flex flex-col gap-5">
              {/* pill badge */}
              <motion.div {...fadeUp(0.05)}>
                <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-3.5 py-1.5 w-fit">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  <span
                    className="text-amber-700 text-[12px] font-semibold"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    Fresh Food Delivered Daily
                  </span>
                </div>
              </motion.div>

              {/* headline */}
              <motion.div {...fadeUp(0.12)}>
                <h1 className="font-display text-[36px] sm:text-[42px] lg:text-[50px] xl:text-[56px] font-semibold text-stone-900 leading-[1.08] tracking-[-0.02em]">
                  Real food,{" "}
                  <span className="italic text-amber-600">the way</span>
                  <br />
                   family loves it.
                </h1>
              </motion.div>

              {/* sub */}
              <motion.p
                {...fadeUp(0.2)}
                className="
    text-stone-600
    text-sm sm:text-[15px] lg:text-base
    leading-relaxed
    max-w-full sm:max-w-[420px] lg:max-w-[450px]
    font-ui
  "
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Authentic North Indian flavours, freshly prepared with quality
                ingredients and delivered hot to your doorstep.
              </motion.p>

              {/* CTAs */}
              <motion.div
                {...fadeUp(0.28)}
                className="flex items-center gap-3 flex-wrap"
              >
                <Link to="/menu">
                  <motion.button
                    whileHover={{
                      scale: 1.03,
                      boxShadow: "0 8px 32px rgba(245,158,11,0.35)",
                    }}
                    whileTap={{ scale: 0.96 }}
                    className="flex items-center gap-2 px-6 py-3.5 bg-amber-500 hover:bg-amber-600
                      text-white rounded-xl font-semibold text-[14px] transition-colors duration-200 shadow-sm"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    <span>Order Now</span>
                    <svg
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </motion.button>
                </Link>

                <Link to="/menu">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 px-6 py-3.5 bg-white border border-stone-200
                      text-stone-700 hover:border-stone-300 hover:text-stone-900 rounded-xl
                      font-medium text-[14px] transition-all duration-200 shadow-sm"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    Explore Menu
                  </motion.button>
                </Link>
              </motion.div>

              {/* social proof row */}
              <motion.div
                {...fadeUp(0.35)}
                className="flex items-center gap-4 flex-wrap"
              >
                {/* rating */}
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1.5">
                    {["🧑", "👩", "👨"].map((e, i) => (
                      <div
                        key={i}
                        className="w-7 h-7 rounded-full bg-amber-100 border-2 border-white flex items-center justify-center text-sm"
                      >
                        {e}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <StarIcon className="w-3.5 h-3.5 text-amber-500" />
                      <span
                        className="text-stone-900 font-bold text-[13px]"
                        style={{
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                        }}
                      >
                        4.9
                      </span>
                    </div>
                    <p
                      className="text-stone-500 text-[11px]"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      <AnimatedCounter from={0} to={5400} suffix="+" /> happy
                      orders
                    </p>
                  </div>
                </div>

                <div className="w-px h-8 bg-stone-200" />

                {/* delivery time */}
                <div className="flex items-center gap-1.5 text-stone-600">
                  <ClockIcon />
                  <span
                    className="text-[13px] font-medium"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                   25 min avg delivery.
                  </span>
                </div>
              </motion.div>

              {/* trust badges */}
              <motion.div
                {...fadeUp(0.42)}
                className="flex items-center gap-2 flex-wrap"
              >
                {TRUST.map((t) => (
                  <div
                    key={t.text}
                    className="flex items-center gap-1.5 bg-white border border-stone-200 rounded-full
                      px-3 py-1.5 text-[11px] font-medium text-stone-600 shadow-sm"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    <span>{t.icon}</span>
                    {t.text}
                  </div>
                ))}
              </motion.div>
            </div>

            {/* ═══════════════ RIGHT — UI card stack ═══════════════ */}
            <div className="relative flex flex-col gap-4">
              {/* top row: live order + ETA */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <LiveOrderCard />
                <ETACard />
              </div>

              {/* category rail */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.6,
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="bg-white rounded-2xl p-3.5 border border-stone-100 shadow-sm"
              >
                <p
                  className="text-[11px] font-semibold text-stone-500 uppercase tracking-widest mb-2.5"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  Browse by category
                </p>
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-0.5">
                  {CATEGORIES.map((c, i) => (
                    <motion.div
                      key={c.label}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.65 + i * 0.06 }}
                    >
                      <Link to={`/menu?cat=${c.label.toLowerCase()}`}>
                        <motion.div
                          whileHover={{ scale: 1.06, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex flex-col items-center gap-1 cursor-pointer flex-shrink-0"
                        >
                          <div
                            className="w-12 h-12 rounded-2xl bg-amber-50 hover:bg-amber-100 transition-colors
                            flex items-center justify-center text-xl border border-amber-100"
                          >
                            {c.emoji}
                          </div>
                          <span
                            className="text-[10px] font-medium text-stone-600 whitespace-nowrap"
                            style={{
                              fontFamily: "'Plus Jakarta Sans', sans-serif",
                            }}
                          >
                            {c.label}
                          </span>
                        </motion.div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* popular dish card rotator */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.75,
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="bg-white rounded-2xl p-4 border border-stone-100 shadow-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <p
                    className="text-[11px] font-semibold text-stone-500 uppercase tracking-widest"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    Popular right now
                  </p>
                  <Link
                    to="/menu"
                    className="text-[11px] font-semibold text-amber-600 hover:text-amber-700 transition-colors"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    See all →
                  </Link>
                </div>
                <DishCardStack />
              </motion.div>

              {/* review + veg guarantee row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ReviewCard />

                {/* pure veg guarantee */}
                <motion.div
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.95,
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="bg-green-50 rounded-2xl p-3.5 border border-green-100 flex flex-col justify-between"
                >
                  <div className="w-8 h-8 rounded-xl bg-green-100 flex items-center justify-center mb-2">
                    <span className="text-lg">🌿</span>
                  </div>
                  <div>
                    <p
                      className="text-green-900 font-bold text-[14px] leading-tight"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      100% Pure Veg
                    </p>
                    <p
                      className="text-green-700 text-[11px] mt-0.5 leading-snug"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                       Freshly prepared every day with quality ingredients and love.
 
                    </p>
                  </div>
                  <div className="mt-2 flex flex-col gap-1">
                    {[
                      "Separate cooking vessels",
                      "FSSAI certified kitchen",
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-1.5">
                        <span className="w-3.5 h-3.5 rounded-full bg-green-200 text-green-700 flex items-center justify-center flex-shrink-0">
                          <CheckIcon />
                        </span>
                        <span
                          className="text-green-700 text-[10px] font-medium"
                          style={{
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                          }}
                        >
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* ─── bottom strip: location search ─── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 lg:mt-14"
          >
            <div className="bg-white border border-stone-200 rounded-2xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shadow-sm max-w-2xl mx-auto lg:mx-0">
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="#d97706"
                    strokeWidth={1.8}
                    className="w-4.5 h-4.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10 2C7.24 2 5 4.24 5 7c0 4.07 5 11 5 11s5-6.93 5-11c0-2.76-2.24-5-5-5zm0 6.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z"
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                   📍 Serving Meerut & Nearby Areas
                  </p>
                  <input
                    type="text"
                    placeholder=" Delivery available within 5 km of Mittal Dhaba"
                    className="w-full text-[14px] font-medium text-stone-800 placeholder-stone-400
                      bg-transparent outline-none"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  />
                </div>
              </div>
              <Link to="/menu">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  className="w-full sm:w-auto px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white
                    rounded-xl text-[13px] font-semibold transition-colors duration-200 whitespace-nowrap"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  Find Food
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
