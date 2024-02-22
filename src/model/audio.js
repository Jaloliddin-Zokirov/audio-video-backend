const mongoose = require("mongoose");

const nestedAudioSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type:String,
    required:true
  },
  audio: {
    type: String,
    required: true,
  }
});

const languageSchema = new mongoose.Schema({
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
  smallaudio: {
    type: String,
    required: true,
  },
  smallimage:{
    type:String,
    required:false
  },
  image: {
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

const mainSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  ru: languageSchema,
  uz: languageSchema, 
});

module.exports = mongoose.model("Main", mainSchema);
