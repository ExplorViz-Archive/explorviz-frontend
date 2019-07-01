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
        },
        "relationships": {
          "roles": {
            "data": [
              {
                "type": "role",
                "id": "admin"
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
        },
        "relationships": {
          "roles": {
            "data": [
              {
                "type": "role",
                "id": "user"
              }
            ]
          }
        }
      }
    ],
    "included": [
      {
        "type": "role",
        "id": "admin",
        "attributes": {

        }
      },
      {
        "type": "role",
        "id": "user",
        "attributes": {

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

  userRouter.patch('/:id', (req, res) => {
    const { username, password } = req.body.data.attributes;
    const { roles } = req.body.data.relationships;

    if(!username || username === '') {
      res.status(400).send("Invalid username");
      return;
    }

    const userCount = users.data.length;

    // Does user with entered username already exist?
    for (let i = 0; i < userCount; i++) {
      if(users.data[i].id != req.params.id && users.data[i].attributes.username === username) {
        res.status(400).send("User already exists");
        return;
      }
    }

    // update user data, if user exists
    for (let i = 0; i < userCount; i++) {
      if(users.data[i].id == req.params.id) {
        users.data[i].attributes.username = username;
        users.data[i].attributes.password = password;
        users.data[i].relationships.roles = roles;
        res.status(204).send();
        return;
      }
    }

    res.status(400).send("User does not exist");
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

    res.status(400).send("User does not exist");
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
    res.status(400).send("User does not exist");
  });

  userRouter.get('/', function (_req, res) {
    res.send(users);
  });

  userRouter.post('/batch', (req, res) => {
    const { count, prefix, passwords, roles, preferences } = req.body.data.attributes;

    if(!count || count <= 1) {
      res.status(400).send("Invalid user count");
      return;
    }
    if(!prefix || prefix === '') {
      res.status(400).send("Invalid prefix");
      return;
    }
    if(!passwords || passwords.length !== count) {
      res.status(400).send("Passwords missing or do not match user count");
      return;
    }
    // Could also check for validity of roles here
    
    // check if a user with given prefix already exists
    var usernameFormatRegEx = new RegExp(`${prefix}-[0-9]+`);
    for (let i = 0; i < users.data.length; i++) {
      let match = users.data[i].attributes.username.match(usernameFormatRegEx) !== null;
      if(match) {
        res.status(400).send("User(s) with passed prefix already exist");
        return;
      }
    }

    let createdUsers = [];

    let relationshipRolesData = roles.map(role => new Object({  
      "type":"role",
      "id":role.descriptor
    }));

    for(let i = 0; i < count; i++) {
      let userNew = {
        "type": "user",
        "id": getNextUserId().toString(),
        "attributes": {
          "username": `${prefix}-${i}`
        },
        "relationships":{
          "roles": {
            "data": relationshipRolesData
          }
        }
      };
      users.data.push(userNew);
      createdUsers.push(userNew);
    }

    for(let i = 0; i < createdUsers.length; i++) {
      for (const [settingId, value] of Object.entries(preferences)) {
        let preferenceNew = global.createUserPreference(createdUsers[i].id, settingId, value);
        global.userPreferences.set(preferenceNew.id, preferenceNew);
      }
    }

    req.body.included = createdUsers;

    let relationshipUserData = createdUsers.map(user => new Object({type: "user", id: user.id}));

    req.body.data.relationships = {
      "users":{
        "data": relationshipUserData
      }
    };

    res.send(req.body);
  });

  userRouter.post('/', (req, res) => {
    const { username, password } = req.body.data.attributes;

    if(!username || username === '') {
      res.status(400).send("Invalid username");
      return;
    }
    if(!password || password === '') {
      res.status(400).send("Invalid password");
      return;
    }
    // Could also check for validity of roles here
    
    const userCount = users.data.length;
    for (let i = 0; i < userCount; i++) {
      if(users.data[i].attributes.username === username) {
        res.status(400).send("User already exists");
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
