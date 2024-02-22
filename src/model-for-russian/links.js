const mongoose = require("mongoose");


const CreateNewLinkSchemaRussian = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  link: {
      type: String,
      required: true
  }
});

module.exports = mongoose.model("LinksRussian", CreateNewLinkSchemaRussian);
