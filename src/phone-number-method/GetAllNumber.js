const Phone = require("../model/phoneNumber");
module.exports = function getAllPhones (req, res) {
  Phone.find()
    .then((phones) => {
      res.status(200).json(phones);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error. Failed to fetch phone numbers." });
    });
};
