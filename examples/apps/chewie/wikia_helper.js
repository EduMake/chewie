'use strict';

var Wikia = require('node-wikia');

function WikiaHelper(sWikia) {
  this.wikia = new Wikia(sWikia);
}

WikiaHelper.prototype.getArticleDetails = function(sSubject) {
  return this.wikia.getArticleDetails({titles:[sSubject]}).then(
    function(response) {
      
      console.log('success - received info for ' + sSubject);
      return response.items[0].abstract;
    }
  );
};

WikiaHelper.prototype.getSearchList = function(sSubject) {
  return this.wikia.getSearchList({query:sSubject}).then(
    function(response) {
      console.log('success - received info for ' + sSubject);
      return response.body;
    }
  );
};

FAADataHelper.prototype.formatSearchResult = function(airportStatus) {
  var weather = _.template('The current weather conditions are ${weather}, ${temp} and wind ${wind}.')({
    weather: airportStatus.weather.weather,
    temp: airportStatus.weather.temp,
    wind: airportStatus.weather.wind
  });
  if (airportStatus.delay === 'true') {
    var template = _.template('There is currently a delay for ${airport}. ' +
      'The average delay time is ${delay_time}. ' +
      'Delay is because of the following: ${delay_reason}. ${weather}');
    return template({
      airport: airportStatus.name,
      delay_time: airportStatus.status.avgDelay,
      delay_reason: airportStatus.status.reason,
      weather: weather
    });
  } else {
    //no delay
    return _.template('There is currently no delay at ${airport}. ${weather}')({
      airport: airportStatus.name,
      weather: weather
    });
  }
};

module.exports = WikiaHelper;