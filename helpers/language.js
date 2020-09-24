function prepareLanguage(language) {
  if (!language) {
    language = "RU";
  }
  language = language.toLowerCase().replace("ua", "uk").toUpperCase();
  if (!(language == "RU" || language == "EN" || language == "UK")) {
    language = "RU";
  }
  return language;
}
module.exports = prepareLanguage;
