import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./css/navbar.css";
import api from "../api";

function Navbar({ user, setUser }) {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await api.get("/logout");
      alert("Logged out successfully");
      setUser(null);
      setIsNavOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Error during logout", error);
    }
  }

  function toggleNavbar() {
    setIsNavOpen(!isNavOpen);
  }

  return (
    <div>
      <nav>
        <p className="headername">Sathish's Public Blog</p>
        <div className="toggle-button" onClick={toggleNavbar}>
          <div></div><div></div><div></div>
        </div>
        <div className={`nav-comp ${isNavOpen ? "active" : ""}`}>
          <Link to="/" className="nav-element">HOME</Link>
          <Link to="/about" className="nav-element">ABOUT US</Link>
          <Link to="/contact" className="nav-element">CONTACT</Link>
          <Link to="/compose" className="nav-element">COMPOSE</Link>

          {user ? (
            <div className="navbar-username">
              {user.name}
              <img src="/prof.png" alt="" className="profile-pic" />
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <div className="login">
              <Link to="/login" className="nav-element">LOGIN</Link>
              <Link to="/register" className="nav-element">REGISTER</Link>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
