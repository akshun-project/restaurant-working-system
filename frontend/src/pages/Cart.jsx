import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import API from "../services/api";
/* ─────────────────────────────────────────────
   FOOD IMAGE MAP — swap with real CDN URLs
   ───────────────────────────────────────────── */
const FOOD_IMAGES = {
  default: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=120&q=80",
  dal:     "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=120&q=80",
  roti:    "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=120&q=80",
  rice:    "https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=120&q=80",
  paneer:  "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=120&q=80",
  chicken: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=120&q=80",
};

function getItemImage(name = "") {
  const n = name.toLowerCase();
  if (n.includes("dal") || n.includes("daal")) return FOOD_IMAGES.dal;
  if (n.includes("roti") || n.includes("naan") || n.includes("paratha")) return FOOD_IMAGES.roti;
  if (n.includes("rice") || n.includes("biryani") || n.includes("pulao")) return FOOD_IMAGES.rice;
  if (n.includes("paneer")) return FOOD_IMAGES.paneer;
  if (n.includes("chicken") || n.includes("mutton") || n.includes("fish")) return FOOD_IMAGES.chicken;
  return FOOD_IMAGES.default;
}

function isVeg(name = "") {
  const n = name.toLowerCase();
  return !n.includes("chicken") && !n.includes("mutton") && !n.includes("fish") && !n.includes("prawn") && !n.includes("egg");
}

/* ─────────────────────────────────────────────
   VEG / NON-VEG BADGE
   ───────────────────────────────────────────── */
function VegBadge({ veg }) {
  return (
    <span
      className={`inline-flex items-center justify-center w-4 h-4 rounded-sm border-2 flex-shrink-0 ${
        veg ? "border-green-600" : "border-red-500"
      }`}
    >
      <span
        className={`w-2 h-2 rounded-full ${veg ? "bg-green-600" : "bg-red-500"}`}
      />
    </span>
  );
}

/* ─────────────────────────────────────────────
   QUANTITY STEPPER
   ───────────────────────────────────────────── */
function QuantityStepper({ qty, onIncrease, onDecrease }) {
  return (
    <div className="flex items-center gap-0 rounded-lg overflow-hidden border border-orange-200 bg-orange-50 h-8">
      <motion.button
        whileTap={{ scale: 0.88 }}
        onClick={onDecrease}
        className="w-8 h-8 flex items-center justify-center text-orange-600 font-bold text-lg hover:bg-orange-100 transition-colors"
        aria-label="Decrease quantity"
      >
        −
      </motion.button>
      <span className="w-8 h-8 flex items-center justify-center text-sm font-bold text-gray-800 bg-white border-x border-orange-200 select-none">
        {qty}
      </span>
      <motion.button
        whileTap={{ scale: 0.88 }}
        onClick={onIncrease}
        className="w-8 h-8 flex items-center justify-center text-orange-600 font-bold text-lg hover:bg-orange-100 transition-colors"
        aria-label="Increase quantity"
      >
        +
      </motion.button>
    </div>
  );
}

/* ─────────────────────────────────────────────
   CART ITEM CARD
   ───────────────────────────────────────────── */
