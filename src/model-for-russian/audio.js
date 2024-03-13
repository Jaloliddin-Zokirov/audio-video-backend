const mongoose = require("mongoose");

const CreateNewLinkSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
});

const nestedAudioSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: String,
  audio: {
    type: String,
    required: true,
  },
  waveformData: {
    type: [Number],
    required: true,
  },
});

const audioSchemaRussian = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  smallaudio: {
    type: String,
    required: true,
  },
  video: {
    type: String,
    required: true,
  },
  instagram: {
    type: String,
    required: false,
  },
  audios: [nestedAudioSchema],
});

module.exports = mongoose.model("AudioRussian", audioSchemaRussian);
