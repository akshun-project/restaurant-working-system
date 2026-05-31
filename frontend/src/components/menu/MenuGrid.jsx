 import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Plus, Minus, Star, Clock3, Leaf, Flame, ChevronRight } from "lucide-react";
import { useCart } from "../../context/CartContext";


/* quantity stepper with spring animation */
const QtyControl = ({ qty, onAdd, onRemove }) => (
  <motion.div
    layout
    className="flex items-center overflow-hidden rounded-xl border-2 border-[#FF5722] bg-white"
    style={{ height: 36 }}
  >
    <motion.button
      whileTap={{ scale: 0.85 }}
      onClick={onRemove}
      className="flex h-full w-8 items-center justify-center text-[#FF5722] transition-colors hover:bg-orange-50"
    >
      <Minus size={13} strokeWidth={3} />
    </motion.button>

    <div className="relative w-7 overflow-hidden text-center text-[14px] font-black text-zinc-900">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={qty}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0,  opacity: 1 }}
          exit={   { y: -10, opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="block"
        >
          {qty}
        </motion.span>
      </AnimatePresence>
    </div>

    <motion.button
      whileTap={{ scale: 0.85 }}
      onClick={onAdd}
      className="flex h-full w-8 items-center justify-center text-[#FF5722] transition-colors hover:bg-orange-50"
    >
      <Plus size={13} strokeWidth={3} />
    </motion.button>
  </motion.div>
);

/* bestseller ribbon */
const Ribbon = ({ label }) => (
  <div className="flex items-center gap-1 rounded-md bg-amber-400 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-amber-900 shadow-sm">
    <Star size={8} className="fill-amber-900 text-amber-900" />
    {label}
  </div>
);

/* veg/nonveg indicator (FSSAI style) */
const VegBadge = ({ isVeg = true }) => (
  <div
    className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[3px] border-2 ${
      isVeg ? "border-emerald-600" : "border-red-600"
    }`}
  >
    <div className={`h-2 w-2 rounded-full ${isVeg ? "bg-emerald-600" : "bg-red-600"}`} />
  </div>
);

/* ── MOBILE CARD (Swiggy-style horizontal) ────────────────── */
const MobileCard = ({ item, qty, onAdd, onRemove }) => {
  const ref  = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -60px 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex items-start gap-4 border-b border-zinc-100 bg-white px-4 py-5 last:border-b-0"
    >
      {/* ── LEFT: info ──────────────────────────────────── */}
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        {/* veg indicator + badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <VegBadge isVeg={item.isVeg !== false} />
          {item.isBestseller && <Ribbon label="Bestseller" />}
          {item.isChefSpecial && <Ribbon label="Chef's Pick" />}
        </div>

        {/* name */}
        <h3 className="text-[16px] font-black leading-snug tracking-[-0.02em] text-zinc-900 line-clamp-2">
          {item.name || "Unnamed Dish"}
        </h3>

        {/* price */}
        <div className="flex items-baseline gap-1.5">
          <span className="text-[17px] font-black tracking-tight text-zinc-900">
            ₹{item.price_full || 0}
          </span>
          {item.price_half && (
            <span className="text-[12px] text-zinc-400">
              / half ₹{item.price_half}
            </span>
          )}
        </div>

        {/* description */}
        {item.description && (
          <p className="line-clamp-2 text-[13px] leading-[1.6] text-zinc-400">
            {item.description}
          </p>
        )}

        {/* meta row */}
        <div className="flex items-center gap-3 text-[11px] font-semibold text-zinc-400">
          {item.rating && (
            <span className="flex items-center gap-0.5 text-emerald-600">
              <Star size={10} className="fill-emerald-500 text-emerald-500" />
              {item.rating}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Clock3 size={10} className="text-orange-400" />
            25 min
          </span>
          {item.spiceLevel && (
            <span className="flex items-center gap-1">
              <Flame size={10} className="text-red-400" />
              {item.spiceLevel}
            </span>
          )}
        </div>
      </div>

      {/* ── RIGHT: image + add button ─────────────────── */}
      <div className="relative shrink-0" style={{ width: 110 }}>
        {/* image */}
        <div className="overflow-hidden rounded-2xl" style={{ height: 100 }}>
          <img
            src={item.image_url || "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=400&auto=format&fit=crop"}
            alt={item.name}
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
            loading="lazy"
          />
        </div>

        {/* ADD / QTY — sits half-overlapping the image bottom */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
          <AnimatePresence mode="wait" initial={false}>
            {qty === 0 ? (
              <motion.button
                key="add"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1,   opacity: 1 }}
                exit={   { scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.18 }}
                whileTap={{ scale: 0.92 }}
                onClick={onAdd}
                className="flex items-center gap-1 rounded-xl border-2 border-[#FF5722] bg-white px-4 py-1.5 text-[13px] font-black text-[#FF5722] shadow-[0_4px_14px_rgba(255,87,34,0.25)] hover:bg-orange-50"
              >
                <Plus size={13} strokeWidth={3} />
                ADD
              </motion.button>
            ) : (
              <motion.div
                key="qty"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1,   opacity: 1 }}
                exit={   { scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <QtyControl qty={qty} onAdd={onAdd} onRemove={onRemove} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

/* ── DESKTOP CARD (rich vertical card) ───────────────────── */
const DesktopCard = ({ item, qty, onAdd, onRemove }) => {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -80px 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-shadow duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.10)]"
    >
      {/* ── IMAGE ────────────────────────────────────── */}
      <div className="relative overflow-hidden" style={{ height: 200 }}>
        <img
          src={item.image_url || "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop"}
          alt={item.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        {/* gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* top-left: veg indicator */}
        <div className="absolute left-3 top-3">
          <div className="flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1.5 shadow backdrop-blur-md">
            <VegBadge isVeg={item.isVeg !== false} />
            <span className="text-[11px] font-bold text-zinc-700">
              {item.isVeg !== false ? "Veg" : "Non-Veg"}
            </span>
          </div>
        </div>

        {/* top-right: rating */}
        {item.rating && (
          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-1.5 backdrop-blur-md">
            <Star size={11} className="fill-amber-400 text-amber-400" />
            <span className="text-[12px] font-bold text-white">{item.rating}</span>
          </div>
        )}

        {/* bottom-left: delivery time */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1.5 shadow backdrop-blur-md">
          <Clock3 size={11} className="text-orange-500" />
          <span className="text-[11px] font-bold text-zinc-800">25 min</span>
        </div>
      </div>

      {/* ── CONTENT ──────────────────────────────────── */}
      <div className="flex flex-1 flex-col p-4">
        {/* badges */}
        {(item.isBestseller || item.isChefSpecial) && (
          <div className="mb-2.5 flex flex-wrap gap-1.5">
            {item.isBestseller  && <Ribbon label="Bestseller"  />}
            {item.isChefSpecial && <Ribbon label="Chef's Pick" />}
          </div>
        )}

        {/* name */}
        <h3 className="text-[17px] font-black leading-snug tracking-[-0.025em] text-zinc-900">
          {item.name || "Unnamed Dish"}
        </h3>

        {/* description */}
        {item.description && (
          <p className="mt-1.5 line-clamp-2 text-[13px] leading-[1.65] text-zinc-400">
            {item.description}
          </p>
        )}

        {/* spice + category tags */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {item.spiceLevel && (
            <span className="flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-600">
              <Flame size={10} /> {item.spiceLevel}
            </span>
          )}
          {item.category && (
            <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] font-semibold text-zinc-500">
              {item.category}
            </span>
          )}
        </div>

        {/* price + add ─ always at bottom */}
        <div className="mt-auto flex items-end justify-between pt-4">
          <div>
            {item.price_half && (
              <p className="text-[12px] text-zinc-400">
                Half ₹{item.price_half}
              </p>
            )}
            <div className="flex items-baseline gap-1">
              <span className="text-[22px] font-black tracking-tight text-zinc-900">
                ₹{item.price_full || 0}
              </span>
              <span className="text-[12px] text-zinc-400">full</span>
            </div>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            {qty === 0 ? (
              <motion.button
                key="add"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1,   opacity: 1 }}
                exit={   { scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.18 }}
                whileTap={{ scale: 0.92 }}
                onClick={onAdd}
                className="flex h-11 items-center gap-1.5 rounded-[14px] bg-[#FF5722] px-5 text-[13px] font-black text-white shadow-[0_4px_16px_rgba(255,87,34,0.35)] transition-colors hover:bg-[#e64a19]"
              >
                <Plus size={15} strokeWidth={3} />
                ADD
              </motion.button>
            ) : (
              <motion.div
                key="qty"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1,   opacity: 1 }}
                exit={   { scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <QtyControl qty={qty} onAdd={onAdd} onRemove={onRemove} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

 const MenuGrid = ({ items = [] }) => {
  const {
    cartItems,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();
 
 const getQuantity = (itemId) => {
  const item = cartItems?.find(
    (i) => (i._id || i.id) === itemId
  );

  return item?.quantity || 0;
};
 

 const handleAdd = (item) => {
  const existing = cartItems.find(
    (cartItem) => cartItem.id === item.id
  );

  if (existing) {
    increaseQuantity(item.id);
  } else {
    addToCart(item);
  }
};

const handleRemove = (item) => {
  decreaseQuantity(item.id);
};

  /* ── STAGGER WRAPPER ─────────────────────────────────── */
  const container = {
    hidden: {},
    show:   { transition: { staggerChildren: 0.06 } },
  };

  return (
    <>
      {/* ── MOBILE: single-column list ─────────────────── */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="block overflow-hidden rounded-3xl border border-zinc-100 bg-white shadow-sm md:hidden"
      >
        {items.map((item) => {
          const key = item._id || item.id;
          return (
            <MobileCard
              key={key}
              item={item}
             qty={getQuantity(key)}
              onAdd={() => handleAdd(item)}
              onRemove={() => handleRemove(item)}
            />
          );
        })}
      </motion.div>

      {/* ── DESKTOP: responsive grid ───────────────────── */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="hidden gap-6 md:grid md:grid-cols-2 xl:grid-cols-3"
      >
        {items.map((item) => {
          const key = item._id || item.id;
          return (
            <DesktopCard
              key={key}
              item={item}
               qty={getQuantity(key)}
              onAdd={() => handleAdd(item)}
              onRemove={() => handleRemove(item)}
            />
          );
        })}
      </motion.div>
    </>
  );
};

export default MenuGrid;