import React, { useState } from "react";
import "./Navbar.css";
import logo from "../../assets/assets/logo.png";
import search_icon from "../../assets/assets/search_icon.svg";
import bell_icon from "../../assets/assets/bell_icon.svg";
import profile_img from "../../assets/assets/profile_img.png";
import caret_icon from "../../assets/assets/caret_icon.svg";

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="Netflix Logo" className="logo" />
        <ul className="nav-links">
          <li>Home</li>
          <li>TV Shows</li>
          <li>Movies</li>
          <li>New & Popular</li>
          <li>My List</li>
          <li>Browse by Language</li>
        </ul>
      </div>

      <div className="navbar-right">
        <img src={search_icon} alt="Search" className="icon" />
        <p>Children</p>
        <img src={bell_icon} alt="Notifications" className="icon" />

        <div
          className="navbar-profile"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <img src={profile_img} alt="Profile" className="profile" />
          <img src={caret_icon} alt="Dropdown" className="caret" />

          {showDropdown && (
            <div className="dropdown">
              <p>Sign Out of Netflix</p>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
