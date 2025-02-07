import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { signup } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";


const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignup = async () => {
    await dispatch(signup({ name, email, password }));
    navigate("/login");
  };

  return (
    <div className="auth-container">
      <h2>Signup</h2>
      <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleSignup}>Signup</button>
      
      <p>
        Already have an account?{" "}
        <Link to="/login" className="login-link">Login</Link>
      </p>
    </div>
  );
};

export default Signup;
