const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Customer = require('../model/Customer');
const AWS = require('aws-sdk');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

// AWS Configuration
const secretAccessKey = "zupg1Xk9orEhnsisf4w5mzIiSDKdWuZkOfs0VYHMTd4";
const accessKeyId = "DO006ALHHDYXV6HC42D4";

AWS.config.update({
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
  region: 'us-east-1',
  endpoint: new AWS.Endpoint('https://audio-videos.nyc3.digitaloceanspaces.com'),
  s3ForcePathStyle: true,
});

const s3 = new AWS.S3();
const uploadToS3 = async (file) => {
    try {
        const fileContent = await fs.readFile(file.path);
        const params = {
            Bucket: 'audio-uploads',
            Key: `${uuidv4()}.png`,
            Body: fileContent,
            ACL: 'public-read',
        };
        const uploadedData = await s3.upload(params).promise();
        console.log('Uploaded to S3:', uploadedData.Location);
        return uploadedData.Location;
    } catch (error) {
        console.error('Error uploading file to S3:', error);
        throw error;
    }
};

module.exports = CreateCusmtomers = async (req, res) => {
    const token = req.headers.authorization;

    jwt.verify(token, 'java', async (err, decodedToken) => {
        if (err) {
            return res.status(401).json({ error: 'Unauthorized' });
        } else {
            try {
                const updateFields = req.body;  

                const CustomerBlog = new Customer({
                  id: uuidv4(),
                    email: updateFields.email,
                    username: updateFields.email.split("@")[0],
                    password: generatePassword(12,updateFields.email,updateFields.email.split("@")[0])
                }); 

                await CustomerBlog.save();
                return res.status(200).json({ message: 'Admin updated successfully', Customer });
            } catch (error) {
                console.error('Error updating admin:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }
        }
    });
};


function generatePassword(length,email,username) {
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
  sendRegistrationEmail(email,password,username)
  return password;
}

async function sendRegistrationEmail(email, temporaryPassword,username) {
  try {
  let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: 'abduxalilovjavohir393@gmail.com',
          pass: 'vsld zabt lglg fhbw'
      },
  });
  console.log(email);
  let mailOptions = {
      from: 'abduxalilovjavohir393@gmail.com',
      to: email,
      subject: 'Your Temporary Password for Registration',
      text: `Your username:${username}, password is: ${temporaryPassword}. Please use this password to log in and set your permanent password.`
  };
  await transporter.sendMail(mailOptions);
  console.log('Email sent successfully to:', email);
} catch (error) {
  console.error('Error sending email:', error);
}
}
