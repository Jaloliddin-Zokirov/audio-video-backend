const AWS = require('aws-sdk');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const MainSchema = require("../model/audio");

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

module.exports = async function CreateForAudio(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const { ru, uz } = req.body;

  console.log(req.body);
  const Rudata = JSON.parse(ru);
  const Uzdata = JSON.parse(uz);

  const ruSmallaudioFile = req.files['ru_smallaudio'] ? req.files['ru_smallaudio'][0] : null;
  const ruImageFile = req.files['ru_image'] ? req.files['ru_image'][0] : null;
  const ruVideoFile = req.files['ru_video'] ? req.files['ru_video'][0] : null;

  if (
    !Rudata ||
    !Rudata.firstname ||
    !Rudata.lastname ||
    !Rudata.description ||
    !Uzdata ||
    !Uzdata.firstname ||
    !Uzdata.lastname ||
    !Uzdata.description ||
    !ruSmallaudioFile ||
    !ruImageFile ||
    !ruVideoFile
  ) {
    console.log('Missing required fields for creating a new audio entry.');
    return res.status(400).json({
      error: 'Missing required fields for creating a new audio entry.',
    });
  }

  try {
    const [ruSmallaudioURL, ruImageURL, ruVideoURL] = await Promise.all([
      uploadToS3(ruSmallaudioFile, 'mp3'),
      uploadToS3(ruImageFile, 'png'),
      uploadToS3(ruVideoFile, 'mp4'),
    ]);

    const newAudioEntry = new MainSchema({
      id: uuidv4(),
      ru: {
        ...Rudata,
        smallaudio: ruSmallaudioURL,
        image: ruImageURL,
        video: ruVideoURL,
        audios: [],
      },
      uz: {
        ...Uzdata,
        smallaudio: ruSmallaudioURL,
        image: ruImageURL,
        video: ruVideoURL,
        audios: [],
      },
    });

    const createdAudio = await newAudioEntry.save();
    res.status(201).json("created");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to process the request.', detailedError: error.message });
  }
};
