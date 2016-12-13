'use strict';

var Wikia = require('node-wikia');

function WikiaHelper(sWikia) {
  this.wikia = new Wikia(sWikia);
}

WikiaHelper.prototype.getArticleDetails = function(sSubject) {
  return this.wikia.getArticleDetails({ids:[],titles:[sSubject]}).then(
    function(response) {
      console.log('success - received info for ' + sSubject, response);
      
      for(var sID in response.items){
        var iID = response.items[sID].id;
        console.log("sID", sID, "iID", iID);
        this.wikia.getArticleAsSimpleJson(iID).then(
          function(response) {
            //console.log('success - found ' + sID);
            console.log("response", response)
          });  
        }
      }
    )
  };



WikiaHelper.prototype.getArticle = function(iID, iParagraphs, iStart) {
  //cache?
  if(iParagraphs == null){
    iParagraphs = 1;
  }
  if(iStart == null){
    iStart = 0;
  }
  return this.wikia.getArticleAsSimpleJson(iID).then(
    function(response) {
      //console.log('success - found ' + sID);
      //console.log("getArticle response", response);
      
      var aMainContent = response.sections[0].content;
      var aParagraphs = aMainContent.filter(function(oPart){
        return oPart.type == 'paragraph';
      });
      var sParagraph = aParagraphs[0].text;
      console.log(sParagraph);
      
      return sParagraph;
    });  
        
  };

WikiaHelper.prototype.getSearchList = function(sSubject) {
  return this.wikia.getSearchList({query:sSubject}).then(
    function(response) {
      console.log('success - received info for ' + sSubject);
      console.log(response);
      
      return response;
    }
  );
};

WikiaHelper.prototype.getLucky = function(sSubject) {
  return this.wikia.getSearchList({query:sSubject}).then(
    function(oResponse) {
      console.log('success - received info for ' + sSubject);
      console.log(oResponse);
      
      if(oResponse.total>0){
        return (oResponse.items[0].id);
      }
      return false;
    }
  );
};

//getSearchList({query:???});

WikiaHelper.prototype.formatSearchResult = function(airportStatus) {
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