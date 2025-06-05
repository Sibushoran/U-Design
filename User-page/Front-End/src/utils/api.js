import axios from "axios";

export const fetchCategories = async () => {
  try {
    const res = await axios.get("https://shopnest-server.vercel.app/api/categories");
    return res.data.categories;
  } catch (err) {
    console.error("❌ Failed to fetch categories:", err);
    return [];
  }
};
