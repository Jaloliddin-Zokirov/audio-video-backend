const Phone = require("../model/phoneNumber");

module.exports = function createPhone(req, res) {
  const { number, instagram } = req.body;
  console.log(req.body);

  Phone.findOne()
    .then(existingPhone => {
      console.log(existingPhone);

      if (existingPhone) {
        return res.status(400).json({ error: "A phone entry already exists. Cannot create another one." });
      }

      if (!number) {
        return res.status(400).json({ error: "Phone number is required." });
      }

      const newPhone = new Phone({ number, instagram });

      newPhone.save()
        .then((createdPhone) => {
          res.status(201).json(createdPhone);
        })
        .catch((error) => {
          console.error(error);

          if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
          }

          res.status(500).json({ error: "Internal Server Error. Failed to create phone number." });
        });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error. Failed to find phone." });
    });
};
