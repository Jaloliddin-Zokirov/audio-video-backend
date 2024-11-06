const MainSchema = require("../model/audio");

const getById = async (req, res) => {
  const audioId = req.params.id;

  try {
    const audioDocument = await MainSchema.findById(audioId).maxTimeMS(60000);// Increase to 60 seconds

    if (!audioDocument) {
      return res.status(404).json({ error: 'Audio document not found.' });
    }

    const extractFileName = (url) => {
      const parts = url.split('/');
      return parts.pop() || parts.pop();
    };

    const extractLanguageData = (languageData) => {
      return {
        _id: languageData._id,
        firstname: languageData.firstname,
        lastname: languageData.lastname,
        description: languageData.description,
        smallaudio: "https://audio-upload.nyc3.digitaloceanspaces.com/audio-uploads/" + extractFileName(languageData.smallaudio),
        image: "https://audio-upload.nyc3.digitaloceanspaces.com/audio-uploads/" + extractFileName(languageData.image),
        video: "https://audio-upload.nyc3.digitaloceanspaces.com/audio-uploads/" + extractFileName(languageData.video),
        instagram: languageData.instagram,
        audios: languageData.audios.map(item => ({
          id: item.id,
          title: item.title,
          audio: "https://audio-upload.nyc3.digitaloceanspaces.com/audio-uploads/" + extractFileName(item.audio),
          description: item.description,
        })),
      };
    };

    const eldata = {
      id: audioDocument._id,
      ru: extractLanguageData(audioDocument.ru),
      uz: extractLanguageData(audioDocument.uz),
    };

    res.status(200).json(eldata);

  } catch (error) {
    console.error(error);

    if (error.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid audio ID format.' });
    }

    res.status(500).json({ error: 'Internal Server Error.', detailedError: error.message });
  }
};

module.exports = getById;
