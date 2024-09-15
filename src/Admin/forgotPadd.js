const Admin = require('../model/admin');
const Confirm = require('../model/confirm');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'jaloliddinzokirov.dev@gmail.com',
        pass: 'vsld zabt lglg fhbw'
    }
});

module.exports = async function SendConfirmationNumber(req, res) {
    try {
        const adminEmail = req.body.email;
        const admin = await Admin.findOne({ email: adminEmail });

        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });
        }

        const confirmationNumber = Math.floor(100000 + Math.random() * 900000);

        await transporter.sendMail({
            from: 'jaloliddinzokirov.dev@gmail.com',
            to: adminEmail,
            subject: 'Confirmation Number',
            text: `Your confirmation number is: ${confirmationNumber}`
        });

        await Confirm.findOneAndUpdate(
            { email: adminEmail },
            { code: confirmationNumber },
            { upsert: true }
        );

        return res.status(200).json({ message: 'Confirmation number sent successfully' });
    } catch (error) {
        console.error('Error sending confirmation number:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
