import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
 const navigate= useNavigate()

  const handleForgotPassword = async (e) => {
    try {
      e.preventDefault();
      const res = await axios.post("http://localhost:5000/forgot-password", { email });
      setMessage(res.data.message);
navigate('/reset-password')
    } catch (error) {
      setMessage("User not found");
    }
    setEmail("");
  };

  return (
    <div>
      <h2>Forgot Password</h2>
      <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <button onClick={handleForgotPassword}>Submit</button>
      <p>{message}</p>
    </div>
  );
};

export default ForgotPassword;
