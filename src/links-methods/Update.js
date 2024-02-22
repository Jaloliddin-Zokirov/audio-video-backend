const Links = require("../model/links");

module.exports = function updateLinkById(req, res) {
  const { id } = req.params;
  const { title ,link} = req.body;

  Links.findByIdAndUpdate(id, { title ,link}, { new: true })
    .then((updatedPhone) => {
      if (!updatedPhone) {
        return res.status(404).json({ error: "Link not found." });
      }
      res.status(200).json(updatedPhone);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error. Failed to update phone number." });
    });
};
