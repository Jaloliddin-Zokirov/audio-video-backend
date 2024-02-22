const Links = require("../model/links");

const { v4: uuidv4 } = require('uuid');
module.exports = function createLinks(req, res) {
  const { title, link } = req.body;


  if (!title ||!link) {
    return res.status(400).json({ error: 'Missing required fields for creating a new inner audio entry.'  });
  }

  const newPhone = new Links({id:uuidv4(),title,link });

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
};
