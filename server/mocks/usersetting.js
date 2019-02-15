/* eslint-env node */
'use strict';

module.exports = function(app) {
  const express = require('express');
  let tokensRouter = express.Router();

  const defaultSettings = {  
    "data":{  
      "type":"usersetting",
      "id":"1",
      "attributes":{  
        "booleanAttributes":{  
          "keepHighlightingOnOpenOrClose":true,
          "enableHoverEffects":true,
          "showFpsCounter":false,
          "appVizTransparency":true
        },
        "numericAttributes":{  
          "appVizTransparencyIntensity":0.1,
          "appVizCommArrowSize":1.0
        },
        "stringAttributes":{  
  
        }
      }
    }
  };

  tokensRouter.get('/', function(req, res) {
    res.send(defaultSettings);
  });

  // The POST and PUT call will not contain a request body
  // because the body-parser is not included by default.
  // To use req.body, run:

  //    npm install --save-dev body-parser

  // After installing, you need to `use` the body-parser for
  // this mock uncommenting the following line:
  //
  //app.use('/api/tokens', require('body-parser').json());
  app.use('/api/v1/settings', tokensRouter);
};
