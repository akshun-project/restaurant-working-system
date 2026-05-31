 const db = require("../config/db");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");


// SIGNUP
exports.signup = (req, res) => {
  const {
    name,
    phone,
    password,
    address,
  } = req.body;

  // CHECK USER EXISTS
  const checkUserQuery =
    "SELECT * FROM users WHERE phone = ?";

  db.query(
    checkUserQuery,
    [phone],
    async (err, results) => {
      if (err) {
        console.log(err);

        return res.status(500).json({
          success: false,
          message: "Server Error",
        });
      }

      if (results.length > 0) {
        return res.status(400).json({
          success: false,
          message: "User already exists",
        });
      }

      // HASH PASSWORD
      const hashedPassword =
        await bcrypt.hash(password, 10);

      // INSERT USER
      const insertQuery = `
        INSERT INTO users
        (name, phone, password, address)
        VALUES (?, ?, ?, ?)
      `;

      db.query(
        insertQuery,
        [
          name,
          phone,
          hashedPassword,
          address,
        ],
        (err, result) => {
          if (err) {
            console.log(err);

            return res.status(500).json({
              success: false,
              message: "Signup failed",
            });
          }

          res.status(201).json({
            success: true,
            message: "Signup successful",
          });
        }
      );
    }
  );
};


// LOGIN
exports.login = (req, res) => {
  const { phone, password } = req.body;

  const query =
    "SELECT * FROM users WHERE phone = ?";

  db.query(
    query,
    [phone],
    async (err, results) => {
      if (err) {
        console.log(err);

        return res.status(500).json({
          success: false,
          message: "Server Error",
        });
      }

      if (results.length === 0) {
        return res.status(400).json({
          success: false,
          message: "User not found",
        });
      }

      const user = results[0];

      // CHECK PASSWORD
      const isMatch =
        await bcrypt.compare(
          password,
          user.password
        );

      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      // GENERATE JWT
      const token = jwt.sign(
        {
          id: user.id,
          role: user.role,
        },

        process.env.JWT_SECRET,

        {
          expiresIn: "7d",
        }
      );

      res.status(200).json({
        success: true,
        message: "Login successful",

        token,

        user: {
          id: user.id,
          name: user.name,
          phone: user.phone,
          address: user.address,
          role: user.role,
        },
      });
    }
  );
};