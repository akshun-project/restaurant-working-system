 import { motion } from "framer-motion";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";

export default function Success() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    total = 0,
    itemCount = 0,
    customerName = "Customer",
    address = "Address not available",
  } = location.state || {};

  return (
    <div className="min-h-screen bg-[#fafaf9] px-4 py-8">
      <div className="max-w-2xl mx-auto">

        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 text-center border border-gray-100 shadow-sm"
        >
          <div className="w-24 h-24 mx-auto rounded-full bg-green-100 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-green-600"
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
          </div>

          <h1 className="mt-6 text-3xl font-bold text-gray-900">
            Order Confirmed 🎉
          </h1>

          <p className="mt-3 text-gray-500">
            Thanks for ordering from
            <span className="font-semibold text-orange-500">
              {" "}Mittal Dhaba
            </span>
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Our kitchen has started preparing your food.
          </p>
        </motion.div>

        {/* Order Status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-6 mt-5 border border-gray-100 shadow-sm"
        >
          <h2 className="font-bold text-gray-900 mb-6">
            Order Status
          </h2>

          <div className="space-y-5">

            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                ✓
              </div>

              <div>
                <p className="font-semibold">
                  Order Received
                </p>

                <p className="text-sm text-gray-500">
                  We've received your order
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-orange-500 animate-pulse"></div>

              <div>
                <p className="font-semibold">
                  Preparing Food
                </p>

                <p className="text-sm text-gray-500">
                  Our chefs are preparing your meal
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 opacity-50">
              <div className="w-8 h-8 rounded-full border-2 border-gray-300"></div>

              <div>
                <p className="font-semibold">
                  Out For Delivery
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 opacity-50">
              <div className="w-8 h-8 rounded-full border-2 border-gray-300"></div>

              <div>
                <p className="font-semibold">
                  Delivered
                </p>
              </div>
            </div>

          </div>
        </motion.div>

        {/* Delivery Details */}
        <div className="bg-white rounded-3xl p-6 mt-5 border border-gray-100 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-4">
            Delivery Details
          </h2>

          <div className="space-y-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400">
                Customer
              </p>

              <p className="font-semibold">
                {customerName}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400">
                Delivery Address
              </p>

              <p className="text-gray-700">
                {address}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400">
                Estimated Delivery
              </p>

              <p className="font-semibold text-green-600">
                25 - 35 Minutes
              </p>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-3xl p-6 mt-5 border border-gray-100 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-4">
            Order Summary
          </h2>

          <div className="flex justify-between mb-3">
            <span className="text-gray-500">
              Total Items
            </span>

            <span className="font-semibold">
              {itemCount}
            </span>
          </div>

          <div className="flex justify-between mb-3">
            <span className="text-gray-500">
              Payment Method
            </span>

            <span className="font-semibold">
              Cash on Delivery
            </span>
          </div>

          <div className="border-t pt-4 mt-4 flex justify-between">
            <span className="font-bold">
              Amount Paid
            </span>

            <span className="font-bold text-orange-500 text-xl">
              ₹{total}
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">

          <button
            onClick={() => navigate("/orders")}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-2xl transition-all"
          >
            View My Orders
          </button>

          <button
            onClick={() => navigate("/menu")}
            className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-bold py-4 rounded-2xl transition-all"
          >
            Order More Food
          </button>

        </div>
      </div>
    </div>
  );
}