import React from "react";

const TrackOrder = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <img
        src="https://img.freepik.com/free-vector/empty-concept-illustration_114360-1188.jpg"
        alt="No Orders"
        style={{ maxWidth: "400px", width: "90%", marginBottom: "20px" }}
      />
      <h2 style={{ fontSize: "22px", color: "#555" }}>No Orders Found</h2>
      <p style={{ color: "#777" }}>
        You haven't placed any orders yet. Start shopping now!
      </p>
    </div>
  );
};

export default TrackOrder;
