const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const townSchema = new Schema({
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
  district: {
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

  region: {
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

  oldDescription: {
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
  townSize: {
    type: Number,
    required: false,
  },

  ref: {
    type: String,
    required: false,
  },

  place_id: {
    type: String,
    required: false,
  },

  rspRef: {
    type: String,
    required: false,
  },
  containsRsp: {
    type: Boolean,
    required: false,
  },

  rspList: [
    {
      type: String,
      required: false,
    },
  ],
});
const town = mongoose.model("town", townSchema);
module.exports = town;
