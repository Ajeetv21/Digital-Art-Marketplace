import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchArtById, updateArt } from "../redux/artSlice";

const EditArt = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selectedArt, loading, error } = useSelector((state) => state.art);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    image: null,
  });

  useEffect(() => {
    dispatch(fetchArtById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedArt) {
      setFormData({
        title: selectedArt.title || "",
        description: selectedArt.description || "",
        price: selectedArt.price || "",
        image: null, // Reset image to avoid showing old preview
      });
    }
  }, [selectedArt]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateArt({ id, updatedData: formData }));
    navigate("/dashboard");
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="edit-art-container">
    <h2>Edit Artwork</h2>
    <form onSubmit={handleSubmit} className="edit-art-form">
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Title"
        required
      />
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Description"
        required
      />
      <input
        type="number"
        name="price"
        value={formData.price}
        onChange={handleChange}
        placeholder="Price"
        required
      />
      <input type="file" name="image" onChange={handleChange} />
      <button type="submit">Update Artwork</button>
    </form>
  </div>
  );
};

export default EditArt;
