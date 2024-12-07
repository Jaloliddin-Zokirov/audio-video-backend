const AWS = require('aws-sdk');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const MainSchema = require("../model/audio"); // O'z modelingizni import qiling

// DigitalOcean S3 konfiguratsiyasi
AWS.config.update({
  accessKeyId: 'DO00Q3H3RQDLUCAGUQLC',
  secretAccessKey: '0vXfJpVjV/1tQa6NrcHo7URzbt+Lubi5n1b1GoAaFh8',
  region: 'us-east-1',
  endpoint: new AWS.Endpoint('https://audio-uploadss.nyc3.digitaloceanspaces.com'),
  s3ForcePathStyle: true,
});

const s3 = new AWS.S3();

// Faylni DigitalOcean S3'dan o'chirish
const deleteOldFileFromS3 = async (fileURL) => {
  try {
    // Faylning nomini URL orqali olish
    const fileKey = fileURL.split('audio-uploads/')[1];
    
    const params = {
      Bucket: 'audio-uploads',
      Key: fileKey,
    };
    
    // Faylni o'chirish
    await s3.deleteObject(params).promise();
    console.log(`Deleted file from S3: ${fileURL}`);
  } catch (error) {
    console.error(`Error deleting file from S3: ${fileURL}`, error);
    throw error;
  }
};

// Faylni S3'ga yuklash
const uploadToS3 = async (file, fileType) => {
  try {
    const fileContent = await fs.readFile(file.path);
    const uniqueFileName = `${uuidv4()}-${Date.now()}.${fileType}`; // Fayl nomini versiyalash

    const params = {
      Bucket: 'audio-uploads',
      Key: uniqueFileName,
      Body: fileContent,
      ACL: 'public-read',
      CacheControl: 'no-cache', // Keshni boshqarish
    };

    const uploadedData = await s3.upload(params).promise();
    console.log('Uploaded to S3:', uploadedData.Location);
    return uploadedData.Location;
  } catch (error) {
    console.error(`Error uploading file ${file.originalname} to S3:`, error);
    throw error;
  }
};

// Audio ma'lumotlarini yangilash
const UpdateAudioEntry = async (req, res) => {
  const { id } = req.params;

  try {
    // Ma'lumotni DB dan olish
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

    // Audios massivini saqlash
    const existingAudios = [...existingAudioEntry.ru.audios]; // Eski audios massivini saqlab qo'yish

    // **Eski fayllarni faqat yangilangan fayllar uchun o'chirish**
    if (req.files['ru_smallaudio']) {
      // Eski smallaudio faylini o'chirish
      await deleteOldFileFromS3(existingAudioEntry.ru.smallaudio);  
      existingAudioEntry.ru.smallaudio = await uploadToS3(req.files['ru_smallaudio'][0], 'mp3');
    }

    if (req.files['ru_image']) {
      // Eski image faylini o'chirish
      await deleteOldFileFromS3(existingAudioEntry.ru.image);  
      existingAudioEntry.ru.image = await uploadToS3(req.files['ru_image'][0], 'png');
    }

    if (req.files['ru_video']) {
      // Eski video faylini o'chirish
      await deleteOldFileFromS3(existingAudioEntry.ru.video);  
      existingAudioEntry.ru.video = await uploadToS3(req.files['ru_video'][0], 'mp4');
    }

    // **Audios massivini yangilash**
    existingAudioEntry.ru = {
      ...Rudata,
      smallaudio: existingAudioEntry.ru.smallaudio,
      image: existingAudioEntry.ru.image,
      video: existingAudioEntry.ru.video,
    };

    existingAudioEntry.uz = {
      ...Uzdata,
      smallaudio: existingAudioEntry.ru.smallaudio,
      image: existingAudioEntry.ru.image,
      video: existingAudioEntry.ru.video,
    };

    // Audios massivini qayta tiklash
    existingAudioEntry.ru.audios = existingAudios;  // Audios massivini saqlab qo'yish

    // Yangilangan ma'lumotlarni saqlash
    const updatedAudioEntry = await existingAudioEntry.save();

    res.status(200).json(updatedAudioEntry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to process the request.', detailedError: error.message });
  }
};

module.exports = UpdateAudioEntry;