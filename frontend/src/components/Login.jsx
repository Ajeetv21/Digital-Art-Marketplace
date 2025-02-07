import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/authSlice";
import { Navigate, useNavigate } from "react-router-dom";
import {Link} from 'react-router-dom'
const Login = () => {
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const navigate = useNavigate();

  const handleLogin = async () => {
    await dispatch(login({ email, password }));
    navigate("/dashboard");
  };

  if (isAuthenticated) return <Navigate to="/dashboard" />;
  return (
    <div className="auth-container">
      <h2>Login</h2>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
     

      
      <p>
              Create new  account?{" "}
              <Link to="/signup" className="login-link">Signup</Link>
            </p>
            <Link to="/forgot-password">Forgot Password?</Link>
    </div>
  );
};

export default Login;