const express = require("express");
const fs = require("node:fs/promises");
const path = require("node:path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();
const usersFile = path.join(__dirname, "../data/users.json");

// register
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const data = await fs.readFile(usersFile, "utf-8");

  const users = JSON.parse(data);

  const existingUser = users.find((el) => el.username === username);
  if (existingUser) {
    return res.status(409).json({
      message: "Username already exists",
    });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = {
    id: users.length + 1,
    username: username,
    passwordHash: passwordHash,
    role: "customer",
  };

  const updateUsers = [...users, newUser];

  await fs.writeFile(usersFile, JSON.stringify(updateUsers));
  const userResponse = {
    id: newUser.id,
    username: newUser.username,
    role: newUser.role,
  };
  res.status(201).json(userResponse);
});

// login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const data = await fs.readFile(usersFile, "utf-8");
  const users = JSON.parse(data);

  const user = users.find((el) => el.username === username);

  if (!user) {
    return res.status(401).json({
      message: "Invalid username or password",
    });
  }
  const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordCorrect) {
    return res.status(401).json({
      message: "Invalid username or password",
    });
  }

  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role,
    },
    "secret_key",
    {
      expiresIn: "1h",
    }
  );
  res.json({ token });
});

module.exports = router;