function CartItemCard({ item, onIncrease, onDecrease, onRemove }) {
  const [removing, setRemoving] = useState(false);
  const veg = isVeg(item.name);
  const imgSrc = item.image || getItemImage(item.name);

  const handleRemove = () => {
    setRemoving(true);
    setTimeout(() => onRemove(item.id ?? item._id ?? item.name), 320);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: removing ? 0 : 1, y: 0, scale: removing ? 0.96 : 1 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="bg-white rounded-2xl overflow-hidden border border-gray-100"
      style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
    >
      <div className="flex items-start gap-3 p-3.5">
        {/* Food Image */}
        <div className="w-[72px] h-[72px] flex-shrink-0 rounded-xl overflow-hidden bg-orange-50">
          <img
            src={imgSrc}
            alt={item.name}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => { e.target.src = FOOD_IMAGES.default; }}
          />
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-1.5 min-w-0">
              <VegBadge veg={veg} />
              <h3 className="text-[13.5px] font-semibold text-gray-800 leading-tight line-clamp-2">
                {item.name}
              </h3>
            </div>
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={handleRemove}
              className="flex-shrink-0 text-gray-300 hover:text-red-400 transition-colors p-0.5 mt-0.5"
              aria-label="Remove item"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                <path d="M10 11v6M14 11v6" />
                <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
              </svg>
            </motion.button>
          </div>

          {item.description && (
            <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">{item.description}</p>
          )}

          <div className="flex items-center justify-between mt-2.5">
            <span className="text-[15px] font-bold text-gray-900">
              ₹{((item.price ?? 0) * item.quantity).toFixed(0)}
            </span>
            <QuantityStepper
              qty={item.quantity}
              onIncrease={() => onIncrease(item.id ?? item._id ?? item.name)}
              onDecrease={() => onDecrease(item.id ?? item._id ?? item.name)}
            />
          </div>

          {item.quantity > 1 && (
            <p className="text-[10.5px] text-gray-400 mt-1">
              ₹{(item.price ?? 0).toFixed(0)} × {item.quantity}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   EMPTY CART STATE
   ───────────────────────────────────────────── */
function EmptyCart() {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: "easeOut" }}
      className="flex flex-col items-center justify-center min-h-[72vh] px-6 text-center"
    >
      <div className="relative mb-6">
        <div className="w-28 h-28 rounded-full bg-orange-50 flex items-center justify-center">
          <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61H19a2 2 0 001.99-1.75L22 6H6" />
          </svg>
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">0</span>
        </div>
      </div>

      <h2 className="text-[22px] font-bold text-gray-800 mb-2">Your cart is empty</h2>
      <p className="text-sm text-gray-500 max-w-[260px] leading-relaxed mb-8">
        Looks like you haven't added anything yet. Explore our menu — there's something for everyone.
      </p>

      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={() => navigate("/menu")}
        className="bg-orange-500 text-white px-8 py-3.5 rounded-xl text-[15px] font-semibold shadow-md shadow-orange-200 hover:bg-orange-600 transition-colors"
      >
        Explore Menu
      </motion.button>

      <div className="flex items-center gap-2 mt-8 text-[12px] text-gray-400">
        <span className="flex items-center gap-1">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          Secure checkout
        </span>
        <span className="w-1 h-1 rounded-full bg-gray-300" />
        <span className="flex items-center gap-1">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          Fast delivery
        </span>
        <span className="w-1 h-1 rounded-full bg-gray-300" />
        <span className="flex items-center gap-1">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
          Fresh food
        </span>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   ORDER SUMMARY PANEL (desktop sidebar / mobile inline)
   ───────────────────────────────────────────── */
function OrderSummary({ subtotal, tax, delivery, total, itemCount, onCheckout }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
      <div className="px-4 py-3.5 border-b border-gray-50">
        <h3 className="text-[13px] font-bold text-gray-400 uppercase tracking-widest">Bill Summary</h3>
      </div>
      <div className="px-4 py-3 space-y-2.5">
        <div className="flex justify-between text-[13.5px] text-gray-600">
          <span>Item total ({itemCount} {itemCount === 1 ? "item" : "items"})</span>
          <span className="font-medium text-gray-800">₹{subtotal.toFixed(0)}</span>
        </div>
        <div className="flex justify-between text-[13.5px] text-gray-600">
          <span>Delivery fee</span>
          {delivery === 0 ? (
            <span className="text-green-600 font-medium">FREE</span>
          ) : (
            <span className="font-medium text-gray-800">₹{delivery.toFixed(0)}</span>
          )}
        </div>
        <div className="flex justify-between text-[13.5px] text-gray-600">
          <span>Taxes & charges</span>
          <span className="font-medium text-gray-800">₹{tax.toFixed(0)}</span>
        </div>
      </div>
      {delivery === 0 && (
        <div className="mx-4 mb-3 px-3 py-2 bg-green-50 rounded-lg flex items-center gap-2">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <span className="text-[11.5px] text-green-700 font-medium">You've unlocked FREE delivery 🎉</span>
        </div>
      )}
      <div className="px-4 pt-3 pb-4 border-t border-dashed border-gray-100">
        <div className="flex justify-between">
          <span className="text-[14.5px] font-bold text-gray-900">To pay</span>
          <span className="text-[16px] font-bold text-gray-900">₹{total.toFixed(0)}</span>
        </div>
      </div>

      {/* CTA — visible only on desktop */}
      <div className="hidden md:block px-4 pb-4">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onCheckout}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl text-[15px] transition-colors"
          style={{ boxShadow: "0 4px 14px rgba(249,115,22,0.28)" }}
        >
          Proceed to Checkout →
        </motion.button>
        <p className="text-center text-[11px] text-gray-400 mt-2.5 flex items-center justify-center gap-1">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
          Secured  
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN CART PAGE
   ───────────────────────────────────────────── */
 export default function Cart() {
  const navigate = useNavigate();

  const {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    increaseQuantity,
    decreaseQuantity,
    totalAmount,
  } = useCart();
  
  const [placingOrder, setPlacingOrder] =
  useState(false);

  /* ── Derive totals ── */
  const itemCount = cartItems.reduce(
    (s, i) => s + i.quantity,
    0
  );

  const subtotal = totalAmount;

  const delivery =
    subtotal >= 299 ? 0 : 29;

  const tax = Math.round(
    subtotal * 0.05
  );

  const total =
    subtotal + delivery + tax;

 const handleCheckout = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/login", {
      state: { from: "/cart" }
    });
    return;
  }

  if (placingOrder) return;

  setPlacingOrder(true);

  try {
    const user = JSON.parse(
      localStorage.getItem("user")
    );

    await API.post(
      "/orders",
      {
        customer_name: user.name,
        phone: user.phone,
        address: user.address,
        landmark: "",
        notes: "",
        total_amount: total,
        items: cartItems,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    navigate("/success", {
  state: {
    total,
    itemCount,
    customerName: user.name,
    address: user.address,
  },
});

clearCart();

  } catch (error) {
    console.log(error);
    alert("Failed to place order");
  } finally {
    setPlacingOrder(false);
  }
};

  /* ── Quantity actions ── */
  const handleIncrease = (id) => {
    increaseQuantity(id);
  };

  const handleDecrease = (id) => {
    decreaseQuantity(id);
  };

  const handleRemove = (id) => {
    removeFromCart(id);
  };

  /* ── ETA helper ── */
  const eta = "25–35 min";

  if (cartItems.length === 0) return (
    <div className="min-h-screen bg-[#fafaf9]">
      <CartHeader itemCount={0} eta={eta} />
      <EmptyCart />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      <CartHeader itemCount={itemCount} eta={eta} />

      {/* ── Page body ── */}
      <div className="max-w-5xl mx-auto px-3 sm:px-4 md:px-6 pb-28 md:pb-8 pt-3">
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start">

          {/* ── LEFT — item list ── */}
          <div className="flex-1 w-full space-y-2.5">

            {/* Delivery progress nudge */}
            {delivery > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-amber-50 border border-amber-100 rounded-xl px-3.5 py-2.5 flex items-center gap-2.5"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                  <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
                </svg>
                <p className="text-[12.5px] text-amber-800">
                  Add <span className="font-bold">₹{(299 - subtotal).toFixed(0)}</span> more to unlock free delivery
                </p>
              </motion.div>
            )}

            {/* Item cards */}
            <AnimatePresence mode="popLayout">
              {cartItems.map((item) => (
                <CartItemCard
                  key={item.id ?? item._id ?? item.name}
                  item={item}
                  onIncrease={handleIncrease}
                  onDecrease={handleDecrease}
                  onRemove={handleRemove}
                />
              ))}
            </AnimatePresence>

            {/* Add more items */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/menu")}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-orange-300 text-orange-500 text-[13.5px] font-semibold bg-orange-50/60 hover:bg-orange-50 transition-colors mt-1"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add more items
            </motion.button>

            {/* Delivery info */}
            <div className="bg-white rounded-2xl border border-gray-100 px-4 py-3 flex items-start gap-3 mt-1" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <div>
                <p className="text-[13px] font-semibold text-gray-700">Delivery by {eta}</p>
                <p className="text-[11.5px] text-gray-400 mt-0.5">Fresh and hot, right to your door</p>
              </div>
            </div>

            {/* Order summary — mobile only */}
            <div className="md:hidden">
              <OrderSummary
                subtotal={subtotal}
                tax={tax}
                delivery={delivery}
                total={total}
                itemCount={itemCount}
                onCheckout={handleCheckout}
              />
            </div>

            {/* Clear cart */}
            <button
              onClick={clearCart}
              className="text-[12px] text-gray-400 hover:text-red-400 transition-colors flex items-center gap-1.5 mx-auto"
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
              Clear cart
            </button>
          </div>

          {/* ── RIGHT — sticky order summary desktop ── */}
          <div className="hidden md:block w-[300px] flex-shrink-0 sticky top-20">
            <OrderSummary
              subtotal={subtotal}
              tax={tax}
              delivery={delivery}
              total={total}
              itemCount={itemCount}
              onCheckout={handleCheckout}
            />

            {/* Trust badges */}
            <div className="mt-3 flex flex-wrap gap-2 justify-center">
              {[
                { icon: "🔒", label: "Pay on Delivery" },
                { icon: "🌿", label: "Fresh food" },
                { icon: "⚡", label: "Fast prep" },
              ].map(({ icon, label }) => (
                <span key={label} className="flex items-center gap-1.5 bg-white border border-gray-100 rounded-full px-3 py-1.5 text-[11.5px] text-gray-500 font-medium">
                  <span>{icon}</span>{label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── STICKY MOBILE CHECKOUT BAR ── */}
      <MobileCheckoutBar
        total={total}
        itemCount={itemCount}
        onCheckout={handleCheckout}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   CART HEADER
   ───────────────────────────────────────────── */
function CartHeader({ itemCount, eta }) {
  const navigate = useNavigate();
  return (
    <div className="bg-white border-b border-gray-100 sticky top-0 z-40" style={{ boxShadow: "0 1px 0 #f1f1f1" }}>
      <div className="max-w-5xl mx-auto px-3 sm:px-4 md:px-6 py-3.5 flex items-center gap-3">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(-1)}
          className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors flex-shrink-0"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </motion.button>

        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <h1 className="text-[17px] font-bold text-gray-900 leading-none">Your Cart</h1>
            {itemCount > 0 && (
              <span className="text-[12px] text-gray-400 font-medium">
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </span>
            )}
          </div>
          <p className="text-[11.5px] text-gray-400 mt-0.5 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block animate-pulse" />
            Mittal Dhaba · Est. {eta}
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-orange-50 px-2.5 py-1.5 rounded-lg border border-orange-100 flex-shrink-0">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          <span className="text-[11px] font-semibold text-orange-600">Safe & Fresh</span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MOBILE STICKY CHECKOUT BAR
   ───────────────────────────────────────────── */
function MobileCheckoutBar({ total, itemCount, onCheckout }) {
  return (
    <motion.div
      initial={{ y: 80 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 380, damping: 32 }}
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 px-4 py-3"
      style={{ boxShadow: "0 -4px 20px rgba(0,0,0,0.07)" }}
    >
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={onCheckout}
        className="w-full flex items-center justify-between bg-orange-500 hover:bg-orange-600 text-white px-5 py-3.5 rounded-xl transition-colors"
        style={{ boxShadow: "0 4px 14px rgba(249,115,22,0.3)" }}
      >
        <div className="flex items-center gap-2">
          <span className="bg-white/20 text-white text-[11.5px] font-bold px-2 py-0.5 rounded-md">
            {itemCount}
          </span>
          <span className="text-[15px] font-bold">Place Order</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[16px] font-bold">₹{total.toFixed(0)}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      </motion.button>
    </motion.div>
  );
}