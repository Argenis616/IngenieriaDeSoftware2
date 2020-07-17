const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const fileSchema = new Schema({
  url: String
});

module.exports = mongoose.model("File", fileSchema);
