const path = require("path");
const fs = require("fs");
const Customer= require("../model/Customer");
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")

module.exports = loginCustomer = async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Customer.findOne({ username });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const jwToken = jwt.sign(
      { username: admin.username, isAdmin: true },
      'java',
      { expiresIn: '10H' }
    );

    admin.token = jwToken

    await admin.save();
    
    res.json({ jwToken });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
