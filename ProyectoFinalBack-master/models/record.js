const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recordSchema = new Schema({
  userId: String,
  action: String,
  date: { type: String },
  time: { type: String }
});

module.exports = mongoose.model("Record", recordSchema);
