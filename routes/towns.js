const express = require("express");
const router = express.Router();
const Town = require("../models/Town");
const prepareLanguage = require("../helpers/language");
const checkApiKey = require("../helpers/auth");

router.get("/", getListTowns, (req, res) => {
  res.json(res.result);
});

//Get One
router.get("/:id", getTown, (req, res) => {
  res.json(res.town);
});

// Create One Route
router.post("/", checkApiKey, async (req, res) => {
  let town = await Town.findOne({ ref: req.body.ref });
  if (town) {
    town.description = req.body.description;
    town.ref = req.body.ref;
    town.place_id = req.body.place_id;
    town.searchstring = req.body.searchstring.toLowerCase();
    town.district = req.body.district;
    town.region = req.body.region;
    town.oldDescription = req.body.oldDescription;
    town.rspRef = req.body.rspRef;
    town.containsRsp = req.body.containsRsp;
    town.rspList = req.body.rspList;
    town.townSize = req.body.townSize;
  } else {
    town = new Town({
      description: req.body.description,
      ref: req.body.ref,
      place_id: req.body.place_id,
      searchstring: req.body.searchstring.toLowerCase(),
      district: req.body.district,
      region: req.body.region,
      oldDescription: req.body.oldDescription,
      rspRef: req.body.rspRef,
      containsRsp: req.body.containsRsp,
      rspList: req.body.rspList,
      townSize: req.body.townSize,
    });
  }

  try {
    const newTown = await town.save();
    res.status(201).json({ town });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/:id", checkApiKey, getTown, async (req, res) => {
  try {
    if (res.town[0]) {
      await Town.deleteOne({ ref: res.town[0].ref });
      res.json({ message: "Town has been deleted" });
    } else {
      res.json({ message: "Town not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getTown(req, res, next) {
  let town;
  try {
    town = await Town.find({ ref: req.params.id });
    if (town == null) {
      return res.status(404).json({ message: "Cannot find town by ref" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.town = town;
  next();
}

async function getListTowns(req, res, next) {
  try {
    let language = req.query.language;
    let limit = req.query.limit;
    let searchstring = req.query.searchstring;
    let place_id = req.query.place_id;
    //let searchid = req.query.cityRef; регл задание? которое возвращает какой-то файл - непонятно
    let offset = req.query.offset;
    let ref = req.query.ref;
    let rsp = req.query.rsp;
    let containsRsp = req.query.containsrsp;

    language = prepareLanguage(language);
    let conditions = {};
    if (searchstring) {
      conditions.searchstring = { $regex: searchstring.toLowerCase() };
    }

    if (ref) {
      conditions.ref = ref;
    }

    if (place_id) {
      conditions.place_id = place_id;
    }

    if (rsp) {
      conditions.rspRef = rsp;
    }

    if (containsRsp) {
      if (containsRsp == "true" || containsRsp == "Y") {
        conditions.containsRsp = true;
      } else {
        conditions.containsRsp = false;
      }
    }

    let allTowns = [];
    if (limit) {
      allTowns = await Town.find(conditions)
        .sort({ townSize: "desc" })
        .limit(+limit);
    } else {
      allTowns = await Town.find(conditions).sort({ townSize: "desc" });
    }
    const allTownsWithLang = allTowns.map((townItem) => {
      return {
        description: townItem.description[language],
        ref: townItem.ref,
        rspRef: townItem.rspRef,
        district: townItem.district[language],
        region: townItem.region[language],
        oldDescription: townItem.description[language],
        rspList: townItem.rspList,
      };
    });
    res.result = {
      success: true,
      data: allTownsWithLang,
    };
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

function getDistance(nLat1, nLon1, nLat2, nLon2) {
  return Math.round(
    3958.75 *
      Math.acos(
        Math.sin(nLat1 / 57.2958) * Math.sin(nLat2 / 57.2958) +
          Math.cos(nLat1 / 57.2958) *
            Math.cos(nLat2 / 57.2958) *
            Math.cos(nLon2 / 57.2958 - nLon1 / 57.2958)
      ) *
      1609.344
  );
}

module.exports = router;
