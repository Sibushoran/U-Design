import { useState } from "react";
import axios from "axios";

function ProductForm() {
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "",
    price: "",
    originalPrice: "",
    tag: "",
    colors: "",
    rating: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("brand", formData.brand);
    data.append("category", formData.category);
    data.append("price", parseFloat(formData.price) || 0);
    data.append("originalPrice", parseFloat(formData.originalPrice) || 0);
    data.append("tag", formData.tag);
    data.append("rating", parseFloat(formData.rating) || 0);
    data.append("colors", formData.colors);
    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      await axios.post("http://localhost:5000/api/products", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("✅ Product added!");
    } catch (err) {
      console.error("❌ Failed to add product:", err);
      alert("Failed to add product. Check console for errors.");
    }
  };

  const leftFields = [
    { name: "name", placeholder: "Product Name" },
    { name: "brand", placeholder: "Brand" },
    { name: "category", placeholder: "Category" },
    { name: "price", placeholder: "Price" },
  ];

  const rightFields = [
    { name: "originalPrice", placeholder: "Original Price" },
    { name: "tag", placeholder: "Tag" },
    { name: "colors", placeholder: "Colors (comma-separated)" },
    { name: "rating", placeholder: "Rating" },
  ];

  return (
    <>
      {/* Global box-sizing fix */}
      <style>
        {`
          * {
            box-sizing: border-box;
          }
        `}
      </style>

      <div
        style={{
          minHeight: "100vh",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #121212, #1a1a1a)",
          fontFamily:
            "'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          padding: "2rem",
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            backgroundColor: "#fff",
            borderRadius: "12px",
            padding: "2rem 3rem",
            width: "100%",
            maxWidth: "900px",
            display: "flex",
            flexWrap: "wrap", // allows wrapping if narrow screen
            gap: "2rem",
            boxShadow: "0 15px 40px rgba(255, 136, 0, 0.25)",
          }}
        >
          {/* Left column */}
          <div
            style={{
              flex: "1 1 300px",
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
              minWidth: 0,
            }}
          >
            {leftFields.map(({ name, placeholder }) => (
              <input
                key={name}
                name={name}
                placeholder={placeholder}
                value={formData[name]}
                onChange={handleChange}
                style={{
                  padding: "1rem",
                  border: "1.5px solid #ff6600",
                  borderRadius: "10px",
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "#333",
                  outline: "none",
                  transition: "border-color 0.3s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#ff6600")}
                onBlur={(e) => (e.target.style.borderColor = "#ff6600")}
              />
            ))}
          </div>

          {/* Right column */}
          <div
            style={{
              flex: "1 1 300px",
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
              minWidth: 0,
            }}
          >
            {rightFields.map(({ name, placeholder }) => (
              <input
                key={name}
                name={name}
                placeholder={placeholder}
                value={formData[name]}
                onChange={handleChange}
                style={{
                  padding: "1rem",
                  border: "1.5px solid #ff6600",
                  borderRadius: "10px",
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "#333",
                  outline: "none",
                  transition: "border-color 0.3s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#ff6600")}
                onBlur={(e) => (e.target.style.borderColor = "#ff6600")}
              />
            ))}

            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
              style={{
                padding: "1rem",
                border: "1.5px solid #ff6600",
                borderRadius: "10px",
                fontWeight: "600",
                cursor: "pointer",
                color: "#ff6600",
                backgroundColor: "#fff",
                transition: "border-color 0.3s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#ff6600")}
              onBlur={(e) => (e.target.style.borderColor = "#ff6600")}
            />

            {preview && (
              <div
                style={{
                  marginTop: "1rem",
                  borderRadius: "12px",
                  overflow: "hidden",
                  border: "2px solid #ff6600",
                  boxShadow: "0 0 8px #ff6600",
                  maxHeight: "220px",
                }}
              >
                <img
                  src={preview}
                  alt="Preview"
                  style={{
                    width: "100%",
                    height: "auto",
                    objectFit: "cover",
                  }}
                />
              </div>
            )}
          </div>

          {/* Submit button below columns */}
          <div
            style={{
              width: "100%",
              marginTop: "2rem",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <button
              type="submit"
              style={{
                padding: "1rem 3rem",
                backgroundColor: "#ff6600",
                color: "#fff",
                fontWeight: "700",
                fontSize: "18px",
                borderRadius: "40px",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 6px 12px rgba(255, 102, 0, 0.7)",
                transition: "background-color 0.3s",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#cc5200")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#ff6600")}
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default ProductForm;
