 const express = require("express");

const router = express.Router();

const db = require("../config/db");

const {
  verifyToken,
  verifyAdmin,
} = require("../middleware/authMiddleware");


// GET MENU
router.get("/menu", (req, res) => {
  const query = "SELECT * FROM menu_items";

  db.query(query, (err, results) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch menu",
      });
    }

    res.status(200).json({
      success: true,
      data: results,
    });
  });
});


// PLACE ORDER
router.post("/place-order", (req, res) => {
  const {
    customer_name,
    phone,
    address,
    landmark,
    notes,
    items,
    total_amount,
  } = req.body;

  const orderQuery = `
    INSERT INTO orders
    (
      customer_name,
      phone,
      address,
      landmark,
      notes,
      total_amount
    )
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    orderQuery,
    [
      customer_name,
      phone,
      address,
      landmark,
      notes,
      total_amount,
    ],

    (err, orderResult) => {
      if (err) {
        console.log(err);

        return res.status(500).json({
          success: false,
          message: "Order creation failed",
        });
      }

      const orderId =
        orderResult.insertId;

      // PREPARE ITEMS
      const orderItemsValues =
        items.map((item) => [
          orderId,
          item.name,
          item.quantity,
          item.price_full ||
            item.price,
        ]);

      const orderItemsQuery = `
        INSERT INTO order_items
        (
          order_id,
          item_name,
          quantity,
          price
        )
        VALUES ?
      `;

      db.query(
        orderItemsQuery,
        [orderItemsValues],

        (err, result) => {
          if (err) {
            console.log(err);

            return res.status(500).json({
              success: false,
              message:
                "Order items insertion failed",
            });
          }

          res.status(201).json({
            success: true,
            message:
              "Order placed successfully",
            order_id: orderId,
          });
        }
      );
    }
  );
});


// GET ORDERS (ADMIN ONLY)
router.get(
  "/orders",

  verifyToken,

  verifyAdmin,

  (req, res) => {
    const ordersQuery = `
      SELECT *
      FROM orders
      ORDER BY created_at DESC
    `;

    db.query(
      ordersQuery,

      async (err, orders) => {
        if (err) {
          console.log(err);

          return res.status(500).json({
            success: false,
            message:
              "Failed to fetch orders",
          });
        }

        // FETCH ITEMS
        const formattedOrders =
          await Promise.all(
            orders.map((order) => {
              return new Promise(
                (resolve, reject) => {
                  const itemsQuery = `
                    SELECT
                      item_name,
                      quantity,
                      price
                    FROM order_items
                    WHERE order_id = ?
                  `;

                  db.query(
                    itemsQuery,
                    [order.id],

                    (err, items) => {
                      if (err) {
                        reject(err);
                      } else {
                        resolve({
                          ...order,
                          items,
                        });
                      }
                    }
                  );
                }
              );
            })
          );

        res.status(200).json({
          success: true,
          data: formattedOrders,
        });
      }
    );
  }
);


// GET ALL MENU ITEMS (ADMIN)
router.get(
  "/admin/menu",

  verifyToken,

  verifyAdmin,

  (req, res) => {
    const query =
      "SELECT * FROM menu_items";

    db.query(query, (err, results) => {
      if (err) {
        console.log(err);

        return res.status(500).json({
          success: false,
          message:
            "Failed to fetch menu items",
        });
      }

      res.status(200).json({
        success: true,
        data: results,
      });
    });
  }
);

// UPDATE MENU ITEM PRICE
router.patch(
  "/admin/update-price/:id",

  verifyToken,

  verifyAdmin,

  (req, res) => {
    const itemId = req.params.id;

    const {
      price_half,
      price_full,
    } = req.body;

    const query = `
      UPDATE menu_items
      SET
        price_half = ?,
        price_full = ?
      WHERE id = ?
    `;

    db.query(
      query,
      [
        price_half,
        price_full,
        itemId,
      ],

      (err, result) => {
        if (err) {
          console.log(err);

          return res.status(500).json({
            success: false,
            message:
              "Failed to update prices",
          });
        }

        res.status(200).json({
          success: true,
          message:
            "Prices updated successfully",
        });
      }
    );
  }
);


// UPDATE STATUS
router.patch(
  "/update-order-status/:id",

  verifyToken,

  verifyAdmin,

  (req, res) => {
    const orderId =
      req.params.id;

    const { status } = req.body;

    const query = `
      UPDATE orders
      SET status = ?
      WHERE id = ?
    `;

    db.query(
      query,
      [status, orderId],

      (err, result) => {
        if (err) {
          console.log(err);

          return res.status(500).json({
            success: false,
            message:
              "Failed to update order status",
          });
        }

        res.status(200).json({
          success: true,
          message:
            "Order status updated successfully",
        });
      }
    );
  }
);

module.exports = router;