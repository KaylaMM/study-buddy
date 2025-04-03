import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaUserCircle } from "react-icons/fa";
import Sidebar from "../SideBar/SideBar";
import logo from "../../assets/images/study-buddy-cropped-transparent.png";
import "./NavBar.scss";

const NavBar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="nav">
      <div className="nav__left">
        <button className="nav__menu-button" onClick={toggleSidebar}>
          <FaBars />
        </button>
        <Link to="/dashboard" className="nav__logo">
          <img src={logo} alt="pencil-icon" className="nav__logo-icon" />
        </Link>
      </div>
      <div className="nav__right">
        <FaUserCircle className="nav__avatar" />
        <button onClick={handleLogout} className="nav__logout-btn">
          Logout
        </button>
      </div>
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
    </nav>
  );
};

export default NavBar;
