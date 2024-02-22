const fs = require('fs').promises; 
const Blog = require("../model/model");

module.exports = async function deleteBlog(req, res) {
  try {
    const blogId = req.params.id; 

    const existingBlog = await Blog.findById(blogId);
    if (!existingBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const imagePath = existingBlog.uz.image; 
    await fs.unlink(`.${imagePath}`); 

    await existingBlog.deleteOne();
    
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
