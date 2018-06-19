/* eslint-env node */
'use strict';

module.exports = function(app) {
  const express = require('express');
  let userRouter = express.Router();

  const userObject = {"data":{"type":"user","id":"356","attributes":{"extensionAttributes":{},"username":"admin","authenticated":false}}};
  const userObjectAuthenticated = {"data":{"type":"user","id":"356","attributes":{"extensionAttributes":{},"username":"admin","hashedPassword":"sha1:64000:18:HoNJQxXRR/J5vQOeG4TbmjhNrNiHng1U:JEVfbufA+njeW7LYNNeSR3Zq","token":"hilu2l187eg8mo13gu3c2gi09l","authenticated":true}}};

  userRouter.get('/', function(req, res) {
    res.send(userObject);
  });

  userRouter.patch('/authenticate', function(req, res) {
    res.send(userObjectAuthenticated);
  });

  userRouter.post('/', function(req, res) {
    res.status(201).end();
  });

  userRouter.get('/:id', function(req, res) {
    res.send({
      'user': {
        id: req.params.id
      }
    });
  });

  userRouter.put('/:id', function(req, res) {
    res.send({
      'user': {
        id: req.params.id
      }
    });
  });

  userRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  // The POST and PUT call will not contain a request body
  // because the body-parser is not included by default.
  // To use req.body, run:

  //    npm install --save-dev body-parser

  // After installing, you need to `use` the body-parser for
  // this mock uncommenting the following line:
  //
  //app.use('/api/user', require('body-parser').json());
  app.use('/api/users', userRouter);
};
