const fs = require('fs').promises; 
const Customer = require("../model/Customer");
const jwt = require('jsonwebtoken');


module.exports = async function DeleteCustomer(req, res) {
  const token = req.headers.authorization;

    jwt.verify(token, 'java', async (err, decodedToken) => {
        if (err) {
            return res.status(401).json({ error: 'Unauthorized' });
        } 
  try {
    const blogId = req.params.id; 

    const existingBlog = await Customer.findById(blogId);
    if (!existingBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }


    await existingBlog.deleteOne();
    
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
    });
};
