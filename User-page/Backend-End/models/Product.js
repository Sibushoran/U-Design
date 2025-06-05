// models/Product.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  rating: Number,
  brand: String,
  image: String,
  tag: String,
  colors: [String],
});

// Avoid model overwrite error in development
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;
