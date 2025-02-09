import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"; // CSS file import

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">🎨ArtGallery</Link>
      </div>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/gallery">Gallery</Link></li>
        <li><Link to="/contacts">Contact</Link></li>
        <li><Link to="/send-mail">Send-mail</Link></li>
       
      </ul>
    </nav>
  );
};

export default Navbar;
