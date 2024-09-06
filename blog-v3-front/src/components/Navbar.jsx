import React from "react";
import './css/navbar.css';
import axios from "axios";
function Navbar({ url, user,setUser }) {
    function handleLogout() {
        axios.get(url + '/logout', { withCredentials: true })
        .then(response => {
            alert("Logged out successfully");
            setUser(null)
            window.location.href = '/'; // Redirect to the login page
        })
        .catch(error => {
            console.error("Error during logout", error);
        });
}
    return (
        <div>
            <nav>
                <p className="headername">Joshua's Public Blog</p>
                <div className="nav-comp">
                    <a href="/" className="nav-element">HOME</a>
                    <a href="/about" className="nav-element">ABOUT US</a>
                    <a href="/contact" className="nav-element">CONTACT</a>
                    <a href="/compose" className="nav-element">COMPOSE</a>
                    {user ?
                        <div>                
                            <div className="navbar-username">{user.name}
                                <img src="/prof.png" alt="" className="profile-pic" />
                                <button className="logout-btn" onClick={handleLogout}>Logout</button>
                            </div>

                        </div> :
                        <div>
                            <a href="/login" className="nav-element">LOGIN</a>
                            <a href="/register" className="nav-element">REGISTER</a></div>}
                </div>
            </nav>
        </div>
    )
}

export default Navbar;