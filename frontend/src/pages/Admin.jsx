 import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import {
  ShoppingBag,
  IndianRupee,
  Clock3,
  ChefHat,
  PackageCheck,
  CheckCircle2,
  Phone,
  MapPin,
  ChevronDown,
  Wifi,
  UtensilsCrossed,
  LayoutDashboard,
  ClipboardList,
  Save,
  Loader2,
} from "lucide-react";

// ─── Skeleton Loader ────────────────────────────────────────────────────────
const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-amber-100/60 rounded-2xl ${className}`} />
);

// ─── Status Config ───────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  Pending:   { bg: "bg-amber-100",   text: "text-amber-700",  dot: "bg-amber-500"  },
  Preparing: { bg: "bg-blue-100",    text: "text-blue-700",   dot: "bg-blue-500"   },
  Delivered: { bg: "bg-emerald-100", text: "text-emerald-700",dot: "bg-emerald-500"},
  Cancelled: { bg: "bg-red-100",     text: "text-red-600",    dot: "bg-red-500"    },
};
const ALL_STATUSES = ["Pending", "Preparing", "Delivered", "Cancelled"];

// ─── Compact Order Card ───────────────────────────────────────────────────────
const OrderCard = ({ order, onUpdateStatus }) => {
  const [expanded, setExpanded] = useState(false);
  const [updating, setUpdating] = useState(false);
  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.Pending;

  const handleStatus = async (status) => {
    setUpdating(true);
    await onUpdateStatus(order.id, status);
    setUpdating(false);
  };

  const timeStr = new Date(order.created_at).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl border border-amber-50 shadow-sm overflow-hidden"
      style={{ boxShadow: "0 2px 16px rgba(180,100,20,0.07)" }}
    >
      {/* Collapsed Row */}
      <button
        onClick={() => setExpanded((p) => !p)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left min-h-[64px]"
      >
        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-black text-zinc-900 text-sm">#{order.id}</span>
            <span className="font-semibold text-zinc-700 text-sm truncate">{order.customer_name}</span>
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-xs text-zinc-400">{timeStr}</span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}>
              {order.status}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="font-black text-zinc-900">₹{order.total_amount}</span>
          <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={16} className="text-zinc-400" />
          </motion.div>
        </div>
      </button>

      {/* Expanded */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="expanded"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-4 border-t border-amber-50 pt-4">
              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`tel:${order.phone}`}
                  className="flex items-center gap-2 bg-zinc-50 rounded-2xl px-3 py-2.5 min-h-[44px]"
                >
                  <Phone size={14} className="text-amber-600 flex-shrink-0" />
                  <span className="text-sm font-semibold text-zinc-700 truncate">{order.phone}</span>
                </a>
                <div className="flex items-start gap-2 bg-zinc-50 rounded-2xl px-3 py-2.5">
                  <MapPin size={14} className="text-amber-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-zinc-600 line-clamp-2">{order.address}</span>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Items</p>
                {order.items?.map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-zinc-50 last:border-0">
                    <div>
                      <p className="font-semibold text-zinc-900 text-sm">{item.item_name}</p>
                      <p className="text-xs text-zinc-400 mt-0.5">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-bold text-zinc-900">₹{item.price}</span>
                  </div>
                ))}
              </div>

              {/* Status Chips */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {ALL_STATUSES.map((s) => {
                    const c = STATUS_CONFIG[s];
                    const active = order.status === s;
                    return (
                      <button
                        key={s}
                        disabled={updating}
                        onClick={() => handleStatus(s)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold min-h-[44px] transition-all duration-200 flex items-center gap-1.5 ${
                          active
                            ? `${c.bg} ${c.text} ring-2 ring-offset-1 ring-amber-400`
                            : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
                        }`}
                      >
                        {updating && active && <Loader2 size={12} className="animate-spin" />}
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── Menu Item Card ───────────────────────────────────────────────────────────
const MenuCard = ({ item, onChange, onSave, isDirty }) => {
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(item);
    setSaving(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl p-5 border border-amber-50 shadow-sm"
      style={{ boxShadow: "0 2px 16px rgba(180,100,20,0.07)" }}
    >
      <div className="flex items-start justify-between gap-2 mb-4">
        <div className="min-w-0">
          <h3 className="font-black text-zinc-900 text-base leading-tight truncate">{item.name}</h3>
          <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full mt-1 inline-block">
            {item.category}
          </span>
        </div>
        <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
          <UtensilsCrossed size={16} className="text-amber-600" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Half</label>
          <div className="relative mt-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm font-bold">₹</span>
            <input
              type="number"
              value={item.price_half || ""}
              onChange={(e) => onChange(item.id, "price_half", e.target.value)}
              className="w-full h-11 rounded-xl border border-zinc-200 pl-7 pr-3 text-sm font-semibold text-zinc-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all"
              placeholder="—"
            />
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Full</label>
          <div className="relative mt-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm font-bold">₹</span>
            <input
              type="number"
              value={item.price_full || ""}
              onChange={(e) => onChange(item.id, "price_full", e.target.value)}
              className="w-full h-11 rounded-xl border border-zinc-200 pl-7 pr-3 text-sm font-semibold text-zinc-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all"
              placeholder="—"
            />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isDirty && (
          <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={handleSave}
            disabled={saving}
            className="w-full h-11 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors duration-200"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? "Saving…" : "Save Prices"}
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── Dashboard KPI Card ───────────────────────────────────────────────────────
const KPICard = ({ icon: Icon, label, value, color, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.35 }}
    className="bg-white rounded-3xl p-5 border border-amber-50 shadow-sm flex flex-col gap-3"
    style={{ boxShadow: "0 2px 16px rgba(180,100,20,0.07)" }}
  >
    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${color}`}>
      <Icon size={22} />
    </div>
    <div>
      <p className="text-2xl font-black text-zinc-900 leading-none">{value}</p>
      <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mt-1.5">{label}</p>
    </div>
  </motion.div>
);

// ─── Empty State ─────────────────────────────────────────────────────────────
const EmptyState = ({ icon: Icon, title, subtitle }) => (
  <div className="flex flex-col items-center justify-center py-16 gap-4">
    <div className="w-16 h-16 rounded-3xl bg-amber-50 flex items-center justify-center">
      <Icon size={28} className="text-amber-400" />
    </div>
    <div className="text-center">
      <p className="font-black text-zinc-800 text-lg">{title}</p>
      <p className="text-zinc-400 text-sm mt-1">{subtitle}</p>
    </div>
  </div>
);

// ─── Main Admin Component ─────────────────────────────────────────────────────
const Admin = () => {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [dirtyItems, setDirtyItems] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [orderFilter, setOrderFilter] = useState("All");

  if (!user || user.role !== "admin") return <Navigate to="/login" />;

  const fetchOrders = useCallback(async () => {
    try {
      const response = await API.get("/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data.data);
    } catch (error) {
      console.log(error);
    }
  }, [token]);

  const fetchMenuItems = useCallback(async () => {
    try {
      const response = await API.get("/admin/menu", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMenuItems(response.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const updateStatus = async (id, status) => {
    try {
      await API.patch(
        `/update-order-status/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders();
    } catch (error) {
      console.log(error);
    }
  };

  const updatePrice = async (item) => {
    try {
      await API.patch(
        `/admin/update-price/${item.id}`,
        { price_half: item.price_half, price_full: item.price_full },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDirtyItems((prev) => {
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handlePriceChange = (id, field, value) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
    setDirtyItems((prev) => new Set(prev).add(id));
  };

  useEffect(() => {
    fetchOrders();
    fetchMenuItems();
    const interval = setInterval(fetchOrders, 15000);
    return () => clearInterval(interval);
  }, []);

  // Stats
  const totalRevenue = orders.reduce((acc, o) => acc + Number(o.total_amount), 0);
  const pendingOrders = orders.filter((o) => o.status === "Pending").length;
  const deliveredOrders = orders.filter((o) => o.status === "Delivered").length;

  // Filtered orders
  const filteredOrders =
    orderFilter === "All" ? orders : orders.filter((o) => o.status === orderFilter);

  // Date
  const dateStr = new Date().toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "orders",    label: "Orders",    icon: ClipboardList  },
    { id: "menu",      label: "Menu",      icon: ChefHat        },
  ];

  return (
    <div
      className="min-h-screen bg-[#fdf8f3] font-sans"
      style={{ fontFamily: "'DM Sans', 'Nunito', system-ui, sans-serif" }}
    >
      {/* ── Sticky Header ──────────────────────────────── */}
      <header
        className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-amber-100"
        style={{ boxShadow: "0 1px 12px rgba(180,100,20,0.06)" }}
      >
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black text-base flex-shrink-0">
              {user?.name?.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="font-black text-zinc-900 text-sm leading-none truncate">{user?.name}</p>
              <p className="text-xs text-zinc-400 mt-0.5">{dateStr}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full flex-shrink-0">
            <Wifi size={12} />
            <span className="text-xs font-bold">Live</span>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="max-w-2xl mx-auto px-4 pb-0">
          <div className="flex gap-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-bold border-b-2 transition-all duration-200 min-h-[44px] ${
                  activeTab === tab.id
                    ? "border-amber-500 text-amber-600"
                    : "border-transparent text-zinc-400"
                }`}
              >
                <tab.icon size={15} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ── Main Content ────────────────────────────────── */}
      <main className="max-w-2xl mx-auto px-4 pt-6 pb-28">
        <AnimatePresence mode="wait">
          {/* ── DASHBOARD TAB ── */}
          {activeTab === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-6">
                <h1 className="text-3xl font-black text-zinc-900">Dashboard</h1>
                <p className="text-zinc-400 mt-1 text-sm">Mittal Dhaba — Today's overview</p>
              </div>

              {loading ? (
                <div className="grid grid-cols-2 gap-4">
                  {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32" />)}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <KPICard icon={ShoppingBag}   label="Total Orders"    value={orders.length}    color="bg-amber-100 text-amber-600"   delay={0}    />
                    <KPICard icon={IndianRupee}   label="Revenue"         value={`₹${totalRevenue}`} color="bg-emerald-100 text-emerald-600" delay={0.05} />
                    <KPICard icon={Clock3}        label="Pending"         value={pendingOrders}    color="bg-yellow-100 text-yellow-600" delay={0.1}  />
                    <KPICard icon={CheckCircle2}  label="Delivered"       value={deliveredOrders}  color="bg-blue-100 text-blue-600"     delay={0.15} />
                  </div>

                  {/* Recent Orders Snippet */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-black text-zinc-900 text-lg">Recent Orders</h2>
                      <button
                        onClick={() => setActiveTab("orders")}
                        className="text-amber-600 font-bold text-sm min-h-[44px] px-2 flex items-center"
                      >
                        See all →
                      </button>
                    </div>
                    <div className="space-y-3">
                      {orders.slice(0, 3).map((order) => {
                        const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.Pending;
                        return (
                          <div
                            key={order.id}
                            className="bg-white rounded-2xl px-4 py-3 flex items-center justify-between border border-amber-50"
                          >
                            <div>
                              <p className="font-bold text-zinc-900 text-sm">#{order.id} · {order.customer_name}</p>
                              <p className="text-xs text-zinc-400 mt-0.5">
                                {new Date(order.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-black text-zinc-900 text-sm">₹{order.total_amount}</span>
                              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.text}`}>
                                {order.status}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                      {orders.length === 0 && (
                        <EmptyState icon={ShoppingBag} title="No orders yet" subtitle="Orders will appear here" />
                      )}
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* ── ORDERS TAB ── */}
          {activeTab === "orders" && (
            <motion.div
              key="orders"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-5">
                <h1 className="text-3xl font-black text-zinc-900">Orders</h1>
                <p className="text-zinc-400 mt-1 text-sm">{orders.length} total orders</p>
              </div>

              {/* Filter Chips */}
              <div className="flex gap-2 mb-5 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
                {["All", ...ALL_STATUSES].map((f) => {
                  const cfg = STATUS_CONFIG[f];
                  const active = orderFilter === f;
                  return (
                    <button
                      key={f}
                      onClick={() => setOrderFilter(f)}
                      className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold min-h-[44px] transition-all duration-200 ${
                        active
                          ? f === "All"
                            ? "bg-zinc-900 text-white"
                            : `${cfg.bg} ${cfg.text} ring-2 ring-offset-1 ring-amber-300`
                          : "bg-white text-zinc-500 border border-zinc-200"
                      }`}
                    >
                      {f}
                      {f !== "All" && (
                        <span className="ml-1.5 opacity-60 text-xs">
                          {orders.filter((o) => o.status === f).length}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {loading ? (
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-16" />)}
                </div>
              ) : filteredOrders.length === 0 ? (
                <EmptyState icon={ClipboardList} title="No orders" subtitle={`No ${orderFilter !== "All" ? orderFilter.toLowerCase() : ""} orders found`} />
              ) : (
                <div className="space-y-3">
                  {filteredOrders.map((order) => (
                    <OrderCard key={order.id} order={order} onUpdateStatus={updateStatus} />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ── MENU TAB ── */}
          {activeTab === "menu" && (
            <motion.div
              key="menu"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-5">
                <h1 className="text-3xl font-black text-zinc-900">Menu</h1>
                <p className="text-zinc-400 mt-1 text-sm">{menuItems.length} items · tap to edit prices</p>
              </div>

              {loading ? (
                <div className="grid grid-cols-2 gap-4">
                  {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-44" />)}
                </div>
              ) : menuItems.length === 0 ? (
                <EmptyState icon={ChefHat} title="No menu items" subtitle="Menu items will appear here" />
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {menuItems.map((item) => (
                    <MenuCard
                      key={item.id}
                      item={item}
                      onChange={handlePriceChange}
                      onSave={updatePrice}
                      isDirty={dirtyItems.has(item.id)}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ── Bottom Nav ─────────────────────────────────── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-amber-100"
        style={{ boxShadow: "0 -4px 20px rgba(180,100,20,0.08)", paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="max-w-2xl mx-auto flex">
          {tabs.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex-1 flex flex-col items-center justify-center gap-1 py-3 min-h-[64px] transition-all duration-200"
              >
                <motion.div
                  animate={{ scale: active ? 1.15 : 1, y: active ? -1 : 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  <tab.icon
                    size={22}
                    className={active ? "text-amber-600" : "text-zinc-400"}
                    strokeWidth={active ? 2.5 : 1.8}
                  />
                </motion.div>
                <span
                  className={`text-xs font-bold transition-colors duration-200 ${
                    active ? "text-amber-600" : "text-zinc-400"
                  }`}
                >
                  {tab.label}
                </span>
                {active && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute top-0 w-10 h-0.5 bg-amber-500 rounded-full"
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Admin;