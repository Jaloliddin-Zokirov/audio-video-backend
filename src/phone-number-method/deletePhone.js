const Phone = require("../model/phoneNumber");


module.exports = function deletePhoneById  (req, res) {
  const { id } = req.params;

  Phone.findByIdAndDelete(id)
    .then((deletedPhone) => {
      if (!deletedPhone) {
        return res.status(404).json({ error: "Phone number not found." });
      }
      res.status(200).json({ message: "Phone number deleted successfully." });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error. Failed to delete phone number." });
    });
};
