import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../components/Loader";
 

const ArtGallery = () => {
  const [arts, setArts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchArts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/arts");
        setArts(response.data);
      } catch (err) {
        setError("Failed to load artworks");
      } finally {
        setLoading(false);
      }
    };

    fetchArts();
  }, []);

  if (loading) return <Loader />;

  if (error) return <p className="error">{error}</p>;

  return (
    <div className="gallery-container">
      <h2>Art Gallery</h2>
      <div className="art-grid">
        {arts.map((art) => (
          <div key={art._id} className="art-card">
             <img src={`http://localhost:5000${art.imageUrl}`} alt={art.title} style={{ width: "50%"  }} />
            <h3>{art.title}</h3>
            <p>{art.description}</p>
            <p className="artist">Artist: {art.artist.name}</p>
            <p className="price">Price: ${art.price}</p>
            <button className="buy-btn">Buy Now</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArtGallery;
