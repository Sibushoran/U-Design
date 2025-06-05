// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Avoid model overwrite error in development
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
