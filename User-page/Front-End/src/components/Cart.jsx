import { useContext } from "react";
import { CartContext } from "../context/CartContext";

const Cart = () => {
  const { cartItems = [], removeFromCart } = useContext(CartContext); // Access removeFromCart

  // Log to check if removeFromCart is available
  console.log("removeFromCart in Cart:", removeFromCart); // Debugging step

  // Calculate the total price
  const totalAmount = cartItems.reduce((total, item) => total + item.price, 0).toFixed(2);

  if (cartItems.length === 0) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <img 
          src="https://img.freepik.com/free-vector/add-cart-concept-illustration_114360-1435.jpg" 
          alt="Empty Cart" 
          style={{ maxWidth: "400px", width: "100%", marginBottom: "20px" }}
        />
        <h2>Your cart is empty</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: "30px", maxWidth: "1200px", margin: "auto" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#333" }}>My Cart</h1>
      <div style={{ marginBottom: "30px" }}>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {cartItems.map((item) => (
            <li 
              key={item._id} // Ensure the key is unique (use _id)
              style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center", 
                marginBottom: "15px", 
                backgroundColor: "#f9f9f9", 
                padding: "15px", 
                borderRadius: "8px", 
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <img 
                  src={item.image} 
                  alt={item.name} 
                  style={{
                    width: "80px", 
                    height: "80px", 
                    objectFit: "cover", 
                    borderRadius: "8px", 
                    marginRight: "20px"
                  }} 
                />
                <div>
                  <h4 style={{ margin: "0", fontSize: "18px", fontWeight: "600" }}>{item.name}</h4>
                  <p style={{ margin: "5px 0", color: "#666" }}>${item.price}</p>
                </div>
              </div>
              <div>
                <button 
                  style={{
                    backgroundColor: "#ff3d00", // Myntra-like red
                    color: "#fff",
                    padding: "8px 16px",
                    fontSize: "14px",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontWeight: "500",
                    transition: "background-color 0.3s",
                  }}
                  onClick={() => {
                    if (typeof removeFromCart === "function") {
                      removeFromCart(item._id); // Call removeFromCart with item._id
                    } else {
                      console.error("removeFromCart is not a function");
                    }
                  }} 
                  onMouseEnter={(e) => (e.target.style.backgroundColor = "#e53935")}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = "#ff3d00")}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Total Amount and Proceed to Buy Button */}
      <div 
        style={{
          backgroundColor: "#fff", 
          padding: "20px", 
          borderRadius: "8px", 
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", 
          textAlign: "center", 
          marginTop: "30px"
        }}
      >
        <h2 style={{ fontSize: "22px", marginBottom: "15px", color: "#333" }}>
          Total Amount: ${totalAmount}
        </h2>
        <button 
          style={{
            backgroundColor: "#28a745", // Green for proceed to buy
            color: "#fff",
            padding: "12px 20px",
            fontSize: "16px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "600",
            transition: "background-color 0.3s",
          }}
          onClick={() => alert("Proceeding to checkout...")}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#218838")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#28a745")}
        >
          Proceed to Buy
        </button>
      </div>
    </div>
  );
};

export default Cart;
