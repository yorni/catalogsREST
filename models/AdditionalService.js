const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const additionalServiceSchema = new Schema({
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

  categoryGroup: {
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

  sender: {
    type: String,
    required: false,
  },
  recipient: {
    type: String,
    required: false,
  },
  serviceGroup: {
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
  serviceGroupId: {
    type: String,
    required: false,
  },
  fixedCount: {
    type: String,
    required: false,
  },
  staticName: {
    type: String,
    required: false,
  },

  categoryGroupID: {
    type: String,
    required: false,
  },
  sortOrder: {
    type: String,
    required: false,
  },
  ref: {
    type: String,
    required: false,
  },
});
const additionalService = mongoose.model(
  "additionalService",
  additionalServiceSchema
);
module.exports = additionalService;
