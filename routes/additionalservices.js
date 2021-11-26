const express = require("express");
const router = express.Router();
const additionalService = require("../models/AdditionalService");
const prepareLanguage = require("../helpers/language");
const checkApiKey = require("../helpers/auth");

// Get All RSP

router.get("/", getListAdditionalServices, (req, res) => {
  res.json(res.result);
});

//Get One
router.get("/:id", getAdditionalService, (req, res) => {
  res.json(res.additionalService);
});

// Create One Route
router.post("/", checkApiKey, async (req, res) => {
  apiKey = req.body.apiKey;
  if (apiKey && apiKey == "8a810b11-6184-4be5-b199-9d6285b6d4a1") {
    let addService = await additionalService.findOne({ ref: req.body.ref });
    if (addService) {
      addService.description = req.body.description;
      addService.additionalSize = req.body.additionalSize;
      addService.ref = req.body.ref;
      addService.sender = req.body.sender;
      addService.recipient = req.body.recipient;
      addService.serviceGroup = req.body.serviceGroup;
      addService.serviceGroupId = req.body.serviceGroupId;
      addService.fixedCount = req.body.fixedCount;
      addService.staticName = req.body.staticName;
      addService.categoryGroup = req.body.categoryGroup;
      addService.categoryGroupID = req.body.categoryGroupID;
      addService.sortOrder = req.body.sortOrder;
    } else {
      addService = new additionalService({
        description: req.body.description,
        additionalSize: req.body.additionalSize,
        ref: req.body.ref,
        sender: req.body.sender,
        recipient: req.body.recipient,
        serviceGroup: req.body.serviceGroup,
        serviceGroupId: req.body.serviceGroupId,
        fixedCount: req.body.fixedCount,
        staticName: req.body.staticName,
        categoryGroup: req.body.categoryGroup,
        categoryGroupID: req.body.categoryGroupID,
        sortOrder: req.body.sortOrder,
      });
    }

    try {
      const newaddService = await addService.save();
      res.status(201).json({ addService });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  } else {
    res.status(401).json({ message: "unautorized" });
  }
});

//Delete One
router.delete("/:id", checkApiKey, getAdditionalService, async (req, res) => {
  try {
    if (res.additionalService[0]) {
      await additionalService.deleteOne({
        ref: res.additionalService[0].ref,
      });
      res.json({ message: "additionalService has been deleted" });
    } else {
      res.json({ message: "additionalService not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getAdditionalService(req, res, next) {
  let addService;
  try {
    addService = await additionalService.find({ ref: req.params.id });
    if (addService == null) {
      return res
        .status(404)
        .json({ message: "Cannot find additional Service" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.additionalService = addService;
  next();
}

async function getListAdditionalServices(req, res, next) {
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
    let allAdditionalServices = [];
    if (limit) {
      allAdditionalServices = await additionalService
        .find(conditions)
        .limit(+limit);
    } else {
      allAdditionalServices = await additionalService.find(conditions);
    }
    const allAdditionalServicesLang = allAdditionalServices.map(
      (addServiceItem) => {
        return {
          ref: addServiceItem.ref,
          description: addServiceItem.description[language],
          additionalSize: addServiceItem.additionalSize,
          sender: addServiceItem.sender,
          recipient: addServiceItem.recipient,
          serviceGroup: addServiceItem.serviceGroup[language],
          serviceGroupId: addServiceItem.serviceGroupId,
          fixedCount: addServiceItem.fixedCount,
          staticName: addServiceItem.staticName,
          categoryGroup: addServiceItem.categoryGroup[language],
          categoryGroupID: addServiceItem.categoryGroupID,
          sortOrder: addServiceItem.sortOrder,
        };
      }
    );
    res.result = {
      success: true,
      data: allAdditionalServicesLang,
    };
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

module.exports = router;
