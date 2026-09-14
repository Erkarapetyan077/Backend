const express = require("express");
const fs = require("node:fs/promises");
const path = require("node:path");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();
const productsFile = path.join(__dirname, "../data/products.json");

// products
router.get("/", async (req, res) => {
  const data = await fs.readFile(productsFile, "utf-8");
  const products = JSON.parse(data);
  const category = req.query.category;
  const sort = req.query.sort;
  let result = products;
  if (category) {
    result = result.filter((el) => el.category === category);
  }
  if (sort) {
    result = result.sort((a, b) => a.price - b.price);
  }
  res.json(result);
});

router.get("/:id", async (req, res) => {
  const data = await fs.readFile(productsFile, "utf-8");
  const products = JSON.parse(data);
  const product = products.find((el) => el.id === +req.params.id);
  product
    ? res.json(product)
    : res.status(404).json({
        message: "product not found",
      });
});

router.post("/", authenticate, authorize("admin"), async (req, res) => {
  const newProduct = req.body;
  const data = await fs.readFile(productsFile, "utf-8");
  const products = JSON.parse(data);
  const updatedProducts = [...products, newProduct];

  await fs.writeFile(productsFile, JSON.stringify(updatedProducts));
  res.status(201).json(newProduct);
});

// for admin
router.put("/:id", authenticate, authorize("admin"), async (req, res) => {
  const data = await fs.readFile(productsFile, "utf-8");
  const products = JSON.parse(data);
  const product = products.find((el) => el.id === +req.params.id);
  const element = req.body;

  if (product) {
    const newProduct = {
      id: product.id,
      name: element.name,
      price: element.price,
      category: element.category,
      stock: element.stock,
    };

    const updatedProducts = products.map((el) => {
      if (el.id === +req.params.id) {
        return newProduct;
      }
      return el;
    });

    await fs.writeFile(productsFile, JSON.stringify(updatedProducts));
    res.status(200).json(newProduct);
  } else {
    res.status(404).json({
      message: "product not found",
    });
  }
});

// delete product
router.delete("/:id", authenticate, authorize("admin"), async (req, res) => {
  const data = await fs.readFile(productsFile, "utf-8");
  const products = JSON.parse(data);
  const product = products.find((el) => el.id === +req.params.id);

  if (product) {
    const allProducts = products.filter((el) => el.id !== product.id);
    await fs.writeFile(productsFile, JSON.stringify(allProducts));
    res.status(204).send();
  } else {
    res.status(404).json({
      message: "product not found",
    });
  }
});

module.exports = router;
