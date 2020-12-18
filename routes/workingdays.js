const express = require("express");
const router = express.Router();
const WorkingDay = require("../models/WorkingDay");
const checkApiKey = require("../helpers/auth");

router.get("/", getAllWorkingDays, (req, res) => {
  res.json(res.result);
});

//Get One
router.get("/:id", getWorkingDay, (req, res) => {
  res.json(res.workingday);
});

// Create One Route
router.post("/", checkApiKey, async (req, res) => {
  let workingday = await WorkingDay.findOne({ rspRef: req.body.rspRef });
  if (workingday) {
    workingday.rspRef = req.body.rspRef;
    workingday.workingDays = req.body.workingDays;
    workingday.cityRefs = req.body.cityRefs;
  } else {
    workingday = new WorkingDay({
      rspRef: req.body.rspRef,
      workingDays: req.body.workingDays,
      cityRefs: req.body.cityRefs,
    });
  }

  try {
    const newWorkingDay = await workingday.save();
    res.status(201).json({ newWorkingDay });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;

async function getWorkingDay(req, res, next) {
  let workingday;
  let rspRef = req.query.rspRef;
  let cityRef = req.query.cityRef;

  try {
    if (rspRef) {
      workingday = await WorkingDay.find({ rspRef: rspRef });
    } else {
      if (cityRef) {
        console.log(cityRef);
        workingday = await WorkingDay.find({ cityRefs: cityRef });
      }
    }

    if (workingday == null) {
      return res.status(404).json({ message: "Cannot find RSP" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.workingday = workingday;
  next();
}

async function getAllWorkingDays(req, res, next) {
  let rspRef = req.query.rspRef;
  let cityRef = req.query.cityRef;
  try {
    let allRSP = [];

    if (rspRef) {
      allWorkingDays = await WorkingDay.find({ rspRef: rspRef });
    } else {
      if (cityRef) {
        console.log(cityRef);
        allWorkingDays = await WorkingDay.find({ cityRefs: cityRef });
      }
    }
    if (allWorkingDays == null) {
      return res.status(404).json({ message: "Cannot find RSP" });
    }
    res.result = allWorkingDays;
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}
