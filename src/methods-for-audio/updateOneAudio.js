const AWS = require('aws-sdk');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const Main = require("../model/audio");
const path = require('path');

AWS.config.update({
  accessKeyId: "DO006ALHHDYXV6HC42D4",
  secretAccessKey: "zupg1Xk9orEhnsisf4w5mzIiSDKdWuZkOfs0VYHMTd4",
  region: 'us-east-1',
  endpoint: new AWS.Endpoint('https://audio-uploadss.blr1.digitaloceanspaces.com'),
  s3ForcePathStyle: true,
});

const s3 = new AWS.S3();

const uploadToS3 = async (file) => {
  const fileContent = await fs.readFile(file.path);
  const params = {
    Bucket: 'audio-uploads',
    Key: `${uuidv4()}.mp3`,
    Body: fileContent,
    ACL: 'public-read',
  };
  const uploadedData = await s3.upload(params).promise();
  console.log('Uploaded to S3:', uploadedData.Location);
  return uploadedData.Location;
};

const deleteFromS3 = async (url) => {
  const key = path.basename(url);
  const params = {
    Bucket: 'audio-uploads',
    Key: key
  };
  await s3.deleteObject(params).promise();
};

const UpdateById = async (req, res) => {
  try {
    const { uz, ru } = req.body;
    const { id, id2 } = req.params;
    const uzData = JSON.parse(uz);
    const ruData = JSON.parse(ru);

    if (!ruData.title || !ruData.description || !uzData.title || !uzData.description) {
      return res.status(400).json({ error: 'Missing required fields for updating the nested audio entry.' });
    }

    const mainAudio = await Main.findById(id);

    if (!mainAudio) {
      return res.status(404).json({ error: 'Main Audio document not found.' });
    }

    const audioFiles = req.files['audio'];

    if (!audioFiles || audioFiles.length === 0) {
      return res.status(400).json({ error: 'No audio files provided.' });
    }

    const ruAudioPromises = audioFiles.map(async (audio) => {
      const audioURL = await uploadToS3(audio, 'mp3');
      return {
        id: id2,
        title: ruData.title,
        description: ruData.description,
        audio: audioURL,
      };
    });

    const uzAudioPromises = audioFiles.map(async (audio) => {
      const audioURL = await uploadToS3(audio, 'mp3');
      return {
        id: id2,
        title: uzData.title,
        description: uzData.description,
        audio: audioURL,
      };
    });

    const [ruAudios, uzAudios] = await Promise.all([
      Promise.all(ruAudioPromises),
      Promise.all(uzAudioPromises),
    ]);

    // Find the index of the audio entry with the provided id2
    const ruAudioIndex = mainAudio.ru.audios.findIndex((audio) => audio.id === id2);
    const uzAudioIndex = mainAudio.uz.audios.findIndex((audio) => audio.id === id2);

    // Delete the existing audio file from S3
    await deleteFromS3(mainAudio.ru.audios[ruAudioIndex].audio);
    await deleteFromS3(mainAudio.uz.audios[uzAudioIndex].audio);

    // Update the specific audio entry with the new data
    mainAudio.ru.audios[ruAudioIndex] = ruAudios[0];
    mainAudio.uz.audios[uzAudioIndex] = uzAudios[0];

    const updatedMainAudio = await mainAudio.save();

    if (updatedMainAudio) {
      res.status(200).json({ message: 'Nested audio entry updated successfully', data: updatedMainAudio });
    } else {
      throw new Error('Failed to update the nested audio entry.');
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error.', detailedError: error.message });
  }
};

module.exports = UpdateById;
