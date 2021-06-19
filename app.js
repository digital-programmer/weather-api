const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const config = require("./config");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  let weatherData = { weather: null };
  let message = null;
  return res.status(200).render("index", weatherData);
});

app.post("/", (req, res) => {
  let city_name = req.body.city;
  const API_Key = config.API_KEY;
  let url = `http://api.openweathermap.org/data/2.5/weather?q=${city_name}&units=metric&appid=${API_Key}`;

  request(url, (error, response, body) => {
    const weatherJSON = JSON.parse(body);
    // console.log(weatherJSON);

    if (weatherJSON.cod == "200") {
      let weather = {
        city: city_name,
        temperature: Math.round(weatherJSON.main.temp),
        description: weatherJSON.weather[0].description,
        windspeed: weatherJSON.wind.speed,
        humidity: weatherJSON.main.humidity,
        icon: weatherJSON.weather[0].icon,
        pressure: weatherJSON.main.pressure,
        success: true,
      };

      let weatherData = { weather: weather };
      return res.render("index", weatherData);
    } else if (weatherJSON.cod == "401") {
      let weather = {
        city: city_name,
        success: false,
      };
      let weatherData = { weather: weather };
      return res.render("index", weatherData);
    } else if (weatherJSON.cod == "404") {
      let weather = {
        city: city_name,
        success: false,
      };
      let weatherData = { weather: weather };
      return res.render("index", weatherData);
    }
  });
});

app.listen(process.env.PORT || 3000, function () {
  console.log("App listening on port 3000!");
});
