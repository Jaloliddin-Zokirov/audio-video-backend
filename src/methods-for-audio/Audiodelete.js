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

// Delete function for files
const deleteFromS3 = async (fileURL) => {
  const key = fileURL.split('audio-uploads/')[1]; // Remove the base URL
  const params = {
    Bucket: 'audio-uploads',
    Key: key,
  };

  console.log(`Deleting file with key: ${key}`);

  try {
    const response = await s3.deleteObject(params).promise();
    console.log(`Deleted file: ${key}`, response); // Log response for debugging
  } catch (err) {
    console.error(`Error deleting file: ${key}`, err);
    throw new Error(`Error deleting file: ${key}`);
  }
};

module.exports = async function deleteAudio(req, res) {
  const { id } = req.params;

  try {
    const audioEntry = await AudioSchema.findById(id);
    if (!audioEntry) {
      return res.status(404).json({ error: 'Audio entry not found.' });
    }

    // Prepare deletion promises for files in the audio entry
    const deletionPromises = [];

    // Check for each file in the audio entry and add deletion tasks to the array
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
          deletionPromises.push(deleteFromS3(item.audio)); // Delete each audio file
        }
      });
    }

    // Wait for all deletions to complete before removing the entry
    await Promise.all(deletionPromises);

    // Now delete the audio entry from the database
    const deletedAudioEntry = await AudioSchema.findByIdAndDelete(id);
    res.status(200).json({ message: 'Audio entry and associated files successfully deleted.', deletedAudioEntry });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid audio entry ID format.' });
    }
    res.status(500).json({ error: 'Internal Server Error. Failed to delete the audio entry.' });
  }
};