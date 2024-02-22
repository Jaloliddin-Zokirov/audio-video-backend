const fs = require('fs');  // Import the fs module
const Logo = require("../model/logo");
const deleteAllFilesFromUploadsFolder = require('../helpers');

module.exports =updateLogo = async function(req, res) {
  const { id } = req.params; 
  const { title } = req.body;
  const image = req.files && req.files["dark"] ? req.files["dark"][0].path : undefined;
  const image2 = req.files && req.files["light"] ? req.files["light"][0].path : undefined;
  console.log(image, title, id);

  if (!title && !image||!image2) {
    return res.status(400).json({ err: "Nothing to update." });
  }

  const readFileToBuffer = (filePath) => {
    try {
      return fs.readFileSync(filePath);
    } catch (error) {
      console.error(`Error reading file from path ${filePath}:`, error);
      return null;
    }
  };
  deleteAllFilesFromUploadsFolder()

  const imageBuffer = readFileToBuffer(image);
  const light = readFileToBuffer(image2);
  
  try {
    let logo = await Logo.findById(id);

    if (!logo) {
      return res.status(404).json({ err: "Logo not found." });
    }

    if (title) {
      logo.title = title;
    }

    if (image) {
      logo.dark = imageBuffer;
    }

    if (image2) {
      logo.light =light;
    }


    await logo.save();

    res.status(200).json({
      id: logo._id,
      title: logo.title,
      dark: `/uploads-logo/${image}`  ,
      light: `/uploads-logo/${image2}` 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error." });
  }
};
