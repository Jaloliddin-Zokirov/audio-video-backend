const Links = require("../model/links");

module.exports = function getAllLinks (req, res) {
  Links.find()
    .then((links) => {
      res.status(200).json(links);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error. Failed to fetch phone numbers." });
    });
};
