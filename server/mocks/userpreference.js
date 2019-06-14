/* eslint-env node */
'use strict';

// settingId -> setting
global.userPreferences = new Map();

global.createUserPreference = function(userId, settingId, value) {
  return {
    "type":"userpreference",
    "id": ID(),
    "attributes":{  
       "userId":userId,
       "settingId":settingId,
       "value":value
    }
  }
}

function ID() {
  return Math.random().toString(36).substr(2, 9);
}

module.exports = function (app) {
  const express = require('express');
  let userpreferenceRouter = express.Router();

  userpreferenceRouter.get('/', function (req, res) {
    // /userpreferences?uid=x
    let { uid } = req.query;

    if(uid) {
      let preferences = [];

      for (const [,preferenceObject] of global.userPreferences.entries()) {
        if(preferenceObject.attributes.userId === uid) {
          preferences.push(preferenceObject);
        }
      }

      res.send({
        "data":preferences
      });
    } else {
      res.status(404).send('User id is mandatory');
    }
  });

  userpreferenceRouter.delete('/:id', function (req, res) {
    let preferenceId = req.params.id;

    if(global.userPreferences.has(preferenceId)) {
      global.userPreferences.delete(preferenceId);
      res.status(204).send();
    } else {
      res.send(404).send('Preference not found');
    }
  });

  userpreferenceRouter.patch('/:prefId', function (req, res) {
    let preferenceId = req.params.prefId;
    const { value } = req.body.data.attributes;

    if(global.userPreferences.has(preferenceId)) {
      let preference = global.userPreferences.get(preferenceId);
      preference.attributes.value = value;
      res.send({
        "data": preference
      });
    } else {
      res.send(404).send('Preference not found');
    }
  });

  userpreferenceRouter.post('/', function (req, res) {
    let { userId, settingId, value } = req.body.data.attributes;

    let preferenceNew = global.createUserPreference(userId, settingId, value);
    global.userPreferences.set(preferenceNew.id, preferenceNew);
    res.send({
      "data": preferenceNew
    });
  });

  // The POST and PUT call will not contain a request body
  // because the body-parser is not included by default.
  // To use req.body, run:

  //    npm install --save-dev body-parser

  // After installing, you need to `use` the body-parser for
  // this mock uncommenting the following line:
  //
  //app.use('/api/tokens', require('body-parser').json());
  app.use('/api/v1/settings/preferences', require('body-parser').json({ type: 'application/vnd.api+json' }));
  app.use('/api/v1/settings/preferences', userpreferenceRouter);
};
