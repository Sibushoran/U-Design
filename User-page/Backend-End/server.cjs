// server.js (CommonJS version)
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Resend } = require("resend");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./utils/cloudinary.js");

const User = require("./models/User.js");
const Product = require("./models/Product.js");

const path = require("path");

// __dirname is available by default in CommonJS
const app = express();
const PORT = process.env.PORT || 5000;
const resend = new Resend(process.env.RESEND_API_KEY);

// =================== MIDDLEWARE ===================
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174','http://localhost:5175',
    'https://shopnest-3iv8-ixz1py1h8-sibushorans-projects.vercel.app', 'https://shopnest-3iv8.vercel.app',  // 👈 add this
    'https://shopnest.vercel.app','https://u-design-os78dni1q-sibushorans-projects.vercel.app','https://shopnest-git-master-sibushorans-projects.vercel.app',  ],
  credentials: true,
}));
app.use(express.json());
app.use(bodyParser.json());
app.get('/favicon.ico', (req, res) => res.status(204).end());

app.use(session({
  secret: 'otp_secret_key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions',
  }),
  cookie: { secure: false }, // Set true if HTTPS
}));

// Serve uploaded images folder (if any local uploads)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// =================== DATABASE ===================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Error:", err.message));

// =================== AUTH ROUTES ===================
const otpStore = {};

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
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

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
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

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
    console.error("OTP send error:", error);
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
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "ecommerce-products",
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [{ width: 800, height: 800, crop: "limit" }],
  },
});
const upload = multer({ storage });

app.get("/api/products-and-users", async (req, res) => {
  try {
    const products = await Product.find();
    const users = await User.find();

    const productsWithImageUrls = products.map((product) => {
      const productObj = product.toObject();
      return {
        ...productObj,
        image: productObj.image
          ? productObj.image.startsWith("http")
            ? productObj.image
            : `http://localhost:${PORT}${productObj.image.startsWith("/") ? "" : "/"}${productObj.image}`
          : "",
      };
    });

    res.json({
      products: productsWithImageUrls,
      users,
      promoBanners: [],
      promo50Off: {},
      categories: [],
      trendingProducts: [],
      brands: [...new Set(products.map((p) => p.brand))],
      ratings: [...new Set(products.map((p) => p.rating))].sort((a, b) => b - a),
    });
  } catch (err) {
    console.error("Error fetching products and users:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    const productsWithImageUrls = products.map((product) => {
      const productObj = product.toObject();
      return {
        ...productObj,
        image: productObj.image
          ? productObj.image.startsWith("http")
            ? productObj.image
            : `http://localhost:${PORT}${productObj.image.startsWith("/") ? "" : "/"}${productObj.image}`
          : "",
      };
    });
    const categories = [...new Set(products.map((p) => p.category))].filter(Boolean);
    res.json({
      products: productsWithImageUrls,
      promoBanners: [],
      promo50Off: {},
      categories,
      trendingProducts: [],
      brands: [...new Set(products.map((p) => p.brand))],
      ratings: [...new Set(products.map((p) => p.rating))].sort((a, b) => b - a),
    });
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/products", upload.single("image"), async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);
    console.log("REQ FILE:", req.file);

    // Parse colors array
    const colorsArray = req.body.colors
      ? req.body.colors.split(",").map(c => c.trim()).filter(Boolean)
      : [];

    // Use image URL from req.file.path if file uploaded, else from req.body.image
    const imageUrl = req.file ? req.file.path : (req.body.image || "");

    const newProduct = new Product({
      ...req.body,
      colors: colorsArray,
      image: imageUrl,
    });

    console.log("Saving product:", newProduct);

    await newProduct.save();
    res.status(201).json({ message: "✅ Product added", product: newProduct });
  } catch (err) {
    console.error("❌ Failed to add product:", err);
    res.status(500).json({ error: "Failed to add product", details: err.message });
  }
});

app.delete("/api/products/:id", async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "✅ Product deleted" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/categories", async (req, res) => {
  try {
    const products = await Product.find();
    const categories = [...new Set(products.map((p) => p.category))].filter(Boolean);
    res.json({ categories });
  } catch (err) {
    console.error("Error fetching categories:", err);
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
          ? productObj.image.startsWith("http")
            ? productObj.image
            : `http://localhost:${PORT}${productObj.image.startsWith("/") ? "" : "/"}${productObj.image}`
          : "",
      };
    });

    res.json({ products: productsWithImageUrls });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// =================== START SERVER ===================
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
