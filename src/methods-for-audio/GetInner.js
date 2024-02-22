const AudioSchema = require("../model/audio");

module.exports =GetInner = async function (req, res) {
  const mainAudioId = req.params.id;
  const innerAudioId = req.params.id2;

  try {
    const mainAudioDocument = await AudioSchema.findById(mainAudioId);

    if (!mainAudioDocument) {
      return res.status(404).json({ error: 'Main Audio document not found.' });
    }

    const innerAudioEntry = mainAudioDocument.audios.find(audio => audio.id === innerAudioId);

    if (!innerAudioEntry) {
      return res.status(404).json({ error: 'Inner Audio entry not found.' });
    }

    res.status(200).json(innerAudioEntry);

  } catch (error) {
    console.error(error);

    if (error.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid audio ID format.' });
    }

    res.status(500).json({ error: 'Internal Server Error.', detailedError: error.message });
  }
};
