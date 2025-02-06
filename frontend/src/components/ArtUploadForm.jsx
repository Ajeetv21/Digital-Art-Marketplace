import React, { useState } from "react";
import axios from "axios";

const ArtUploadForm = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [image, setImage] = useState(null);
    const [message, setMessage] = useState("");

    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!image) {
            setMessage("Please select an image.");
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("price", price);
        formData.append("image", image);

        try {
            const token = localStorage.getItem("token"); // Get token from localStorage
            const response = await axios.post("http://localhost:5000/upload-art", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`, // Send token for authentication
                },
            });

            setMessage("Art uploaded successfully!");
            setTitle("");
            setDescription("");
            setPrice("");
            setImage(null);
        } catch (error) {
            console.error("Error uploading art:", error);
            setMessage("Failed to upload art.");
        }
    };

    return (
        <div>
            <h2>Upload Your Artwork</h2>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
                <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required />
                <input type="file" accept="image/*" onChange={handleFileChange} required />
                <button type="submit">Upload Art</button>
            </form>
        </div>
    );
};

export default ArtUploadForm;
