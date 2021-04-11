const express = require("express");
const router = express.Router();
const cargoDescription = require("../models/CargoDescription");
const prepareLanguage = require("../helpers/language");
const checkApiKey = require("../helpers/auth");

router.get("/", getListCargoDescriptions, (req, res) => {
  res.json(res.result);
});

//Get One
router.get("/:id", getCargoDescription, (req, res) => {
  res.json(res.cargoDescription);
});

// Create One Route
router.post("/", checkApiKey, async (req, res) => {
  let cDescription = await cargoDescription.findOne({ ref: req.body.ref });
  if (cDescription) {
    cDescription.description = req.body.description;
    cDescription.ref = req.body.ref;
  } else {
    cDescription = new cargoDescription({
      description: req.body.description,
      ref: req.body.ref,
    });
  }

  try {
    const newcDescription = await cDescription.save();
    res.status(201).json({ cDescription });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//Delete One
router.delete("/:id", checkApiKey, getCargoDescription, async (req, res) => {
  try {
    if (res.cargoDescription[0]) {
      await cargoDescription.deleteOne({ ref: res.cargoDescription[0].ref });
      res.json({ message: "Cargo description has been deleted" });
    } else {
      res.json({ message: "Cargo description not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getCargoDescription(req, res, next) {
  let cDescription;
  try {
    cDescription = await cargoDescription.find({ ref: req.params.id });
    if (cDescription == null) {
      return res.status(404).json({ message: "Cannot find cargo description" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.cargoDescription = cDescription;
  next();
}

async function getListCargoDescriptions(req, res, next) {
  try {
    let language = req.query.language;
    let limit = req.query.limit;
    let ref = req.query.ref;

    language = prepareLanguage(language);

    let conditions = {};

    if (ref) {
      conditions.ref = ref;
    }

    let allCargoDescriptions = [];
    if (limit) {
      allCargoDescriptions = await deliveryCondition
        .find(conditions)
        .limit(+limit);
    } else {
      allCargoDescriptions = await deliveryCondition.find(conditions);
    }
    const allCargoDescriptionsLang = allCargoDescriptions.map(
      (addServiceItem) => {
        return {
          ref: addServiceItem.ref,
          description: addServiceItem.description[language],
        };
      }
    );
    res.result = {
      success: true,
      data: allCargoDescriptionsLang,
    };
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

module.exports = router;
