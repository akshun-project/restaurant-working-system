 import { motion } from "framer-motion";

import {
  BadgeCheck,
  Leaf,
  Star,
} from "lucide-react";

const reviews = [
  "Best food delivery experience in Meerut.",
  "Paneer Butter Masala tasted rich and authentic.",
  "Packaging quality feels premium and hygienic.",
  "Fast delivery and amazing tandoori flavors.",
  "Feels like restaurant dining at home.",
  "Authentic taste without being oily.",
  "Dal Makhani combo is honestly addictive.",
  "Perfect family dinner option for weekends.",
];

const ReviewCard = ({ text }) => {
  return (
    <div className="group relative flex min-w-[320px] sm:min-w-[390px] items-center gap-5 overflow-hidden rounded-[30px] border border-orange-100 bg-white/90 px-6 py-5 shadow-[0_10px_40px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(249,115,22,0.12)]">
      {/* Glow */}
      <div className="absolute right-[-40px] top-[-40px] h-[120px] w-[120px] rounded-full bg-orange-100 blur-3xl opacity-0 transition-all duration-500 group-hover:opacity-100" />

      {/* Icon */}
      <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500 text-white shadow-lg shadow-green-200">
        <Leaf size={20} />
      </div>

      {/* Content */}
      <div className="relative flex-1">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={14}
              className="fill-orange-400 text-orange-400"
            />
          ))}
        </div>

        <p className="mt-3 text-[15px] leading-[1.9] text-zinc-700">
          “{text}”
        </p>

        <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-green-600">
          <BadgeCheck size={15} />

          Verified Orders
        </div>
      </div>
    </div>
  );
};

const Testimonials = () => {
  return (
    <section className="relative overflow-hidden bg-[#fffaf5] py-28">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-[-120px] top-[-120px] h-[320px] w-[320px] rounded-full bg-orange-100 blur-3xl opacity-60" />

        <div className="absolute bottom-[-120px] right-[-120px] h-[320px] w-[320px] rounded-full bg-yellow-100 blur-3xl opacity-60" />
      </div>

      <div className="relative z-10">
        {/* Top */}
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          {/* Badge */}
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
            }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-white px-4 py-2 shadow-sm"
          >
            <Leaf
              size={15}
              className="text-green-500"
            />

            <span className="text-sm font-semibold text-zinc-700">
              100% Pure Vegetarian
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h2
            initial={{
              opacity: 0,
              y: 30,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
              delay: 0.1,
            }}
            viewport={{ once: true }}
            className="mt-7 max-w-5xl text-[42px] font-black leading-[0.95] tracking-[-0.05em] text-zinc-900 sm:text-[58px] lg:text-[74px]"
          >
            Real Reviews.
            <span className="block text-orange-500">
              Real Pure Veg Lovers.
            </span>
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{
              opacity: 0,
              y: 30,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
              delay: 0.2,
            }}
            viewport={{ once: true }}
            className="mt-7 max-w-[720px] text-[17px] leading-[1.9] text-zinc-600 md:text-[18px]"
          >
            Thousands of customers trust Mittal Dhaba for authentic
            vegetarian flavors, hygienic preparation, premium quality,
            and fast delivery across Meerut.
          </motion.p>
        </div>

        {/* Single Moving Row */}
        <div className="relative mt-20 overflow-hidden">
          <motion.div
            animate={{
              x: [0, -1600],
            }}
            transition={{
              repeat: Infinity,
              duration: 22,
              ease: "linear",
            }}
            className="flex gap-6"
          >
            {[...reviews, ...reviews].map(
              (review, index) => (
                <ReviewCard
                  key={index}
                  text={review}
                />
              )
            )}
          </motion.div>

          {/* Fade Left */}
          <div className="absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-[#fffaf5] to-transparent" />

          {/* Fade Right */}
          <div className="absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-[#fffaf5] to-transparent" />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;