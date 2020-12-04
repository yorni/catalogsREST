const express = require("express");
const router = express.Router();
const fs = require("fs");

router.post("/", async (req, res) => {
  console.log("tst ", __dirname);
  var body = "";
  filePath = __dirname + "/public/data.txt";
  req.on("data", function (data) {
    body += data;
  });

  req.on("end", function () {
    fs.appendFile(filePath, body, function () {
      res.end();
    });
  });
});

module.exports = router;
