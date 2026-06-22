 import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Flame,
  Receipt,
  Bike,
  CheckCircle2,
  ChevronRight,
  X,
  Clock,
  MapPin,
} from "lucide-react";
import API from "../services/api";

/**
 * ── Mittal Dhaba · My Orders ─────────────────────────────────────────────
 * Needs `lucide-react` added to the project (framer-motion is already a
 * dependency): npm install lucide-react
 *
 * Design tokens
 *   page bg     #FAF6F0   ink          #2A1D14   ink-soft   #8A7B6C
 *   hairline    #ECE3D5   card         #FFFFFF
 *   ember (CTA) #D9531E   ember-dark   #B8431A
 *   tracker bg  linear-gradient(160deg,#4A1C12,#2B0F09)
 *   turmeric (preparing) #D89A1E   tulsi (delivered) #3F6B4A
 *   neutral (placed) #9A8B7A      brick (cancelled) #9B3B2C
 * ------------------------------------------------------------------------ */

const ACTIVE_STATUSES = ["Pending", "Preparing", "Out For Delivery"];

const STAGES = [
  { key: "Pending", label: "Order placed", icon: Receipt },
  { key: "Preparing", label: "On the tandoor", icon: Flame },
  { key: "Out For Delivery", label: "Out for delivery", icon: Bike },
  { key: "Delivered", label: "Delivered", icon: CheckCircle2 },
];

const STATUS_THEME = {
  Pending: { dot: "#9A8B7A", text: "#6B5D4F", bg: "#F2EEE7", caption: "Confirming with the kitchen" },
  Preparing: { dot: "#D89A1E", text: "#8A5F0E", bg: "#FBF0D9", caption: "Sizzling on the tandoor" },
  "Out For Delivery": { dot: "#D9531E", text: "#B8431A", bg: "#FBE3D8", caption: "Your rider is on the way" },
  Delivered: { dot: "#3F6B4A", text: "#3F6B4A", bg: "#E4EFE6", caption: "Delivered — enjoy your meal" },
  Cancelled: { dot: "#9B3B2C", text: "#9B3B2C", bg: "#F3E1DC", caption: "This order was cancelled" },
};

function stageIndex(status) {
  const i = STAGES.findIndex((s) => s.key === status);
  return i === -1 ? 0 : i;
}

function itemCount(order) {
  if (!order.items?.length) return 0;
  return order.items.reduce((sum, it) => sum + (Number(it.quantity) || 1), 0);
}

function formatAmount(value) {
  const num = Number(value) || 0;
  return num.toLocaleString("en-IN");
}

function formatDate(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const isToday = d.toDateString() === new Date().toDateString();
  const time = d.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
  if (isToday) return `Today, ${time}`;
  return `${d.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}, ${time}`;
}

function estimateEta(order) {
  if (order.eta_minutes) return `${order.eta_minutes} min`;
  if (order.eta) return order.eta;
  switch (order.status) {
    case "Pending":
      return "Confirming…";
    case "Preparing":
      return "25–30 min";
    case "Out For Delivery":
      return "10–15 min";
    default:
      return "—";
  }
}

/* ── Sticky live tracker ─────────────────────────────────────────────── */

