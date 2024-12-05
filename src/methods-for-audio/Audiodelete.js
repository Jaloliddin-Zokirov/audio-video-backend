const AWS = require('aws-sdk');
const AudioSchema = require("../model/audio");
const path = require('path');

const secretAccessKey = "0vXfJpVjV/1tQa6NrcHo7URzbt+Lubi5n1b1GoAaFh8";
const accessKeyId = "DO00Q3H3RQDLUCAGUQLC";

AWS.config.update({
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
  region: 'us-east-1',
  endpoint: new AWS.Endpoint('https://audio-uploadss.nyc3.digitaloceanspaces.com'),
  s3ForcePathStyle: true,
});

const s3 = new AWS.S3();

module.exports = async function deleteAudio(req, res) {
  const { id } = req.params;

  try {
    const audioEntry = await AudioSchema.findById(id);
    console.log(audioEntry);
    

    if (!audioEntry) {
      return res.status(404).json({ error: 'Audio entry not found.' });
    }

    const deletionPromises = [];

    if (audioEntry.smallaudio) {
      deletionPromises.push(deleteFromS3(audioEntry.smallaudio));
    }
    if (audioEntry.image) {
      deletionPromises.push(deleteFromS3(audioEntry.image));
    }
    if (audioEntry.video) {
      deletionPromises.push(deleteFromS3(audioEntry.video));
    }

    if (audioEntry.audios && audioEntry.audios.length > 0) {
      audioEntry.audios.forEach(item => {
        deletionPromises.push(deleteFromS3(item.audio));
      });
    }

    await Promise.all(deletionPromises); // Wait for all deletions to complete

    const deletedAudioEntry = await AudioSchema.findByIdAndDelete(id);

    res.status(200).json({ message: 'Audio entry successfully deleted.', deletedAudioEntry });

  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid audio entry ID format.' });
    }
    res.status(500).json({ error: 'Internal Server Error. Failed to delete the audio entry.' });
  }
};

const deleteFromS3 = async (url) => {
  const key = path.basename(url);
  const params = {
    Bucket: 'audio-uploads',
    Key: key
  };
  console.log(key);
  
  await s3.deleteObject(params).promise();
};
