import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import API from "../services/api";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await API.get("/orders/my-orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(response.data.orders || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700";

      case "Preparing":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-orange-100 text-orange-700";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-lg font-semibold">Loading Orders...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf9] px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900">My Orders</h1>

          <p className="text-gray-500 mt-2">Track all your food orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm">
            <h2 className="text-xl font-bold">No Orders Yet</h2>

            <p className="text-gray-500 mt-2">
              Your placed orders will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <motion.div
                key={order.id}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="bg-white rounded-3xl p-6 shadow-sm border border-zinc-100"
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h2 className="text-lg font-bold">Order #{order.id}</h2>

                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>

                  <span
                    className={`px-4 py-2 rounded-full text-xs font-bold ${getStatusColor(
                      order.status,
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Delivery Address</p>

                    <p className="font-medium">{order.address}</p>

                    <div className="mt-4 border-t pt-4">
                      <h4 className="font-semibold text-sm mb-2">
                        Ordered Items
                      </h4>

                      <div className="space-y-2">
                        {order.items?.map((item, index) => (
                          <div
                            key={index}
                            className="flex justify-between text-sm"
                          >
                            <span>{item.name}</span>

                            <span className="font-medium">
                              × {item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-gray-500">Total Amount</p>

                    <p className="text-2xl font-black text-orange-500">
                      ₹{order.total_amount}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
