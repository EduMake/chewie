'use strict';
module.change_code = 1;
var _ = require('lodash');
var Alexa = require('alexa-app');
var app = new Alexa.app('chewie');
var WikiaHelper = require('./wikia_helper');

app.launch(function(req, res) {
  var prompt = 'What tell you I can?.';
  res.say(prompt).reprompt(prompt).shouldEndSession(false);
});

app.intent('SearchIntent', {
  'slots': {
    'Text': 'LIST_OF_PAGES'
  },
  'utterances': [
    'search {Text}',
    'search for {Text}',
    'look up {Text}',
    'find {Text}'
    ]
},
  function(req, res) {
    //get the slot
    var sSubject = req.slot('Text');
    var reprompt = 'What can chewie find for you.';
    if (_.isEmpty(oSubject)) {
      var prompt = 'I didn\'t hear that. Tell me what I can find for you.';
      res.say(prompt).reprompt(reprompt).shouldEndSession(false);
      return true;
    } else {
      var oWikiaHelper = new WikiaHelper('starwars');
      oWikiaHelper.getSearchList(sSubject).then(function(oResult) {
        console.log(oResult);
        res.say(oWikiaHelper.formatSearchResult(oResult)).send();
      }).catch(function(err) {
        console.log(err.statusCode);
        var prompt = 'I could not find the droid you are looking for.';
         //https://github.com/matt-kruse/alexa-app/blob/master/index.js#L171
        res.say(prompt).reprompt(reprompt).shouldEndSession(false).send();
      });
      return false;
    }
  }
);


app.intent('SummaryIntent', {
  'slots': {
    'Page': 'LIST_OF_PAGES'
  },
  'utterances': [
    'describe {Page}',
    'describe a {Page}',
    'tell me about {Page}',
    'who is {Page}',
    'what is {Page}'
    ]
},
  function(req, res) {
    //get the slot
    var sSubject = req.slot('Text');
    var reprompt = 'What can chewie find for you.';
    if (_.isEmpty(oSubject)) {
      var prompt = 'I didn\'t hear that. Tell me what I can find for you.';
      res.say(prompt).reprompt(reprompt).shouldEndSession(false);
      return true;
    } else {
      var oWikiaHelper = new WikiaHelper('starwars');
      oWikiaHelper.getArticleDetails(sSubject).then(function(oResult) {
        console.log(oResult);
        res.say(oWikiaHelper.formatPageResult(oResult)).send();
      }).catch(function(err) {
        console.log(err.statusCode);
        var prompt = 'I could not find the droid you are looking for.';
         //https://github.com/matt-kruse/alexa-app/blob/master/index.js#L171
        res.say(prompt).reprompt(reprompt).shouldEndSession(false).send();
      });
      return false;
    }
  }
);

//hack to support custom utterances in utterance expansion string
console.log(app.utterances().replace(/\{\-\|/g, '{'));
module.exports = app;