const Blog = require("../model/model");

module.exports = function getBlogById(req, res) {
  const blogId = req.params.id;

  Blog.findById(blogId)
    .then((result) => {
      const blogWithUrl = {
        ...result._doc,
        image: `/uploads/${result.image}`,
      };

      res.send(blogWithUrl);
    })
    .catch((err) => {
      console.log(err);
    });
}