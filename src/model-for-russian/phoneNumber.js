const mongoose = require("mongoose");

const PhoneschemaRussian = new mongoose.Schema({
  number: {
    type: String,
    required: true,
  },
  instagram:{
    type: String,
  }
}, { timestamps: true });

const Phone = mongoose.model("PhoneRussian", PhoneschemaRussian);

module.exports = Phone;
