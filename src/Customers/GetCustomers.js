const jwt = require("jsonwebtoken");
const Customer = require("../model/Customer");

module.exports = function GetCuustomer(req, res) {
    const token = req.headers.authorization;

    jwt.verify(token, 'java', (err, decodedToken) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        } else {
          Customer.find()
                .then((result) => {
                    res.json({ adminData: result });
                })
                .catch((err) => {
                    console.log(err);
                    res.status(500).json({ message: 'Internal server error' });
                });
        }
    });
};
