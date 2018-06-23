/* eslint-env node */
'use strict';

module.exports = function(app) {
  const express = require('express');
  let timestampRouter = express.Router();

  timestampRouter.get('/from-recent', function(req, res) {
    res.send({data: []});
  });

  timestampRouter.get('/all-uploaded', function(req, res) {
    res.send({data: []});
  });  

  timestampRouter.post('/', function(req, res) {
    res.status(201).end();
  });

  timestampRouter.get('/:id', function(req, res) {
    res.send({
      'timestamp': {
        id: req.params.id
      }
    });
  });

  timestampRouter.put('/:id', function(req, res) {
    res.send({
      'timestamp': {
        id: req.params.id
      }
    });
  });

  timestampRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  // The POST and PUT call will not contain a request body
  // because the body-parser is not included by default.
  // To use req.body, run:

  //    npm install --save-dev body-parser

  // After installing, you need to `use` the body-parser for
  // this mock uncommenting the following line:
  //
  //app.use('/api/timestamp', require('body-parser').json());
  app.use('/api/timestamp', timestampRouter);
};
