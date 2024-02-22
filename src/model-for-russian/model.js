const mongoose = require("mongoose")
const Schema = require("schema")


const blogSchemaRussian = new mongoose.Schema({
  title:{
    type:String,
    required:true
  },
  description:{
    type:String,
    required:true
  },
  image:{
    type:Buffer,
    required: true
  },
},{timestamps:true});

const Blog = mongoose.model("BlogRussian",blogSchemaRussian)
module.exports = Blog  
