import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const CategoryPage = () => {
  const { category } = useParams(); // Get category from URL
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("/api/products")
      .then((response) => {
        const filteredProducts = response.data.products.filter(
          (product) => product.category === category
        );
        setProducts(filteredProducts);
      })
      .catch((error) => {
        console.error("Error fetching products", error);
      });
  }, [category]);

  return (
    <div className="container py-4">
      <h2>{category} Products</h2>
      <div className="row">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm">
                <img
                  src={product.img}
                  alt={product.title}
                  className="card-img-top"
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h5 className="card-title">{product.title}</h5>
                  <p className="card-text">{product.description}</p>
                  <p className="text-primary fw-bold">${product.price}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>No products found.</div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
