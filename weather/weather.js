const request = require("request");

var getWeather = (lat, lng, callback) => {
  request(
    {
      url: `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${process.env.OWMAPIKEY}`,
      json: true,
    },
    (error, response, body) => {
      if (!error && response.statusCode === 200) {
        callback(undefined, {
          temperature: body.main.temp,
          apparentTemperature: body.main.feels_like,
        });
      } else {
        callback(error);
      }
    }
  );
};

module.exports.getWeather = getWeather;
