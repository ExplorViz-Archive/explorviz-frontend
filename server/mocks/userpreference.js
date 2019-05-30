/* eslint-env node */
'use strict';

module.exports = function (app) {
  const express = require('express');
  let userpreferenceRouter = express.Router();

  // userId -> [setting1,...,settingN]
  let userPreferences = new Map();

  userpreferenceRouter.get('/', function (_req, res) {
    let settings = [...userPreferences.values()]
    res.send(settings);
  });

  userpreferenceRouter.get('/:id', function (req, res) {
    let userId = req.params.id;

    if(!userPreferences.has(userId))
      userPreferences.set(userId, []);
      
    res.send({
      "data":userPreferences.get(userId)
    });
  });

  userpreferenceRouter.post('/', function (req, res) {
    let { userId, settingId, value } = req.body.data.attributes;

    if(!userPreferences.has(userId))
      userPreferences.set(userId, []);

    let currentSettings = userPreferences.get(userId);
    for(let i = 0; i < currentSettings.length; i++) {
      if(currentSettings[i].attributes.settingId === settingId) {
        currentSettings[i].attributes.value = value;
        res.send({
          "data":currentSettings
        });
        return;
      }
    }
    let preferenceNew = createUserPreference(userId, settingId, value);
    currentSettings.push(preferenceNew);
    res.send({
      "data":currentSettings
    });
  });

  function createUserPreference(userId, settingId, value) {
    return {
      "type":"userpreference",
      "id":`[userId=${userId},settingId=${settingId}]`,
      "attributes":{  
         "userId":userId,
         "settingId":settingId,
         "value":value
      }
    }
  }

  // The POST and PUT call will not contain a request body
  // because the body-parser is not included by default.
  // To use req.body, run:

  //    npm install --save-dev body-parser

  // After installing, you need to `use` the body-parser for
  // this mock uncommenting the following line:
  //
  //app.use('/api/tokens', require('body-parser').json());
  app.use('/api/v1/settings/custom', require('body-parser').json({ type: 'application/vnd.api+json' }));
  app.use('/api/v1/settings/custom', userpreferenceRouter);
};
