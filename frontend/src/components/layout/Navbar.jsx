 

import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
/* ─────────────────────────── constants ─────────────────────────── */

const NAV_LINKS = [
  { label: "Menu",     to: "/menu"     },
  { label: "Orders",   to: "/orders"   },
  { label: "Cart",    to: "/cart"    },
  { label: "Contact",  to: "/contact"  },
];

 
/* ─────────────────────────── icon atoms ────────────────────────── */

const CartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.6}
    stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.6}
    stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

/* ─────────────────────────── logo ──────────────────────────────── */

const Logo = ({ scrolled }) => (
  <Link to="/" className="flex items-center gap-2.5 group select-none">
    {/* minimal mark — a stylised flame/dot cluster */}
    <span className="relative flex items-end gap-[3px] pb-[2px]">
      <span className={`block rounded-full transition-all duration-500
        ${scrolled ? "bg-amber-500" : "bg-amber-400"}
        w-[5px] h-[14px] group-hover:h-[18px]`} />
      <span className={`block rounded-full transition-all duration-500
        ${scrolled ? "bg-amber-500" : "bg-amber-400"}
        w-[5px] h-[20px] group-hover:h-[24px]`} />
      <span className={`block rounded-full transition-all duration-500
        ${scrolled ? "bg-amber-500" : "bg-amber-400"}
        w-[5px] h-[12px] group-hover:h-[16px]`} />
    </span>

    <span className="flex flex-col leading-none">
      <span
        style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.01em" }}
        className={`font-semibold transition-colors duration-300 text-[22px]
          ${scrolled ? "text-stone-900" : "text-stone-50"}`}
      >
        Mittal Dhaba
      </span>
      <span
        style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.18em" }}
        className={`text-[7.5px] font-medium uppercase transition-colors duration-300
          ${scrolled ? "text-amber-600" : "text-amber-300"}`}
      >
        Pure Veg · Meerut
      </span>
    </span>
  </Link>
);

/* ─────────────────────────── desktop nav link ───────────────────── */

const NavLink = ({ to, label, scrolled }) => {
  const { pathname } = useLocation();
  const isActive = pathname === to;

  return (
    <Link to={to} className="relative group px-1 py-0.5">
      <span
        style={{ fontFamily: "'DM Sans', sans-serif" }}
        className={`text-[13.5px] font-medium tracking-wide transition-colors duration-200
          ${scrolled
            ? isActive ? "text-amber-600" : "text-stone-700 group-hover:text-stone-900"
            : isActive ? "text-amber-300" : "text-stone-200 group-hover:text-white"
          }`}
      >
        {label}
      </span>

      {/* underline bar */}
      <span className={`absolute bottom-0 left-0 h-px rounded-full transition-all duration-300
        ${scrolled ? "bg-amber-500" : "bg-amber-400"}
        ${isActive ? "w-full" : "w-0 group-hover:w-full"}`} />
    </Link>
  );
};

/* ─────────────────────────── cart button ────────────────────────── */

const CartButton = ({ scrolled, count }) => (
  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
    <Link to="/cart"
      className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-medium
        transition-all duration-300 border
        ${scrolled
          ? "bg-amber-500 text-white border-amber-500 hover:bg-amber-600 shadow-sm hover:shadow-amber-200/60 hover:shadow-md"
          : "bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-sm"
        }`}
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <CartIcon />
      <span>Cart</span>
      {count > 0 && (
        <motion.span
          key={count}
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute -top-1.5 -right-1.5 w-[18px] h-[18px] rounded-full
            bg-red-500 text-white text-[9px] font-bold flex items-center justify-center"
        >
          {count}
        </motion.span>
      )}
    </Link>
  </motion.div>
);

/* ─────────────────────────── auth button ────────────────────────── */

const AuthButton = ({ scrolled }) => (
  <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
    <Link to="/login"
      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] font-medium
        transition-all duration-300
        ${scrolled
          ? "text-stone-700 hover:text-stone-900 hover:bg-stone-100"
          : "text-stone-100 hover:text-white hover:bg-white/10"
        }`}
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <UserIcon />
      <span>Sign in</span>
    </Link>
  </motion.div>
);

