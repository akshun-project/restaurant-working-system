import { Link } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import API from "../../services/api";
import { useCart } from "../../context/CartContext";
/* ─────────────────── font injection ─────────────────── */
const FontStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,600;0,9..144,700;1,9..144,600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    .font-display { font-family: 'Fraunces', serif; }
    .font-ui      { font-family: 'Plus Jakarta Sans', sans-serif; }
    .scrollbar-hide::-webkit-scrollbar { display: none; }
    .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
  `}</style>
);

const VegDot = ({ jain = false }) => (
  <span
    title={jain ? "Jain friendly" : "Pure Veg"}
    className={`inline-flex items-center justify-center w-[14px] h-[14px] rounded-[3px] border-[1.5px] flex-shrink-0
      ${jain ? "border-amber-500" : "border-green-600"}`}
  >
    <span
      className={`w-[7px] h-[7px] rounded-full ${jain ? "bg-amber-500" : "bg-green-600"}`}
    />
  </span>
);

const SpiceBar = ({ level }) => (
  <div className="flex items-center gap-[3px]">
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className={`block w-[18px] h-[3px] rounded-full transition-colors ${
          i < level ? "bg-red-500" : "bg-stone-200"
        }`}
      />
    ))}
  </div>
);

const StarIcon = () => (
  <svg
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-3.5 h-3.5 text-amber-400"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

/* ─────────────────── add button with counter ─────────────────── */
function AddButton({ dish, qty, onAdd, onRemove }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      {qty === 0 ? (
        <motion.button
          key="add"
          onClick={(e) => {
            e.preventDefault();
            onAdd(dish);
          }}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.85 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className="flex items-center gap-1 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-[13px] font-bold rounded-xl shadow-sm"
        >
          Add
        </motion.button>
      ) : (
        <motion.div
          key="counter"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.85 }}
          className="flex items-center gap-0 bg-amber-500 rounded-xl overflow-hidden"
        >
          <button
            onClick={(e) => {
              e.preventDefault();
              onRemove(dish);
            }}
            className="w-8 h-[34px] text-white font-bold"
          >
            −
          </button>

          <span className="w-7 text-center text-white font-bold">{qty}</span>

          <button
            onClick={(e) => {
              e.preventDefault();
              onAdd(dish);
            }}
            className="w-8 h-[34px] text-white font-bold"
          >
            +
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────── dish card ─────────────────── */
function DishCard({ dish, index, getQuantity, handleAdd, handleRemove }) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.55,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={prefersReduced ? {} : { y: -5 }}
      className="group relative bg-white rounded-[24px] overflow-hidden border border-stone-100
        shadow-[0_2px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.11)]
        transition-shadow duration-400 flex flex-col"
    >
      {/* recommended ribbon */}
      {dish.ribbon && (
        <div
          className="absolute top-0 left-0 right-0 z-10 flex items-center justify-center
          gap-1.5 py-1.5 bg-stone-900 text-[10px] font-bold text-amber-300 tracking-widest uppercase"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
            <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.873 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" />
          </svg>
          Recommended
        </div>
      )}

      {/* image */}
      <div
        className={`relative overflow-hidden ${dish.ribbon ? "mt-[28px]" : ""}`}
      >
        <img
          src={dish.image}
          alt={dish.name}
          className="w-full h-[200px] object-cover transition-transform duration-700 group-hover:scale-[1.06]"
          loading="lazy"
        />

        {/* overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* tag pill */}

        {/* category badge */}
        <div className="absolute top-3.5 left-3.5">
          <span
            className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-sm
    text-stone-700 text-[11px] font-semibold shadow-md"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {dish.category}
          </span>
        </div>

        {/* price over image */}
        <div className="absolute bottom-3.5 left-3.5 flex items-baseline gap-1.5">
          <span className="text-white font-extrabold text-[18px] drop-shadow-md">
            ₹{dish.price_full || dish.price || 0}
          </span>
          {dish.originalPrice && (
            <span
              className="text-white/60 text-[13px] line-through"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              ₹{dish.originalPrice}
            </span>
          )}
        </div>
      </div>

      {/* content */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* name row */}
        <div className="flex items-start gap-2">
          <VegDot jain={dish.isJain} />
          <div className="flex-1 min-w-0">
            <h3
              className="text-stone-900 font-bold text-[16px] leading-tight tracking-[-0.02em] truncate"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {dish.name}
            </h3>
            <p
              className="text-stone-500 text-[11.5px] leading-snug mt-0.5 line-clamp-2"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {dish.desc}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function FeaturedDishes() {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");

  const pillsRef = useRef(null);
  const prefersReduced = useReducedMotion();

  const {
    cartItems,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    totalItems,
  } = useCart();

  useEffect(() => {
    const fetchFeaturedDishes = async () => {
      try {
        const res = await API.get("/menu");

        const menuData = res.data?.data ?? [];

        setDishes(menuData);
      } catch (error) {
        console.error("Featured dishes fetch failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedDishes();
  }, []);

  const categories = [
    { id: "all", label: "All" },
    ...Array.from(
      new Set(dishes.map((dish) => dish.category).filter(Boolean)),
    ).map((category) => ({
      id: category,
      label: category,
    })),
  ];

  const filtered =
    activeCategory === "all"
      ? dishes
      : dishes.filter((dish) => dish.category === activeCategory);

  const featured = filtered.slice(0, 6);

  const getQuantity = (id) => {
    const item = cartItems.find((i) => i.id === id || i._id === id);

    return item?.quantity || 0;
  };

  const handleAdd = (dish) => {
    const qty = getQuantity(dish._id || dish.id);

    if (qty > 0) {
      increaseQuantity(dish._id || dish.id);
    } else {
      addToCart(dish);
    }
  };

  const handleRemove = (dish) => {
    decreaseQuantity(dish._id || dish.id);
  };

  return (
    <>
      <FontStyle />

      <section className="relative bg-[#FDFAF5] py-16 md:py-24 overflow-hidden">
        {/* bg glow */}
        <div className="pointer-events-none absolute top-0 right-0 w-[45vw] h-[45vw] max-w-[600px] rounded-full bg-orange-100/50 blur-[100px]" />
        <div className="pointer-events-none absolute bottom-0 left-0 w-[35vw] h-[35vw] max-w-[500px] rounded-full bg-amber-50/80 blur-[80px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ── section header ── */}
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between mb-10">
            {/* left */}
            <div className="max-w-xl">
              <motion.div
                initial={
                  prefersReduced ? { opacity: 0 } : { opacity: 0, y: 16 }
                }
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 bg-white border border-orange-200 rounded-full px-4 py-1.5 mb-5 shadow-sm"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                <span
                  className="text-[12px] font-semibold text-stone-700"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  Trending this week
                </span>
              </motion.div>

              <motion.h2
                initial={
                  prefersReduced ? { opacity: 0 } : { opacity: 0, y: 20 }
                }
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.08 }}
                className="font-display text-[34px] sm:text-[44px] lg:text-[52px] font-semibold
                  text-stone-900 leading-[1.06] tracking-[-0.03em]"
              >
                Dishes worth
                <br />
                <em className="text-amber-600 not-italic">coming back for.</em>
              </motion.h2>

              <motion.p
                initial={
                  prefersReduced ? { opacity: 0 } : { opacity: 0, y: 16 }
                }
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.16 }}
                className="mt-3 text-stone-500 text-[15px] leading-relaxed max-w-[420px]"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Every recipe passed down, every ingredient sourced locally. Pure
                veg. No compromises.
              </motion.p>
            </div>

            {/* right CTA */}
            <motion.div
              initial={prefersReduced ? { opacity: 0 } : { opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.22 }}
              className="flex items-center gap-3"
            >
              {/* floating cart summary */}
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 8 }}
                    transition={{ type: "spring", stiffness: 380, damping: 28 }}
                  >
                    <Link to="/cart">
                      <button
                        className="flex items-center gap-2 px-4 py-2.5 bg-stone-900 text-white
                          rounded-xl text-[13px] font-semibold shadow-md hover:bg-stone-800 transition-colors"
                        style={{
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                        }}
                      >
                        <svg
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-4 h-4"
                        >
                          <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                        </svg>
                        View Cart · {totalItems} item{totalItems > 1 ? "s" : ""}
                      </button>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>

              <Link to="/menu">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="group flex items-center gap-2 h-11 px-6 rounded-xl bg-white border border-stone-200
                    text-stone-800 text-[13px] font-semibold shadow-sm hover:border-stone-300 hover:shadow-md
                    transition-all duration-200"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  Full Menu
                  <svg
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M1 8a.5.5 0 01.5-.5h11.793l-3.147-3.146a.5.5 0 01.708-.708l4 4a.5.5 0 010 .708l-4 4a.5.5 0 01-.708-.708L13.293 8.5H1.5A.5.5 0 011 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </motion.button>
              </Link>
            </motion.div>
          </div>

          {/* ── category rail ── */}
          <div
            ref={pillsRef}
            className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1 mb-10"
          >
            {categories.map((cat, i) => (
              <motion.button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                initial={
                  prefersReduced ? { opacity: 0 } : { opacity: 0, y: 10 }
                }
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                whileTap={{ scale: 0.95 }}
                className={`relative whitespace-nowrap px-5 py-2.5 rounded-2xl text-[13px] font-semibold
                  transition-all duration-200 flex-shrink-0
                  ${
                    activeCategory === cat.id
                      ? "bg-stone-900 text-white shadow-md"
                      : "bg-white text-stone-600 border border-stone-200 hover:border-stone-300 hover:text-stone-900"
                  }`}
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {cat.label}
                {activeCategory === cat.id && (
                  <motion.span
                    layoutId="pill-active"
                    className="absolute inset-0 rounded-2xl bg-stone-900 -z-10"
                    transition={{ type: "spring", stiffness: 400, damping: 34 }}
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* ── dish grid ── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
            >
              {filtered.length > 0 ? (
                featured.map((dish, i) => (
                  <DishCard
                    key={dish._id || dish.id}
                    dish={dish}
                    index={i}
                    getQuantity={getQuantity}
                    handleAdd={handleAdd}
                    handleRemove={handleRemove}
                  />
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full flex flex-col items-center justify-center py-20 gap-3"
                >
                  <span className="text-5xl">🍽️</span>
                  <p
                    className="text-stone-500 text-[15px] font-medium"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    No dishes in this category yet.
                  </p>
                  <button
                    onClick={() => setActiveCategory("all")}
                    className="text-amber-600 text-[13px] font-semibold hover:text-amber-700"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    See all dishes →
                  </button>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* ── bottom CTA strip ── */}
          <motion.div
            initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="mt-14 bg-stone-900 rounded-[28px] p-6 sm:p-8 flex flex-col sm:flex-row
              items-center justify-between gap-5 overflow-hidden relative"
          >
            {/* glow */}
            <div className="absolute right-0 top-0 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

            <div>
              <p
                className="text-white font-bold text-[20px] sm:text-[22px] leading-tight"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Hungry for more?
              </p>
              <p
                className="text-stone-400 text-[14px] mt-1"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Browse 40+ dishes — thali, paratha, chaat, sweets & more.
              </p>
            </div>

            <Link to="/menu" className="flex-shrink-0">
              <motion.button
                whileHover={{
                  scale: 1.04,
                  boxShadow: "0 8px 32px rgba(245,158,11,0.4)",
                }}
                whileTap={{ scale: 0.96 }}
                className="flex items-center gap-2.5 px-7 py-3.5 bg-amber-500 hover:bg-amber-400
                  text-white font-bold text-[14px] rounded-2xl transition-colors duration-200 shadow-sm"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Explore Full Menu
                <svg
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M1 8a.5.5 0 01.5-.5h11.793l-3.147-3.146a.5.5 0 01.708-.708l4 4a.5.5 0 010 .708l-4 4a.5.5 0 01-.708-.708L13.293 8.5H1.5A.5.5 0 011 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
