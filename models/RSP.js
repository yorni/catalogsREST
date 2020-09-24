const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const rspSchema = new Schema({
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
  address: {
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
  searchstring: {
    type: String,
    required: false,
  },

  place_id: {
    type: String,
    required: false,
  },

  phone: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  ref: {
    type: String,
    required: false,
  },
  number: {
    type: String,
    required: false,
  },
  latitude: {
    type: Number,
    required: false,
  },
  longitude: {
    type: Number,
    required: false,
  },
  cityRef: {
    type: String,
    required: false,
  },
  schedule: {
    monday: {
      type: String,
      required: false,
    },
    tuesday: {
      type: String,
      required: false,
    },
    wednesday: {
      type: String,
      required: false,
    },
    thursday: {
      type: String,
      required: false,
    },
    friday: {
      type: String,
      required: false,
    },
    saturday: {
      type: String,
      required: false,
    },
    sunday: {
      type: String,
      required: false,
    },
  },
});
const rsp = mongoose.model("rsp", rspSchema);
module.exports = rsp;
