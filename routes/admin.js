const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const router = express.Router();

router.post("/login", async (req, res) => {
  console.log("[admin/login] request body", req.body);
  try {
    const email = req.body.email ? String(req.body.email).trim().toLowerCase() : "";
    const password = req.body.password ? String(req.body.password) : "";
    console.log("[admin/login] normalized email", email, "password length", password.length);

    if (!email || !password) {
      console.log("[admin/login] missing email or password");
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const admin = await Admin.findOne({
      email,
    });
    console.log("[admin/login] admin found", !!admin, admin ? admin.email : null);

    if (!admin) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const validPassword = await bcrypt.compare(
      password,
      admin.password
    );
    console.log("[admin/login] bcrypt compare result", validPassword);

    if (!validPassword) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error",
    });
  }
});

module.exports = router;