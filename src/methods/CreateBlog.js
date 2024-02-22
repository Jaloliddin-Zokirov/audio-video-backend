const fs = require('fs');
const Blog = require("../model/model");
const {v4:uuidv4}  = require("uuid")

module.exports = async function createBlog(req, res) {
  try {
    const { ru, uz } = req.body;
    const imagePath = req.file.path; 
    const dataUZ = JSON.parse(uz)
    const dataRU = JSON.parse(ru)

    const newBlog = new Blog({
      id:uuidv4(),
      ru: { ...dataRU, image: `/${imagePath}` },
      uz: { ...dataUZ, image: `/${imagePath}` },
    });

    await newBlog.save();
    res.status(201).json({ message: "Blog created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
