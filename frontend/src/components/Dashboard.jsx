import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchArts, deleteArt } from "../redux/artSlice";

import { Link } from "react-router-dom";
import Header from "./Header";


const Dashboard = () => {
  const dispatch = useDispatch();
  const { arts = [], loading, error } = useSelector((state) => state.art || {});
  const name = useSelector((state) => state.auth.name || "");

  useEffect(() => {
    dispatch(fetchArts());
  }, [dispatch]);

  const handleDelete = (id) => {
    dispatch(deleteArt(id));
  };

  return (
    <div className="dashboard-container">
      
      <Header/>
     

      {loading && <p className="loading">Loading artworks...</p>}
      {error && <p className="error">{error}</p>}

      <table className="art-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Artist</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {arts.length === 0 && !loading ? (
            <tr>
              <td colSpan="6">No artworks found.</td>
            </tr>
          ) : (
            arts.map((art) => (
              <tr key={art._id}>
                <td>
                  <Link to={`/art/${art._id}`}>
                    <img
                      src={`http://localhost:5000${art.imageUrl}`}
                      alt={art.title}
                      className="art-image"
                    />
                  </Link>
                </td>
                <td>{art.title}</td>
                <td>{art.description}</td>
                <td>${art.price}</td>
                <td>{art.artist.name} ({art.artist.email})</td>
                <td>
                  <button className="delete-btn" onClick={() => handleDelete(art._id)}>
                    Delete
                  </button>
                  <Link to={`/edit-art/${art._id}`}>
                    <button className="edit-btn">Edit</button>
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
