const Phone = require("../model/phoneNumber");

module.exports = function getPhoneById (req, res) {
  const { id } = req.params;

  Phone.findById(id)
    .then((phone) => {
      if (!phone) {
        return res.status(404).json({ error: "Phone number not found." });
      }
      res.status(200).json(phone,instagram);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error. Failed to fetch phone number." });
    });
};
