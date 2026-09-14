const express = require("express");
const fs = require("node:fs/promises");
const path = require("node:path");
const { authenticate } = require("../middleware/auth");

const router = express.Router();
const productsFile = path.join(__dirname, "../data/products.json");
const ordersFile = path.join(__dirname, "../data/orders.json");

// client orders
router.post("/", authenticate, async (req, res) => {
  const items = req.body.items;
  const data = await fs.readFile(productsFile, "utf-8");
  const products = JSON.parse(data);
  let total = 0;

  const element = items.map((item) => {
    return products.find((product) => product.id === item.productId);
  });

  if (
    items.find((item, index) => {
      return item.quantity > element[index].stock;
    })
  ) {
    return res.status(400).json({
      message: "Not enough stock",
    });
  }

  items.forEach((item, index) => {
    total += element[index].price * item.quantity;
  });

  const updatedProducts = products.map((product) => {
    const item = items.find((item) => item.productId === product.id);

    if (item) {
      return {
        ...product,
        stock: product.stock - item.quantity,
      };
    }
    return product;
  });

  await fs.writeFile(productsFile, JSON.stringify(updatedProducts));

  const orderData = await fs.readFile(ordersFile, "utf-8");
  const orders = JSON.parse(orderData);

  const newOrder = {
    id: orders.length + 1,
    userId: req.user.id,
    items: items,
    total: total,
    createdAt: new Date().toISOString(),
  };
  const updatedOrders = [...orders, newOrder];

  await fs.writeFile(ordersFile, JSON.stringify(updatedOrders));
  res.status(201).json(newOrder);
});

// client order
router.get("/", authenticate, async (req, res) => {
  const data = await fs.readFile(ordersFile, "utf-8");
  const orders = JSON.parse(data);

  const ordersById = orders.filter((order) => order.userId === req.user.id);

  res.json(ordersById);
});

// client order by id
router.get("/:id", authenticate, async (req, res) => {
  const data = await fs.readFile(ordersFile, "utf-8");
  const orders = JSON.parse(data);

  const order = orders.find((order) => order.id === +req.params.id);

  if (!order) {
    return res.status(404).json({
      message: "Order not found",
    });
  }

  if (order.userId === req.user.id) {
    return res.json(order);
  } else if (req.user.role === "admin") {
    return res.json(order);
  } else {
    return res.status(403).json({
      message: "Forbidden",
    });
  }
});

module.exports = router;
