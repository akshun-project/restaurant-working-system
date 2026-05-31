import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import {
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  Star,
  Truck,
  ShieldCheck,
  Leaf,
  Users,
  Phone,
  Lock,
  User,
  MapPin,
  Loader2,
  ChevronRight,
  Flame,
} from "lucide-react";

/* ─── Floating Label Input ─────────────────────────────────── */
function FloatingInput({
  id,
  label,
  type = "text",
  value,
  onChange,
  icon: Icon,
  suffix,
  error,
  success,
  autoComplete,
  inputMode,
}) {
  const [focused, setFocused] = useState(false);
  const raised = focused || value.length > 0;

  return (
    <div className="relative group">
      <div
        className={`
          relative flex items-center border rounded-xl transition-all duration-200
          bg-white overflow-hidden
          ${
            error
              ? "border-red-400 shadow-[0_0_0_3px_rgba(239,68,68,0.1)]"
              : success
                ? "border-emerald-400 shadow-[0_0_0_3px_rgba(16,185,129,0.08)]"
                : focused
                  ? "border-orange-400 shadow-[0_0_0_3px_rgba(249,115,22,0.12)]"
                  : "border-zinc-200 hover:border-zinc-300"
          }
        `}
      >
        {Icon && (
           <div
  className={`pl-4 mr-2 transition-colors duration-200 ${
    focused ? "text-orange-500" : "text-zinc-400"
  }`}
>
  <Icon size={18} strokeWidth={1.8} />
</div>
        )}
        <div className="relative flex-1 px-4 py-0">
          <label
            htmlFor={id}
            className={`
              absolute left-0 pointer-events-none transition-all duration-200 font-medium
              ${raised ? "top-2 text-[11px] tracking-wide" : "top-1/2 -translate-y-1/2 text-sm"}
              ${error ? "text-red-400" : focused ? "text-orange-500" : "text-zinc-400"}
            `}
          >
            {label}
          </label>
          <input
            id={id}
            type={type}
            value={value}
            onChange={onChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            autoComplete={autoComplete}
            inputMode={inputMode}
            className="w-full bg-transparent outline-none text-zinc-900 text-[15px] font-medium pt-5 pb-2 appearance-none"
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
          />
        </div>
        {suffix && <div className="pr-4 flex-shrink-0">{suffix}</div>}
        {success && !suffix && (
          <div className="pr-4 text-emerald-500">
            <CheckCircle2 size={18} strokeWidth={2} />
          </div>
        )}
      </div>
      {error && (
        <p
          id={`${id}-error`}
          className="mt-1.5 text-xs text-red-500 font-medium pl-1"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}

/* ─── Trust Badge ───────────────────────────────────────────── */
function TrustBadge({ icon: Icon, label, sub, color }) {
  return (
    <div className="flex items-start gap-3">
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${color}`}
      >
        <Icon size={17} strokeWidth={2} className="text-white" />
      </div>
      <div>
        <p className="text-white text-sm font-semibold leading-tight">
          {label}
        </p>
        <p className="text-white/60 text-xs mt-0.5 leading-tight">{sub}</p>
      </div>
    </div>
  );
}

/* ─── Stat Card ─────────────────────────────────────────────── */
function Stat({ value, label }) {
  return (
    <div className="text-center">
      <p className="text-white text-2xl font-bold tracking-tight">{value}</p>
      <p className="text-white/55 text-xs font-medium mt-0.5 leading-tight">
        {label}
      </p>
    </div>
  );
}

/* ─── Main Component ────────────────────────────────────────── */
export default function MittalDhabaSignup() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    password: "",
    address: "",
  });
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const nameRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  const update = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors((er) => ({ ...er, [field]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim() || form.name.trim().split(" ").length < 2)
      e.name = "Enter your full name (first & last)";
    if (!/^[6-9]\d{9}$/.test(form.phone.trim()))
      e.phone = "Enter a valid 10-digit Indian mobile number";
    if (form.password.length < 6)
      e.password = "Password must be at least 6 characters";
    if (!form.address.trim()) e.address = "Delivery address is required";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();

    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    try {
      setLoading(true);

      const response = await API.post("/signup", form);

      alert(response.data.message);

      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex font-sans">
      {/* ─── LEFT PANEL ─────────────────────────────────────── */}
      <div
        className="hidden lg:flex lg:w-[52%] xl:w-[55%] flex-col justify-between relative overflow-hidden"
        style={{ background: "#18181B" }}
      >
        {/* Subtle warm texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 80%, #F97316 0%, transparent 50%),
                              radial-gradient(circle at 80% 20%, #F97316 0%, transparent 50%)`,
          }}
        />

        {/* Food image mosaic */}
        <div className="absolute bottom-0 right-0 w-72 h-72 opacity-10">
          <div className="absolute bottom-8 right-8 w-48 h-48 rounded-full border border-orange-500/30" />
          <div className="absolute bottom-16 right-16 w-32 h-32 rounded-full border border-orange-500/20" />
        </div>

        <div className="relative z-10 p-10 xl:p-14 flex flex-col h-full justify-between">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-14">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                <Flame size={20} className="text-white" strokeWidth={2} />
              </div>
              <div>
                <p className="text-white font-bold text-lg leading-none font-poppins tracking-tight">
                  Mittal Dhaba
                </p>
                <p className="text-white/40 text-[11px] font-medium tracking-widest uppercase mt-0.5">
                  Authentic Taste
                </p>
              </div>
            </div>

            {/* Hero copy */}
            <div className="mb-10">
              <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 mb-6">
                <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                <span className="text-orange-400 text-xs font-semibold tracking-wide uppercase">
                  Now delivering in your area
                </span>
              </div>

              <h1 className="text-white text-4xl xl:text-5xl font-bold leading-[1.15] font-poppins mb-4">
                Real food,
                <br />
                <span className="text-orange-400">real fast.</span>
              </h1>
              <p className="text-white/55 text-base leading-relaxed max-w-xs">
                Decades of authentic North Indian flavours, hot and fresh — at
                your doorstep in under 30 minutes.
              </p>
            </div>

            {/* Food showcase */}
            <div className="grid grid-cols-3 gap-3 mb-10">
              {[
                { emoji: "🍛", name: "Dal Makhani", time: "22 min" },
                { emoji: "🫓", name: "Butter Naan", time: "18 min" },
                { emoji: "🍛", name: "Paneer Butter Masala", time: "22 min" },
              ].map((dish) => (
                <div
                  key={dish.name}
                  className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-3.5 group hover:bg-white/[0.07] hover:border-orange-500/20 transition-all duration-200 cursor-default"
                >
                  <div className="text-2xl mb-2">{dish.emoji}</div>
                  <p className="text-white text-xs font-semibold leading-tight">
                    {dish.name}
                  </p>
                  <div className="flex items-center gap-1 mt-1.5">
                    <Truck size={11} className="text-orange-400" />
                    <span className="text-white/40 text-[10px]">
                      {dish.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-5 mb-10">
              <TrustBadge
                icon={Users}
                label="5,000+ Happy Customers"
                sub="And counting every day"
                color="bg-orange-500"
              />
              <TrustBadge
                icon={Truck}
                label="Fast Delivery"
                sub="Avg. 28 min to your door"
                color="bg-zinc-700"
              />
              <TrustBadge
                icon={ShieldCheck}
                label="Hygienic Kitchen"
                sub="FSSAI certified & inspected"
                color="bg-zinc-700"
              />
              <TrustBadge
                icon={Leaf}
                label="Fresh Ingredients"
                sub="Sourced daily, never frozen"
                color="bg-orange-500"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="border-t border-white/[0.08] pt-8">
            <div className="grid grid-cols-3 gap-4">
              <Stat value="98%" label="On-time delivery" />
              <Stat value="4.8★" label="Average rating" />
              <Stat value="50+" label="Menu items" />
            </div>
          </div>
        </div>
      </div>

      {/* ─── RIGHT PANEL ────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 overflow-y-auto">
        {/* Mobile brand header */}
        <div className="lg:hidden flex items-center gap-2.5 mb-8 self-start">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <Flame size={16} className="text-white" strokeWidth={2} />
          </div>
          <p className="text-zinc-900 font-bold text-base font-poppins">
            Mittal Dhaba
          </p>
        </div>

        <div className="w-full max-w-[420px]">
          {/* Card */}
          <div className="bg-white rounded-2xl border border-zinc-100 p-8 sm:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.09)] transition-shadow duration-300">
            {/* Heading */}
            <div className="mb-8">
              <div className="flex items-center gap-1.5 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    className="text-orange-400 fill-orange-400"
                  />
                ))}
                <span className="text-zinc-400 text-xs ml-1">
                  Loved by thousands
                </span>
              </div>
              <h2 className="text-2xl font-bold text-zinc-900 font-poppins leading-tight">
                Create your account
              </h2>
              <p className="text-zinc-500 text-sm mt-1.5 leading-relaxed">
                Join Mittal Dhaba and get your first order delivered in under 30
                minutes.
              </p>
            </div>

            {/* Form */}
            <div className="space-y-4">
              <div ref={nameRef}>
                <FloatingInput
                  id="name"
                  label="Full Name"
                  value={form.name}
                  onChange={update("name")}
                  icon={User}
                  error={errors.name}
                  success={
                    !errors.name &&
                    form.name.trim().split(" ").length >= 2 &&
                    form.name.trim().length > 3
                  }
                  autoComplete="name"
                />
              </div>

              <FloatingInput
                id="phone"
                label="Phone Number"
                value={form.phone}
                onChange={update("phone")}
                icon={Phone}
                error={errors.phone}
                success={!errors.phone && /^[6-9]\d{9}$/.test(form.phone)}
                autoComplete="tel"
                inputMode="numeric"
              />

              <FloatingInput
                id="password"
                label="Password"
                type={showPass ? "text" : "password"}
                value={form.password}
                onChange={update("password")}
                icon={Lock}
                error={errors.password}
                success={!errors.password && form.password.length >= 8}
                autoComplete="new-password"
                suffix={
                  <button
                    type="button"
                    onClick={() => setShowPass((s) => !s)}
                    className="text-zinc-400 hover:text-zinc-600 transition-colors p-1 -mr-1"
                    aria-label={showPass ? "Hide password" : "Show password"}
                  >
                    {showPass ? (
                      <EyeOff size={17} strokeWidth={1.8} />
                    ) : (
                      <Eye size={17} strokeWidth={1.8} />
                    )}
                  </button>
                }
              />

              {/* Password strength */}
              {form.password.length > 0 && (
                <div className="flex gap-1.5 px-1">
                  {[...Array(4)].map((_, i) => {
                    const strength = Math.min(
                      4,
                      Math.floor(form.password.length / 3),
                    );
                    return (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          i < strength
                            ? strength <= 1
                              ? "bg-red-400"
                              : strength <= 2
                                ? "bg-yellow-400"
                                : strength <= 3
                                  ? "bg-blue-400"
                                  : "bg-emerald-400"
                            : "bg-zinc-100"
                        }`}
                      />
                    );
                  })}
                </div>
              )}

              <FloatingInput
                id="address"
                label="Delivery Address"
                value={form.address}
                onChange={update("address")}
                icon={MapPin}
                error={errors.address}
                success={!errors.address && form.address.trim().length > 8}
                autoComplete="street-address"
              />
            </div>

            {/* CTA */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`
                mt-6 w-full flex items-center justify-center gap-2.5
                font-semibold text-white text-[15px] py-4 rounded-xl
                transition-all duration-200 active:scale-[0.98]
                ${
                  loading
                    ? "bg-orange-400 cursor-not-allowed"
                    : "bg-orange-500 hover:bg-orange-600 shadow-[0_4px_16px_rgba(249,115,22,0.35)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.45)]"
                }
              `}
              aria-busy={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Creating account…</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={18} strokeWidth={2.5} />
                </>
              )}
            </button>
          </div>

          {/* Sign in link */}
          <p className="text-center text-zinc-500 text-sm mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-orange-500 font-semibold hover:text-orange-600 transition-colors inline-flex items-center gap-0.5"
            >
              Sign in
              <ChevronRight size={14} strokeWidth={2.5} />
            </Link>
          </p>

          {/* Mobile trust pills */}
          <div className="lg:hidden flex flex-wrap justify-center gap-2 mt-8">
            {[
              "5000+ customers",
              "Fast delivery",
              "FSSAI certified",
              "Fresh daily",
            ].map((t) => (
              <span
                key={t}
                className="text-xs text-zinc-500 bg-white border border-zinc-200 rounded-full px-3 py-1 font-medium"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Google Fonts ─────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&family=Manrope:wght@400;500;600;700&display=swap');
        .font-poppins { font-family: 'Poppins', sans-serif; }
        .font-sans { font-family: 'Manrope', sans-serif; }
        @keyframes bounce-once {
          0%, 100% { transform: translateY(0); }
          40% { transform: translateY(-12px); }
          70% { transform: translateY(-6px); }
        }
        .animate-bounce-once { animation: bounce-once 0.7s ease-out; }
        input[type="password"]::-ms-reveal { display: none; }
        input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 1000px white inset !important;
          -webkit-text-fill-color: #18181b !important;
        }
      `}</style>
    </div>
  );
}
