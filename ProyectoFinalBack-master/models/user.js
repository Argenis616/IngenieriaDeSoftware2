const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  areaId: String,
  email: String,
  password: String,
  userType: {
    type: String,
    enum: ["Coordinator", "Representative", "Author"]
  },
  active: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model("User", userSchema);
