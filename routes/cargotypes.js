const express = require("express");
const router = express.Router();
const cargoType = require("../models/CargoType");
const prepareLanguage = require("../helpers/language");
const checkApiKey = require("../helpers/auth");

router.get("/", getListCargoTypes, (req, res) => {
  res.json(res.result);
});

//Get One
router.get("/:id", getCargoType, (req, res) => {
  res.json(res.cargoType);
});

// Create One Route
router.post("/", checkApiKey, async (req, res) => {
  let cType = await cargoType.findOne({ ref: req.body.ref });
  if (cType) {
    cType.description = req.body.description;
    cType.ref = req.body.ref;
    cType.type = req.body.type;
    cType.typeref = req.body.typeref;
    cType.limits = req.body.limits;
  } else {
    cType = new cargoType({
      description: req.body.description,
      ref: req.body.ref,
      type: req.body.type,
      typeref: req.body.typeref,
      limits: req.body.limits,
    });
  }

  try {
    const newcType = await cType.save();
    res.status(201).json({ cType });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//Delete One
router.delete("/:id", checkApiKey, getCargoType, async (req, res) => {
  try {
    if (res.cargoType[0]) {
      await cargoType.deleteOne({ ref: res.cargoType[0].ref });
      res.json({ message: "Cargo Type has been deleted" });
    } else {
      res.json({ message: "Cargo Type not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getCargoType(req, res, next) {
  let cType;
  try {
    cType = await cargoType.find({ ref: req.params.id });
    if (cType == null) {
      return res.status(404).json({ message: "Cannot find cargo Type" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.cargoType = cType;
  next();
}

async function getListCargoTypes(req, res, next) {
  try {
    let language = req.query.language;
    let ref = req.query.ref;

    language = prepareLanguage(language);

    let conditions = {};

    if (ref) {
      conditions.ref = ref;
    }

    let allCargoTypes = [];
    allCargoTypes = await cargoType.find(conditions).sort("description.RU");

    const allCargoTypesLang = allCargoTypes.map((addServiceItem) => {
      let limits = {};

      if (addServiceItem.limits.height.max) {
        limits.height = addServiceItem.limits.height;
      }

      if (addServiceItem.limits.width.max) {
        limits.width = addServiceItem.limits.width;
      }
      if (addServiceItem.limits.length.max) {
        limits.length = addServiceItem.limits.length;
      }
      if (addServiceItem.limits.weight.max) {
        limits.weight = addServiceItem.limits.weight;
      }
      if (addServiceItem.limits.size.max) {
        limits.size = addServiceItem.limits.size;
      }

      if (addServiceItem.limits.volumeWeight.max) {
        limits.volumeWeight = addServiceItem.limits.volumeWeight;
      }

      if (addServiceItem.limits.volume.max) {
        limits.volume = addServiceItem.limits.volume;
      }

      return {
        ref: addServiceItem.ref,
        description: addServiceItem.description[language],
        type: addServiceItem.type[language],
        typeref: addServiceItem.typeref,
        limits: limits,
      };
    });
    res.result = {
      success: true,
      data: allCargoTypesLang,
    };
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

module.exports = router;
