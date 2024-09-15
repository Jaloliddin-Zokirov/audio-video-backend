const mongoose = require("mongoose");
const Main = require("../model/audio");

module.exports = async function getAllAudio(req, res) {
  try {
    const audioEntries = await Main.find({}, 'id ru.firstname ru.lastname ru.smallaudio ru.image ru.audios description ru.video ru.instagram uz.firstname uz.lastname uz.smallaudio uz.image uz.audios description uz.video uz.instagram');
    
    if (!audioEntries || audioEntries.length === 0) {
      return res.status(404).json({ error: "Audio data not found." });
    }
    const audioWithUrls = audioEntries.map(entry => {
      const extractFileName = (url) => {
        if (url && typeof url === 'string') {
          const parts = url.split('/');
          return parts.pop() || parts.pop();
        }
        return null; 
      }
    
      const mapAudioData = (audios) => {
        return audios.map(item => {
          return {
            id: item.id,
            title: item.title,
            audio: "https://audio-uploads.blr1.digitaloceanspaces.com/audio-uploads/" + extractFileName(item.audio),
            description: item.description,
          };
        });
      };
    
      return {
        _id: entry._id,
        ru: {
          firstname: entry.ru.firstname,
          lastname: entry.ru.lastname,
          description: entry.ru.description,
          smallaudio: "https://audio-uploads.blr1.digitaloceanspaces.com/audio-uploads/" + extractFileName(entry.ru.smallaudio),
          image: "https://audio-uploads.blr1.digitaloceanspaces.com/audio-uploads/" + extractFileName(entry.ru.image),
          video: "https://audio-uploads.blr1.digitaloceanspaces.com/audio-uploads/" + extractFileName(entry.ru.video),
          instagram: entry.ru.instagram,
          audios: mapAudioData(entry.ru.audios),  // Include audios with URLs here
        },
        uz: {
          firstname: entry.uz.firstname,
          lastname: entry.uz.lastname,
          description: entry.description,
          smallaudio: "https://audio-uploads.blr1.digitaloceanspaces.com/audio-uploads/" + extractFileName(entry.uz.smallaudio),
          image: "https://audio-uploads.blr1.digitaloceanspaces.com/audio-uploads/" + extractFileName(entry.uz.image),
          video: "https://audio-uploads.blr1.digitaloceanspaces.com/audio-uploads/" + extractFileName(entry.uz.video),
          instagram: entry.uz.instagram,
          audios: mapAudioData(entry.uz.audios),  // Include audios with URLs here
        },
      };
    });

    res.status(200).json(audioWithUrls);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch audio entries.', detailedError: error.message });
  }
};
