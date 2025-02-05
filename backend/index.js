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
  otp:String,
  otpExpires:Date,

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

const generateOTP = () => crypto.randomInt(100000, 999999).toString();
const isOTPExpired =(otpExpires)=> new Date() > new Date(otpExpires);


const sendOTP = (email,otp) =>{
  transporter.sendMail({
    from:"ajeetv628@gmail.come",
    to:email,
    subject: "Password Reset OTP",
    html:`<p>Your OTP for Password reset is <b>${otp}</b>. it expires in 10 minutes</p>`
  })
}
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
  const {email} = req.body;
  try {
    const user = await User.findOne({email});
    if(!user) return res.status(400).json({error:"User not found"})
    const otp = generateOTP();
   user.otp=otp;
   user.otpExpires = new Date(Date.now() + 10 *60 *1000);
   await user.save();

   sendOTP(email,otp)
   res.json({message:"OTP sent for password reset"})

  } catch (error) {
    
  }
});

app.post("/reset-password", async (req, res) => {
  const {email,otp,newPassword} = req.body;
  try {
    const user = await User.findOne({email});
    if(!user || user.otp!==otp ||isOTPExpired(user.otpExpires)){
      res.json({error:"Invalid or expired Otp"})
    }
   user.password = await bcrypt.hash(newPassword,10);
  
   user.otp=null;
   user.otpExpires = null;
   await user.save();
   res.json({message:"Password reset successfully"})

  } catch (error) {
    
  }
});


// Protected Route (Dashboard)
app.get("/dashboard", (req, res) => {
  res.json({ message: "Welcome to the dashboard" });
});

// Logout Route (Frontend should handle token removal)
app.post("/logout", (req, res) => {
  res.json({ message: "Logged out successfully" });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
