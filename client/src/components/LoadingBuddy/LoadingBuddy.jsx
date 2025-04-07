import React from "react";
import buddyIcon from "../../assets/images/buddy-icon-transparent.png";
import "./LoadingBuddy.scss";

const LoadingBuddy = ({ message = "Loading..." }) => {
  return (
    <div className="loading-buddy">
      <div className="loading-buddy__container">
        <div className="loading-buddy__icon">
          <img src={buddyIcon} alt="Loading Buddy" />
        </div>
        <div className="loading-buddy__bubble">
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingBuddy;
