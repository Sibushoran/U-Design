import React, { useEffect, useState } from "react";
import axios from "axios";
import './ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("https://u-design-1.onrender.com/api/products");
        setProducts(res.data.products || []);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchProducts();
  }, [refresh]);

  const deleteProduct = async (id) => {
    try {
      console.log("Attempting to delete product with ID:", id);
      const res = await axios.delete(`https://u-design-1.onrender.com/api/products/${id}`);
      console.log("Backend response:", res.data);
      alert("Product deleted successfully.");
      setRefresh(!refresh);
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Failed to delete product.");
    }
  };

  return (
    <div className="product-list">
      <h2>All Products</h2>
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Image</th> {/* New image column */}
              <th>Name</th>
              <th>Brand</th>
              <th>Price</th>
              <th>Rating</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>
                  {product.image ? (
                    <img 
                      src={product.image} 
                      alt={product.name || product.title} 
                      style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px' }} 
                    />
                  ) : (
                    <span>No Image</span>
                  )}
                </td>
                <td>{product.name || product.title}</td>
                <td>{product.brand}</td>
                <td>${product.price}</td>
                <td>{product.rating}★</td>
                <td>
                  <button onClick={() => deleteProduct(product._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProductList;
