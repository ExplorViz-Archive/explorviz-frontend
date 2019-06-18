/* eslint-env node */
'use strict';

module.exports = function(app) {
  const express = require('express');
  let settingsinfoRouter = express.Router();
  
  const settings = {
    "data":[
       {
          "type":"rangesetting",
          "id":"appVizCommArrowSize",
          "attributes":{  
             "max":5.0,
             "displayName":"Arrow Size in Application Visualization",
             "description":"Arrow Size for selected communications in application visualization",
             "origin":"core",
             "defaultValue":1.0,
             "min":0.0
          }
       },
       {
          "type":"rangesetting",
          "id":"appVizTransparencyIntensity",
          "attributes":{  
             "max":0.5,
             "displayName":"Transparency Intensity in Application Visualization",
             "description":"Transparency effect intensity ('App Viz Transparency' must be enabled)",
             "origin":"core",
             "defaultValue":0.1,
             "min":0.1
          }
       },
       {
          "type":"rangesetting",
          "id":"appVizCurvyCommHeight",
          "attributes":{  
             "max":50.0,
             "displayName":"Curviness of the Communication Lines",
             "description":"If greater 0.0, communication lines are rendered arc-shaped with set height (Straight lines: 0.0)",
             "origin":"core",
             "defaultValue":0.0,
             "min":0.0
          }
       },
       {
          "type":"flagsetting",
          "id":"showFpsCounter",
          "attributes":{  
             "displayName":"Show FPS Counter",
             "description":"'Frames Per Second' metrics in visualizations",
             "origin":"core",
             "defaultValue":false
          }
       },
       {
          "type":"flagsetting",
          "id":"appVizTransparency",
          "attributes":{  
             "displayName":"Enable Transparent Components",
             "description":"Transparency effect for selection (left click) in application visualization",
             "origin":"core",
             "defaultValue":true
          }
       },
       {
          "type":"flagsetting",
          "id":"keepHighlightingOnOpenOrClose",
          "attributes":{  
             "displayName":"Keep Highlighting On Open Or Close",
             "description":"Toggle if highlighting should be resetted on double click in application visualization",
             "origin":"core",
             "defaultValue":true
          }
       },
       {
          "type":"flagsetting",
          "id":"enableHoverEffects",
          "attributes":{  
             "displayName":"Enable Hover Effects",
             "description":"Hover effect (flashing entities) for mouse cursor",
             "origin":"core",
             "defaultValue":true
          }
       }
/*        ,{
          "type":"flagsetting",
          "id":"dummy1",
          "attributes":{  
             "displayName":"I'm just a dummy flagsetting",
             "description":"I'm just a dummy flagsetting",
             "origin":"dummy",
             "defaultValue":true
          }
       },
       {
          "type":"rangesetting",
          "id":"dummy2",
          "attributes":{  
            "max":10.0,
            "displayName":"I'm just a dummy rangesetting",
            "description":"I'm just a dummy rangesetting",
            "origin":"dummy",
            "defaultValue":5.0,
            "min":1.0
          }
       } */
    ]
  };

  settingsinfoRouter.get('/', function(req, res) {
    res.send(settings);
  });

  settingsinfoRouter.get('/:id', function(req, res) {
    let allSettings = settings.data;
    for(let i = 0; i < allSettings.length; i++) {
      if(allSettings[i].id === req.params.id) {
        res.send({
          "data":allSettings[i]
        });
        return;
      }
    }
    res.send(400, {"errors": [ { "status": "400", "title": "Error", "detail": "Setting does not exists" } ]});
  });

  settingsinfoRouter.delete('/:id', function(req, res) {
    for(let i = 0; i < settings.data.length; i++) {
      if(settings.data[i].id === req.params.id) {
        settings.data.splice(i, 1); 
        res.send(201);
        return;
      }
    }
    res.send(400, {"errors": [ { "status": "400", "title": "Error", "detail": "Setting does not exists" } ]});
  });

  settingsinfoRouter.post('/', function(req, res) {
    settings.push(req.body.data);
    res.send({
      "data":settings.data[settings.data.length-1]
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
  app.use('/api/v1/settings/info', require('body-parser').json({ type: 'application/vnd.api+json' }));
  app.use('/api/v1/settings/info', settingsinfoRouter);
};
