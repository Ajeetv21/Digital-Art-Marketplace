import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";
import axios from "axios";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [arts, setArts] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchArts();
  }, []);

  const fetchArts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/arts");
      setArts(response.data);
    } catch (error) {
      console.error("Error fetching artworks:", error);
    }
  };

  const dispatch = useDispatch();
  const name = useSelector((state) => state.auth.name);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/arts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setArts(arts.filter((art) => art._id !== id));
      setMessage("Artwork deleted successfully!");
    } catch (error) {
      console.error("Error deleting artwork:", error);
      setMessage("Failed to delete artwork.");
    }
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Dashboard</h2>
      <p className="dashboard-welcome">
        Welcome, <span className="username">{name}</span>!
      </p>
      <button className="logout-button" onClick={() => dispatch(logout())}>
        Logout
      </button>

      <h2>Art Gallery</h2>
      {message && <p>{message}</p>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
        {arts.map((art) => (
          <div key={art._id} style={{ border: "1px solid #ddd", padding: "10px" }}>
            <Link to={`/art/${art._id}`}>
              <img src={`http://localhost:5000${art.imageUrl}`} alt={art.title} style={{ width: "100%", cursor: "pointer" }} />
            </Link>
            <h3>{art.title}</h3>
            <p>{art.description}</p>
            <p><strong>Price:</strong> ${art.price}</p>
            <p><strong>Artist:</strong> {art.artist.name} ({art.artist.email})</p>
            <button onClick={() => handleDelete(art._id)}>Delete</button>
            <Link to={`/edit-art/${art._id}`}><button>Edit</button></Link>  {/* Edit Button */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
