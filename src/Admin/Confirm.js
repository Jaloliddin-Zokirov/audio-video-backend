const Admin = require('../model/admin');
const Confirm = require('../model/confirm');
const jwt = require('jsonwebtoken');

module.exports = async function confirmConfirmationCode(req, res) {
    try {
        const { email, code } = req.body;

        const admin = await Admin.findOne({ email });
        const confirmRecord = await Confirm.findOne({ email });

        if (!admin || !confirmRecord) {
            return res.status(404).json({ error: 'Admin or confirmation record not found' });
        }

        if (confirmRecord.code !== code) {
            return res.status(400).json({ error: 'Confirmation code is incorrect' });
        }

        confirmRecord.code = null;
        await confirmRecord.save();

        const token = jwt.sign({ email: admin.email, isAdmin: admin.isAdmin }, 'java', { expiresIn: '1h' });

        return res.status(200).json({ message: 'Confirmation code confirmed successfully', token,admin });
    } catch (error) {
        console.error('Error confirming confirmation code:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
