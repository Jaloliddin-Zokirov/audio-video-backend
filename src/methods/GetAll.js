const  path  = require("path");
const  fs  = require("fs");
const Blog = require("../model/model");

function arrayBufferToBuffer(arrayBuffer) {
  const buffer = Buffer.alloc(arrayBuffer.byteLength);
  const view = new Uint8Array(arrayBuffer);
  for (let i = 0; i < buffer.length; ++i) {
    buffer[i] = view[i];
  }
  return buffer;
}

module.exports = function getAllBlogs(req, res) {
  Blog.find()
    .then((result) => {
      const blogsWithUrls = result.map(blog => {
        const uploadDir = path.join(__dirname, '..', 'uploads');

 
        return {
          ...blog._doc,
        };
      });

      res.send(blogsWithUrls);
    })
    .catch((err) => {
      console.log(err);
    });
}

