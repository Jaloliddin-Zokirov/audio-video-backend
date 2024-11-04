const AWS = require('aws-sdk');
const path = require('path');
const Main = require("../model/audio");

const secretAccessKey = "y8pBkCDHq5rs47P3M7tsgdfhnMuaAlL0BlsTJCIMNIM";
const accessKeyId = "DO00URTADLFCKV6TVHG9";

AWS.config.update({
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
  region: 'us-east-1',
  endpoint: new AWS.Endpoint('https://audio-uploadss.blr1.digitaloceanspaces.com'),
  s3ForcePathStyle: true,
});

const s3 = new AWS.S3();

const deleteFromS3 = async (url) => {
  const key = path.basename(url);
  const params = {
    Bucket: 'audio-uploads',
    Key: key
  };

  try {
    await s3.deleteObject(params).promise();
    console.log(`Deleted file from S3: ${url}`);
  } catch (error) {
    console.error(`Error deleting file from S3: ${url}`, error);
    throw error;
  }
};

const delteInner = async (req, res) => {
  try {
    const { id, id2 } = req.params;

    const mainAudio = await Main.findById(id).maxTimeMS(30000);

    if (!mainAudio) {
      return res.status(404).json({ error: 'Main Audio document not found.' });
    }

    // Find the audio entry in both languages
    const ruAudio = mainAudio.ru.audios.find(audio => audio.id === id2);
    const uzAudio = mainAudio.uz.audios.find(audio => audio.id === id2);

    if (!ruAudio && !uzAudio) {
      return res.status(404).json({ error: 'Audio entry not found.' });
    }

    // Delete from S3 if URL is found
    if (ruAudio?.url) await deleteFromS3(ruAudio.url);
    if (uzAudio?.url) await deleteFromS3(uzAudio.url);

    // Remove the audio entry from both languages
    mainAudio.ru.audios = mainAudio.ru.audios.filter(audio => audio.id !== id2);
    mainAudio.uz.audios = mainAudio.uz.audios.filter(audio => audio.id !== id2);

    const updatedMainAudio = await mainAudio.save();

    if (updatedMainAudio) {
      res.status(200).json({ message: 'Audio entry deleted successfully', data: updatedMainAudio });
    } else {
      throw new Error('Failed to delete the audio entry.');
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error.', detailedError: error.message });
  }
};

module.exports = delteInner;