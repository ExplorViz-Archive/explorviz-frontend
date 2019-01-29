/* eslint-env node */
'use strict';

module.exports = function (app) {
  const express = require('express');
  let roleRouter = express.Router();

  const roles = {
    "data": [
      {
        "type": "role",
        "id": "2",
        "attributes": {
          "descriptor": "admin"
        }
      }
    ]
  };

  roleRouter.get('/', function (req, res) {
    res.send(roles);
  });

  // The POST and PUT call will not contain a request body
  // because the body-parser is not included by default.
  // To use req.body, run:

  //    npm install --save-dev body-parser

  // After installing, you need to `use` the body-parser for
  // this mock uncommenting the following line:
  //
  //app.use('/api/v1/roles', require('body-parser').json({ type: 'application/vnd.api+json' }));
  app.use('/api/v1/roles', roleRouter);
};
