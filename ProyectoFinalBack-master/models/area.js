const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const areaSchema = new Schema({
  name: String
});

module.exports = mongoose.model("Area", areaSchema);
