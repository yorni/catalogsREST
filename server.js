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

const rspRouter = require("./routes/rsp");
app.use("/getRsp", rspRouter);

const townsRouter = require("./routes/towns");
app.use("/getTowns", townsRouter);

const additionalservicesRouter = require("./routes/additionalservices");
app.use("/getAdditionalServices", additionalservicesRouter);

const deliveryConditionsRouter = require("./routes/deliveryconditions");
app.use("/getDeliveryConditions", deliveryConditionsRouter);

const departureConditionsRouter = require("./routes/departureconditions");
app.use("/getDepartureConditions", departureConditionsRouter);

app.listen(port, () => {
  console.log("We are live on " + port);
});
