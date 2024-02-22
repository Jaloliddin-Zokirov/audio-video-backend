const mongoose = require("mongoose");
const Schema = require("schema");

const languageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,  // Assuming you want to store the image buffer
    required: true
  },
});

const mainSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  ru: languageSchema,
  uz: languageSchema, 
});

const Blog = mongoose.model("Blog", mainSchema);
module.exports = Blog;
