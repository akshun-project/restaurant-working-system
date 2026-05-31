 const express = require("express");
const cors = require("cors");

require("dotenv").config();
require("./config/db");

const app = express();

// ROUTES
const menuRoutes = require("./routes/menuRoutes");
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// API ROUTES
app.use("/", menuRoutes);
app.use("/", authRoutes);
app.use("/", orderRoutes);

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Mittal Dhaba Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});