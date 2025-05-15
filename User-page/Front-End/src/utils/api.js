import axios from "axios";

export const fetchCategories = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/categories");
    return res.data.categories;
  } catch (err) {
    console.error("❌ Failed to fetch categories:", err);
    return [];
  }
};
