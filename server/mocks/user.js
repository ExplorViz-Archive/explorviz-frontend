/* eslint-env node */
'use strict';

module.exports = function (app) {
  const express = require('express');
  let userRouter = express.Router();

  let users = {
    "data": [
      {
        "type": "user",
        "id": "3",
        "attributes": {
          "username": "admin",
          "settings": createSettingsObject()
        },
        "relationships": {
          "roles": {
            "data": [
              {
                "type": "role",
                "id": "2"
              }
            ]
          }
        }
      },
      {
        "type": "user",
        "id": "4",
        "attributes": {
          "username": "user",
          "settings": createSettingsObject()
        },
        "relationships": {
          "roles": {
            "data": [
              {
                "type": "role",
                "id": "3"
              }
            ]
          }
        }
      }
    ],
    "included": [
      {
        "type": "role",
        "id": "2",
        "attributes": {
          "descriptor": "admin"
        }
      },
      {
        "type": "role",
        "id": "3",
        "attributes": {
          "descriptor": "user"
        }
      }
    ]
  };

  let userIdCounter;

  function getNextUserId() {
    if(!userIdCounter) {
      userIdCounter = 3;
      const userCount = users.data.length;
      for (let i = 0; i < userCount; i++) {
        if(parseInt(users.data[i].id) > userIdCounter) {
          userIdCounter = parseInt(users.data[i].id);
        }
      }
    }
    return ++userIdCounter;
  }

  function createSettingsObject() {
    return {
      "id": 1,
      "booleanAttributes": {
        "keepHighlightingOnOpenOrClose": true,
        "enableHoverEffects": true,
        "showFpsCounter": false,
        "appVizTransparency": true
      },
      "numericAttributes": {
        "appVizTransparencyIntensity": 0.3,
        "appVizCommArrowSize": 1.0
      },
      "stringAttributes": {}
    };
  }

  userRouter.patch('/:id', (req, res) => {
    const { username, settings, password } = req.body.data.attributes;
    const { roles } = req.body.data.relationships;

    if(!username || username === '') {
      res.send(400, {"errors": [ { "status": "400", "title": "Error", "detail": "Invalid username" } ]});
      return;
    }

    const userCount = users.data.length;

    // Does user with entered username already exist?
    for (let i = 0; i < userCount; i++) {
      if(users.data[i].id != req.params.id && users.data[i].attributes.username === username) {
        res.send(400, {"errors": [ { "status": "400", "title": "Error", "detail": "User already exists" } ]});
        return;
      }
    }

    // update user data, if user exists
    for (let i = 0; i < userCount; i++) {
      if(users.data[i].id == req.params.id) {
        users.data[i].attributes.username = username;
        users.data[i].attributes.password = password;
        users.data[i].attributes.settings = settings;
        users.data[i].relationships.roles = roles;
        res.status(204).send();
        return;
      }
    }

    res.send(400, {"errors": [ { "status": "400", "title": "Error", "detail": "User does not exists" } ]});
  });

  userRouter.get('/:id', (req, res) => {
    const userCount = users.data.length;
    for (let i = 0; i < userCount; i++) {
      if(users.data[i].id == req.params.id) {
        res.send({
          "data": users.data[i]
        });
        return;
      }
    }

    res.send(400, {"errors": [ { "status": "400", "title": "Error", "detail": "User does not exists" } ]});
  });

  userRouter.delete('/:id', (req, res) => {
    const userCount = users.data.length;
    for (let i = 0; i < userCount; i++) {
      if(users.data[i].id == req.params.id) {
        users.data.splice(i, 1);
        res.status(204).send();
        return;
      }
    }
    res.send(400, {"errors": [ { "status": "400", "title": "Error", "detail": "User does not exists" } ]});
  });

  userRouter.get('/', function (req, res) {
    res.send(users);
  });

  userRouter.post('/', (req, res) => {
    const { username, password } = req.body.data.attributes;

    if(!username || username === '') {
      res.send(400, {"errors": [ { "status": "400", "title": "Error", "detail": "Invalid username" } ]});
      return;
    }
    if(!password || password === '') {
      res.send(400, {"errors": [ { "status": "400", "title": "Error", "detail": "Invalid password" } ]});
      return;
    }
    // Could also check for validity of roles here
    
    const userCount = users.data.length;
    for (let i = 0; i < userCount; i++) {
      if(users.data[i].attributes.username === username) {
        res.send(400, {"errors": [ { "status": "400", "title": "Error", "detail": "User already exists" } ]});
        return;
      }
    }

    req.body.data.id = getNextUserId().toString();

    users.data.push(req.body.data);
    res.send(req.body);
  });

  app.use('/api/v1/users', require('body-parser').json({ type: 'application/vnd.api+json' }));
  app.use('/api/v1/users', userRouter);
};
