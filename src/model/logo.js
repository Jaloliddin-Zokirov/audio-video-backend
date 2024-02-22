const mongoose = require("mongoose");

const logoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  light: {
    type: Buffer,
    required: true,
  },
  dark: {
    type: Buffer,
    required: true,
  },
}, { timestamps: true });

const Logo = mongoose.model("Logo", logoSchema);

module.exports = Logo;
