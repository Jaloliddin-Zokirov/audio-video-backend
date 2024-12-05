const AWS = require('aws-sdk');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const MainSchema = require("../model/audio");

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

const uploadToS3 = async (file, fileType) => {
  try {
    const fileContent = await fs.readFile(file.path);
    const params = {
      Bucket: 'audio-uploads',
      Key: `${uuidv4()}.${fileType}`,
      Body: fileContent,
      ACL: 'public-read',
    };
    const uploadedData = await s3.upload(params).promise();
    console.log('Uploaded to S3:', uploadedData.Location);
    return uploadedData.Location;
  } catch (error) {
    console.error(`Error uploading file ${file.originalname} to S3:`, error);
    throw error;
  }
};

module.exports = async function UpdateAudioEntry(req, res) {
  const { id } = req.params;

  try {
    const existingAudioEntry = await MainSchema.findById(id).maxTimeMS(30000);

    if (!existingAudioEntry) {
      return res.status(404).json({ error: 'Audio entry not found.' });
    }

    const { ru, uz } = req.body;

    const Rudata = JSON.parse(ru);
    const Uzdata = JSON.parse(uz);

    if (
      !Rudata ||
      !Rudata.firstname ||
      !Rudata.lastname ||
      !Rudata.description ||
      !Uzdata ||
      !Uzdata.firstname ||
      !Uzdata.lastname ||
      !Uzdata.description
    ) {
      console.log('Missing required fields for updating the audio entry.');
      return res.status(400).json({
        error: 'Missing required fields for updating the audio entry.',
      });
    }

    const [ruSmallaudioURL, ruImageURL, ruVideoURL] = await Promise.all([
      uploadToS3(req.files['ru_smallaudio'][0], 'mp3'),
      uploadToS3(req.files['ru_image'][0], 'png'),
      uploadToS3(req.files['ru_video'][0], 'mp4'),
    ]);

    existingAudioEntry.ru = {
      ...Rudata,
      smallaudio: ruSmallaudioURL,
      image: ruImageURL,
      video: ruVideoURL,
    };

    existingAudioEntry.uz = {
      ...Uzdata,
      smallaudio: ruSmallaudioURL,
      image: ruImageURL,
      video: ruVideoURL,
    };

    const updatedAudioEntry = await existingAudioEntry.save();

    res.status(200).json(updatedAudioEntry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to process the request.', detailedError: error.message });
  }
};
