const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://localhost:27017/auth_db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  resetToken: { type: String },
  resetTokenExpiry: { type: Date }
});

const User = mongoose.model("User", UserSchema);
const secretKey = "your_secret_key"; // Change this to a secure key

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "ajeetv628@gmail.com",
    pass: "uxqt wkud xwfd kffp",
  },
});

// Signup Route
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    await transporter.sendMail({
      to: email,
      subject: "Welcome to Our App",
      text: `Hello ${name}, welcome to our app! Your account has been successfully created.`
    });
    res.json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error signing up" });
  }
});

// Login Route
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });
    
    const token = jwt.sign({ id: user._id }, secretKey, { expiresIn: "1h" });
   
    res.json({ token, name: user.name, message: "Login successful" });
  } catch (error) {
    res.status(500).json({ error: "Error logging in" });
  }
});

// Forgot Password Route
app.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });
    
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour expiration
    await user.save();
    
    await transporter.sendMail({
      to: email,
      subject: "Password Reset Request",
      text: `To reset your password, click on the following link: http://localhost:3000/reset-password/${resetToken}`
    });
    
    res.json({ message: "Password reset email sent" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Middleware to Verify Token
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ error: "Access denied" });
  
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.userId = decoded.id;
    next();
  });
};

// Protected Route (Dashboard)
app.get("/dashboard", verifyToken, (req, res) => {
  res.json({ message: "Welcome to the dashboard" });
});

// Logout Route (Frontend should handle token removal)
app.post("/logout", (req, res) => {
  res.json({ message: "Logged out successfully" });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
