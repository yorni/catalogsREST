const express = require("express");
const router = express.Router();
const departureCondition = require("../models/DepartureCondition");
const prepareLanguage = require("../helpers/language");
const checkApiKey = require("../helpers/auth");

router.get("/", getListDepartureConditions, (req, res) => {
  res.json(res.result);
});

//Get One
router.get("/:id", getDepartureCondition, (req, res) => {
  res.json(res.departureCondition);
});

// Create One Route
router.post("/", checkApiKey, async (req, res) => {
  let depCondition = await departureCondition.findOne({ ref: req.body.ref });
  if (depCondition) {
    depCondition.description = req.body.description;
    depCondition.ref = req.body.ref;
    depCondition.hint = req.body.hint;
    depCondition.timeTable = req.body.timeTable;
  } else {
    depCondition = new departureCondition({
      description: req.body.description,
      ref: req.body.ref,
      hint: req.body.hint,
      timeTable: req.body.timeTable,
    });
  }

  try {
    const newdepCondition = await depCondition.save();
    res.status(201).json({ depCondition });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//Delete One
router.delete("/:id", checkApiKey, getDepartureCondition, async (req, res) => {
  try {
    if (res.departureCondition[0]) {
      await departureCondition.deleteOne({
        ref: res.departureCondition[0].ref,
      });
      res.json({ message: "Departure Condition has been deleted" });
    } else {
      res.json({ message: "Departure Condition not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getDepartureCondition(req, res, next) {
  let depCondition;
  try {
    depCondition = await departureCondition.find({ ref: req.params.id });
    if (depCondition == null) {
      return res
        .status(404)
        .json({ message: "Cannot find Departure Condition" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.departureCondition = depCondition;
  next();
}

async function getListDepartureConditions(req, res, next) {
  try {
    let language = req.query.language;
    let limit = req.query.limit;
    let ref = req.query.ref;

    language = prepareLanguage(language);

    let conditions = {};

    if (ref) {
      conditions.ref = ref;
    }

    // console.log(conditions);
    let allDepartureConditions = [];
    if (limit) {
      allDepartureConditions = await departureCondition
        .find(conditions)
        .limit(+limit);
    } else {
      allDepartureConditions = await departureCondition.find(conditions);
    }
    const allDepartureConditionsLang = allDepartureConditions.map(
      (addServiceItem) => {
        return {
          ref: addServiceItem.ref,
          description: addServiceItem.description[language],
          hint: addServiceItem.hint[language],
          timeTable: addServiceItem.timeTable.map((timeTableItem) => {
            return {
              sendingTime: timeTableItem.sendingTime,
              condition: timeTableItem.condition[language],
              acceptableFromTime: timeTableItem.acceptableFromTime,
              acceptableToTime: timeTableItem.acceptableToTime,
            };
          }),
        };
      }
    );
    res.result = {
      success: true,
      data: allDepartureConditionsLang,
    };
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

module.exports = router;
