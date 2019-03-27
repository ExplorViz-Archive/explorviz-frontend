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

  const descriptors = {
    "keepHighlightingOnOpenOrClose": {
      "data":{
        "type":"booleansettingsdescriptor",
        "id":"keepHighlightingOnOpenOrClose",
        "attributes":{
          "description":"Transparency effect for selection (left click) in application visualization",
          "defaultValue":true,
          "name":"Keep Highlighting On Open Or Close"
        }
      }
    },
    "enableHoverEffects": {
      "data":{
        "type":"booleansettingsdescriptor",
        "id":"enableHoverEffects",
        "attributes":{
          "description":"Hover effect (flashing entities) for mouse cursor",
          "defaultValue":true,
          "name":"Enable Hover Effects"
        }
      }
    },
    "showFpsCounter": {
      "data":{
        "type":"booleansettingsdescriptor",
        "id":"showFpsCounter",
        "attributes":{
          "description":"'Frames Per Second' metrics in visualizations",
          "defaultValue":false,
          "name":"Show FPS Counter"
        }
      }
    },
    "appVizTransparency": {
      "data":{
        "type":"booleansettingsdescriptor",
        "id":"appVizTransparency",
        "attributes":{
          "description":"Transparency effect for selection (left click) in application visualization",
          "defaultValue":true,
          "name":"App Viz Transparency"
        }
      }
    },
    "appVizCommArrowSize": {
      "data":{
        "type":"numericsettingsdescriptor",
        "id":"appVizCommArrowSize",
        "attributes":{
          "description":"Arrow Size for selected communications in application visualization",
          "defaultValue":1.0,
          "min":-9.223372036854776E18,
          "max":9.223372036854776E18,
          "inRange":false,
          "name":"AppViz Arrow Size"
        }
      }
    },
    "appVizTransparencyIntensity": {
      "data":{
        "type":"numericsettingsdescriptor",
        "id":"appVizTransparencyIntensity",
        "attributes":{
          "description":"Transparency effect intensity ('App Viz Transparency' must be enabled)",
          "defaultValue":0.1,
          "min":0.1,
          "max":0.5,
          "inRange":false,
          "name":"AppViz Transparency Intensity"
        }
      }
    }
  };

  tokensRouter.get('/', function(req, res) {
    res.send(defaultSettings);
  });

  tokensRouter.get('/:id/info', function(req, res) {
    if(descriptors[req.params.id]) {
      res.send(descriptors[req.params.id]);
    } else {
      res.send(400, {"errors": [ { "status": "400", "title": "Error", "detail": "Descriptor does not exists" } ]});
    }
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
