const AudioSchema = require("../model/audio");

module.exports = GetInner = async function (req, res) {
  const mainAudioId = req.params.id;
  const innerAudioId = req.params.id2; 

  try {
    const mainAudioDocument = await AudioSchema.findById(mainAudioId);

    if (!mainAudioDocument) {
      return res.status(404).json({ error: "Main Audio document not found." });
    }

    const ruAudioEntry = mainAudioDocument.ru?.audios?.find(audio => audio.id === innerAudioId);

    const uzAudioEntry = mainAudioDocument.uz?.audios?.find(audio => audio.id === innerAudioId);

    if (ruAudioEntry) {
      return res.status(200).json({ language: "ru", audio: ruAudioEntry });
    }

    if (uzAudioEntry) {
      return res.status(200).json({ language: "uz", audio: uzAudioEntry });
    }

    return res.status(404).json({ error: "Inner Audio entry not found in both ru and uz." });
  } catch (error) {
    console.error(error);

    if (error.kind === "ObjectId") {
      return res.status(400).json({ error: "Invalid audio ID format." });
    }

    res.status(500).json({ error: "Internal Server Error.", detailedError: error.message });
  }
};