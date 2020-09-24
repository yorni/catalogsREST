const express = require("express");
const router = express.Router();
const deliveryCondition = require("../models/DeliveryCondition");
const prepareLanguage = require("../helpers/language");
const checkApiKey = require("../helpers/auth");

router.get("/", getListDeliveryConditions, (req, res) => {
  res.json(res.result);
});

//Get One
router.get("/:id", getDeliveryCondition, (req, res) => {
  res.json(res.deliveryCondition);
});

// Create One Route
router.post("/", checkApiKey, async (req, res) => {
  let delCondition = await deliveryCondition.findOne({ ref: req.body.ref });
  if (delCondition) {
    delCondition.description = req.body.description;
    delCondition.ref = req.body.ref;
    delCondition.hint = req.body.hint;
    delCondition.timeTable = req.body.timeTable;
  } else {
    delCondition = new deliveryCondition({
      description: req.body.description,
      ref: req.body.ref,
      hint: req.body.hint,
      timeTable: req.body.timeTable,
    });
  }

  try {
    const newdelCondition = await delCondition.save();
    res.status(201).json({ delCondition });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//Delete One
router.delete("/:id", checkApiKey, getDeliveryCondition, async (req, res) => {
  try {
    if (res.deliveryCondition[0]) {
      await deliveryCondition.deleteOne({ ref: res.deliveryCondition[0].ref });
      res.json({ message: "Delivery Condition has been deleted" });
    } else {
      res.json({ message: "Delivery Condition not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getDeliveryCondition(req, res, next) {
  let delCondition;
  try {
    delCondition = await deliveryCondition.find({ ref: req.params.id });
    if (delCondition == null) {
      return res
        .status(404)
        .json({ message: "Cannot find Delivery Condition" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.deliveryCondition = delCondition;
  next();
}

async function getListDeliveryConditions(req, res, next) {
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
    let allDeliveryConditions = [];
    if (limit) {
      allDeliveryConditions = await deliveryCondition
        .find(conditions)
        .limit(+limit);
    } else {
      allDeliveryConditions = await deliveryCondition.find(conditions);
    }
    const allDeliveryConditionsLang = allDeliveryConditions.map(
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
      data: allDeliveryConditionsLang,
    };
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

module.exports = router;
