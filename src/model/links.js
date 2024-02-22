const mongoose = require("mongoose");


const CreateNewLinkSchema = new mongoose.Schema({
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

module.exports = mongoose.model("Links", CreateNewLinkSchema);
