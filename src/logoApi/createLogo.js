const Logo = require("../model/logo");
const fs = require("fs");

module.exports =  createLogo = async (req, res) => {
  const { title } = req.body;
  const darkImage = req.files && req.files["dark"] ? req.files["dark"][0].path : undefined;
  const lightImage = req.files && req.files["light"] ? req.files["light"][0].path : undefined;

  const existingLogo = await Logo.findOne();
  if (existingLogo) {
    return res.status(400).json({ error: "A logo already exists. Cannot create another one." });
  }

  if (!title || !darkImage || !lightImage) {
    return res.status(400).json({ error: "Missing required fields for creating a new logo." });
  }

  const readFileToBuffer = (filePath) => {
    return fs.readFileSync(filePath);
  };

  const darkBuffer = readFileToBuffer(darkImage);
  const lightBuffer = readFileToBuffer(lightImage);

  const newLogo = new Logo({
    title,
    dark: darkBuffer,
    light: lightBuffer,
  });

  try {
    const savedLogo = await newLogo.save();
    res.status(201).json(savedLogo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error." });
  }
};
