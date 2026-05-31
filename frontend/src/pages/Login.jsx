 import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Phone, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { Toaster } from "react-hot-toast";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "phone"
          ? value.replace(/\D/g, "").slice(0, 10)
          : value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.phone || !formData.password) {
      return toast.error("Please fill all fields");
    }

    try {
      setLoading(true);

      const response = await API.post(
        "/login",
        formData
      );

      login(
        response.data.user,
        response.data.token
      );

      toast.success(
        `Welcome back, ${response.data.user.name}`
      );

      navigate("/");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-5">
      <div className="w-full max-w-md bg-white border border-zinc-200 rounded-3xl shadow-lg p-8">

        <div className="mb-8">
          <p className="text-orange-500 font-semibold text-sm uppercase tracking-wider">
            Mittal Dhaba
          </p>

          <h1 className="text-3xl font-bold text-zinc-900 mt-2">
            Welcome Back 👋
          </h1>

          <p className="text-zinc-500 mt-2 text-sm">
            Login to continue ordering your
            favourite dishes.
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >
          <div className="relative">
            <Phone
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full h-14 pl-12 pr-4 rounded-xl border border-zinc-200 focus:border-orange-500 outline-none transition"
            />
          </div>

          <div className="relative">
            <Lock
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
            />

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full h-14 pl-12 pr-12 rounded-xl border border-zinc-200 focus:border-orange-500 outline-none transition"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500"
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>

          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-sm text-orange-500 hover:text-orange-600"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="text-center text-zinc-500 text-sm mt-6">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-orange-500 font-semibold"
          >
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;