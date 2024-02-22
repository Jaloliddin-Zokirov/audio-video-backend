const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const CustomerSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: false
    }
});

CustomerSchema.pre('save', async function(next) {
  const customer = this;
  if (!customer.isModified('password')) return next();

  try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(customer.password, salt);
      customer.password = hashedPassword;
      next();
  } catch (error) {
      next(error);
  }
});

const AdminCustomer = mongoose.model("CustomerSchema", CustomerSchema);

module.exports = AdminCustomer;