    import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const floatingVariants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const Success = () => {
  const orderId =
    "#" +
    Math.floor(
      100000 + Math.random() * 900000
    );

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fafaf9] px-4 py-10">
      {/* BACKGROUND GLOW */}
      <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-100 blur-3xl opacity-60" />

      {/* CONTENT */}
      <motion.div
        initial={{
          opacity: 0,
          y: 30,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
        }}
        className="relative z-10 w-full max-w-xl overflow-hidden rounded-[36px] border border-zinc-100 bg-white p-7 shadow-[0_20px_60px_rgba(0,0,0,0.06)] sm:p-10"
      >
        {/* TOP ICON */}
        <div className="flex justify-center">
          <motion.div
            variants={
              floatingVariants
            }
            animate="animate"
            className="relative flex h-28 w-28 items-center justify-center rounded-full bg-green-50"
          >
            {/* PULSE */}
            <div className="absolute inset-0 rounded-full bg-green-100 animate-ping opacity-30" />

            {/* CHECK */}
            <motion.div
              initial={{
                scale: 0,
                rotate: -20,
              }}
              animate={{
                scale: 1,
                rotate: 0,
              }}
              transition={{
                type: "spring",
                stiffness: 220,
                damping: 14,
                delay: 0.2,
              }}
              className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-green-500 shadow-xl shadow-green-200"
            >
              <svg
                className="h-10 w-10 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </motion.div>
          </motion.div>
        </div>

        {/* TEXT */}
        <div className="mt-8 text-center">
          <motion.p
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.2,
            }}
            className="text-[12px] font-bold uppercase tracking-[0.16em] text-green-600"
          >
            Order Confirmed
          </motion.p>

          <motion.h1
            initial={{
              opacity: 0,
              y: 14,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.3,
            }}
            className="mt-4 text-[36px] font-black leading-[1] tracking-[-0.06em] text-zinc-900 sm:text-[46px]"
          >
            Thank You
            <span className="block text-orange-500">
              For Ordering.
            </span>
          </motion.h1>

          <motion.p
            initial={{
              opacity: 0,
              y: 14,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.4,
            }}
            className="mx-auto mt-5 max-w-[420px] text-[15px] leading-relaxed text-zinc-500"
          >
            Our chefs have started preparing your fresh meal.
            Your order will arrive hot and delicious.
          </motion.p>
        </div>

        {/* ORDER CARD */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.5,
          }}
          className="mt-8 overflow-hidden rounded-3xl border border-zinc-100 bg-[#fafafa]"
        >
          {/* TOP */}
          <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-400">
                Order ID
              </p>

              <h3 className="mt-1 text-[18px] font-black text-zinc-900">
                {orderId}
              </h3>
            </div>

            <div className="rounded-2xl bg-orange-100 px-4 py-2">
              <p className="text-[12px] font-bold text-orange-600">
                Preparing
              </p>
            </div>
          </div>

          {/* DETAILS */}
          <div className="space-y-4 px-5 py-5">
            {/* ETA */}
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50">
                <svg
                  className="h-5 w-5 text-orange-500"
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
              </div>

              <div>
                <p className="text-[14px] font-bold text-zinc-900">
                  Estimated Delivery
                </p>

                <p className="mt-1 text-[13px] text-zinc-500">
                  25–35 minutes
                </p>
              </div>
            </div>

            {/* ADDRESS */}
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-50">
                <svg
                  className="h-5 w-5 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0L6.343 16.657A8 8 0 1117.657 16.657z"
                  />
                </svg>
              </div>

              <div>
                <p className="text-[14px] font-bold text-zinc-900">
                  Delivery Address
                </p>

                <p className="mt-1 text-[13px] leading-relaxed text-zinc-500">
                  Your order will be delivered safely to your selected location.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* STATUS */}
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 0.7,
          }}
          className="mt-7 rounded-2xl border border-green-100 bg-green-50 px-5 py-4"
        >
          <div className="flex items-center gap-3">
            <div className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>

              <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
            </div>

            <p className="text-[13px] font-semibold text-green-700">
              Kitchen has started preparing your meal
            </p>
          </div>
        </motion.div>

        {/* BUTTONS */}
        <motion.div
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.8,
          }}
          className="mt-8 grid gap-3 sm:grid-cols-2"
        >
          {/* MENU */}
          <Link to="/menu">
            <motion.button
              whileTap={{
                scale: 0.97,
              }}
              className="flex h-14 w-full items-center justify-center rounded-2xl border border-zinc-200 bg-white text-[14px] font-bold text-zinc-700 transition-all duration-300 hover:border-orange-200 hover:bg-orange-50"
            >
              Back to Menu
            </motion.button>
          </Link>

          {/* TRACK */}
          <motion.button
            whileTap={{
              scale: 0.97,
            }}
            className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-orange-500 text-[14px] font-bold text-white shadow-lg shadow-orange-200 transition-all duration-300 hover:bg-orange-600"
          >
            Track Order

            <svg
              className="h-5 w-5"
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
          </motion.button>
        </motion.div>

        {/* FOOTER */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3 text-[11px] font-semibold text-zinc-400">
          <div className="rounded-full bg-zinc-100 px-3 py-1.5">
            Freshly Prepared
          </div>

          <div className="rounded-full bg-zinc-100 px-3 py-1.5">
            Safe Delivery
          </div>

          <div className="rounded-full bg-zinc-100 px-3 py-1.5">
            Premium Ingredients
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Success;