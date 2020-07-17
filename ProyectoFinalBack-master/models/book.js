const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  name: String,
  requestId: String,
  areaId: String,
  authorId: String,
  stateRepresentative: String,
  stateCoordinator: String,
  fileWithNames: {
    type: String,
    default: ""
  },
  fileWithoutNames: {
    type: String,
    default: ""
  },
  dictamenOne: {
    type: String,
    default: ""
  },
  dictamenTwo: {
    type: String,
    default: ""
  },
  dictamenThree: {
    type: String,
    default: ""
  },
  correctedBook: {
    type: String,
    default: ""
  },
  ISBN: {
    type: String,
    default: ""
  },
  fileISBN: {
    type: String,
    default: ""
  },
  acceptedBook: {
    type: String,
    default: ""
  },
  armado: {
    type: String,
    default: ""
  },
  ready: {
    type: String,
    default: ""
  },
  agradecimiento1: {
    type: String,
    default: ""
  },
  agradecimiento2: {
    type: String,
    default: ""
  },
  agradecimiento3: {
    type: String,
    default: ""
  },
  requestUrl: {
    type: String,
    default: ""
  }
});

module.exports = mongoose.model("Book", bookSchema);
