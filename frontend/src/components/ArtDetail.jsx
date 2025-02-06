import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ArtDetail = () => {
    const { id } = useParams();
    const [art, setArt] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchArt();
    }, []);

    const fetchArt = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/arts/${id}`);
            setArt(response.data);
        } catch (error) {
            console.error("Error fetching artwork:", error);
        }
    };

    return (
        <div>
            {art ? (
                <div>
                    <h2>{art.title}</h2>
                    <img src={`http://localhost:5000${art.imageUrl}`} alt={art.title} style={{ width: "50%" }} />
                    <p>{art.description}</p>
                    <p><strong>Price:</strong> ${art.price}</p>
                    <p><strong>Artist:</strong> {art.artist.name} ({art.artist.email})</p>
                </div>
            ) : (
                <p>Loading artwork...</p>
            )}
        </div>
    );
};

export default ArtDetail;
