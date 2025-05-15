import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";

const Wishlist = () => {
  const { wishlistItems = [], removeFromWishlist, addToCart } = useContext(CartContext); // Make sure addToCart is in context

  if (wishlistItems.length === 0) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <img
          src="https://img.freepik.com/free-vector/favorites-concept-illustration_114360-1251.jpg
"
          alt="No Wishlist Items"
          style={{ maxWidth: "400px", width: "90%", marginBottom: "20px" }}
        />
        <p style={{ fontSize: "20px", color: "#666" }}>Your wishlist is empty.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "30px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#333" }}>My Wishlist</h1>
      <div
        style={{
          marginTop: "20px",
          paddingTop: "20px",
          borderTop: "2px solid #ddd",
        }}
      >
        {wishlistItems.map((product) => (
          <div
            key={product._id}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "15px",
              marginBottom: "15px",
              backgroundColor: "#fff",
              borderRadius: "10px",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
              transition: "transform 0.3s, box-shadow 0.3s",
            }}
          >
            <img
              src={product.image}
              alt={product.name}
              style={{
                width: "120px",
                height: "120px",
                objectFit: "cover",
                borderRadius: "8px",
                marginRight: "20px",
              }}
            />
            <div style={{ flex: "1" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "600", margin: "0", color: "#333" }}>
                {product.name}
              </h3>
              <p style={{ fontSize: "16px", color: "#777", margin: "5px 0" }}>${product.price}</p>
              <p style={{ fontSize: "14px", color: "#888" }}>Free Shipping</p>
            </div>
            <div>
              <button
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#ff3d00", // Myntra red color
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                  transition: "background-color 0.3s",
                }}
                onClick={() => addToCart(product)} // Trigger add to cart
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#e53935")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "#ff3d00")}
              >
                Add to Cart
              </button>
              <button
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#ff3d00", // Myntra red color
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                  transition: "background-color 0.3s",
                  marginTop: "10px", // Add margin for spacing
                }}
                onClick={() => removeFromWishlist(product._id)} // Trigger removal from wishlist
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#e53935")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "#ff3d00")}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
