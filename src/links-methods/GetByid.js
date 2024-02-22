
const Links = require("../model/links");

module.exports = function getLinkyId (req, res) {
  const { id } = req.params;

  Links.findById(id)
    .then((phone) => {
      if (!phone) {
        return res.status(404).json({ error: "Link not found." });
      }
      res.status(200).json(phone);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error. Failed to fetch phone number." });
    });
};
