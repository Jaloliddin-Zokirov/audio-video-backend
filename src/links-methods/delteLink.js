
const Links = require("../model/links");

module.exports = function deleteLinkById  (req, res) {
  const { id } = req.params;

  Links.findByIdAndDelete(id)
    .then((deletedPhone) => {
      if (!deletedPhone) {
        return res.status(404).json({ error: "Link not found." });
      }
      res.status(200).json({ message: "Link deleted successfully." });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error. Failed to delete phone number." });
    });
};
