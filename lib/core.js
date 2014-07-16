'use strict';

var request = require('request'),
    step = require('step');

var core = {};

core.start = function(program) {
  var weatherApiUrl = "http://weather.livedoor.com/forecast/webservice/json/v1?city=" + program.place;
  var yoAllApi      = "http://api.justyo.co/yoall/";

  step(
    function() {
      request(weatherApiUrl, this);
    },
    function(err, response, body) {
      if (err) return;
      var json;

      if (response.statusCode == "200") {
        try {
          json = JSON.parse(body);
        } catch(e) {
          console.log("JSON parse error...");
          process.exit(1);
          return;
        }

        var forecast = json.forecasts[0];

        if (forecast.telop.indexOf("雨") != -1) {
          var params = {
            method: "POST",
            uri: yoAllApi,
            form: {api_token: program.key}
          };

          console.log("It's rainy day. :( ");
          request(params, this);

        } else {
          console.log("It's sunny day. :) ");
        }
      }
    },
    function(err, response, body) {
      if (err) return;

      if (response.statusCode == "200") {
        console.log("Yo API calling finished.");
      }
    }
  );
}

module.exports = core;

