// src/components/TopBar.jsx

import React from "react";

const TopBar = () => {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      padding: "10px 20px",
      backgroundColor: "#282c34",
      color: "white",
      height: "60px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
    }}>
      {/* Avatar */}
      <img
        src="https://i.pravatar.cc/40" // avatar exemple (40x40)
        alt="avatar"
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          marginRight: "15px",
          cursor: "pointer"
        }}
      />
      {/* Titre ou logo */}
      <h1 style={{ fontSize: "20px", margin: 0 }}>Mon Application</h1>
    </div>
  );
};

export default TopBar;
