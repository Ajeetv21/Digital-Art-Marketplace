import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditArt = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchArtDetails();
  }, []);

  const fetchArtDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/arts/${id}`);
      const { title, description, price } = response.data;
      setTitle(title);
      setDescription(description);
      setPrice(price);
    } catch (error) {
      console.error("Error fetching artwork details:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price);
      if (image) formData.append("image", image);

      await axios.put(`http://localhost:5000/arts/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("Artwork updated successfully!");
      setTimeout(() => navigate("/dashboard"), 1000); // Redirect after 2 seconds
    } catch (error) {
      console.error("Error updating artwork:", error);
      setMessage("Failed to update artwork.");
    }
  };

  return (
    <div>
      <h2>Edit Artwork</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" required />
        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" required />
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        <button type="submit">Update Artwork</button>
      </form>
    </div>
  );
};

export default EditArt;
