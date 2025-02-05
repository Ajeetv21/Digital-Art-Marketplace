import React, { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleForgotPassword = async () => {
    try {
      const res = await axios.post("http://localhost:5000/forgot-password", { email });
      setMessage(res.data.message);
    } catch (error) {
      setMessage("User not found");
    }
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
