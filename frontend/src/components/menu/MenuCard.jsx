 import { motion } from "framer-motion";
import { useCart } from "../../context/CartContext";

const BADGE_STYLES = {
  Bestseller: "bg-amber-400 text-amber-900",
  Popular: "bg-orange-500 text-white",
  Trending: "bg-rose-500 text-white",
  "Must Try": "bg-purple-500 text-white",
};

const MenuCard = ({ item }) => {
  const {
    addToCart,
    cartItems,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  const cartItem = cartItems.find(
    (cartItem) => cartItem.id === item.id
  );

  const quantity = cartItem?.quantity || 0;

  const discount =
    item.price_full &&
    item.price &&
    item.price_full > item.price
      ? Math.round(
          ((item.price_full - item.price) /
            item.price_full) *
            100
        )
      : 0;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        ease: "easeOut",
      }}
      whileHover={{ y: -3 }}
      className="group overflow-hidden rounded-3xl border border-zinc-100 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]"
    >
      {/* IMAGE */}
      <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />

        {/* BADGE */}
        {item.badge && (
          <div
            className={`absolute left-3 top-3 rounded-lg px-2 py-1 text-[10px] font-black tracking-wide ${
              BADGE_STYLES[item.badge] ||
              "bg-zinc-900 text-white"
            }`}
          >
            {item.badge}
          </div>
        )}

        {/* DISCOUNT */}
        {discount > 0 && (
          <div className="absolute right-3 top-3 rounded-lg bg-green-600 px-2 py-1 text-[10px] font-black text-white">
            {discount}% OFF
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-4">
        {/* TITLE */}
        <div className="mb-2 flex items-start gap-2">
          {/* VEG DOT */}
          <div className="mt-[3px] flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-[4px] border-2 border-green-600">
            <div className="h-2 w-2 rounded-full bg-green-600" />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-1 text-[15px] font-black tracking-[-0.02em] text-zinc-900">
              {item.name}
            </h3>

            <div className="mt-1 flex items-center gap-2">
              {/* RATING */}
              <div className="flex items-center gap-1 rounded-md bg-green-600 px-1.5 py-[2px] text-[11px] font-bold text-white">
                <span>★</span>

                <span>
                  {item.rating || "4.5"}
                </span>
              </div>

              {/* PREP TIME */}
              <div className="flex items-center gap-1 text-[11px] text-zinc-400">
                <svg
                  className="h-3 w-3 text-orange-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>

                <span>
                  {item.prepTime ||
                    "15-20 min"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* DESCRIPTION */}
        <p className="mb-4 line-clamp-2 text-[12px] leading-relaxed text-zinc-500">
          {item.description ||
            item.desc ||
            "Freshly prepared authentic flavors made with premium ingredients."}
        </p>

        {/* FOOTER */}
        <div className="flex items-center justify-between gap-3">
          {/* PRICE */}
        <div className="flex flex-col items-start">
  {item.price_half && item.price_full ? (
    <>
      <span className="text-[13px] font-semibold text-zinc-600">
        Half ₹{item.price_half}
      </span>

      <span className="text-[18px] font-black text-zinc-900">
        Full ₹{item.price_full}
      </span>
    </>
  ) : (
    <span className="text-[18px] font-black text-zinc-900">
      ₹{item.price}
    </span>
  )}
</div>

          {/* CART BUTTON */}
          {quantity === 0 ? (
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={() =>
                addToCart(item)
              }
              className="flex h-10 items-center gap-1 rounded-xl border-2 border-orange-500 bg-white px-4 text-[13px] font-black text-orange-500 transition-all duration-300 hover:bg-orange-500 hover:text-white"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>

              ADD
            </motion.button>
          ) : (
            <div className="flex h-10 items-center overflow-hidden rounded-xl bg-orange-500 shadow-lg shadow-orange-200">
              <button
                onClick={() =>
                  decreaseQuantity(
                    item.id
                  )
                }
                className="flex h-10 w-10 items-center justify-center text-lg font-black text-white transition-colors duration-200 hover:bg-orange-600"
              >
                −
              </button>

              <span className="flex w-8 items-center justify-center text-[14px] font-black text-white">
                {quantity}
              </span>

              <button
                onClick={() =>
                  increaseQuantity(
                    item.id
                  )
                }
                className="flex h-10 w-10 items-center justify-center text-lg font-black text-white transition-colors duration-200 hover:bg-orange-600"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
};

export default MenuCard;