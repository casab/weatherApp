const yargs = require("yargs");
const geocode = require("./geocode/geocode");
const weather = require("./weather/weather");
require("dotenv").config();

const argv = yargs
  .options({
    a: {
      demand: true,
      alias: "address",
      describe: "Address to fetch weather for",
      string: true,
    },
  })
  .help()
  .alias("help", "h").argv;

geocode.geocodeAddress(argv.address, (errorMessage, addressResults) => {
  if (errorMessage) {
    console.log(errorMessage);
  } else {
    console.log(addressResults.address);
    weather.getWeather(
      addressResults.latitude,
      addressResults.longitude,
      (errorMessage, weatherResults) => {
        if (errorMessage) {
          console.log(errorMessage);
        } else {
          console.log(
            `It's currently ${weatherResults.temperature}. It feels like ${weatherResults.apparentTemperature}.`
          );
        }
      }
    );
  }
});
