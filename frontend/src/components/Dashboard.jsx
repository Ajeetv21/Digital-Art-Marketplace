import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const name = useSelector((state) => state.auth.name);

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Dashboard</h2>
      <p className="dashboard-welcome">Welcome, <span className="username">{name}</span>!</p>
      <button className="logout-button" onClick={() => dispatch(logout())}>Logout</button>
    </div>
  );
};

export default Dashboard;

