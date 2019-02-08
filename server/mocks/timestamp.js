/* eslint-env node */
'use strict';

module.exports = function(app) {
  const express = require('express');
  let timestampRouter = express.Router();

  const timestampObjects = require('./timestamps.json');

  timestampRouter.get('/subsequent-interval', function(req, res) {
    res.send(timestampObjects);
  });

  timestampRouter.get('/all-uploaded', function(req, res) {
    res.send({data: []});
  });

  app.use('/api/v1/timestamps', timestampRouter);
};
