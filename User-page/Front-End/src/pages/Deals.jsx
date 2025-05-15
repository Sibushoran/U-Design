import React from "react";

const Deals = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <img
        src="https://img.freepik.com/free-vector/sale-concept-illustration_114360-1084.jpg"
        alt="No Deals"
        style={{ maxWidth: "400px", width: "90%", marginBottom: "20px" }}
      />
      <h2 style={{ fontSize: "22px", color: "#555" }}>No Daily Deals Available</h2>
      <p style={{ color: "#777" }}>
        Check back later for exciting deals and discounts!
      </p>
    </div>
  );
};

export default Deals;
