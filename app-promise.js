const yargs = require("yargs");
const axios = require("axios");
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

axios
  .get("https://maps.googleapis.com/maps/api/geocode/json", {
    params: {
      address: encodeURIComponent(argv.address),
      key: process.env.GEOAPIKEY,
    },
  })
  .then((response) => {
    if (response.data.status === "ZERO_RESULTS") {
      throw new Error("Unable to find that address.");
    }
    console.log(response.data.results[0].formatted_address);
    return axios.get("https://api.openweathermap.org/data/2.5/weather", {
      params: {
        lat: response.data.results[0].geometry.location.lat,
        lon: response.data.results[0].geometry.location.lng,
        units: "metric",
        appid: process.env.OWMAPIKEY,
      },
    });
  })
  .then((response) => {
    const temperature = response.data.main.temp;
    const apparentTemperature = response.data.main.feels_like;
    console.log(
      `It's currently ${temperature}. It feels like ${apparentTemperature}.`
    );
  })
  .catch((e) => {
    if (e.code === "ENOTFOUND") {
      console.log("Unable to connect to API servers.");
    } else {
      console.log(e.message);
    }
  });
