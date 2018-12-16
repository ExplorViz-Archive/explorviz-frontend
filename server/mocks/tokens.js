/* eslint-env node */
'use strict';

module.exports = function(app) {
  const express = require('express');
  let tokensRouter = express.Router();

  const token = {
    "data":{
      "type":"user",
      "id":"3",
      "attributes":{
        "username":"admin",
        "settings":{
          "id":1,
          "showFpsCounter":false,
          "appVizClassColor":"0xFF0000"
        },"token":"eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJmNTVhMWMzNS0yYTJhLTQxMTMtOTY0ZS01MGRmNWI2MTkwNTQiLCJpc3MiOiJFeHBsb3JWaXoiLCJhdWQiOiJFeHBsb3JWaXoiLCJzdWIiOiJhZG1pbiIsImlhdCI6MTU0NDk1MTk5NywiZXhwIjoxNTQ0OTU1NTk3LCJyb2xlcyI6W3siaWQiOjIsImRlc2NyaXB0b3IiOiJhZG1pbiJ9XSwicmVmcmVzaENvdW50IjowLCJyZWZyZXNoTGltaXQiOjF9.OwcVptvB-6-cP6Jt244gtsLkCX7qSya_nx7VQ8Z_A-k"
      },
      "relationships":{
        "roles":{
          "data":[
            {
              "type":"role",
              "id":"2"
            }
          ]
        }
      }
    },
    "included":[
      {
        "type":"role",
        "id":"2",
        "attributes":{
          "descriptor":"admin"
        }
      }
    ]
  };

  tokensRouter.post('/refresh', function(req, res) {
    res.send(token);
  });

  tokensRouter.post('/', function(req, res) {
    res.send(token);
  });

  // The POST and PUT call will not contain a request body
  // because the body-parser is not included by default.
  // To use req.body, run:

  //    npm install --save-dev body-parser

  // After installing, you need to `use` the body-parser for
  // this mock uncommenting the following line:
  //
  //app.use('/api/tokens', require('body-parser').json());
  app.use('/api/v1/tokens', tokensRouter);
};
