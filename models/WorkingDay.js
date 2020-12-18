const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const workingDaySchema = new Schema({
  rspRef: String,
  workingDays: Array,
  cityRefs: Array,
});
const workingDay = mongoose.model("workingDay", workingDaySchema);
module.exports = workingDay;
