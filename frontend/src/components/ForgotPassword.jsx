import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../redux/authSlice"; 
import { useNavigate } from "react-router-dom";


const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const dispatch = useDispatch();
  const message = useSelector((state) => state.auth.forgotPasswordMessage);
  const navigate = useNavigate();

  const handleForgotPassword = (e) => {
    e.preventDefault();
    dispatch(forgotPassword(email)).then((result) => {
      if (result.meta.requestStatus === "fulfilled") {
        setIsModalOpen(true); // Open the modal
      }
    });
    setEmail("");
    navigate("/reset-password");
  };

  return (
    <div className="auth-container">
      <h2>Forgot Password</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleForgotPassword}>Submit</button>

      {/* Popup Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Password Reset Link Sent</h3>
            <p>{message || "Check your email for further instructions."}</p>
            <button onClick={() => setIsModalOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
