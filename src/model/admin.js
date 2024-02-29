const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

const AdminSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        default: "jaloliddin"
    },
    lastname: {
        type: String,
        required: true,
        default: "zokirov"
    },
    email: {
        type: String,
        required: true,
        default: "jaloliddinzokirov.dev@gmail.com"
    },
    username: {
        type: String,
        required: true,
        default: 'jaloliddinzokirov.dev'
    },
    password: {
        type: String,
        required: true,
    },
    token: {
        type: String 
    },
    code:{
        type:String
    },
    image: {
        type: String,
        required: false
    }
});

AdminSchema.pre('save', async function(next) {
    const admin = this;
    if (!admin.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(admin.password, salt);
        admin.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

const Admin = mongoose.model("Admin", AdminSchema);


async function sendRegistrationEmail(email, temporaryPassword) {
  try {
  let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: 'jaloliddinzokirov.dev@gmail.com',
          pass: 'uwum xfjz fpxb xgtq'
      },
  });
  console.log(email);
  let mailOptions = {
      from: 'jaloliddinzokirov.dev@gmail.com',
      to: email,
      subject: 'Your Temporary Password for Registration',
      text: `Your temporary password is: ${temporaryPassword}. Please use this password to log in and set your permanent password.`
  };
  await transporter.sendMail(mailOptions);
  console.log('Email sent successfully to:', email);
} catch (error) {
  console.error('Error sending email:', error);
}
}

Admin.countDocuments({})
    .then(count => {
        if (count === 0) {
            const admin = new Admin();
            admin.password = generatePassword(12); 
            return admin.save();
        } else {
            console.log("Admin already exists");
            return Promise.resolve(); 
        }
    })
    .then(savedAdmin => {
        if (savedAdmin) {
            console.log('Admin created successfully:', savedAdmin);
        }
    })
    .catch(error => {
        console.error('Error creating/admin:', error);
    });

function generatePassword(length) {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    const hyphenPositions = [4, 8];

    for (let i = 0; i < length; i++) {
        if (hyphenPositions.includes(i)) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            password += '-' + characters[randomIndex];
        } else {
            const randomIndex = Math.floor(Math.random() * characters.length);
            password += characters[randomIndex];
        }
    }
    sendRegistrationEmail("abduxalilovjavohir393@gmail.com",password)
    return password;
}

module.exports = Admin;
