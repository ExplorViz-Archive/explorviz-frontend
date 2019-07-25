/* eslint-env node */
'use strict';

module.exports = function (app) {
  const express = require('express');
  const SSE = require('express-sse');
  const sse = new SSE(["array", "containing", "initial", "content", "(optional)"]);

  let landscapeRouter = express.Router();

  const landscapeObject = require('./landscape.json');

  landscapeRouter.get('/broadcast', sse.init);

  landscapeRouter.get('/latest-landscape', function (req, res) {
    res.send(landscapeObject);
  });

  landscapeRouter.get('/by-timestamp', function (req, res) {
    res.send(landscapeObject);
  });

  landscapeRouter.post('/', function (req, res) {
    res.status(201).end();
  });

  landscapeRouter.get('/:id', function (req, res) {
    res.send({
      'landscape': {
        id: req.params.id
      }
    });
  });

  landscapeRouter.put('/:id', function (req, res) {
    res.send({
      'landscape': {
        id: req.params.id
      }
    });
  });

  landscapeRouter.delete('/:id', function (req, res) {
    res.status(204).end();
  });

  // The POST and PUT call will not contain a request body
  // because the body-parser is not included by default.
  // To use req.body, run:

  //    npm install --save-dev body-parser

  // After installing, you need to `use` the body-parser for
  // this mock uncommenting the following line:
  //
  //app.use('/api/landscape', require('body-parser').json());
  app.use('/api/v1/landscapes', landscapeRouter);

  function sendSSE() {
    setTimeout(function () {
      const updatedLandscape = updateTimestampInLandscape(landscapeObject);
      sse.send(updatedLandscape, "message");
      sendSSE();
    }, 10000);
  }

  function updateTimestampInLandscape(jsonLandscape) {
    const timestampId = jsonLandscape["data"]["relationships"]["timestamp"]["data"]["id"];
    
    const includedArray = jsonLandscape["included"];

    for(var elem of includedArray) {
      if(elem["id"] == timestampId) {

        const currentDate = Date.now();

        elem["attributes"]["timestamp"] = currentDate;
        elem["attributes"]["totalRequests"] = getRandomInt(1000000);

        // update id of timestamp
        findAndReplace(jsonLandscape, "id", timestampId, currentDate);
        break;
      }
    }

    return jsonLandscape;
  }

  function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  function findAndReplace(object, key, oldValue, replacevalue) {
    for (var x in object) {
      if (object.hasOwnProperty(x)) {
        if (typeof object[x] == 'object') {
          findAndReplace(object[x], key, oldValue, replacevalue);
        }
        if (x == key && object[x] == oldValue) { 
          object[key] = replacevalue;
        }
      }
    }
  }

  sendSSE();
};
