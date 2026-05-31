 const db = require("../config/db");

// CREATE ORDER
exports.createOrder = (req, res) => {
  console.log("BODY:", req.body);
  console.log("USER:", req.user);

  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "User not authenticated",
    });
  }

  const {
    customer_name,
    phone,
    address,
    landmark,
    notes,
    total_amount,
    items,
  } = req.body;

  const user_id = req.user.id;

  const orderQuery = `
    INSERT INTO orders (
      user_id,
      customer_name,
      phone,
      address,
      landmark,
      notes,
      total_amount,
      status
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, 'Pending')
  `;

  db.query(
    orderQuery,
    [
      user_id,
      customer_name,
      phone,
      address,
      landmark,
      notes,
      total_amount,
    ],
    (err, result) => {
      if (err) {
        console.log("ORDER ERROR:", err);

        return res.status(500).json({
          success: false,
          message: "Failed to create order",
        });
      }

      const orderId = result.insertId;

      if (!items || items.length === 0) {
        return res.status(201).json({
          success: true,
          message: "Order placed successfully",
          orderId,
        });
      }

      const itemValues = items.map((item) => [
        orderId,
        item.name,
        item.quantity,
        item.price,
      ]);

      const itemQuery = `
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
        itemQuery,
        [itemValues],
        (itemErr) => {
          if (itemErr) {
            console.log(
              "ITEM ERROR:",
              itemErr
            );

            return res.status(500).json({
              success: false,
              message:
                "Failed to save order items",
            });
          }

          return res.status(201).json({
            success: true,
            message:
              "Order placed successfully",
            orderId,
          });
        }
      );
    }
  );
};

// GET MY ORDERS
 exports.getMyOrders = (req, res) => {
  const userId = req.user.id;

  const query = `
    SELECT
      o.*,
      oi.item_name,
      oi.quantity,
      oi.price
    FROM orders o
    LEFT JOIN order_items oi
    ON o.id = oi.order_id
    WHERE o.user_id = ?
    ORDER BY o.created_at DESC
  `;

  db.query(
    query,
    [userId],
    (err, results) => {
      if (err) {
        console.log(err);

        return res.status(500).json({
          success: false,
          message: "Failed to fetch orders",
        });
      }

      const ordersMap = {};

      results.forEach((row) => {
        if (!ordersMap[row.id]) {
          ordersMap[row.id] = {
            id: row.id,
            status: row.status,
            total_amount: row.total_amount,
            address: row.address,
            created_at: row.created_at,
            items: [],
          };
        }

        if (row.item_name) {
          ordersMap[row.id].items.push({
            name: row.item_name,
            quantity: row.quantity,
            price: row.price,
          });
        }
      });

      return res.status(200).json({
        success: true,
        orders: Object.values(ordersMap),
      });
    }
  );
};