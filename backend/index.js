const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const multer = require("multer");
const app = express();
app.use(express.json());
const path = require("path");
const fs = require("fs");
app.use(cors());
app.use("/uploads", express.static("uploads"));

mongoose.connect("mongodb://localhost:27017/auth_db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads";
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

const ArtSchema = new mongoose.Schema({
  title: String,
  description: String,
  imageUrl: String,
  price: Number,
  artist: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  otp:String,
  otpExpires:Date,

});

const User = mongoose.model("User", UserSchema);
const Art = mongoose.model("Art", ArtSchema);
const secretKey = "your_secret_key"; 


// Authentication Middleware
const protect = async (req, res, next) => {
let token;
let authHeader = req.headers.authorization|| req.headers.Authorization;
if(authHeader && authHeader.startsWith("Bearer")){
 token = authHeader.split(" ")[1];
}
if(!token){ 
  res.status(401).json({ error: "Unauthorized: No token provided" });
}


  try {
      // Verify token
      const decoded = jwt.verify(token, secretKey); 
      req.user = decoded; 
   
      next();

      
  } catch (error) {
      res.status(401).json({ error: "Unauthorized: Invalid token" });
  }

};


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



// Art Routes

app.post("/upload-art", protect, upload.single("image"), async (req, res) => {
  try {
      const { title, description, price } = req.body;

     
      const artist = req.user.id; // Use id from token

      if (!req.file) return res.status(400).json({ error: "No image provided" });

      const imageUrl = `/uploads/${req.file.filename}`;
      const art = new Art({ title, description, price, imageUrl, artist });

      await art.save();
      res.status(201).json(art);
  } catch (error) {
      res.status(500).json({ error: "Server error" });
  }
});
// Get All Artworks
app.get("/arts", async (req, res) => {
  const arts = await Art.find().populate("artist", "name email");
  res.json(arts);
});

app.get("/arts/:id", async (req, res) => {
  const art = await Art.findById(req.params.id).populate("artist", "name email");
  if (!art) return res.status(404).json({ error: "Artwork not found" });
  res.json(art);
});

app.delete("/arts/:id", protect, async (req, res) => {
  const art = await Art.findById(req.params.id);
  const imagePath = path.join("uploads", path.basename(art.imageUrl));
  if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);

  await art.deleteOne();
  res.json({ message: "Artwork deleted" });

});
app.put("/arts/:id", protect, upload.single("image"), async (req, res) => {
  try {
    const { title, description, price } = req.body;
    const art = await Art.findById(req.params.id);

    if (!art) return res.status(404).json({ error: "Artwork not found" });

    // Update fields if provided
    art.title = title || art.title;
    art.description = description || art.description;
    art.price = price || art.price;

    // If a new image is uploaded, replace the old one
    if (req.file) {
      // Delete old image from uploads folder
      const oldImagePath = path.join("uploads", path.basename(art.imageUrl));
      if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);

      // Set new image URL
      art.imageUrl = `/uploads/${req.file.filename}`;
    }

    await art.save();
    res.json({ message: "Artwork updated successfully", art });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