function LiveTracker({ order, extraCount, onOpenDetail }) {
  const reduceMotion = useReducedMotion();
  const idx = stageIndex(order.status);
  const theme = STATUS_THEME[order.status] || STATUS_THEME.Pending;
  const progressPct = (idx / (STAGES.length - 1)) * 100;

  return (
    <div className="sticky top-0 z-40 bg-[#FAF6F0]/95 px-4 pt-4 pb-3 backdrop-blur-sm">
      <div
        className="overflow-hidden rounded-3xl shadow-[0_18px_40px_-12px_rgba(43,15,9,0.45)]"
        style={{ backgroundImage: "linear-gradient(160deg,#4A1C12,#2B0F09)" }}
      >
        <div className="px-5 pt-5 pb-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#E8A463]">
              Live Order
            </span>
            <span
              className="rounded-full px-3 py-1 text-[11px] font-semibold"
              style={{ background: theme.bg, color: theme.text }}
            >
              {order.status}
            </span>
          </div>

          <div className="mt-2 flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="text-lg font-extrabold tracking-tight text-white">
                Order #{order.id}
              </p>
              <p className="mt-0.5 truncate text-[13px] text-white/60">{theme.caption}</p>
            </div>
            <div className="flex-shrink-0 text-right">
              <p className="flex items-center justify-end gap-1 text-[11px] font-medium text-white/50">
                <Clock className="h-3 w-3" /> ETA
              </p>
              <p className="text-base font-bold text-white">{estimateEta(order)}</p>
            </div>
          </div>
        </div>

        {/* animated progress timeline */}
        <div className="relative px-9 pt-7 pb-5">
          <div className="absolute left-9 right-9 top-[34px] h-1 rounded-full bg-white/15" />
          <motion.div
            className="absolute left-9 top-[34px] h-1 rounded-full"
            style={{ backgroundImage: "linear-gradient(90deg,#D89A1E,#D9531E)" }}
            initial={false}
            animate={{ width: `calc(${progressPct}% * 0.82)` }}
            transition={{ duration: reduceMotion ? 0 : 0.7, ease: "easeOut" }}
          />
          <div className="relative flex justify-between">
            {STAGES.map((stage, i) => {
              const done = i <= idx;
              const isCurrent = i === idx;
              const Icon = stage.icon;
              return (
                <div key={stage.key} className="flex w-14 flex-col items-center gap-2">
                  <motion.div
                    className="flex h-8 w-8 items-center justify-center rounded-full"
                    style={{
                      background: done ? (isCurrent ? "#D9531E" : "#B8431A") : "rgba(255,255,255,0.12)",
                    }}
                    animate={isCurrent && !reduceMotion ? { scale: [1, 1.14, 1] } : { scale: 1 }}
                    transition={{ repeat: isCurrent && !reduceMotion ? Infinity : 0, duration: 1.6 }}
                  >
                    <Icon className={`h-4 w-4 ${done ? "text-white" : "text-white/40"}`} />
                  </motion.div>
                  <span
                    className={`text-center text-[10px] font-medium leading-tight ${
                      done ? "text-white/90" : "text-white/35"
                    }`}
                  >
                    {stage.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={() => onOpenDetail(order)}
          className="flex w-full items-center justify-center gap-1.5 bg-[#D9531E] py-3.5 text-sm font-bold text-white transition active:bg-[#B8431A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Track Order <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {extraCount > 0 && (
        <p className="mt-2 px-1 text-[12px] font-medium text-[#8A7B6C]">
          +{extraCount} more order{extraCount > 1 ? "s" : ""} in progress
        </p>
      )}
    </div>
  );
}

/* ── Compact history row ─────────────────────────────────────────────── */

function OrderRow({ order, onSelect }) {
  const theme = STATUS_THEME[order.status] || STATUS_THEME.Pending;
  const count = itemCount(order);

  return (
    <button
      onClick={() => onSelect(order)}
      className="flex w-full items-center gap-3 rounded-2xl border border-[#ECE3D5] bg-white px-4 py-3 text-left shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition active:scale-[0.99] active:bg-[#FAF6F0] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D9531E]"
    >
      <span className="h-2 w-2 flex-shrink-0 rounded-full" style={{ background: theme.dot }} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-[13.5px] font-bold text-[#2A1D14]">#{order.id}</span>
          <span className="text-[11px] font-medium" style={{ color: theme.text }}>
            {order.status}
          </span>
        </div>
        <p className="mt-0.5 truncate text-[12px] text-[#8A7B6C]">
          {count} item{count !== 1 ? "s" : ""} · {formatDate(order.created_at)}
        </p>
      </div>
      <div className="flex flex-shrink-0 items-center gap-1.5">
        <span className="text-[14px] font-extrabold tabular-nums text-[#2A1D14]">
          ₹{formatAmount(order.total_amount)}
        </span>
        <ChevronRight className="h-4 w-4 text-[#C9BBAB]" />
      </div>
    </button>
  );
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-[#ECE3D5] bg-white px-4 py-3">
      <div className="h-2 w-2 rounded-full bg-[#ECE3D5]" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-24 animate-pulse rounded bg-[#ECE3D5]" />
        <div className="h-2.5 w-32 animate-pulse rounded bg-[#ECE3D5]" />
      </div>
      <div className="h-3 w-10 animate-pulse rounded bg-[#ECE3D5]" />
    </div>
  );
}

function EmptyState({ menuHref }) {
  return (
    <div className="mt-4 flex flex-col items-center rounded-3xl bg-white px-6 py-14 text-center shadow-sm">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FBE3D8]">
        <Receipt className="h-6 w-6 text-[#D9531E]" />
      </div>
      <h2 className="mt-4 text-base font-bold text-[#2A1D14]">No orders yet</h2>
      <p className="mt-1.5 max-w-[220px] text-[13px] text-[#8A7B6C]">
        When you order from Mittal Dhaba, it&apos;ll show up here.
      </p>
      <a
        href={menuHref}
        className="mt-5 rounded-full bg-[#D9531E] px-6 py-2.5 text-[13px] font-bold text-white transition active:bg-[#B8431A]"
      >
        View Menu
      </a>
    </div>
  );
}

/* ── Detail bottom sheet ─────────────────────────────────────────────── */

function OrderDetailSheet({ order, onClose }) {
  const closeBtnRef = useRef(null);
  const theme = STATUS_THEME[order.status] || STATUS_THEME.Pending;
  const isActive = ACTIVE_STATUSES.includes(order.status);
  const idx = stageIndex(order.status);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-[2px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={`Order #${order.id} details`}
        onClick={(e) => e.stopPropagation()}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 280 }}
        className="max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-[#FAF6F0] pb-[env(safe-area-inset-bottom)]"
      >
        <div className="relative sticky top-0 flex items-center justify-between bg-[#FAF6F0] px-5 pt-5 pb-3">
          <div className="absolute left-1/2 top-2 h-1.5 w-10 -translate-x-1/2 rounded-full bg-[#ECE3D5]" />
          <div>
            <p className="text-[15px] font-extrabold text-[#2A1D14]">Order #{order.id}</p>
            <p className="text-[12px] text-[#8A7B6C]">{formatDate(order.created_at)}</p>
          </div>
          <button
            ref={closeBtnRef}
            onClick={onClose}
            aria-label="Close order details"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#2A1D14] shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D9531E]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-5 pb-8">
          <span
            className="inline-flex rounded-full px-3 py-1 text-[11px] font-semibold"
            style={{ background: theme.bg, color: theme.text }}
          >
            {order.status}
          </span>

          {isActive ? (
            <div className="mt-5 space-y-4">
              {STAGES.map((s, i) => {
                const done = i <= idx;
                const Icon = s.icon;
                return (
                  <div key={s.key} className="flex items-center gap-3">
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-full ${
                        done ? "bg-[#D9531E]" : "bg-[#ECE3D5]"
                      }`}
                    >
                      <Icon className={`h-3.5 w-3.5 ${done ? "text-white" : "text-[#B3A593]"}`} />
                    </div>
                    <span
                      className={`text-[13px] font-medium ${
                        done ? "text-[#2A1D14]" : "text-[#B3A593]"
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="mt-3 text-[13px] text-[#8A7B6C]">{theme.caption}</p>
          )}

          {order.address && (
            <div className="mt-6 flex items-start gap-2.5 rounded-2xl bg-white p-4 shadow-sm">
              <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#D9531E]" />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[#8A7B6C]">
                  Delivery address
                </p>
                <p className="mt-0.5 text-[13.5px] text-[#2A1D14]">{order.address}</p>
              </div>
            </div>
          )}

          <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#8A7B6C]">Items</p>
            <div className="mt-2.5 space-y-2.5">
              {order.items?.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-[13.5px]">
                  <span className="text-[#2A1D14]">{item.name}</span>
                  <span className="font-semibold tabular-nums text-[#6B5D4F]">× {item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-[#ECE3D5] pt-3">
              <span className="text-[13.5px] font-bold text-[#2A1D14]">Total</span>
              <span className="text-[15px] font-extrabold tabular-nums text-[#D9531E]">
                ₹{formatAmount(order.total_amount)}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────── */

const Orders = ({ menuHref = "/" }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = useCallback(async (isBackground = false) => {
    try {
      if (!isBackground) setLoading(true);
      const token = localStorage.getItem("token");
      const response = await API.get("/orders/my-orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data.orders || []);
      setError(false);
    } catch (err) {
      console.log(err);
      if (!isBackground) setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    // Keep the live tracker fresh without a manual refresh.
    const interval = setInterval(() => fetchOrders(true), 25000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const sortedOrders = useMemo(
    () => [...orders].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
    [orders]
  );
  const activeOrders = useMemo(
    () => sortedOrders.filter((o) => ACTIVE_STATUSES.includes(o.status)),
    [sortedOrders]
  );
  const historyOrders = useMemo(
    () => sortedOrders.filter((o) => !ACTIVE_STATUSES.includes(o.status)),
    [sortedOrders]
  );
  const primaryActive = activeOrders[0];
  const extraActive = activeOrders.slice(1);

  return (
    <div className="min-h-screen bg-[#FAF6F0]">
      {!loading && primaryActive && (
        <LiveTracker
          order={primaryActive}
          extraCount={extraActive.length}
          onOpenDetail={setSelectedOrder}
        />
      )}

      <div className="mx-auto max-w-lg px-4 pb-10 pt-6">
        {!primaryActive && (
          <div className="mb-5">
            <h1 className="text-2xl font-extrabold tracking-tight text-[#2A1D14]">My Orders</h1>
            <p className="mt-1 text-[13px] text-[#8A7B6C]">Track every order from Mittal Dhaba</p>
          </div>
        )}

        {error && (
          <div className="mb-4 flex items-center justify-between rounded-2xl bg-[#F3E1DC] px-4 py-3 text-[13px] text-[#9B3B2C]">
            <span>Couldn&apos;t load your orders.</span>
            <button onClick={() => fetchOrders()} className="font-bold underline">
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className="space-y-2.5">
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </div>
        ) : sortedOrders.length === 0 ? (
          <EmptyState menuHref={menuHref} />
        ) : (
          <>
            {extraActive.length > 0 && (
              <>
                <p className="mb-2 px-1 text-[11px] font-bold uppercase tracking-wide text-[#8A7B6C]">
                  Also in progress
                </p>
                <div className="mb-5 space-y-2.5">
                  {extraActive.map((order) => (
                    <OrderRow key={order.id} order={order} onSelect={setSelectedOrder} />
                  ))}
                </div>
              </>
            )}

            <p className="mb-2 px-1 text-[11px] font-bold uppercase tracking-wide text-[#8A7B6C]">
              Order History
            </p>
            {historyOrders.length === 0 ? (
              <p className="px-1 text-[13px] text-[#8A7B6C]">No past orders yet.</p>
            ) : (
              <div className="space-y-2.5">
                {historyOrders.map((order) => (
                  <OrderRow key={order.id} order={order} onSelect={setSelectedOrder} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <AnimatePresence>
        {selectedOrder && (
          <OrderDetailSheet order={selectedOrder} onClose={() => setSelectedOrder(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Orders;