const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const cargoTypeSchema = new Schema(
  {
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

    type: {
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

    typeref: {
      type: String,
      required: false,
    },

    limits: {
      height: {
        min: {
          type: Number,
          required: false,
        },
        max: {
          type: Number,
          required: false,
        },
      },

      width: {
        min: {
          type: Number,
          required: false,
        },
        max: {
          type: Number,
          required: false,
        },
      },

      length: {
        min: {
          type: Number,
          required: false,
        },
        max: {
          type: Number,
          required: false,
        },
      },

      weight: {
        min: {
          type: Number,
          required: false,
        },
        max: {
          type: Number,
          required: false,
        },
      },

      size: {
        min: {
          type: Number,
          required: false,
        },
        max: {
          type: Number,
          required: false,
        },
      },

      volumeWeight: {
        min: {
          type: Number,
          required: false,
        },
        max: {
          type: Number,
          required: false,
        },
      },

      volume: {
        min: {
          type: Number,
          required: false,
        },
        max: {
          type: Number,
          required: false,
        },
      },
    },
  },
  { minimize: true }
);
const cargoType = mongoose.model("cargoType", cargoTypeSchema);
module.exports = cargoType;
