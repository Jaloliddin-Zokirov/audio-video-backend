const AWS = require('aws-sdk');
const path = require('path');
const AudioSchema = require("../model/audio");

const secretAccessKey = "y8pBkCDHq5rs47P3M7tsgdfhnMuaAlL0BlsTJCIMNIM";
const accessKeyId = "DO00URTADLFCKV6TVHG9";

AWS.config.update({
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
  region: 'us-east-1',
  endpoint: new AWS.Endpoint('https://audio-uploads.blr1.digitaloceanspaces.com'),
  s3ForcePathStyle: true,
});

const s3 = new AWS.S3();

const deleteFromS3 = async (url) => {
  const key = path.basename(url);
  const params = {
    Bucket: 'audio-uploads',
    Key: key,
  };
  try {
    await s3.deleteObject(params).promise();
    console.log(`Deleted from S3: ${key}`);
  } catch (error) {
    console.error(`Failed to delete ${key} from S3:`, error);
    throw error;
  }
};

module.exports = async function deleteAudio(req, res) {
  const { id } = req.params;

  try {
    const audioEntry = await AudioSchema.findById(id);
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
        if (item.audio) {
          deletionPromises.push(deleteFromS3(item.audio));
        }
      });
    }

    await Promise.all(deletionPromises);

    const deletedAudioEntry = await AudioSchema.findByIdAndDelete(id);

    res.status(200).json({
      message: 'Audio entry successfully deleted.',
      deletedAudioEntry,
    });

  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid audio entry ID format.' });
    }
    res.status(500).json({
      error: 'Internal Server Error. Failed to delete the audio entry.',
      detailedError: error.message,
    });
  }
};