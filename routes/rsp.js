const express = require("express");
const router = express.Router();
const RSP = require("../models/RSP");
const prepareLanguage = require("../helpers/language");
const checkApiKey = require("../helpers/auth");
// Get All RSP
router.get("/", getListRSP, (req, res) => {
  res.json(res.result);
});

//Get One
router.get("/:id", getRSP, (req, res) => {
  res.json(res.rsp);
});

// Create One Route
router.post("/", checkApiKey, async (req, res) => {
  let rsp = await RSP.findOne({ ref: req.body.ref });
  if (rsp) {
    rsp.description = req.body.description;
    rsp.address = req.body.address;
    rsp.phone = req.body.phone;
    rsp.email = req.body.email;
    rsp.ref = req.body.ref;
    rsp.number = req.body.number;
    rsp.latitude = req.body.latitude;
    rsp.longitude = req.body.longitude;
    rsp.cityRef = req.body.cityRef;
    rsp.schedule = req.body.schedule;
    rsp.place_id = req.body.place_id;
    if (!!req.body.region) {
      rsp.region = req.body.region;
    }

    rsp.typeCOD = req.body.typeCOD;
    rsp.searchstring = req.body.searchstring.toLowerCase();
  } else {
    rsp = new RSP({
      description: req.body.description,
      address: req.body.address,
      phone: req.body.phone,
      email: req.body.email,
      ref: req.body.ref,
      region: req.body.region,
      number: req.body.number,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      cityRef: req.body.cityRef,
      schedule: req.body.schedule,
      place_id: req.body.place_id,
      typeCOD: req.body.typeCOD,
      searchstring: req.body.searchstring.toLowerCase(),
    });
  }

  try {
    const newRSP = await rsp.save();
    res.status(201).json({ rsp });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//Delete One
router.delete("/:id", checkApiKey, getRSP, async (req, res) => {
  try {
    if (res.rsp[0]) {
      await RSP.deleteOne({ ref: res.rsp[0].ref });
      res.json({ message: "RSP has been deleted" });
    } else {
      res.json({ message: "RSP not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

async function getRSP(req, res, next) {
  let rsp;
  try {
    rsp = await RSP.find({ ref: req.params.id });
    if (rsp == null) {
      return res.status(404).json({ message: "Cannot find RSP" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.rsp = rsp;
  next();
}

async function getListRSP(req, res, next) {
  try {
    let app = req.query.app;
    let website = true && app && app == "website";
    let language = req.query.language;
    let limit = req.query.limit;
    let searchstring = req.query.searchstring;
    let place_id = req.query.place_id;
    let cityRef = req.query.cityref;
    let offset = req.query.offset;
    let ref = req.query.ref;

    language = prepareLanguage(language);

    let conditions = {};
    if (searchstring) {
      conditions.searchstring = { $regex: searchstring.toLowerCase() };
    }

    if (ref) {
      conditions.ref = ref;
    }

    if (cityRef) {
      conditions.cityRef = cityRef;
    }

    if (place_id) {
      conditions.place_id = place_id;
    }

    // console.log(conditions);
    let allRSP = [];
    if (limit) {
      allRSP = await RSP.find(conditions).limit(+limit);
    } else {
      allRSP = await RSP.find(conditions);
    }
    const allRSPWithLang = allRSP.map((rspItem) => {
      if (website) {
        return {
          description: rspItem.description[language],
          address: rspItem.address[language],
          region: rspItem.region[language],
          phone: rspItem.phone,
          email: rspItem.email,
          ref: rspItem.ref,
          number: rspItem.number,
          latitude: rspItem.latitude,
          longitude: rspItem.longitude,
          cityRef: rspItem.cityRef,
          typeCOD: rspItem.typeCOD,
          schedule: rspItem.schedule,
        };
      } else {
        {
          return {
            description: rspItem.description[language],
            address: rspItem.address[language],
            phone: rspItem.phone,
            email: rspItem.email,
            ref: rspItem.ref,
            number: rspItem.number,
            latitude: rspItem.latitude,
            longitude: rspItem.longitude,
            cityRef: rspItem.cityRef,
            schedule: rspItem.schedule,
          };
        }
      }
    });
    res.result = {
      success: true,
      data: allRSPWithLang,
    };
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}
