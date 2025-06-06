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
  const [submitting, setSubmitting] = useState(false);

 const CLOUD_NAME = "dxmhwf0ax";         // ← your actual cloud name
const UPLOAD_PRESET = "shopnest";    // Replace with your unsigned upload preset

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
    setPreview(URL.createObjectURL(file));
  };

  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", UPLOAD_PRESET);
    data.append("cloud_name", CLOUD_NAME);


    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      data
    );

    return res.data.secure_url; // return the image URL
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.price.trim()) {
      alert("Please enter required fields: Product Name and Price");
      return;
    }

    try {
      setSubmitting(true);

      let imageUrl = "";

      // Upload to Cloudinary if an image is selected
      if (formData.image) {
        imageUrl = await uploadToCloudinary(formData.image);
      }

      // Send to your backend
      const payload = {
        name: formData.name,
        brand: formData.brand,
        category: formData.category,
        price: parseFloat(formData.price) || 0,
        originalPrice: parseFloat(formData.originalPrice) || 0,
        tag: formData.tag,
        rating: parseFloat(formData.rating) || 0,
        colors: formData.colors,
        image: imageUrl,
      };

      await axios.post("https://u-design-os78dni1q-sibushorans-projects.vercel.app/api/products", payload);
      alert("✅ Product added!");

      setFormData({
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
      setPreview(null);
    } catch (err) {
      console.error("❌ Failed to add product:", err);
      alert("Failed to add product. Check console for errors.");
    } finally {
      setSubmitting(false);
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
      <style>{`* { box-sizing: border-box; }`}</style>
      <div
        style={{
          minHeight: "100vh",
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
            flexWrap: "wrap",
            gap: "2rem",
            boxShadow: "0 15px 40px rgba(255, 136, 0, 0.25)",
          }}
        >
          <div style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
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
                }}
              />
            ))}
          </div>

          <div style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
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
                }}
              />
            ))}

            <input
              type="file"
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
              }}
            />

            {preview ? (
              <div style={{ marginTop: "1rem", borderRadius: "12px", overflow: "hidden", border: "2px solid #ff6600" }}>
                <img src={preview} alt="Preview" style={{ width: "100%", objectFit: "cover" }} />
              </div>
            ): null}
          </div>

          <div style={{ width: "100%", marginTop: "2rem", display: "flex", justifyContent: "center" }}>
            <button
              type="submit"
              disabled={submitting}
              style={{
                padding: "1rem 3rem",
                backgroundColor: submitting ? "#cc5200" : "#ff6600",
                color: "#fff",
                fontWeight: "700",
                fontSize: "18px",
                borderRadius: "40px",
                border: "none",
                cursor: submitting ? "not-allowed" : "pointer",
                boxShadow: "0 6px 12px rgba(255, 102, 0, 0.7)",
              }}
            >
              {submitting ? "Adding..." : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default ProductForm;
