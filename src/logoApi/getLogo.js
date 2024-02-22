const fs = require("fs");
const path = require("path");
const Logo = require("../model/logo");

function arrayBufferToBuffer(arrayBuffer) {
  const buffer = Buffer.alloc(arrayBuffer.byteLength);
  const view = new Uint8Array(arrayBuffer);
  for (let i = 0; i < buffer.length; ++i) {
    buffer[i] = view[i];
  }
  return buffer;
}

module.exports = getLogo = async function (req, res) {
  try {
    const logos = await Logo.find();

    const logosWithUrls = logos.map((logo) => {
      const darkPath = path.join(__dirname, '../../', 'uploads-logo', `image-${logo._id}-dark.png`);
      const lightPath = path.join(__dirname, '../../', 'uploads-logo', `image-${logo._id}-light.png`);

      if (logo.dark && !fs.existsSync(darkPath)) {
        fs.writeFileSync(darkPath, arrayBufferToBuffer(logo.dark.buffer), 'binary');
      }

      if (logo.light && !fs.existsSync(lightPath)) {
        fs.writeFileSync(lightPath, arrayBufferToBuffer(logo.light.buffer), 'binary');
      }

      return {
        ...logo._doc,
        light: `/uploads-logo/image-${logo._id}-light.png`,
        dark : `/uploads-logo/image-${logo._id}-dark.png`,
      };
    });

    res.status(200).json(logosWithUrls);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error." });
  }
};
