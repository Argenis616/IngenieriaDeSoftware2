const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const requestSchema = new Schema({
  areaId: String,
  authorId: String,
  bookName: String,
  justification: String,
  docenciaActive: Boolean,
  docenciaPriority: String,
  docenciaJustification: String,
  docenciaKindOfText: String,
  researchActive: Boolean,
  researchPriority: String,
  difusionActive: Boolean,
  difusionPriority: String,
  myPublic: String,
  market: String,
  numberOfBooks: String,
  financing: String,
  autorization: Boolean
});

module.exports = mongoose.model("Request", requestSchema);
