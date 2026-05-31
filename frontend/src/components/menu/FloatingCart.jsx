 import { motion, AnimatePresence } from "framer-motion";

import { Link } from "react-router-dom";

import { useCart } from "../../context/CartContext";

const FloatingCartBar = () => {
  const {
    totalItems,
    totalAmount,
  } = useCart();

  if (!totalItems) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{
          y: 120,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        exit={{
          y: 120,
          opacity: 0,
        }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 24,
        }}
        className="fixed bottom-4 left-4 right-4 z-[70] md:left-auto md:right-6 md:w-[360px]"
      >
        <Link
          to="/cart"
          className="group flex items-center justify-between overflow-hidden rounded-3xl bg-[#111111] px-5 py-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)] transition-all duration-300 hover:translate-y-[-2px]"
        >
          {/* LEFT */}
          <div className="flex items-center gap-3">
            {/* COUNT */}
            <div className="flex h-11 min-w-[44px] items-center justify-center rounded-2xl bg-orange-500 px-3">
              <span className="text-[15px] font-black text-white">
                {totalItems}
              </span>
            </div>

            {/* TEXT */}
            <div>
              <p className="text-[14px] font-black tracking-[-0.02em] text-white">
                {totalItems === 1
                  ? "1 item added"
                  : `${totalItems} items added`}
              </p>

              <p className="mt-[2px] text-[12px] text-zinc-400">
                Ready to checkout
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4">
            {/* TOTAL */}
            <div className="text-right">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-500">
                Total
              </p>

              <p className="text-[18px] font-black tracking-[-0.03em] text-white">
                ₹{totalAmount}
              </p>
            </div>

            {/* CTA */}
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 transition-all duration-300 group-hover:bg-orange-500">
              <svg
                className="h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </div>
          </div>
        </Link>
      </motion.div>
    </AnimatePresence>
  );
};

export default FloatingCartBar;