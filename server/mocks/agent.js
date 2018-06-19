/* eslint-env node */
'use strict';

module.exports = function(app) {
  const express = require('express');
  let agentRouter = express.Router();

  agentRouter.get('/', function(req, res) {
    res.send({data: []});
  });

  agentRouter.post('/', function(req, res) {
    res.status(201).end();
  });

  agentRouter.get('/:id', function(req, res) {
    res.send({
      'agent': {
        id: req.params.id
      }
    });
  });

  agentRouter.put('/:id', function(req, res) {
    res.send({
      'agent': {
        id: req.params.id
      }
    });
  });

  agentRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  // The POST and PUT call will not contain a request body
  // because the body-parser is not included by default.
  // To use req.body, run:

  //    npm install --save-dev body-parser

  // After installing, you need to `use` the body-parser for
  // this mock uncommenting the following line:
  //
  //app.use('/api/agent', require('body-parser').json());
  app.use('/api/discovery/agents', agentRouter);
};
