async function checkApiKey(req, res, next) {
  apiKey = req.body.apiKey;
  if (apiKey && apiKey == process.env.APIKEY) {
    next();
  } else {
    res.status(401).json({ message: "unautorized" });
  }
}

module.exports = checkApiKey;
