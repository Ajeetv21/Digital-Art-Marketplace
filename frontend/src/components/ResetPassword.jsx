import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [form, setForm] = useState({ email: "", otp: "", newPassword: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    try {
      e.preventDefault();
      const res = await axios.post("http://localhost:5000/reset-password", form);
      setMessage(res.data.message);
      navigate("/login");
    } catch (error) {
      setMessage("Invalid OTP or expired OTP");
    }
    setForm({ email: "", otp: "", newPassword: "" });
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        type="text"
        placeholder="Enter OTP"
        value={form.otp}
        onChange={(e) => setForm({ ...form, otp: e.target.value })}
      />
      <input
        type="password"
        placeholder="Enter new password"
        value={form.newPassword}
        onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
      />
      <button onClick={handleResetPassword}>Submit</button>
      <p>{message}</p>
    </div>
  );
};

export default ResetPassword;