/* ─────────────────────────── hamburger ─────────────────────────── */

 const Hamburger = ({ open, onClick, scrolled }) => {
  return (
    <button
      onClick={onClick}
      className="relative flex h-10 w-10 items-center justify-center"
      aria-label="Menu"
    >
      <div className="relative h-5 w-6">
        <span
          className={`absolute left-0 top-0 h-0.5 w-6 transition-all duration-300 ${
            scrolled ? "bg-stone-900" : "bg-white"
          } ${
            open
              ? "translate-y-2 rotate-45"
              : ""
          }`}
        />

        <span
          className={`absolute left-0 top-2 h-0.5 w-6 transition-all duration-300 ${
            scrolled ? "bg-stone-900" : "bg-white"
          } ${
            open
              ? "opacity-0"
              : ""
          }`}
        />

        <span
          className={`absolute left-0 top-4 h-0.5 w-6 transition-all duration-300 ${
            scrolled ? "bg-stone-900" : "bg-white"
          } ${
            open
              ? "-translate-y-2 -rotate-45"
              : ""
          }`}
        />
      </div>
    </button>
  );
};

/* ─────────────────────────── mobile menu ───────────────────────── */

 const MobileMenu = ({ open, onClose }) => {
  const { pathname } = useLocation();

  const { user, logout } = useAuth();
  const { totalItems } = useCart();

  const prefersReduced = useReducedMotion();
  // lock body scroll
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };
  const panelVariants = {
    hidden: { x: "100%" },
    visible: {
      x: 0,
      transition: { type: "spring", stiffness: 300, damping: 35 },
    },
    exit: {
      x: "100%",
      transition: { duration: 0.28, ease: [0.4, 0, 1, 1] },
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, x: 24 },
    visible: (i) => ({
      opacity: 1, x: 0,
      transition: { delay: 0.12 + i * 0.06, duration: 0.38, ease: [0.22, 1, 0.36, 1] },
    }),
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* backdrop */}
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            variants={prefersReduced ? {} : overlayVariants}
            initial="hidden" animate="visible" exit="hidden"
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />

          {/* panel */}
          <motion.div
            key="panel"
            className="fixed top-0 right-0 z-50 h-full w-[85vw] max-w-sm
              bg-stone-950 flex flex-col overflow-hidden"
            variants={prefersReduced ? {} : panelVariants}
            initial="hidden" animate="visible" exit="exit"
          >
            {/* top bar */}
            <div className="flex items-center justify-between px-6 pt-5 pb-6">
              <span
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
                className="text-[20px] font-semibold text-stone-50 tracking-wide"
              >
                Mittal Dhaba
              </span>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-stone-800 flex items-center justify-center
                  hover:bg-stone-700 transition-colors"
                aria-label="Close menu"
              >
                <svg viewBox="0 0 14 14" className="w-3.5 h-3.5 text-stone-300" fill="none"
                  stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                  <path d="M1 1l12 12M13 1L1 13" />
                </svg>
              </button>
            </div>

            {/* divider */}
            <div className="mx-6 h-px bg-stone-800" />

            {/* links */}
            <nav className="flex flex-col gap-1 px-4 pt-6 flex-1">
              {NAV_LINKS.map((link, i) => {
                const isActive = pathname === link.to;
                return (
                  <motion.div
                    key={link.to}
                    custom={i}
                    variants={prefersReduced ? {} : itemVariants}
                    initial="hidden" animate="visible"
                  >
                    <Link
                      to={link.to}
                      onClick={onClose}
                      className={`flex items-center justify-between px-4 py-4 rounded-xl
                        text-[17px] font-medium transition-all duration-200
                        ${isActive
                          ? "bg-amber-500/15 text-amber-400"
                          : "text-stone-300 hover:bg-stone-800/80 hover:text-stone-50"
                        }`}
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {link.label}
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
              {user?.role === "admin" && (
  <Link
    to="/admin"
    onClick={onClose}
    className="flex items-center justify-between px-4 py-4 rounded-xl text-[17px] font-medium text-stone-300 hover:bg-stone-800/80 hover:text-stone-50"
    style={{
      fontFamily: "'DM Sans', sans-serif",
    }}
  >
    Admin
  </Link>
)}
            </nav>

            {/* bottom CTAs */}
            <motion.div
              className="px-6 pb-10 flex flex-col gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38, duration: 0.4 }}
            >
              <Link to="/cart" onClick={onClose}
                className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-xl
                  bg-amber-500 text-white text-[15px] font-semibold
                  hover:bg-amber-600 active:scale-95 transition-all duration-200"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                <CartIcon />
                View Cart
                {totalItems > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 rounded-md bg-white/20 text-xs font-bold">
                    {totalItems}
                  </span>
                )}
              </Link>

              {user ? (
  <button
    onClick={() => {
      logout();
      onClose();
    }}
    className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-xl border border-red-800 text-red-300 text-[15px] font-medium hover:bg-red-900/20 transition-all duration-200"
  >
    Logout
  </button>
) : (
  <Link
    to="/login"
    onClick={onClose}
    className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-xl border border-stone-700 text-stone-300 text-[15px] font-medium"
  >
    <UserIcon />
    Sign In
  </Link>
)}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

  const UserMenu = ({
  user,
  logout,
  scrolled,
}) => {
  return (
    <div
      className={`flex items-center gap-3 rounded-full px-4 py-2 transition-all duration-300 ${
        scrolled
          ? "bg-stone-100"
          : "bg-white/10 backdrop-blur-sm"
      }`}
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-sm font-bold text-white">
        {user?.name?.charAt(0)}
      </div>

      <span
        className={`text-sm font-semibold ${
          scrolled
            ? "text-stone-800"
            : "text-white"
        }`}
      >
        {user?.name}
      </span>

      <button
        onClick={logout}
        className={`text-xs font-medium ${
          scrolled
            ? "text-red-600"
            : "text-red-300"
        }`}
      >
        Logout
      </button>
    </div>
  );
};
/* ─────────────────────────── navbar ────────────────────────────── */

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
const { totalItems } = useCart();
  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 18);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // close mobile menu on route change
  const { pathname } = useLocation();
  useEffect(() => { setMobileOpen(false); }, [pathname]);

 

  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
      `}</style>

      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-30 transition-all duration-500
          ${scrolled
            ? "bg-white/90 backdrop-blur-xl border-b border-stone-200/60 shadow-[0_1px_24px_0_rgba(0,0,0,0.06)]"
            : "bg-transparent border-b border-transparent"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex items-center justify-between transition-all duration-300
            ${scrolled ? "h-[62px]" : "h-[72px]"}`}
          >
            {/* logo */}
            <Logo scrolled={scrolled} />

            {/* desktop nav */}
           <nav className="hidden md:flex items-center gap-7">
  {NAV_LINKS.map((link) => (
    <NavLink
      key={link.to}
      {...link}
      scrolled={scrolled}
    />
  ))}

  {user?.role === "admin" && (
    <NavLink
      to="/admin"
      label="Admin"
      scrolled={scrolled}
    />
  )}
</nav>

            {/* desktop actions */}
            <div className="hidden md:flex items-center gap-2">
              {user ? (
  <UserMenu
    user={user}
    logout={logout}
    scrolled={scrolled}
  />
) : (
  <AuthButton
    scrolled={scrolled}
  />
)}
              
            </div>

            {/* mobile: cart + hamburger */}
            <div className="flex md:hidden items-center gap-1">
              {/* cart icon only on mobile */}
              <motion.div whileTap={{ scale: 0.9 }}>
                <Link to="/cart"
                  className={`relative flex items-center justify-center w-10 h-10 rounded-full
                    transition-colors duration-200
                    ${scrolled ? "text-stone-700 hover:bg-stone-100" : "text-white hover:bg-white/10"}`}
                >
                  <CartIcon />
                  {totalItems > 0 && (
                    <span className="absolute top-1 right-1 w-[14px] h-[14px] rounded-full
                      bg-red-500 text-white text-[8px] font-bold flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Link>
              </motion.div>

              <Hamburger
                open={mobileOpen}
                onClick={() => setMobileOpen((v) => !v)}
                scrolled={scrolled}
              />
            </div>
          </div>
        </div>

        {/* scrolled accent line */}
        <AnimatePresence>
          {scrolled && (
            <motion.div
              key="accent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              exit={{ scaleX: 0 }}
              style={{ originX: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r
                from-amber-400 via-amber-500 to-amber-400 opacity-70"
            />
          )}
        </AnimatePresence>
      </motion.header>

      {/* mobile drawer */}
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}