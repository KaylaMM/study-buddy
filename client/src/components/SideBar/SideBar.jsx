import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaBook, FaChartLine } from "react-icons/fa";
import "./SideBar.scss";

const SideBar = ({ isOpen, onClose }) => {
  const menuItems = [
    { path: "/dashboard", icon: <FaHome />, label: "Home" },
    { path: "/dashboard/decks", icon: <FaBook />, label: "Decks" },

    {
      path: "/dashboard/progress",
      icon: <FaChartLine />,
      label: "Progress Tracker",
    },
  ];

  return (
    <div className={`sidebar ${isOpen ? "sidebar--open" : ""}`}>
      <div className="sidebar__content">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className="sidebar__item"
            onClick={onClose}
          >
            <span className="sidebar__icon">{item.icon}</span>
            <span className="sidebar__label">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SideBar;
