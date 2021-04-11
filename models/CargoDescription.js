const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const cargoDescriptionSchema = new Schema({
  description: {
    UK: {
      type: String,
      required: false,
    },
    RU: {
      type: String,
      required: false,
    },
    EN: {
      type: String,
      required: false,
    },
  },

  ref: {
    type: String,
    required: false,
  },
});
const cargoDescription = mongoose.model(
  "cargoDescription",
  cargoDescriptionSchema
);
module.exports = cargoDescription;
