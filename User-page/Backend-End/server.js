require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Resend } = require("resend");
const multer = require("multer");
const path = require("path");

const User = require("./models/User");
const Product = require("./models/Product");

const app = express();
const PORT = process.env.PORT || 5000;
const resend = new Resend(process.env.RESEND_API_KEY);

// =================== MIDDLEWARE ===================
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
}));
app.use(express.json());
app.use(bodyParser.json());
app.use(session({
  secret: 'otp_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
}));

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// =================== DATABASE ===================
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Error:", err.message));

// =================== AUTH ROUTES ===================
const otpStore = {};

// Signup
app.post("/api/auth/signup", async (req, res) => {
  const { email, password } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Login
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// OTP Email Login
app.post("/api/send-otp", async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = otp;

  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Your OTP Code",
      html: `<p>Your OTP is <strong>${otp}</strong></p>`,
    });
    res.json({ message: "OTP sent to email" });
  } catch (error) {
    res.status(500).json({ message: "Failed to send OTP", error });
  }
});

app.post("/api/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  if (otpStore[email] === otp) {
    req.session.user = email;
    delete otpStore[email];
    res.json({ message: "OTP verified" });
  } else {
    res.status(400).json({ message: "Invalid OTP" });
  }
});

app.get("/api/check-auth", (req, res) => {
  if (req.session.user) {
    res.json({ authenticated: true, user: req.session.user });
  } else {
    res.json({ authenticated: false });
  }
});

app.post("/api/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out" });
  });
});

// =================== PRODUCT ROUTES ===================

// Multer setup for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Get all products and users
app.get("/api/products-and-users", async (req, res) => {
  try {
    const products = await Product.find();
    const users = await User.find();

    const productsWithImageUrls = products.map((product) => {
      const productObj = product.toObject();
      return {
        ...productObj,
        image: productObj.image
          ? `http://localhost:${PORT}${productObj.image.startsWith("/") ? "" : "/"}${productObj.image}`
          : "",
      };
    });

    res.json({
      products: productsWithImageUrls,
      users: users,
      promoBanners: [],
      promo50Off: {},
      categories: [],
      trendingProducts: [],
      brands: [...new Set(products.map((p) => p.brand))],
      ratings: [...new Set(products.map((p) => p.rating))].sort((a, b) => b - a),
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get all products
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();

    const productsWithImageUrls = products.map((product) => {
      const productObj = product.toObject();
      return {
        ...productObj,
        image: productObj.image
          ? `http://localhost:${PORT}${productObj.image.startsWith("/") ? "" : "/"}${productObj.image}`
          : "",
      };
    });
     const categories = [...new Set(products.map((p) => p.category))].filter(Boolean);
    console.log("📦 Categories:", categories);
    res.json({
      products: productsWithImageUrls,
      promoBanners: [],
      promo50Off: {},
      categories: categories,
      trendingProducts: [],
      brands: [...new Set(products.map((p) => p.brand))],
      ratings: [...new Set(products.map((p) => p.rating))].sort((a, b) => b - a),
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Add product
app.post("/api/products", upload.single("image"), async (req, res) => {
  try {
    const newProduct = new Product({
      ...req.body,
      image: req.file ? `/uploads/${req.file.filename}` : "",
    });
    await newProduct.save();
    res.status(201).json({ message: "✅ Product added", product: newProduct });
  } catch (err) {
    res.status(500).json({ error: "Failed to add product" });
  }
});

// Delete product
app.delete("/api/products/:id", async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "✅ Product deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get all categories
app.get("/api/categories", async (req, res) => {
  try {
    const products = await Product.find();
    const categories = [...new Set(products.map((p) => p.category))].filter(Boolean); // Get unique categories
    res.json({ categories });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
app.get("/api/search", async (req, res) => {
  const { q } = req.query;
  try {
    const products = await Product.find({
      title: { $regex: q, $options: "i" },
    });

    const productsWithImageUrls = products.map((product) => {
      const productObj = product.toObject();
      return {
        ...productObj,
        image: productObj.image
          ? `http://localhost:${PORT}${productObj.image.startsWith("/") ? "" : "/"}${productObj.image}`
          : "",
      };
    });

    res.json({ products: productsWithImageUrls });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// =================== START SERVER ===================
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
