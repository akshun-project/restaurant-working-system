import { Routes, Route } from "react-router-dom";
import Contact from "../pages/Contact";
import Home from "../pages/Home";
import Menu from "../pages/Menu";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import Success from "../pages/Success";
import Admin from "../pages/Admin";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Orders from "../pages/Orders";
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/menu" element={<Menu />} />

      <Route path="/cart" element={<Cart />} />
      <Route path="/login" element={<Login />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/checkout" element={<Checkout />} />
       <Route path="/orders" element={<Orders />} />
      <Route path="/success" element={<Success />} />

      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
};

export default AppRoutes;
