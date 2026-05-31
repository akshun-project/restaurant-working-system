 import {
  MapPin,
  Phone,
  Mail,
  ArrowUpRight,
  Leaf,
} from "lucide-react";

import {
  FaInstagram,
  FaXTwitter,
} from "react-icons/fa6";

import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-[#0f0f0f] pt-24">
      {/* BACKGROUND */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-[-120px] top-[-120px] h-[320px] w-[320px] rounded-full bg-orange-500/10 blur-3xl" />

        <div className="absolute bottom-[-120px] right-[-120px] h-[320px] w-[320px] rounded-full bg-yellow-500/10 blur-3xl" />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-8">
        {/* TOP */}
        <div className="grid gap-14 border-b border-white/10 pb-16 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]">
          {/* BRAND */}
          <div>
            {/* LOGO */}
            <div className="flex items-center gap-4">
              <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-[#1a1a1a] shadow-lg">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,115,0,0.35),transparent_70%)]" />

                <span className="relative text-[16px] font-black tracking-[-0.08em] text-white">
                  MD
                </span>
              </div>

              <div>
                <h2 className="text-[22px] font-black tracking-[-0.04em] text-white">
                  Mittal Dhaba
                </h2>

                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-400">
                  Modern Indian Kitchen
                </p>
              </div>
            </div>

            {/* DESC */}
            <p className="mt-7 max-w-[420px] text-[15px] leading-[2] text-zinc-400">
              Delivering authentic Indian vegetarian flavors with premium
              quality, hygienic preparation, and a modern food ordering
              experience across Meerut.
            </p>

            {/* PURE VEG BADGE */}
            <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2">
              <Leaf
                size={15}
                className="text-green-400"
              />

              <span className="text-sm font-semibold text-green-300">
                100% Pure Vegetarian
              </span>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="text-[18px] font-black tracking-[-0.03em] text-white">
              Quick Links
            </h3>

            <div className="mt-7 flex flex-col gap-4">
              {[
                {
                  label: "Home",
                  path: "/",
                },
                {
                  label: "Menu",
                  path: "/menu",
                },
                {
                  label: "Cart",
                  path: "/cart",
                },
                {
                  label: "Login",
                  path: "/login",
                },
              ].map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className="group flex items-center gap-2 text-[15px] text-zinc-400 transition-all duration-300 hover:text-orange-400"
                >
                  {item.label}

                  <ArrowUpRight
                    size={15}
                    className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                  />
                </Link>
              ))}
            </div>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="text-[18px] font-black tracking-[-0.03em] text-white">
              Contact
            </h3>

            <div className="mt-7 space-y-5">
              <div className="flex items-start gap-3">
                <MapPin
                  size={18}
                  className="mt-1 text-orange-400"
                />

                <p className="text-[15px] leading-[1.8] text-zinc-400">
                  Meerut, Uttar Pradesh,
                  India
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Phone
                  size={18}
                  className="text-orange-400"
                />

                <p className="text-[15px] text-zinc-400">
                  +91 98765 43210
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Mail
                  size={18}
                  className="text-orange-400"
                />

                <p className="text-[15px] text-zinc-400">
                  hello@mittaldhaba.com
                </p>
              </div>
            </div>
          </div>

          {/* SOCIALS */}
          <div>
            <h3 className="text-[18px] font-black tracking-[-0.03em] text-white">
              Follow Us
            </h3>

            <p className="mt-7 text-[15px] leading-[1.9] text-zinc-400">
              Stay connected for new dishes, exclusive offers, and pure
              veg dhaba experiences.
            </p>

            {/* SOCIAL ICONS */}
            <div className="mt-8 flex items-center gap-4">
              <a
                href="#"
                className="group flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-zinc-400 backdrop-blur-xl transition-all duration-300 hover:border-orange-500/20 hover:bg-orange-500 hover:text-white"
              >
                <FaInstagram size={18} />
              </a>

              <a
                href="#"
                className="group flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-zinc-400 backdrop-blur-xl transition-all duration-300 hover:border-orange-500/20 hover:bg-orange-500 hover:text-white"
              >
                <FaXTwitter size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="flex flex-col items-center justify-between gap-5 py-7 text-center md:flex-row md:text-left">
          <p className="text-sm text-zinc-500">
            © 2026 Mittal Dhaba. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-5">
            <Link
              to="/privacy"
              className="text-sm text-zinc-500 transition-all duration-300 hover:text-orange-400"
            >
              Privacy Policy
            </Link>

            <Link
              to="/terms"
              className="text-sm text-zinc-500 transition-all duration-300 hover:text-orange-400"
            >
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;