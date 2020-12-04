require("dotenv").config();

const express = require("express");

const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("connection to db established"));

const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT;
app.use(bodyParser.json({ extended: true }));

app.use(function (req, res, next) {
  for (var key in req.query) {
    req.query[key.toLowerCase()] = req.query[key];
  }
  next();
});

const rspRouter = require("./routes/rsp");
app.use("/getRsp", rspRouter);

const rspdRouter = require("./routes/rspd");
app.use("/getRspd", rspdRouter);

const townsRouter = require("./routes/towns");
app.use("/getTowns", townsRouter);

const additionalservicesRouter = require("./routes/additionalservices");
app.use("/getAdditionalServices", additionalservicesRouter);

const deliveryConditionsRouter = require("./routes/deliveryconditions");
app.use("/getDeliveryConditions", deliveryConditionsRouter);

const departureConditionsRouter = require("./routes/departureconditions");
app.use("/getDepartureConditions", departureConditionsRouter);

const uploadfile = require("./routes/uploadfile");
app.use("/integration/hs/diia/fileupload", uploadfile);

app.use("/public", express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/public"));

app.listen(port, () => {
  console.log("We are live on " + port);
});
