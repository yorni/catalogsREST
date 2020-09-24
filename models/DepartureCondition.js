const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const departureConditionSchema = new Schema({
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

  hint: {
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

  timeTable: [
    {
      condition: {
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
      sendingTime: {
        type: String,
        required: false,
      },
      acceptableFromTime: {
        type: String,
        required: false,
      },
      acceptableToTime: {
        type: String,
        required: false,
      },
    },
  ],
});
const departureCondition = mongoose.model(
  "departureCondition",
  departureConditionSchema
);
module.exports = departureCondition;
