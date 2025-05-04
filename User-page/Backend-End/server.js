require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const session = require("express-session");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Resend } = require("resend");

const Product = require("./models/Product"); // Uses main DB

const app = express();
const PORT = process.env.PORT ||5001;
const resend = new Resend(process.env.RESEND_API_KEY);

// Middleware
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
app.use("/uploads", express.static(path.join(__dirname, "../../Admin-page/Backend-End/uploads")));

// Connect to MAIN DB for Products
mongoose.connect(process.env.MONGO_URI_MAIN, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("✅ Connected to Main MongoDB (Products)"))
  .catch((error) => console.log("❌ Main MongoDB connection error:", error));

// Connect to AUTH DB for Users
const authConnection = mongoose.createConnection(process.env.MONGO_URI_AUTH, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
authConnection.on("connected", () => console.log("✅ Connected to Auth MongoDB (Users)"));
authConnection.on("error", (err) => console.error("❌ Auth MongoDB connection error:", err));

// Use auth DB for User model
const userSchema = require("./models/UserSchema");
const User = authConnection.model("User", userSchema);

// ======= PRODUCT ROUTES =======
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    const productsWithImageUrls = products.map((product) => ({
      ...product.toObject(),
      image: product.image ? `http://localhost:${PORT}${product.image}` : "",
    }));

    res.json({
      products: productsWithImageUrls,
      promoBanners: [],
      promo50Off: {},
      categories: [],
      trendingProducts: [],
      brands: [...new Set(products.map(p => p.brand))],
      ratings: [...new Set(products.map(p => p.rating))].sort((a, b) => b - a),
    });
  } catch (error) {
    console.error("❌ Failed to fetch products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ======= AUTH ROUTES =======

// Signup
app.post('/api/auth/signup', async (req, res) => {
  const { email, password } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'User already exists' });

    const hashed = await bcryptjs.hash(password, 10);
    const user = new User({ email, password: hashed });
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const match = await bcryptjs.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ======= OTP AUTH =======

const otpStore = {};

app.post('/api/send-otp', async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = otp;

  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Your OTP Code',
      html: `<p>Your OTP is <strong>${otp}</strong></p>`,
    });
    res.json({ message: 'OTP sent to email' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send OTP', error });
  }
});

app.post('/api/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  if (otpStore[email] === otp) {
    req.session.user = email;
    delete otpStore[email];
    res.json({ message: 'OTP verified' });
  } else {
    res.status(400).json({ message: 'Invalid OTP' });
  }
});

app.get('/api/check-auth', (req, res) => {
  if (req.session.user) {
    res.json({ authenticated: true, user: req.session.user });
  } else {
    res.json({ authenticated: false });
  }
});

app.post('/api/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out' });
  });
});

// ======= ADMIN USERS =======
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({}, 'email password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// ======= START SERVER =======
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
