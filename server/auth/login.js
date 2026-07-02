const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const users = require("../users");

const router = express.Router();

const SECRET = process.env.JWT_SECRET || "ops-dashboard-secret";

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email);

  if (!user) {
    return res.status(401).json({
      message: "User not found",
    });
  }

  const validPassword = bcrypt.compareSync(password, user.password);

  if (!validPassword) {
    return res.status(401).json({
      message: "Invalid password",
    });
  }

  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
      email: user.email,
    },
    SECRET,
    {
      expiresIn: "1d",
    }
  );

  res.json({
    message: "Login Successful",
    token,
    role: user.role,
    name: user.name,
  });
});

module.exports = router;