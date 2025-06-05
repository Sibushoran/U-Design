const mongoose = require("mongoose");

// Define the User schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,  // The type of this field is a string.
    required: true,  // This field is mandatory.
  },
  password: {
    type: String,  // The type of this field is a string (hashed password).
    required: true,  // This field is mandatory.
  },
});

// Create and export the User model using the defined schema
module.exports = mongoose.model("User", userSchema);
