const AWS = require('aws-sdk');
const path = require('path');
const Main = require("../model/audio");

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

    // Find the index of the audio entry in both languages
    const ruIndex = mainAudio.ru.audios.findIndex(audio => audio.id === id2);
    const uzIndex = mainAudio.uz.audios.findIndex(audio => audio.id === id2);

    if (ruIndex === -1 || uzIndex === -1) {
      return res.status(404).json({ error: 'Audio entry not found.' });
    }

    // Remove the audio entry from both languages
    mainAudio.ru.audios.splice(ruIndex, 1);
    mainAudio.uz.audios.splice(uzIndex, 1);

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


