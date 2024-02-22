const fs = require('fs').promises; 
const Blog = require("../model/model");

module.exports = async function updateBlog(req, res) {
  try {
    const blogId = req.params.id; 
    const { ru, uz } = req.body;
    const imagePath = req.file ? req.file.path : null; 

    const existingBlog = await Blog.findById(blogId);
    if (!existingBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (imagePath && existingBlog.uz.image) {
      await fs.unlink(`.${existingBlog.uz.image}`);
    }

    existingBlog.ru = { ...JSON.parse(ru) };
    existingBlog.uz = {...JSON.parse(uz) };
    if (imagePath) {
      existingBlog.uz.image = `/${imagePath}`;
      existingBlog.ru.image = `/${imagePath}`;
    }

    await existingBlog.save();

    res.status(200).json({ message: "Blog updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
