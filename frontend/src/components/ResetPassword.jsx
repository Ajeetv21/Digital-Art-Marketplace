import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../redux/authSlice"; // Import resetPassword action
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [form, setForm] = useState({ email: "", otp: "", newPassword: "" });
  const dispatch = useDispatch();
  const resetPasswordMessage = useSelector((state) => state.auth.resetPasswordMessage);
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    dispatch(resetPassword(form)).then((result) => {
      if (result.meta.requestStatus === "fulfilled") {
        navigate("/login");
      }
    });
    setForm({ email: "", otp: "", newPassword: "" });
  };

  return (
    <div className="auth-container">
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
      <p>{resetPasswordMessage}</p>
    </div>
  );
};

export default ResetPassword;
