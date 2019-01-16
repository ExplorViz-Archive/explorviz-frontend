/* eslint-env node */
'use strict';

module.exports = function (app) {
  const express = require('express');
  const SSE = require('express-sse');
  const sse = new SSE(["array", "containing", "initial", "content", "(optional)"]);

  let landscapeRouter = express.Router();

  const landscapeObject = {
    "data": {
      "type": "landscape",
      "id": "3",
      "attributes": {
        "extensionAttributes": {},
        "events": {},
        "exceptions": {}
      },
      "relationships": {
        "timestamp": {
          "data": {
            "type": "timestamp",
            "id": "437"
          }
        },
        "systems": {
          "data": [
            {
              "type": "system",
              "id": "5"
            },
            {
              "type": "system",
              "id": "9"
            },
            {
              "type": "system",
              "id": "16"
            },
            {
              "type": "system",
              "id": "23"
            },
            {
              "type": "system",
              "id": "31"
            },
            {
              "type": "system",
              "id": "38"
            },
            {
              "type": "system",
              "id": "46"
            }
          ]
        },
        "totalApplicationCommunications": {
          "data": [
            {
              "type": "applicationcommunication",
              "id": "340"
            },
            {
              "type": "applicationcommunication",
              "id": "341"
            },
            {
              "type": "applicationcommunication",
              "id": "342"
            },
            {
              "type": "applicationcommunication",
              "id": "343"
            },
            {
              "type": "applicationcommunication",
              "id": "344"
            },
            {
              "type": "applicationcommunication",
              "id": "345"
            },
            {
              "type": "applicationcommunication",
              "id": "346"
            },
            {
              "type": "applicationcommunication",
              "id": "347"
            },
            {
              "type": "applicationcommunication",
              "id": "348"
            },
            {
              "type": "applicationcommunication",
              "id": "349"
            },
            {
              "type": "applicationcommunication",
              "id": "350"
            },
            {
              "type": "applicationcommunication",
              "id": "351"
            },
            {
              "type": "applicationcommunication",
              "id": "352"
            },
            {
              "type": "applicationcommunication",
              "id": "353"
            },
            {
              "type": "applicationcommunication",
              "id": "354"
            },
            {
              "type": "applicationcommunication",
              "id": "355"
            },
            {
              "type": "applicationcommunication",
              "id": "356"
            },
            {
              "type": "applicationcommunication",
              "id": "357"
            },
            {
              "type": "applicationcommunication",
              "id": "358"
            },
            {
              "type": "applicationcommunication",
              "id": "359"
            },
            {
              "type": "applicationcommunication",
              "id": "360"
            },
            {
              "type": "applicationcommunication",
              "id": "361"
            },
            {
              "type": "applicationcommunication",
              "id": "362"
            },
            {
              "type": "applicationcommunication",
              "id": "363"
            },
            {
              "type": "applicationcommunication",
              "id": "364"
            },
            {
              "type": "applicationcommunication",
              "id": "365"
            },
            {
              "type": "applicationcommunication",
              "id": "366"
            },
            {
              "type": "applicationcommunication",
              "id": "367"
            },
            {
              "type": "applicationcommunication",
              "id": "368"
            },
            {
              "type": "applicationcommunication",
              "id": "369"
            },
            {
              "type": "applicationcommunication",
              "id": "370"
            },
            {
              "type": "applicationcommunication",
              "id": "371"
            }
          ]
        }
      }
    },
    "included": [
      {
        "type": "databasequery",
        "id": "265",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593140400,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 549
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "aggregatedclazzcommunication",
        "id": "148",
        "attributes": {
          "extensionAttributes": {},
          "totalRequests": 2000,
          "averageResponseTime": 146
        },
        "relationships": {
          "sourceClazz": {
            "data": {
              "type": "clazz",
              "id": "97"
            }
          },
          "targetClazz": {
            "data": {
              "type": "clazz",
              "id": "100"
            }
          },
          "clazzCommunications": {
            "data": [
              {
                "type": "clazzcommunication",
                "id": "146"
              }
            ]
          }
        }
      },
      {
        "type": "databasequery",
        "id": "215",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593057200,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 604
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "node",
        "id": "65",
        "attributes": {
          "extensionAttributes": {},
          "ipAddress": "10.0.0.7",
          "cpuUtilization": 0.86,
          "freeRAM": 2147483648,
          "usedRAM": 1073741824
        },
        "relationships": {
          "applications": {
            "data": [
              {
                "type": "application",
                "id": "66"
              },
              {
                "type": "application",
                "id": "67"
              }
            ]
          },
          "parent": {
            "data": {
              "type": "nodegroup",
              "id": "55"
            }
          }
        }
      },
      {
        "type": "clazzcommunication",
        "id": "131",
        "attributes": {
          "extensionAttributes": {},
          "operationName": "getMethod40()",
          "totalRequests": 800,
          "averageResponseTime": 581
        },
        "relationships": {
          "sourceClazz": {
            "data": {
              "type": "clazz",
              "id": "86"
            }
          },
          "targetClazz": {
            "data": {
              "type": "clazz",
              "id": "109"
            }
          },
          "tracesteps": {
            "data": [
              {
                "type": "tracestep",
                "id": "132"
              }
            ]
          }
        }
      },
      {
        "type": "component",
        "id": "99",
        "attributes": {
          "extensionAttributes": {},
          "name": "configuration",
          "fullQualifiedName": "org.webshop.kernel.configuration"
        },
        "relationships": {
          "children": {
            "data": []
          },
          "clazzes": {
            "data": [
              {
                "type": "clazz",
                "id": "100"
              },
              {
                "type": "clazz",
                "id": "101"
              }
            ]
          },
          "parentComponent": {
            "data": {
              "type": "component",
              "id": "95"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "230",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593077300,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "37",
          "responseTime": 869
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "node",
        "id": "14",
        "attributes": {
          "extensionAttributes": {},
          "ipAddress": "10.0.1.2",
          "cpuUtilization": 0.54,
          "freeRAM": 3221225472,
          "usedRAM": 3221225472
        },
        "relationships": {
          "applications": {
            "data": [
              {
                "type": "application",
                "id": "15"
              }
            ]
          },
          "parent": {
            "data": {
              "type": "nodegroup",
              "id": "13"
            }
          }
        }
      },
      {
        "type": "nodegroup",
        "id": "39",
        "attributes": {
          "extensionAttributes": {},
          "name": "10.0.5.1"
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "system",
              "id": "38"
            }
          }
        }
      },
      {
        "type": "applicationcommunication",
        "id": "350",
        "attributes": {
          "extensionAttributes": {},
          "requests": 100,
          "averageResponseTime": 0
        },
        "relationships": {
          "sourceApplication": {
            "data": {
              "type": "application",
              "id": "27"
            }
          },
          "targetApplication": {
            "data": {
              "type": "application",
              "id": "30"
            }
          }
        }
      },
      {
        "type": "applicationcommunication",
        "id": "349",
        "attributes": {
          "extensionAttributes": {},
          "requests": 100,
          "averageResponseTime": 0
        },
        "relationships": {
          "sourceApplication": {
            "data": {
              "type": "application",
              "id": "26"
            }
          },
          "targetApplication": {
            "data": {
              "type": "application",
              "id": "27"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "328",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593856000,
          "statementType": "Statement",
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 230
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "landscape",
        "id": "3",
        "attributes": {
          "extensionAttributes": {},
          "events": {},
          "exceptions": {}
        },
        "relationships": {
          "timestamp": {
            "data": {
              "type": "timestamp",
              "id": "437"
            }
          },
          "systems": {
            "data": [
              {
                "type": "system",
                "id": "5"
              },
              {
                "type": "system",
                "id": "9"
              },
              {
                "type": "system",
                "id": "16"
              },
              {
                "type": "system",
                "id": "23"
              },
              {
                "type": "system",
                "id": "31"
              },
              {
                "type": "system",
                "id": "38"
              },
              {
                "type": "system",
                "id": "46"
              }
            ]
          },
          "totalApplicationCommunications": {
            "data": [
              {
                "type": "applicationcommunication",
                "id": "340"
              },
              {
                "type": "applicationcommunication",
                "id": "341"
              },
              {
                "type": "applicationcommunication",
                "id": "342"
              },
              {
                "type": "applicationcommunication",
                "id": "343"
              },
              {
                "type": "applicationcommunication",
                "id": "344"
              },
              {
                "type": "applicationcommunication",
                "id": "345"
              },
              {
                "type": "applicationcommunication",
                "id": "346"
              },
              {
                "type": "applicationcommunication",
                "id": "347"
              },
              {
                "type": "applicationcommunication",
                "id": "348"
              },
              {
                "type": "applicationcommunication",
                "id": "349"
              },
              {
                "type": "applicationcommunication",
                "id": "350"
              },
              {
                "type": "applicationcommunication",
                "id": "351"
              },
              {
                "type": "applicationcommunication",
                "id": "352"
              },
              {
                "type": "applicationcommunication",
                "id": "353"
              },
              {
                "type": "applicationcommunication",
                "id": "354"
              },
              {
                "type": "applicationcommunication",
                "id": "355"
              },
              {
                "type": "applicationcommunication",
                "id": "356"
              },
              {
                "type": "applicationcommunication",
                "id": "357"
              },
              {
                "type": "applicationcommunication",
                "id": "358"
              },
              {
                "type": "applicationcommunication",
                "id": "359"
              },
              {
                "type": "applicationcommunication",
                "id": "360"
              },
              {
                "type": "applicationcommunication",
                "id": "361"
              },
              {
                "type": "applicationcommunication",
                "id": "362"
              },
              {
                "type": "applicationcommunication",
                "id": "363"
              },
              {
                "type": "applicationcommunication",
                "id": "364"
              },
              {
                "type": "applicationcommunication",
                "id": "365"
              },
              {
                "type": "applicationcommunication",
                "id": "366"
              },
              {
                "type": "applicationcommunication",
                "id": "367"
              },
              {
                "type": "applicationcommunication",
                "id": "368"
              },
              {
                "type": "applicationcommunication",
                "id": "369"
              },
              {
                "type": "applicationcommunication",
                "id": "370"
              },
              {
                "type": "applicationcommunication",
                "id": "371"
              }
            ]
          }
        }
      },
      {
        "type": "databasequery",
        "id": "238",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593087600,
          "statementType": "Statement",
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 333
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "applicationcommunication",
        "id": "355",
        "attributes": {
          "extensionAttributes": {},
          "requests": 100,
          "averageResponseTime": 0
        },
        "relationships": {
          "sourceApplication": {
            "data": {
              "type": "application",
              "id": "49"
            }
          },
          "targetApplication": {
            "data": {
              "type": "application",
              "id": "57"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "292",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593794900,
          "statementType": "Statement",
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 224
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "316",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593837700,
          "statementType": "Statement",
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 542
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "288",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593181700,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 414
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "applicationcommunication",
        "id": "361",
        "attributes": {
          "extensionAttributes": {},
          "requests": 500,
          "averageResponseTime": 0
        },
        "relationships": {
          "sourceApplication": {
            "data": {
              "type": "application",
              "id": "63"
            }
          },
          "targetApplication": {
            "data": {
              "type": "application",
              "id": "64"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "331",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593859300,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 574
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "clazzcommunication",
        "id": "157",
        "attributes": {
          "extensionAttributes": {},
          "operationName": "getMethod12()",
          "totalRequests": 500,
          "averageResponseTime": 624
        },
        "relationships": {
          "sourceClazz": {
            "data": {
              "type": "clazz",
              "id": "125"
            }
          },
          "targetClazz": {
            "data": {
              "type": "clazz",
              "id": "109"
            }
          },
          "tracesteps": {
            "data": [
              {
                "type": "tracestep",
                "id": "158"
              }
            ]
          }
        }
      },
      {
        "type": "databasequery",
        "id": "253",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593107100,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 940
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "tracestep",
        "id": "138",
        "attributes": {
          "extensionAttributes": {},
          "tracePosition": 4,
          "requests": 600,
          "currentTraceDuration": 8098,
          "averageResponseTime": 976
        },
        "relationships": {
          "parentTrace": {
            "data": {
              "type": "trace",
              "id": "128"
            }
          },
          "clazzCommunication": {
            "data": {
              "type": "clazzcommunication",
              "id": "137"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "191",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593010200,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 486
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "nodegroup",
        "id": "52",
        "attributes": {
          "extensionAttributes": {},
          "name": "10.0.0.3"
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "system",
              "id": "46"
            }
          }
        }
      },
      {
        "type": "clazz",
        "id": "104",
        "attributes": {
          "extensionAttributes": {},
          "name": "MultipleExtensionHandler",
          "fullQualifiedName": "org.webshop.kernel.extension.MultipleExtensionHandler",
          "instanceCount": 5
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "component",
              "id": "102"
            }
          },
          "clazzCommunications": {
            "data": []
          }
        }
      },
      {
        "type": "nodegroup",
        "id": "32",
        "attributes": {
          "extensionAttributes": {},
          "name": "10.0.4.1"
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "system",
              "id": "31"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "339",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593869400,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "51",
          "responseTime": 30
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "clazzcommunication",
        "id": "160",
        "attributes": {
          "extensionAttributes": {},
          "operationName": "getMethod48()",
          "totalRequests": 4200,
          "averageResponseTime": 156
        },
        "relationships": {
          "sourceClazz": {
            "data": {
              "type": "clazz",
              "id": "109"
            }
          },
          "targetClazz": {
            "data": {
              "type": "clazz",
              "id": "80"
            }
          },
          "tracesteps": {
            "data": [
              {
                "type": "tracestep",
                "id": "161"
              }
            ]
          }
        }
      },
      {
        "type": "databasequery",
        "id": "276",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593155500,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 125
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "190",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768592983300,
          "statementType": "Statement",
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 899
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "applicationcommunication",
        "id": "366",
        "attributes": {
          "extensionAttributes": {},
          "requests": 100,
          "averageResponseTime": 0
        },
        "relationships": {
          "sourceApplication": {
            "data": {
              "type": "application",
              "id": "66"
            }
          },
          "targetApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          }
        }
      },
      {
        "type": "tracestep",
        "id": "156",
        "attributes": {
          "extensionAttributes": {},
          "tracePosition": 10,
          "requests": 3500,
          "currentTraceDuration": 7847,
          "averageResponseTime": 487
        },
        "relationships": {
          "parentTrace": {
            "data": {
              "type": "trace",
              "id": "128"
            }
          },
          "clazzCommunication": {
            "data": {
              "type": "clazzcommunication",
              "id": "155"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "277",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593156700,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 408
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "320",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593846600,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "52",
          "responseTime": 63
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "clazz",
        "id": "86",
        "attributes": {
          "extensionAttributes": {},
          "name": "AccountSqlMapDao",
          "fullQualifiedName": "org.webshop.tooling.AccountSqlMapDao",
          "instanceCount": 5
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "component",
              "id": "85"
            }
          },
          "clazzCommunications": {
            "data": [
              {
                "type": "clazzcommunication",
                "id": "131"
              }
            ]
          }
        }
      },
      {
        "type": "node",
        "id": "69",
        "attributes": {
          "extensionAttributes": {},
          "ipAddress": "10.0.0.9",
          "cpuUtilization": 0.65,
          "freeRAM": 1073741824,
          "usedRAM": 2147483648
        },
        "relationships": {
          "applications": {
            "data": [
              {
                "type": "application",
                "id": "70"
              }
            ]
          },
          "parent": {
            "data": {
              "type": "nodegroup",
              "id": "68"
            }
          }
        }
      },
      {
        "type": "clazzcommunication",
        "id": "155",
        "attributes": {
          "extensionAttributes": {},
          "operationName": "getMethod9()",
          "totalRequests": 3500,
          "averageResponseTime": 487
        },
        "relationships": {
          "sourceClazz": {
            "data": {
              "type": "clazz",
              "id": "109"
            }
          },
          "targetClazz": {
            "data": {
              "type": "clazz",
              "id": "125"
            }
          },
          "tracesteps": {
            "data": [
              {
                "type": "tracestep",
                "id": "156"
              }
            ]
          }
        }
      },
      {
        "type": "databasequery",
        "id": "226",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593071900,
          "statementType": "Statement",
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 48
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "227",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593073200,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 664
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "clazz",
        "id": "74",
        "attributes": {
          "extensionAttributes": {},
          "name": "BaseLabeler",
          "fullQualifiedName": "org.webshop.labeling.BaseLabeler",
          "instanceCount": 20
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "component",
              "id": "73"
            }
          },
          "clazzCommunications": {
            "data": [
              {
                "type": "clazzcommunication",
                "id": "127"
              }
            ]
          }
        }
      },
      {
        "type": "databasequery",
        "id": "216",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593058500,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 845
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "327",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593855100,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "17",
          "responseTime": 450
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "329",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593857100,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 544
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "249",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593102400,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "36",
          "responseTime": 165
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "tracestep",
        "id": "171",
        "attributes": {
          "extensionAttributes": {},
          "tracePosition": 1,
          "requests": 2500,
          "currentTraceDuration": 3781,
          "averageResponseTime": 361
        },
        "relationships": {
          "parentTrace": {
            "data": {
              "type": "trace",
              "id": "170"
            }
          },
          "clazzCommunication": {
            "data": {
              "type": "clazzcommunication",
              "id": "169"
            }
          }
        }
      },
      {
        "type": "node",
        "id": "183",
        "attributes": {
          "extensionAttributes": {},
          "ipAddress": "10.0.0.8",
          "cpuUtilization": 0.99,
          "freeRAM": 4294967296,
          "usedRAM": 2147483648
        },
        "relationships": {
          "applications": {
            "data": [
              {
                "type": "application",
                "id": "184"
              },
              {
                "type": "application",
                "id": "185"
              }
            ]
          },
          "parent": {
            "data": {
              "type": "nodegroup",
              "id": "182"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "231",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593078800,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "42",
          "responseTime": 346
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "214",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593056000,
          "statementType": "Statement",
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 181
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "applicationcommunication",
        "id": "368",
        "attributes": {
          "extensionAttributes": {},
          "requests": 100,
          "averageResponseTime": 0
        },
        "relationships": {
          "sourceApplication": {
            "data": {
              "type": "application",
              "id": "58"
            }
          },
          "targetApplication": {
            "data": {
              "type": "application",
              "id": "70"
            }
          }
        }
      },
      {
        "type": "node",
        "id": "18",
        "attributes": {
          "extensionAttributes": {},
          "ipAddress": "10.0.2.1",
          "cpuUtilization": 0.21,
          "freeRAM": 3221225472,
          "usedRAM": 2147483648
        },
        "relationships": {
          "applications": {
            "data": [
              {
                "type": "application",
                "id": "19"
              }
            ]
          },
          "parent": {
            "data": {
              "type": "nodegroup",
              "id": "17"
            }
          }
        }
      },
      {
        "type": "component",
        "id": "79",
        "attributes": {
          "extensionAttributes": {},
          "name": "helpers",
          "fullQualifiedName": "org.webshop.helpers"
        },
        "relationships": {
          "children": {
            "data": []
          },
          "clazzes": {
            "data": [
              {
                "type": "clazz",
                "id": "80"
              },
              {
                "type": "clazz",
                "id": "81"
              },
              {
                "type": "clazz",
                "id": "82"
              },
              {
                "type": "clazz",
                "id": "83"
              },
              {
                "type": "clazz",
                "id": "84"
              }
            ]
          },
          "parentComponent": {
            "data": {
              "type": "component",
              "id": "72"
            }
          }
        }
      },
      {
        "type": "clazzcommunication",
        "id": "127",
        "attributes": {
          "extensionAttributes": {},
          "operationName": "getMethod34()",
          "totalRequests": 40,
          "averageResponseTime": 813
        },
        "relationships": {
          "sourceClazz": {
            "data": {
              "type": "clazz",
              "id": "74"
            }
          },
          "targetClazz": {
            "data": {
              "type": "clazz",
              "id": "80"
            }
          },
          "tracesteps": {
            "data": [
              {
                "type": "tracestep",
                "id": "129"
              }
            ]
          }
        }
      },
      {
        "type": "databasequery",
        "id": "315",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593834900,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "42",
          "responseTime": 582
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "237",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593086600,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "49",
          "responseTime": 263
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "317",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593841100,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 192
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "node",
        "id": "50",
        "attributes": {
          "extensionAttributes": {},
          "ipAddress": "10.0.0.2",
          "cpuUtilization": 0.25,
          "freeRAM": 1073741824,
          "usedRAM": 4294967296
        },
        "relationships": {
          "applications": {
            "data": [
              {
                "type": "application",
                "id": "51"
              }
            ]
          },
          "parent": {
            "data": {
              "type": "nodegroup",
              "id": "47"
            }
          }
        }
      },
      {
        "type": "trace",
        "id": "128",
        "attributes": {
          "extensionAttributes": {},
          "traceId": 1,
          "totalRequests": 32350,
          "totalTraceDuration": 8290,
          "averageResponseTime": 234
        },
        "relationships": {
          "traceSteps": {
            "data": [
              {
                "type": "tracestep",
                "id": "129"
              },
              {
                "type": "tracestep",
                "id": "132"
              },
              {
                "type": "tracestep",
                "id": "135"
              },
              {
                "type": "tracestep",
                "id": "138"
              },
              {
                "type": "tracestep",
                "id": "141"
              },
              {
                "type": "tracestep",
                "id": "144"
              },
              {
                "type": "tracestep",
                "id": "147"
              },
              {
                "type": "tracestep",
                "id": "150"
              },
              {
                "type": "tracestep",
                "id": "153"
              },
              {
                "type": "tracestep",
                "id": "156"
              },
              {
                "type": "tracestep",
                "id": "158"
              },
              {
                "type": "tracestep",
                "id": "161"
              },
              {
                "type": "tracestep",
                "id": "163"
              },
              {
                "type": "tracestep",
                "id": "166"
              },
              {
                "type": "tracestep",
                "id": "168"
              }
            ]
          }
        }
      },
      {
        "type": "clazzcommunication",
        "id": "134",
        "attributes": {
          "extensionAttributes": {},
          "operationName": "getMethod17()",
          "totalRequests": 60,
          "averageResponseTime": 765
        },
        "relationships": {
          "sourceClazz": {
            "data": {
              "type": "clazz",
              "id": "109"
            }
          },
          "targetClazz": {
            "data": {
              "type": "clazz",
              "id": "80"
            }
          },
          "tracesteps": {
            "data": [
              {
                "type": "tracestep",
                "id": "135"
              }
            ]
          }
        }
      },
      {
        "type": "databasequery",
        "id": "239",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593088900,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 307
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "applicationcommunication",
        "id": "342",
        "attributes": {
          "extensionAttributes": {},
          "requests": 100,
          "averageResponseTime": 0
        },
        "relationships": {
          "sourceApplication": {
            "data": {
              "type": "application",
              "id": "44"
            }
          },
          "targetApplication": {
            "data": {
              "type": "application",
              "id": "45"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "332",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593860600,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "44",
          "responseTime": 973
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "330",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593858200,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 770
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "system",
        "id": "46",
        "attributes": {
          "extensionAttributes": {},
          "name": "PubFlow"
        },
        "relationships": {
          "nodegroups": {
            "data": [
              {
                "type": "nodegroup",
                "id": "47"
              },
              {
                "type": "nodegroup",
                "id": "52"
              },
              {
                "type": "nodegroup",
                "id": "55"
              },
              {
                "type": "nodegroup",
                "id": "68"
              },
              {
                "type": "nodegroup",
                "id": "182"
              }
            ]
          },
          "parent": {
            "data": {
              "type": "landscape",
              "id": "3"
            }
          }
        }
      },
      {
        "type": "tracestep",
        "id": "141",
        "attributes": {
          "extensionAttributes": {},
          "tracePosition": 5,
          "requests": 1000,
          "currentTraceDuration": 2033,
          "averageResponseTime": 842
        },
        "relationships": {
          "parentTrace": {
            "data": {
              "type": "trace",
              "id": "128"
            }
          },
          "clazzCommunication": {
            "data": {
              "type": "clazzcommunication",
              "id": "140"
            }
          }
        }
      },
      {
        "type": "tracestep",
        "id": "135",
        "attributes": {
          "extensionAttributes": {},
          "tracePosition": 3,
          "requests": 60,
          "currentTraceDuration": 3712,
          "averageResponseTime": 765
        },
        "relationships": {
          "parentTrace": {
            "data": {
              "type": "trace",
              "id": "128"
            }
          },
          "clazzCommunication": {
            "data": {
              "type": "clazzcommunication",
              "id": "134"
            }
          }
        }
      },
      {
        "type": "node",
        "id": "29",
        "attributes": {
          "extensionAttributes": {},
          "ipAddress": "10.0.3.2",
          "cpuUtilization": 0.86,
          "freeRAM": 2147483648,
          "usedRAM": 2147483648
        },
        "relationships": {
          "applications": {
            "data": [
              {
                "type": "application",
                "id": "30"
              }
            ]
          },
          "parent": {
            "data": {
              "type": "nodegroup",
              "id": "28"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "270",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593147200,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 255
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "component",
        "id": "105",
        "attributes": {
          "extensionAttributes": {},
          "name": "guard",
          "fullQualifiedName": "org.webshop.kernel.guard"
        },
        "relationships": {
          "children": {
            "data": []
          },
          "clazzes": {
            "data": [
              {
                "type": "clazz",
                "id": "106"
              },
              {
                "type": "clazz",
                "id": "107"
              }
            ]
          },
          "parentComponent": {
            "data": {
              "type": "component",
              "id": "95"
            }
          }
        }
      },
      {
        "type": "clazz",
        "id": "84",
        "attributes": {
          "extensionAttributes": {},
          "name": "SequenceHelper",
          "fullQualifiedName": "org.webshop.helpers.SequenceHelper",
          "instanceCount": 35
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "component",
              "id": "79"
            }
          },
          "clazzCommunications": {
            "data": []
          }
        }
      },
      {
        "type": "system",
        "id": "5",
        "attributes": {
          "extensionAttributes": {},
          "name": "Requests"
        },
        "relationships": {
          "nodegroups": {
            "data": [
              {
                "type": "nodegroup",
                "id": "6"
              }
            ]
          },
          "parent": {
            "data": {
              "type": "landscape",
              "id": "3"
            }
          }
        }
      },
      {
        "type": "application",
        "id": "49",
        "attributes": {
          "extensionAttributes": {},
          "name": "Jira",
          "programmingLanguage": "JAVA",
          "lastUsage": 1547561492149
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "node",
              "id": "48"
            }
          },
          "components": {
            "data": []
          },
          "databaseQueries": {
            "data": []
          },
          "applicationCommunications": {
            "data": [
              {
                "type": "applicationcommunication",
                "id": "353"
              },
              {
                "type": "applicationcommunication",
                "id": "355"
              },
              {
                "type": "applicationcommunication",
                "id": "356"
              },
              {
                "type": "applicationcommunication",
                "id": "357"
              },
              {
                "type": "applicationcommunication",
                "id": "353"
              },
              {
                "type": "applicationcommunication",
                "id": "355"
              },
              {
                "type": "applicationcommunication",
                "id": "356"
              },
              {
                "type": "applicationcommunication",
                "id": "357"
              }
            ]
          },
          "aggregatedClazzCommunications": {
            "data": []
          },
          "traces": {
            "data": []
          }
        }
      },
      {
        "type": "databasequery",
        "id": "202",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593039900,
          "statementType": "Statement",
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 593
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "197",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593033100,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 465
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "199",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593035700,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 763
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "node",
        "id": "33",
        "attributes": {
          "extensionAttributes": {},
          "ipAddress": "10.0.4.1",
          "cpuUtilization": 0.58,
          "freeRAM": 4294967296,
          "usedRAM": 3221225472
        },
        "relationships": {
          "applications": {
            "data": [
              {
                "type": "application",
                "id": "34"
              }
            ]
          },
          "parent": {
            "data": {
              "type": "nodegroup",
              "id": "32"
            }
          }
        }
      },
      {
        "type": "application",
        "id": "58",
        "attributes": {
          "extensionAttributes": {},
          "name": "Provenance",
          "programmingLanguage": "JAVA",
          "lastUsage": 1547561492149
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "node",
              "id": "56"
            }
          },
          "components": {
            "data": []
          },
          "databaseQueries": {
            "data": []
          },
          "applicationCommunications": {
            "data": [
              {
                "type": "applicationcommunication",
                "id": "368"
              },
              {
                "type": "applicationcommunication",
                "id": "368"
              }
            ]
          },
          "aggregatedClazzCommunications": {
            "data": []
          },
          "traces": {
            "data": []
          }
        }
      },
      {
        "type": "databasequery",
        "id": "204",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593042500,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 1000
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "applicationcommunication",
        "id": "347",
        "attributes": {
          "extensionAttributes": {},
          "requests": 100,
          "averageResponseTime": 0
        },
        "relationships": {
          "sourceApplication": {
            "data": {
              "type": "application",
              "id": "57"
            }
          },
          "targetApplication": {
            "data": {
              "type": "application",
              "id": "41"
            }
          }
        }
      },
      {
        "type": "application",
        "id": "19",
        "attributes": {
          "extensionAttributes": {},
          "name": "Interface",
          "programmingLanguage": "JAVA",
          "lastUsage": 1547561492149
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "node",
              "id": "18"
            }
          },
          "components": {
            "data": []
          },
          "databaseQueries": {
            "data": []
          },
          "applicationCommunications": {
            "data": [
              {
                "type": "applicationcommunication",
                "id": "344"
              },
              {
                "type": "applicationcommunication",
                "id": "346"
              },
              {
                "type": "applicationcommunication",
                "id": "344"
              },
              {
                "type": "applicationcommunication",
                "id": "346"
              }
            ]
          },
          "aggregatedClazzCommunications": {
            "data": []
          },
          "traces": {
            "data": []
          }
        }
      },
      {
        "type": "aggregatedclazzcommunication",
        "id": "159",
        "attributes": {
          "extensionAttributes": {},
          "totalRequests": 2800,
          "averageResponseTime": 700.5
        },
        "relationships": {
          "sourceClazz": {
            "data": {
              "type": "clazz",
              "id": "125"
            }
          },
          "targetClazz": {
            "data": {
              "type": "clazz",
              "id": "109"
            }
          },
          "clazzCommunications": {
            "data": [
              {
                "type": "clazzcommunication",
                "id": "157"
              },
              {
                "type": "clazzcommunication",
                "id": "172"
              }
            ]
          }
        }
      },
      {
        "type": "applicationcommunication",
        "id": "352",
        "attributes": {
          "extensionAttributes": {},
          "requests": 100,
          "averageResponseTime": 0
        },
        "relationships": {
          "sourceApplication": {
            "data": {
              "type": "application",
              "id": "34"
            }
          },
          "targetApplication": {
            "data": {
              "type": "application",
              "id": "37"
            }
          }
        }
      },
      {
        "type": "applicationcommunication",
        "id": "357",
        "attributes": {
          "extensionAttributes": {},
          "requests": 100,
          "averageResponseTime": 0
        },
        "relationships": {
          "sourceApplication": {
            "data": {
              "type": "application",
              "id": "49"
            }
          },
          "targetApplication": {
            "data": {
              "type": "application",
              "id": "63"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "241",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593091300,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 782
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "nodegroup",
        "id": "24",
        "attributes": {
          "extensionAttributes": {},
          "name": "10.0.3.1"
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "system",
              "id": "23"
            }
          }
        }
      },
      {
        "type": "clazzcommunication",
        "id": "162",
        "attributes": {
          "extensionAttributes": {},
          "operationName": "getMethod13()",
          "totalRequests": 4200,
          "averageResponseTime": 553
        },
        "relationships": {
          "sourceClazz": {
            "data": {
              "type": "clazz",
              "id": "80"
            }
          },
          "targetClazz": {
            "data": {
              "type": "clazz",
              "id": "109"
            }
          },
          "tracesteps": {
            "data": [
              {
                "type": "tracestep",
                "id": "163"
              }
            ]
          }
        }
      },
      {
        "type": "aggregatedclazzcommunication",
        "id": "154",
        "attributes": {
          "extensionAttributes": {},
          "totalRequests": 24000,
          "averageResponseTime": 648
        },
        "relationships": {
          "sourceClazz": {
            "data": {
              "type": "clazz",
              "id": "106"
            }
          },
          "targetClazz": {
            "data": {
              "type": "clazz",
              "id": "109"
            }
          },
          "clazzCommunications": {
            "data": [
              {
                "type": "clazzcommunication",
                "id": "152"
              }
            ]
          }
        }
      },
      {
        "type": "databasequery",
        "id": "298",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593809400,
          "statementType": "Statement",
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 247
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "243",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593094500,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "48",
          "responseTime": 763
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "component",
        "id": "96",
        "attributes": {
          "extensionAttributes": {},
          "name": "api",
          "fullQualifiedName": "org.webshop.kernel.api"
        },
        "relationships": {
          "children": {
            "data": []
          },
          "clazzes": {
            "data": [
              {
                "type": "clazz",
                "id": "97"
              },
              {
                "type": "clazz",
                "id": "98"
              }
            ]
          },
          "parentComponent": {
            "data": {
              "type": "component",
              "id": "95"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "303",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593820000,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "79",
          "responseTime": 602
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "clazzcommunication",
        "id": "152",
        "attributes": {
          "extensionAttributes": {},
          "operationName": "getMethod12()",
          "totalRequests": 12000,
          "averageResponseTime": 648
        },
        "relationships": {
          "sourceClazz": {
            "data": {
              "type": "clazz",
              "id": "106"
            }
          },
          "targetClazz": {
            "data": {
              "type": "clazz",
              "id": "109"
            }
          },
          "tracesteps": {
            "data": [
              {
                "type": "tracestep",
                "id": "153"
              }
            ]
          }
        }
      },
      {
        "type": "databasequery",
        "id": "282",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593172500,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 224
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "280",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593160900,
          "statementType": "Statement",
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 468
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "305",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593822400,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 941
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "213",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593055000,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "48",
          "responseTime": 230
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "node",
        "id": "48",
        "attributes": {
          "extensionAttributes": {},
          "ipAddress": "10.0.0.1",
          "cpuUtilization": 0.91,
          "freeRAM": 3221225472,
          "usedRAM": 4294967296
        },
        "relationships": {
          "applications": {
            "data": [
              {
                "type": "application",
                "id": "49"
              }
            ]
          },
          "parent": {
            "data": {
              "type": "nodegroup",
              "id": "47"
            }
          }
        }
      },
      {
        "type": "component",
        "id": "118",
        "attributes": {
          "extensionAttributes": {},
          "name": "info",
          "fullQualifiedName": "org.webshop.kernel.info"
        },
        "relationships": {
          "children": {
            "data": []
          },
          "clazzes": {
            "data": [
              {
                "type": "clazz",
                "id": "119"
              },
              {
                "type": "clazz",
                "id": "120"
              }
            ]
          },
          "parentComponent": {
            "data": {
              "type": "component",
              "id": "95"
            }
          }
        }
      },
      {
        "type": "component",
        "id": "121",
        "attributes": {
          "extensionAttributes": {},
          "name": "lifecycle",
          "fullQualifiedName": "org.webshop.kernel.lifecycle"
        },
        "relationships": {
          "children": {
            "data": []
          },
          "clazzes": {
            "data": [
              {
                "type": "clazz",
                "id": "122"
              },
              {
                "type": "clazz",
                "id": "123"
              }
            ]
          },
          "parentComponent": {
            "data": {
              "type": "component",
              "id": "95"
            }
          }
        }
      },
      {
        "type": "applicationcommunication",
        "id": "364",
        "attributes": {
          "extensionAttributes": {},
          "requests": 100,
          "averageResponseTime": 0
        },
        "relationships": {
          "sourceApplication": {
            "data": {
              "type": "application",
              "id": "60"
            }
          },
          "targetApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          }
        }
      },
      {
        "type": "component",
        "id": "112",
        "attributes": {
          "extensionAttributes": {},
          "name": "api",
          "fullQualifiedName": "org.webshop.kernel.impl.api"
        },
        "relationships": {
          "children": {
            "data": []
          },
          "clazzes": {
            "data": [
              {
                "type": "clazz",
                "id": "113"
              }
            ]
          },
          "parentComponent": {
            "data": {
              "type": "component",
              "id": "108"
            }
          }
        }
      },
      {
        "type": "applicationcommunication",
        "id": "358",
        "attributes": {
          "extensionAttributes": {},
          "requests": 200,
          "averageResponseTime": 0
        },
        "relationships": {
          "sourceApplication": {
            "data": {
              "type": "application",
              "id": "51"
            }
          },
          "targetApplication": {
            "data": {
              "type": "application",
              "id": "66"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "248",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593100900,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "78",
          "responseTime": 573
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "application",
        "id": "54",
        "attributes": {
          "extensionAttributes": {},
          "name": "PostgreSQL",
          "programmingLanguage": "JAVA",
          "lastUsage": 1547561492149
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "node",
              "id": "53"
            }
          },
          "components": {
            "data": []
          },
          "databaseQueries": {
            "data": []
          },
          "applicationCommunications": {
            "data": []
          },
          "aggregatedClazzCommunications": {
            "data": []
          },
          "traces": {
            "data": []
          }
        }
      },
      {
        "type": "clazzcommunication",
        "id": "149",
        "attributes": {
          "extensionAttributes": {},
          "operationName": "getMethod28()",
          "totalRequests": 150,
          "averageResponseTime": 165
        },
        "relationships": {
          "sourceClazz": {
            "data": {
              "type": "clazz",
              "id": "122"
            }
          },
          "targetClazz": {
            "data": {
              "type": "clazz",
              "id": "125"
            }
          },
          "tracesteps": {
            "data": [
              {
                "type": "tracestep",
                "id": "150"
              }
            ]
          }
        }
      },
      {
        "type": "databasequery",
        "id": "326",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593853700,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "71",
          "responseTime": 680
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "component",
        "id": "72",
        "attributes": {
          "extensionAttributes": {},
          "name": "webshop",
          "fullQualifiedName": "org.webshop"
        },
        "relationships": {
          "children": {
            "data": [
              {
                "type": "component",
                "id": "73"
              },
              {
                "type": "component",
                "id": "79"
              },
              {
                "type": "component",
                "id": "85"
              },
              {
                "type": "component",
                "id": "92"
              },
              {
                "type": "component",
                "id": "95"
              }
            ]
          },
          "clazzes": {
            "data": []
          },
          "parentComponent": {
            "data": {
              "type": "component",
              "id": "71"
            }
          }
        }
      },
      {
        "type": "component",
        "id": "188",
        "attributes": {
          "extensionAttributes": {},
          "name": "connector",
          "fullQualifiedName": "org.database.connector"
        },
        "relationships": {
          "children": {
            "data": []
          },
          "clazzes": {
            "data": [
              {
                "type": "clazz",
                "id": "189"
              }
            ]
          },
          "parentComponent": {
            "data": {
              "type": "component",
              "id": "187"
            }
          }
        }
      },
      {
        "type": "clazz",
        "id": "93",
        "attributes": {
          "extensionAttributes": {},
          "name": "AbstractBean",
          "fullQualifiedName": "org.webshop.unsafe.AbstractBean",
          "instanceCount": 20
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "component",
              "id": "92"
            }
          },
          "clazzCommunications": {
            "data": []
          }
        }
      },
      {
        "type": "application",
        "id": "27",
        "attributes": {
          "extensionAttributes": {},
          "name": "Eprints",
          "programmingLanguage": "PERL",
          "lastUsage": 1547561492149
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "node",
              "id": "25"
            }
          },
          "components": {
            "data": []
          },
          "databaseQueries": {
            "data": []
          },
          "applicationCommunications": {
            "data": [
              {
                "type": "applicationcommunication",
                "id": "350"
              },
              {
                "type": "applicationcommunication",
                "id": "350"
              }
            ]
          },
          "aggregatedClazzCommunications": {
            "data": []
          },
          "traces": {
            "data": []
          }
        }
      },
      {
        "type": "clazzcommunication",
        "id": "137",
        "attributes": {
          "extensionAttributes": {},
          "operationName": "getMethod2()",
          "totalRequests": 600,
          "averageResponseTime": 976
        },
        "relationships": {
          "sourceClazz": {
            "data": {
              "type": "clazz",
              "id": "109"
            }
          },
          "targetClazz": {
            "data": {
              "type": "clazz",
              "id": "113"
            }
          },
          "tracesteps": {
            "data": [
              {
                "type": "tracestep",
                "id": "138"
              }
            ]
          }
        }
      },
      {
        "type": "application",
        "id": "184",
        "attributes": {
          "extensionAttributes": {},
          "name": "Cache",
          "programmingLanguage": "JAVA",
          "lastUsage": 1547561492150
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "node",
              "id": "183"
            }
          },
          "components": {
            "data": []
          },
          "databaseQueries": {
            "data": []
          },
          "applicationCommunications": {
            "data": [
              {
                "type": "applicationcommunication",
                "id": "367"
              },
              {
                "type": "applicationcommunication",
                "id": "367"
              }
            ]
          },
          "aggregatedClazzCommunications": {
            "data": []
          },
          "traces": {
            "data": []
          }
        }
      },
      {
        "type": "databasequery",
        "id": "251",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593104700,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 767
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "applicationcommunication",
        "id": "369",
        "attributes": {
          "extensionAttributes": {},
          "requests": 200,
          "averageResponseTime": 0
        },
        "relationships": {
          "sourceApplication": {
            "data": {
              "type": "application",
              "id": "61"
            }
          },
          "targetApplication": {
            "data": {
              "type": "application",
              "id": "70"
            }
          }
        }
      },
      {
        "type": "applicationcommunication",
        "id": "370",
        "attributes": {
          "extensionAttributes": {},
          "requests": 300,
          "averageResponseTime": 0
        },
        "relationships": {
          "sourceApplication": {
            "data": {
              "type": "application",
              "id": "64"
            }
          },
          "targetApplication": {
            "data": {
              "type": "application",
              "id": "70"
            }
          }
        }
      },
      {
        "type": "applicationcommunication",
        "id": "341",
        "attributes": {
          "extensionAttributes": {},
          "requests": 100,
          "averageResponseTime": 0
        },
        "relationships": {
          "sourceApplication": {
            "data": {
              "type": "application",
              "id": "41"
            }
          },
          "targetApplication": {
            "data": {
              "type": "application",
              "id": "44"
            }
          }
        }
      },
      {
        "type": "tracestep",
        "id": "173",
        "attributes": {
          "extensionAttributes": {},
          "tracePosition": 2,
          "requests": 900,
          "currentTraceDuration": 7187,
          "averageResponseTime": 777
        },
        "relationships": {
          "parentTrace": {
            "data": {
              "type": "trace",
              "id": "170"
            }
          },
          "clazzCommunication": {
            "data": {
              "type": "clazzcommunication",
              "id": "172"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "255",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593110300,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "53",
          "responseTime": 530
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "217",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593059800,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 783
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "applicationcommunication",
        "id": "346",
        "attributes": {
          "extensionAttributes": {},
          "requests": 100,
          "averageResponseTime": 0
        },
        "relationships": {
          "sourceApplication": {
            "data": {
              "type": "application",
              "id": "19"
            }
          },
          "targetApplication": {
            "data": {
              "type": "application",
              "id": "57"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "333",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593862000,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "38",
          "responseTime": 331
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "application",
        "id": "34",
        "attributes": {
          "extensionAttributes": {},
          "name": "Wiki",
          "programmingLanguage": "JAVA",
          "lastUsage": 1547561492149
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "node",
              "id": "33"
            }
          },
          "components": {
            "data": []
          },
          "databaseQueries": {
            "data": []
          },
          "applicationCommunications": {
            "data": [
              {
                "type": "applicationcommunication",
                "id": "352"
              },
              {
                "type": "applicationcommunication",
                "id": "352"
              }
            ]
          },
          "aggregatedClazzCommunications": {
            "data": []
          },
          "traces": {
            "data": []
          }
        }
      },
      {
        "type": "application",
        "id": "67",
        "attributes": {
          "extensionAttributes": {},
          "name": "Provenance",
          "programmingLanguage": "JAVA",
          "lastUsage": 1547561492149
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "node",
              "id": "65"
            }
          },
          "components": {
            "data": []
          },
          "databaseQueries": {
            "data": []
          },
          "applicationCommunications": {
            "data": [
              {
                "type": "applicationcommunication",
                "id": "371"
              },
              {
                "type": "applicationcommunication",
                "id": "371"
              }
            ]
          },
          "aggregatedClazzCommunications": {
            "data": []
          },
          "traces": {
            "data": []
          }
        }
      },
      {
        "type": "aggregatedclazzcommunication",
        "id": "130",
        "attributes": {
          "extensionAttributes": {},
          "totalRequests": 80,
          "averageResponseTime": 813
        },
        "relationships": {
          "sourceClazz": {
            "data": {
              "type": "clazz",
              "id": "74"
            }
          },
          "targetClazz": {
            "data": {
              "type": "clazz",
              "id": "80"
            }
          },
          "clazzCommunications": {
            "data": [
              {
                "type": "clazzcommunication",
                "id": "127"
              }
            ]
          }
        }
      },
      {
        "type": "databasequery",
        "id": "193",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593016400,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 428
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "clazzcommunication",
        "id": "180",
        "attributes": {
          "extensionAttributes": {},
          "operationName": "getMethod38()",
          "totalRequests": 390,
          "averageResponseTime": 173
        },
        "relationships": {
          "sourceClazz": {
            "data": {
              "type": "clazz",
              "id": "80"
            }
          },
          "targetClazz": {
            "data": {
              "type": "clazz",
              "id": "109"
            }
          },
          "tracesteps": {
            "data": [
              {
                "type": "tracestep",
                "id": "181"
              }
            ]
          }
        }
      },
      {
        "type": "nodegroup",
        "id": "182",
        "attributes": {
          "extensionAttributes": {},
          "name": "10.0.0.8"
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "system",
              "id": "46"
            }
          }
        }
      },
      {
        "type": "node",
        "id": "11",
        "attributes": {
          "extensionAttributes": {},
          "ipAddress": "10.0.1.1",
          "cpuUtilization": 0.42,
          "freeRAM": 3221225472,
          "usedRAM": 1073741824
        },
        "relationships": {
          "applications": {
            "data": [
              {
                "type": "application",
                "id": "12"
              }
            ]
          },
          "parent": {
            "data": {
              "type": "nodegroup",
              "id": "10"
            }
          }
        }
      },
      {
        "type": "component",
        "id": "71",
        "attributes": {
          "extensionAttributes": {},
          "name": "org",
          "fullQualifiedName": "org"
        },
        "relationships": {
          "children": {
            "data": [
              {
                "type": "component",
                "id": "72"
              }
            ]
          },
          "clazzes": {
            "data": []
          }
        }
      },
      {
        "type": "component",
        "id": "102",
        "attributes": {
          "extensionAttributes": {},
          "name": "extension",
          "fullQualifiedName": "org.webshop.kernel.extension"
        },
        "relationships": {
          "children": {
            "data": []
          },
          "clazzes": {
            "data": [
              {
                "type": "clazz",
                "id": "103"
              },
              {
                "type": "clazz",
                "id": "104"
              }
            ]
          },
          "parentComponent": {
            "data": {
              "type": "component",
              "id": "95"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "274",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593152600,
          "statementType": "Statement",
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 525
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "275",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593154200,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 596
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "220",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593063800,
          "statementType": "Statement",
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 886
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "192",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593013600,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 593
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "278",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593158400,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "15",
          "responseTime": 720
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "224",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593069500,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "33",
          "responseTime": 660
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "trace",
        "id": "170",
        "attributes": {
          "extensionAttributes": {},
          "traceId": 2,
          "totalRequests": 24390,
          "totalTraceDuration": 4341,
          "averageResponseTime": 173
        },
        "relationships": {
          "traceSteps": {
            "data": [
              {
                "type": "tracestep",
                "id": "171"
              },
              {
                "type": "tracestep",
                "id": "173"
              },
              {
                "type": "tracestep",
                "id": "175"
              },
              {
                "type": "tracestep",
                "id": "177"
              },
              {
                "type": "tracestep",
                "id": "179"
              },
              {
                "type": "tracestep",
                "id": "181"
              }
            ]
          }
        }
      },
      {
        "type": "clazzcommunication",
        "id": "176",
        "attributes": {
          "extensionAttributes": {},
          "operationName": "getMethod47()",
          "totalRequests": 11200,
          "averageResponseTime": 556
        },
        "relationships": {
          "sourceClazz": {
            "data": {
              "type": "clazz",
              "id": "80"
            }
          },
          "targetClazz": {
            "data": {
              "type": "clazz",
              "id": "109"
            }
          },
          "tracesteps": {
            "data": [
              {
                "type": "tracestep",
                "id": "177"
              }
            ]
          }
        }
      },
      {
        "type": "databasequery",
        "id": "337",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593866500,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 959
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "clazz",
        "id": "109",
        "attributes": {
          "extensionAttributes": {},
          "name": "ImplementationHandler",
          "fullQualifiedName": "org.webshop.kernel.impl.ImplementationHandler",
          "instanceCount": 45
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "component",
              "id": "108"
            }
          },
          "clazzCommunications": {
            "data": [
              {
                "type": "clazzcommunication",
                "id": "134"
              },
              {
                "type": "clazzcommunication",
                "id": "137"
              },
              {
                "type": "clazzcommunication",
                "id": "140"
              },
              {
                "type": "clazzcommunication",
                "id": "155"
              },
              {
                "type": "clazzcommunication",
                "id": "160"
              },
              {
                "type": "clazzcommunication",
                "id": "165"
              },
              {
                "type": "clazzcommunication",
                "id": "169"
              },
              {
                "type": "clazzcommunication",
                "id": "174"
              },
              {
                "type": "clazzcommunication",
                "id": "178"
              }
            ]
          }
        }
      },
      {
        "type": "clazz",
        "id": "89",
        "attributes": {
          "extensionAttributes": {},
          "name": "ItemSqlMapDao",
          "fullQualifiedName": "org.webshop.tooling.ItemSqlMapDao",
          "instanceCount": 45
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "component",
              "id": "85"
            }
          },
          "clazzCommunications": {
            "data": []
          }
        }
      },
      {
        "type": "databasequery",
        "id": "322",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593848800,
          "statementType": "Statement",
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 105
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "node",
        "id": "25",
        "attributes": {
          "extensionAttributes": {},
          "ipAddress": "10.0.3.1",
          "cpuUtilization": 0.39,
          "freeRAM": 1073741824,
          "usedRAM": 3221225472
        },
        "relationships": {
          "applications": {
            "data": [
              {
                "type": "application",
                "id": "26"
              },
              {
                "type": "application",
                "id": "27"
              }
            ]
          },
          "parent": {
            "data": {
              "type": "nodegroup",
              "id": "24"
            }
          }
        }
      },
      {
        "type": "tracestep",
        "id": "168",
        "attributes": {
          "extensionAttributes": {},
          "tracePosition": 15,
          "requests": 2100,
          "currentTraceDuration": 8290,
          "averageResponseTime": 234
        },
        "relationships": {
          "parentTrace": {
            "data": {
              "type": "trace",
              "id": "128"
            }
          },
          "clazzCommunication": {
            "data": {
              "type": "clazzcommunication",
              "id": "167"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "279",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593160000,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "93",
          "responseTime": 543
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "clazz",
        "id": "78",
        "attributes": {
          "extensionAttributes": {},
          "name": "DescriptionLabeler",
          "fullQualifiedName": "org.webshop.labeling.DescriptionLabeler",
          "instanceCount": 5
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "component",
              "id": "73"
            }
          },
          "clazzCommunications": {
            "data": []
          }
        }
      },
      {
        "type": "databasequery",
        "id": "228",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593074400,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 174
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "applicationcommunication",
        "id": "353",
        "attributes": {
          "extensionAttributes": {},
          "requests": 100,
          "averageResponseTime": 0
        },
        "relationships": {
          "sourceApplication": {
            "data": {
              "type": "application",
              "id": "49"
            }
          },
          "targetApplication": {
            "data": {
              "type": "application",
              "id": "54"
            }
          }
        }
      },
      {
        "type": "node",
        "id": "43",
        "attributes": {
          "extensionAttributes": {},
          "ipAddress": "10.0.5.2",
          "cpuUtilization": 0.66,
          "freeRAM": 3221225472,
          "usedRAM": 2147483648
        },
        "relationships": {
          "applications": {
            "data": [
              {
                "type": "application",
                "id": "44"
              },
              {
                "type": "application",
                "id": "45"
              }
            ]
          },
          "parent": {
            "data": {
              "type": "nodegroup",
              "id": "42"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "264",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593139100,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 960
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "tracestep",
        "id": "177",
        "attributes": {
          "extensionAttributes": {},
          "tracePosition": 4,
          "requests": 11200,
          "currentTraceDuration": 4271,
          "averageResponseTime": 556
        },
        "relationships": {
          "parentTrace": {
            "data": {
              "type": "trace",
              "id": "170"
            }
          },
          "clazzCommunication": {
            "data": {
              "type": "clazzcommunication",
              "id": "176"
            }
          }
        }
      },
      {
        "type": "aggregatedclazzcommunication",
        "id": "139",
        "attributes": {
          "extensionAttributes": {},
          "totalRequests": 1200,
          "averageResponseTime": 976
        },
        "relationships": {
          "sourceClazz": {
            "data": {
              "type": "clazz",
              "id": "109"
            }
          },
          "targetClazz": {
            "data": {
              "type": "clazz",
              "id": "113"
            }
          },
          "clazzCommunications": {
            "data": [
              {
                "type": "clazzcommunication",
                "id": "137"
              }
            ]
          }
        }
      },
      {
        "type": "clazz",
        "id": "91",
        "attributes": {
          "extensionAttributes": {},
          "name": "SequenceSqlMapDao",
          "fullQualifiedName": "org.webshop.tooling.SequenceSqlMapDao",
          "instanceCount": 15
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "component",
              "id": "85"
            }
          },
          "clazzCommunications": {
            "data": []
          }
        }
      },
      {
        "type": "clazz",
        "id": "88",
        "attributes": {
          "extensionAttributes": {},
          "name": "CategorySqlMapDao",
          "fullQualifiedName": "org.webshop.tooling.CategorySqlMapDao",
          "instanceCount": 30
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "component",
              "id": "85"
            }
          },
          "clazzCommunications": {
            "data": []
          }
        }
      },
      {
        "type": "clazz",
        "id": "82",
        "attributes": {
          "extensionAttributes": {},
          "name": "CategoryHelper",
          "fullQualifiedName": "org.webshop.helpers.CategoryHelper",
          "instanceCount": 35
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "component",
              "id": "79"
            }
          },
          "clazzCommunications": {
            "data": []
          }
        }
      },
      {
        "type": "databasequery",
        "id": "285",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593177300,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "48",
          "responseTime": 952
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "timestamp",
        "id": "437",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 1547561662140,
          "totalRequests": 24809
        }
      },
      {
        "type": "clazz",
        "id": "119",
        "attributes": {
          "extensionAttributes": {},
          "name": "AccountSqlMapDao",
          "fullQualifiedName": "org.webshop.kernel.info.AccountSqlMapDao",
          "instanceCount": 5
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "component",
              "id": "118"
            }
          },
          "clazzCommunications": {
            "data": []
          }
        }
      },
      {
        "type": "clazzcommunication",
        "id": "146",
        "attributes": {
          "extensionAttributes": {},
          "operationName": "getMethod48()",
          "totalRequests": 1000,
          "averageResponseTime": 146
        },
        "relationships": {
          "sourceClazz": {
            "data": {
              "type": "clazz",
              "id": "97"
            }
          },
          "targetClazz": {
            "data": {
              "type": "clazz",
              "id": "100"
            }
          },
          "tracesteps": {
            "data": [
              {
                "type": "tracestep",
                "id": "147"
              }
            ]
          }
        }
      },
      {
        "type": "clazz",
        "id": "122",
        "attributes": {
          "extensionAttributes": {},
          "name": "AccountSqlMapDao",
          "fullQualifiedName": "org.webshop.kernel.lifecycle.AccountSqlMapDao",
          "instanceCount": 25
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "component",
              "id": "121"
            }
          },
          "clazzCommunications": {
            "data": [
              {
                "type": "clazzcommunication",
                "id": "149"
              }
            ]
          }
        }
      },
      {
        "type": "application",
        "id": "70",
        "attributes": {
          "extensionAttributes": {},
          "name": "Webshop",
          "programmingLanguage": "JAVA",
          "lastUsage": 1547561492149
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "node",
              "id": "69"
            }
          },
          "components": {
            "data": [
              {
                "type": "component",
                "id": "71"
              }
            ]
          },
          "databaseQueries": {
            "data": []
          },
          "applicationCommunications": {
            "data": []
          },
          "aggregatedClazzCommunications": {
            "data": [
              {
                "type": "aggregatedclazzcommunication",
                "id": "130"
              },
              {
                "type": "aggregatedclazzcommunication",
                "id": "133"
              },
              {
                "type": "aggregatedclazzcommunication",
                "id": "136"
              },
              {
                "type": "aggregatedclazzcommunication",
                "id": "139"
              },
              {
                "type": "aggregatedclazzcommunication",
                "id": "142"
              },
              {
                "type": "aggregatedclazzcommunication",
                "id": "145"
              },
              {
                "type": "aggregatedclazzcommunication",
                "id": "148"
              },
              {
                "type": "aggregatedclazzcommunication",
                "id": "151"
              },
              {
                "type": "aggregatedclazzcommunication",
                "id": "154"
              },
              {
                "type": "aggregatedclazzcommunication",
                "id": "159"
              },
              {
                "type": "aggregatedclazzcommunication",
                "id": "164"
              }
            ]
          },
          "traces": {
            "data": [
              {
                "type": "trace",
                "id": "128"
              },
              {
                "type": "trace",
                "id": "170"
              }
            ]
          }
        }
      },
      {
        "type": "databasequery",
        "id": "268",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593144700,
          "statementType": "Statement",
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 514
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "289",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593183000,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 849
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "node",
        "id": "53",
        "attributes": {
          "extensionAttributes": {},
          "ipAddress": "10.0.0.3",
          "cpuUtilization": 0.45,
          "freeRAM": 1073741824,
          "usedRAM": 4294967296
        },
        "relationships": {
          "applications": {
            "data": [
              {
                "type": "application",
                "id": "54"
              }
            ]
          },
          "parent": {
            "data": {
              "type": "nodegroup",
              "id": "52"
            }
          }
        }
      },
      {
        "type": "node",
        "id": "36",
        "attributes": {
          "extensionAttributes": {},
          "ipAddress": "10.0.4.2",
          "cpuUtilization": 0.85,
          "freeRAM": 2147483648,
          "usedRAM": 1073741824
        },
        "relationships": {
          "applications": {
            "data": [
              {
                "type": "application",
                "id": "37"
              }
            ]
          },
          "parent": {
            "data": {
              "type": "nodegroup",
              "id": "35"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "254",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593108800,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "40",
          "responseTime": 31
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "application",
        "id": "63",
        "attributes": {
          "extensionAttributes": {},
          "name": "Workflow",
          "programmingLanguage": "JAVA",
          "lastUsage": 1547561492149
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "node",
              "id": "62"
            }
          },
          "components": {
            "data": []
          },
          "databaseQueries": {
            "data": []
          },
          "applicationCommunications": {
            "data": [
              {
                "type": "applicationcommunication",
                "id": "361"
              },
              {
                "type": "applicationcommunication",
                "id": "365"
              },
              {
                "type": "applicationcommunication",
                "id": "361"
              },
              {
                "type": "applicationcommunication",
                "id": "365"
              }
            ]
          },
          "aggregatedClazzCommunications": {
            "data": []
          },
          "traces": {
            "data": []
          }
        }
      },
      {
        "type": "nodegroup",
        "id": "28",
        "attributes": {
          "extensionAttributes": {},
          "name": "10.0.3.2"
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "system",
              "id": "23"
            }
          }
        }
      },
      {
        "type": "tracestep",
        "id": "158",
        "attributes": {
          "extensionAttributes": {},
          "tracePosition": 11,
          "requests": 500,
          "currentTraceDuration": 1727,
          "averageResponseTime": 624
        },
        "relationships": {
          "parentTrace": {
            "data": {
              "type": "trace",
              "id": "128"
            }
          },
          "clazzCommunication": {
            "data": {
              "type": "clazzcommunication",
              "id": "157"
            }
          }
        }
      },
      {
        "type": "clazz",
        "id": "123",
        "attributes": {
          "extensionAttributes": {},
          "name": "AccountSqlMapDao",
          "fullQualifiedName": "org.webshop.kernel.lifecycle.AccountSqlMapDao",
          "instanceCount": 15
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "component",
              "id": "121"
            }
          },
          "clazzCommunications": {
            "data": []
          }
        }
      },
      {
        "type": "databasequery",
        "id": "291",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593793000,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "75",
          "responseTime": 953
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "application",
        "id": "30",
        "attributes": {
          "extensionAttributes": {},
          "name": "Database",
          "programmingLanguage": "JAVA",
          "lastUsage": 1547561492149
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "node",
              "id": "29"
            }
          },
          "components": {
            "data": []
          },
          "databaseQueries": {
            "data": []
          },
          "applicationCommunications": {
            "data": []
          },
          "aggregatedClazzCommunications": {
            "data": []
          },
          "traces": {
            "data": []
          }
        }
      },
      {
        "type": "databasequery",
        "id": "271",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593148400,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 158
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "207",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593047000,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "62",
          "responseTime": 873
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "clazz",
        "id": "98",
        "attributes": {
          "extensionAttributes": {},
          "name": "APIHandler",
          "fullQualifiedName": "org.webshop.kernel.api.APIHandler",
          "instanceCount": 25
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "component",
              "id": "96"
            }
          },
          "clazzCommunications": {
            "data": []
          }
        }
      },
      {
        "type": "tracestep",
        "id": "161",
        "attributes": {
          "extensionAttributes": {},
          "tracePosition": 12,
          "requests": 4200,
          "currentTraceDuration": 6824,
          "averageResponseTime": 156
        },
        "relationships": {
          "parentTrace": {
            "data": {
              "type": "trace",
              "id": "128"
            }
          },
          "clazzCommunication": {
            "data": {
              "type": "clazzcommunication",
              "id": "160"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "258",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593121300,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 732
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "196",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593031500,
          "statementType": "Statement",
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 331
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "203",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593041200,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 430
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "application",
        "id": "12",
        "attributes": {
          "extensionAttributes": {},
          "name": "Frontend",
          "programmingLanguage": "JAVA",
          "lastUsage": 1547561492145
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "node",
              "id": "11"
            }
          },
          "components": {
            "data": []
          },
          "databaseQueries": {
            "data": []
          },
          "applicationCommunications": {
            "data": [
              {
                "type": "applicationcommunication",
                "id": "343"
              },
              {
                "type": "applicationcommunication",
                "id": "345"
              },
              {
                "type": "applicationcommunication",
                "id": "343"
              },
              {
                "type": "applicationcommunication",
                "id": "345"
              }
            ]
          },
          "aggregatedClazzCommunications": {
            "data": []
          },
          "traces": {
            "data": []
          }
        }
      },
      {
        "type": "aggregatedclazzcommunication",
        "id": "151",
        "attributes": {
          "extensionAttributes": {},
          "totalRequests": 300,
          "averageResponseTime": 165
        },
        "relationships": {
          "sourceClazz": {
            "data": {
              "type": "clazz",
              "id": "122"
            }
          },
          "targetClazz": {
            "data": {
              "type": "clazz",
              "id": "125"
            }
          },
          "clazzCommunications": {
            "data": [
              {
                "type": "clazzcommunication",
                "id": "149"
              }
            ]
          }
        }
      },
      {
        "type": "databasequery",
        "id": "302",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593818600,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "84",
          "responseTime": 717
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "240",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593090100,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 173
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "295",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593804400,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 421
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "clazz",
        "id": "113",
        "attributes": {
          "extensionAttributes": {},
          "name": "APIImpl",
          "fullQualifiedName": "org.webshop.kernel.impl.api.APIImpl",
          "instanceCount": 25
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "component",
              "id": "112"
            }
          },
          "clazzCommunications": {
            "data": []
          }
        }
      },
      {
        "type": "application",
        "id": "41",
        "attributes": {
          "extensionAttributes": {},
          "name": "4D",
          "programmingLanguage": "JAVA",
          "lastUsage": 1547561492149
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "node",
              "id": "40"
            }
          },
          "components": {
            "data": []
          },
          "databaseQueries": {
            "data": []
          },
          "applicationCommunications": {
            "data": [
              {
                "type": "applicationcommunication",
                "id": "341"
              },
              {
                "type": "applicationcommunication",
                "id": "341"
              }
            ]
          },
          "aggregatedClazzCommunications": {
            "data": []
          },
          "traces": {
            "data": []
          }
        }
      },
      {
        "type": "databasequery",
        "id": "244",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593095500,
          "statementType": "Statement",
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 54
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "nodegroup",
        "id": "47",
        "attributes": {
          "extensionAttributes": {},
          "name": "10.0.0.1 - 10.0.0.2"
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "system",
              "id": "46"
            }
          }
        }
      },
      {
        "type": "node",
        "id": "21",
        "attributes": {
          "extensionAttributes": {},
          "ipAddress": "10.0.2.2",
          "cpuUtilization": 0.48,
          "freeRAM": 4294967296,
          "usedRAM": 4294967296
        },
        "relationships": {
          "applications": {
            "data": [
              {
                "type": "application",
                "id": "22"
              }
            ]
          },
          "parent": {
            "data": {
              "type": "nodegroup",
              "id": "20"
            }
          }
        }
      },
      {
        "type": "applicationcommunication",
        "id": "344",
        "attributes": {
          "extensionAttributes": {},
          "requests": 100,
          "averageResponseTime": 0
        },
        "relationships": {
          "sourceApplication": {
            "data": {
              "type": "application",
              "id": "19"
            }
          },
          "targetApplication": {
            "data": {
              "type": "application",
              "id": "22"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "306",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593823800,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 671
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "application",
        "id": "61",
        "attributes": {
          "extensionAttributes": {},
          "name": "Provenance",
          "programmingLanguage": "JAVA",
          "lastUsage": 1547561492149
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "node",
              "id": "59"
            }
          },
          "components": {
            "data": []
          },
          "databaseQueries": {
            "data": []
          },
          "applicationCommunications": {
            "data": [
              {
                "type": "applicationcommunication",
                "id": "369"
              },
              {
                "type": "applicationcommunication",
                "id": "369"
              }
            ]
          },
          "aggregatedClazzCommunications": {
            "data": []
          },
          "traces": {
            "data": []
          }
        }
      },
      {
        "type": "databasequery",
        "id": "299",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593813300,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 985
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "281",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593170700,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 196
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "system",
        "id": "31",
        "attributes": {
          "extensionAttributes": {},
          "name": "OSIS-Kiel"
        },
        "relationships": {
          "nodegroups": {
            "data": [
              {
                "type": "nodegroup",
                "id": "32"
              },
              {
                "type": "nodegroup",
                "id": "35"
              }
            ]
          },
          "parent": {
            "data": {
              "type": "landscape",
              "id": "3"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "261",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593125900,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "73",
          "responseTime": 487
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "211",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593051700,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 334
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "284",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593175700,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "53",
          "responseTime": 442
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "clazz",
        "id": "117",
        "attributes": {
          "extensionAttributes": {},
          "name": "AccountSqlMapDao",
          "fullQualifiedName": "org.webshop.kernel.impl.persistence.AccountSqlMapDao",
          "instanceCount": 45
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "component",
              "id": "116"
            }
          },
          "clazzCommunications": {
            "data": []
          }
        }
      },
      {
        "type": "databasequery",
        "id": "269",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593146000,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 534
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "component",
        "id": "124",
        "attributes": {
          "extensionAttributes": {},
          "name": "logging",
          "fullQualifiedName": "org.webshop.kernel.logging"
        },
        "relationships": {
          "children": {
            "data": []
          },
          "clazzes": {
            "data": [
              {
                "type": "clazz",
                "id": "125"
              },
              {
                "type": "clazz",
                "id": "126"
              }
            ]
          },
          "parentComponent": {
            "data": {
              "type": "component",
              "id": "95"
            }
          }
        }
      },
      {
        "type": "clazzcommunication",
        "id": "143",
        "attributes": {
          "extensionAttributes": {},
          "operationName": "getMethod27()",
          "totalRequests": 100,
          "averageResponseTime": 843
        },
        "relationships": {
          "sourceClazz": {
            "data": {
              "type": "clazz",
              "id": "106"
            }
          },
          "targetClazz": {
            "data": {
              "type": "clazz",
              "id": "93"
            }
          },
          "tracesteps": {
            "data": [
              {
                "type": "tracestep",
                "id": "144"
              }
            ]
          }
        }
      },
      {
        "type": "clazz",
        "id": "103",
        "attributes": {
          "extensionAttributes": {},
          "name": "SingleExtensionHandler",
          "fullQualifiedName": "org.webshop.kernel.extension.SingleExtensionHandler",
          "instanceCount": 25
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "component",
              "id": "102"
            }
          },
          "clazzCommunications": {
            "data": []
          }
        }
      },
      {
        "type": "databasequery",
        "id": "312",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593830900,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 330
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "clazz",
        "id": "120",
        "attributes": {
          "extensionAttributes": {},
          "name": "AccountSqlMapDao",
          "fullQualifiedName": "org.webshop.kernel.info.AccountSqlMapDao",
          "instanceCount": 25
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "component",
              "id": "118"
            }
          },
          "clazzCommunications": {
            "data": []
          }
        }
      },
      {
        "type": "databasequery",
        "id": "234",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593082300,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 945
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "219",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593062900,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "60",
          "responseTime": 733
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "195",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593030300,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "54",
          "responseTime": 97
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "applicationcommunication",
        "id": "356",
        "attributes": {
          "extensionAttributes": {},
          "requests": 500,
          "averageResponseTime": 0
        },
        "relationships": {
          "sourceApplication": {
            "data": {
              "type": "application",
              "id": "49"
            }
          },
          "targetApplication": {
            "data": {
              "type": "application",
              "id": "60"
            }
          }
        }
      },
      {
        "type": "clazz",
        "id": "101",
        "attributes": {
          "extensionAttributes": {},
          "name": "ConfigurationHandler",
          "fullQualifiedName": "org.webshop.kernel.configuration.ConfigurationHandler",
          "instanceCount": 5
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "component",
              "id": "99"
            }
          },
          "clazzCommunications": {
            "data": []
          }
        }
      },
      {
        "type": "clazz",
        "id": "115",
        "attributes": {
          "extensionAttributes": {},
          "name": "CacheImpl",
          "fullQualifiedName": "org.webshop.kernel.impl.cache.CacheImpl",
          "instanceCount": 45
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "component",
              "id": "114"
            }
          },
          "clazzCommunications": {
            "data": []
          }
        }
      },
      {
        "type": "databasequery",
        "id": "273",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593151600,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "32",
          "responseTime": 442
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "335",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593864100,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 569
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "aggregatedclazzcommunication",
        "id": "164",
        "attributes": {
          "extensionAttributes": {},
          "totalRequests": 35780,
          "averageResponseTime": 323.875
        },
        "relationships": {
          "sourceClazz": {
            "data": {
              "type": "clazz",
              "id": "80"
            }
          },
          "targetClazz": {
            "data": {
              "type": "clazz",
              "id": "109"
            }
          },
          "clazzCommunications": {
            "data": [
              {
                "type": "clazzcommunication",
                "id": "162"
              },
              {
                "type": "clazzcommunication",
                "id": "167"
              },
              {
                "type": "clazzcommunication",
                "id": "176"
              },
              {
                "type": "clazzcommunication",
                "id": "180"
              }
            ]
          }
        }
      },
      {
        "type": "application",
        "id": "45",
        "attributes": {
          "extensionAttributes": {},
          "name": "PostgreSQL",
          "programmingLanguage": "JAVA",
          "lastUsage": 1547561492149
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "node",
              "id": "43"
            }
          },
          "components": {
            "data": []
          },
          "databaseQueries": {
            "data": []
          },
          "applicationCommunications": {
            "data": []
          },
          "aggregatedClazzCommunications": {
            "data": []
          },
          "traces": {
            "data": []
          }
        }
      },
      {
        "type": "applicationcommunication",
        "id": "343",
        "attributes": {
          "extensionAttributes": {},
          "requests": 100,
          "averageResponseTime": 0
        },
        "relationships": {
          "sourceApplication": {
            "data": {
              "type": "application",
              "id": "12"
            }
          },
          "targetApplication": {
            "data": {
              "type": "application",
              "id": "19"
            }
          }
        }
      },
      {
        "type": "component",
        "id": "114",
        "attributes": {
          "extensionAttributes": {},
          "name": "cache",
          "fullQualifiedName": "org.webshop.kernel.impl.cache"
        },
        "relationships": {
          "children": {
            "data": []
          },
          "clazzes": {
            "data": [
              {
                "type": "clazz",
                "id": "115"
              }
            ]
          },
          "parentComponent": {
            "data": {
              "type": "component",
              "id": "108"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "223",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593067800,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 280
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "application",
        "id": "185",
        "attributes": {
          "extensionAttributes": {},
          "name": "Database Connector",
          "programmingLanguage": "JAVA",
          "lastUsage": 1547561492150
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "node",
              "id": "183"
            }
          },
          "components": {
            "data": [
              {
                "type": "component",
                "id": "186"
              }
            ]
          },
          "databaseQueries": {
            "data": [
              {
                "type": "databasequery",
                "id": "190"
              },
              {
                "type": "databasequery",
                "id": "191"
              },
              {
                "type": "databasequery",
                "id": "192"
              },
              {
                "type": "databasequery",
                "id": "193"
              },
              {
                "type": "databasequery",
                "id": "194"
              },
              {
                "type": "databasequery",
                "id": "195"
              },
              {
                "type": "databasequery",
                "id": "196"
              },
              {
                "type": "databasequery",
                "id": "197"
              },
              {
                "type": "databasequery",
                "id": "198"
              },
              {
                "type": "databasequery",
                "id": "199"
              },
              {
                "type": "databasequery",
                "id": "200"
              },
              {
                "type": "databasequery",
                "id": "201"
              },
              {
                "type": "databasequery",
                "id": "202"
              },
              {
                "type": "databasequery",
                "id": "203"
              },
              {
                "type": "databasequery",
                "id": "204"
              },
              {
                "type": "databasequery",
                "id": "205"
              },
              {
                "type": "databasequery",
                "id": "206"
              },
              {
                "type": "databasequery",
                "id": "207"
              },
              {
                "type": "databasequery",
                "id": "208"
              },
              {
                "type": "databasequery",
                "id": "209"
              },
              {
                "type": "databasequery",
                "id": "210"
              },
              {
                "type": "databasequery",
                "id": "211"
              },
              {
                "type": "databasequery",
                "id": "212"
              },
              {
                "type": "databasequery",
                "id": "213"
              },
              {
                "type": "databasequery",
                "id": "214"
              },
              {
                "type": "databasequery",
                "id": "215"
              },
              {
                "type": "databasequery",
                "id": "216"
              },
              {
                "type": "databasequery",
                "id": "217"
              },
              {
                "type": "databasequery",
                "id": "218"
              },
              {
                "type": "databasequery",
                "id": "219"
              },
              {
                "type": "databasequery",
                "id": "220"
              },
              {
                "type": "databasequery",
                "id": "221"
              },
              {
                "type": "databasequery",
                "id": "222"
              },
              {
                "type": "databasequery",
                "id": "223"
              },
              {
                "type": "databasequery",
                "id": "224"
              },
              {
                "type": "databasequery",
                "id": "225"
              },
              {
                "type": "databasequery",
                "id": "226"
              },
              {
                "type": "databasequery",
                "id": "227"
              },
              {
                "type": "databasequery",
                "id": "228"
              },
              {
                "type": "databasequery",
                "id": "229"
              },
              {
                "type": "databasequery",
                "id": "230"
              },
              {
                "type": "databasequery",
                "id": "231"
              },
              {
                "type": "databasequery",
                "id": "232"
              },
              {
                "type": "databasequery",
                "id": "233"
              },
              {
                "type": "databasequery",
                "id": "234"
              },
              {
                "type": "databasequery",
                "id": "235"
              },
              {
                "type": "databasequery",
                "id": "236"
              },
              {
                "type": "databasequery",
                "id": "237"
              },
              {
                "type": "databasequery",
                "id": "238"
              },
              {
                "type": "databasequery",
                "id": "239"
              },
              {
                "type": "databasequery",
                "id": "240"
              },
              {
                "type": "databasequery",
                "id": "241"
              },
              {
                "type": "databasequery",
                "id": "242"
              },
              {
                "type": "databasequery",
                "id": "243"
              },
              {
                "type": "databasequery",
                "id": "244"
              },
              {
                "type": "databasequery",
                "id": "245"
              },
              {
                "type": "databasequery",
                "id": "246"
              },
              {
                "type": "databasequery",
                "id": "247"
              },
              {
                "type": "databasequery",
                "id": "248"
              },
              {
                "type": "databasequery",
                "id": "249"
              },
              {
                "type": "databasequery",
                "id": "250"
              },
              {
                "type": "databasequery",
                "id": "251"
              },
              {
                "type": "databasequery",
                "id": "252"
              },
              {
                "type": "databasequery",
                "id": "253"
              },
              {
                "type": "databasequery",
                "id": "254"
              },
              {
                "type": "databasequery",
                "id": "255"
              },
              {
                "type": "databasequery",
                "id": "256"
              },
              {
                "type": "databasequery",
                "id": "257"
              },
              {
                "type": "databasequery",
                "id": "258"
              },
              {
                "type": "databasequery",
                "id": "259"
              },
              {
                "type": "databasequery",
                "id": "260"
              },
              {
                "type": "databasequery",
                "id": "261"
              },
              {
                "type": "databasequery",
                "id": "262"
              },
              {
                "type": "databasequery",
                "id": "263"
              },
              {
                "type": "databasequery",
                "id": "264"
              },
              {
                "type": "databasequery",
                "id": "265"
              },
              {
                "type": "databasequery",
                "id": "266"
              },
              {
                "type": "databasequery",
                "id": "267"
              },
              {
                "type": "databasequery",
                "id": "268"
              },
              {
                "type": "databasequery",
                "id": "269"
              },
              {
                "type": "databasequery",
                "id": "270"
              },
              {
                "type": "databasequery",
                "id": "271"
              },
              {
                "type": "databasequery",
                "id": "272"
              },
              {
                "type": "databasequery",
                "id": "273"
              },
              {
                "type": "databasequery",
                "id": "274"
              },
              {
                "type": "databasequery",
                "id": "275"
              },
              {
                "type": "databasequery",
                "id": "276"
              },
              {
                "type": "databasequery",
                "id": "277"
              },
              {
                "type": "databasequery",
                "id": "278"
              },
              {
                "type": "databasequery",
                "id": "279"
              },
              {
                "type": "databasequery",
                "id": "280"
              },
              {
                "type": "databasequery",
                "id": "281"
              },
              {
                "type": "databasequery",
                "id": "282"
              },
              {
                "type": "databasequery",
                "id": "283"
              },
              {
                "type": "databasequery",
                "id": "284"
              },
              {
                "type": "databasequery",
                "id": "285"
              },
              {
                "type": "databasequery",
                "id": "286"
              },
              {
                "type": "databasequery",
                "id": "287"
              },
              {
                "type": "databasequery",
                "id": "288"
              },
              {
                "type": "databasequery",
                "id": "289"
              },
              {
                "type": "databasequery",
                "id": "290"
              },
              {
                "type": "databasequery",
                "id": "291"
              },
              {
                "type": "databasequery",
                "id": "292"
              },
              {
                "type": "databasequery",
                "id": "293"
              },
              {
                "type": "databasequery",
                "id": "294"
              },
              {
                "type": "databasequery",
                "id": "295"
              },
              {
                "type": "databasequery",
                "id": "296"
              },
              {
                "type": "databasequery",
                "id": "297"
              },
              {
                "type": "databasequery",
                "id": "298"
              },
              {
                "type": "databasequery",
                "id": "299"
              },
              {
                "type": "databasequery",
                "id": "300"
              },
              {
                "type": "databasequery",
                "id": "301"
              },
              {
                "type": "databasequery",
                "id": "302"
              },
              {
                "type": "databasequery",
                "id": "303"
              },
              {
                "type": "databasequery",
                "id": "304"
              },
              {
                "type": "databasequery",
                "id": "305"
              },
              {
                "type": "databasequery",
                "id": "306"
              },
              {
                "type": "databasequery",
                "id": "307"
              },
              {
                "type": "databasequery",
                "id": "308"
              },
              {
                "type": "databasequery",
                "id": "309"
              },
              {
                "type": "databasequery",
                "id": "310"
              },
              {
                "type": "databasequery",
                "id": "311"
              },
              {
                "type": "databasequery",
                "id": "312"
              },
              {
                "type": "databasequery",
                "id": "313"
              },
              {
                "type": "databasequery",
                "id": "314"
              },
              {
                "type": "databasequery",
                "id": "315"
              },
              {
                "type": "databasequery",
                "id": "316"
              },
              {
                "type": "databasequery",
                "id": "317"
              },
              {
                "type": "databasequery",
                "id": "318"
              },
              {
                "type": "databasequery",
                "id": "319"
              },
              {
                "type": "databasequery",
                "id": "320"
              },
              {
                "type": "databasequery",
                "id": "321"
              },
              {
                "type": "databasequery",
                "id": "322"
              },
              {
                "type": "databasequery",
                "id": "323"
              },
              {
                "type": "databasequery",
                "id": "324"
              },
              {
                "type": "databasequery",
                "id": "325"
              },
              {
                "type": "databasequery",
                "id": "326"
              },
              {
                "type": "databasequery",
                "id": "327"
              },
              {
                "type": "databasequery",
                "id": "328"
              },
              {
                "type": "databasequery",
                "id": "329"
              },
              {
                "type": "databasequery",
                "id": "330"
              },
              {
                "type": "databasequery",
                "id": "331"
              },
              {
                "type": "databasequery",
                "id": "332"
              },
              {
                "type": "databasequery",
                "id": "333"
              },
              {
                "type": "databasequery",
                "id": "334"
              },
              {
                "type": "databasequery",
                "id": "335"
              },
              {
                "type": "databasequery",
                "id": "336"
              },
              {
                "type": "databasequery",
                "id": "337"
              },
              {
                "type": "databasequery",
                "id": "338"
              },
              {
                "type": "databasequery",
                "id": "339"
              }
            ]
          },
          "applicationCommunications": {
            "data": []
          },
          "aggregatedClazzCommunications": {
            "data": []
          },
          "traces": {
            "data": []
          }
        }
      },
      {
        "type": "databasequery",
        "id": "250",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593103400,
          "statementType": "Statement",
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 973
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "336",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593865300,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 61
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "222",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593066500,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 542
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "tracestep",
        "id": "175",
        "attributes": {
          "extensionAttributes": {},
          "tracePosition": 3,
          "requests": 8200,
          "currentTraceDuration": 5551,
          "averageResponseTime": 375
        },
        "relationships": {
          "parentTrace": {
            "data": {
              "type": "trace",
              "id": "170"
            }
          },
          "clazzCommunication": {
            "data": {
              "type": "clazzcommunication",
              "id": "174"
            }
          }
        }
      },
      {
        "type": "clazz",
        "id": "83",
        "attributes": {
          "extensionAttributes": {},
          "name": "ItemHelper",
          "fullQualifiedName": "org.webshop.helpers.ItemHelper",
          "instanceCount": 35
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "component",
              "id": "79"
            }
          },
          "clazzCommunications": {
            "data": []
          }
        }
      },
      {
        "type": "application",
        "id": "26",
        "attributes": {
          "extensionAttributes": {},
          "name": "Webinterface",
          "programmingLanguage": "JAVA",
          "lastUsage": 1547561492149
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "node",
              "id": "25"
            }
          },
          "components": {
            "data": []
          },
          "databaseQueries": {
            "data": []
          },
          "applicationCommunications": {
            "data": [
              {
                "type": "applicationcommunication",
                "id": "349"
              },
              {
                "type": "applicationcommunication",
                "id": "349"
              }
            ]
          },
          "aggregatedClazzCommunications": {
            "data": []
          },
          "traces": {
            "data": []
          }
        }
      },
      {
        "type": "clazz",
        "id": "97",
        "attributes": {
          "extensionAttributes": {},
          "name": "APIHandler",
          "fullQualifiedName": "org.webshop.kernel.api.APIHandler",
          "instanceCount": 25
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "component",
              "id": "96"
            }
          },
          "clazzCommunications": {
            "data": [
              {
                "type": "clazzcommunication",
                "id": "146"
              }
            ]
          }
        }
      },
      {
        "type": "databasequery",
        "id": "324",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593851200,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 95
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "323",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593850000,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 721
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "applicationcommunication",
        "id": "348",
        "attributes": {
          "extensionAttributes": {},
          "requests": 100,
          "averageResponseTime": 0
        },
        "relationships": {
          "sourceApplication": {
            "data": {
              "type": "application",
              "id": "57"
            }
          },
          "targetApplication": {
            "data": {
              "type": "application",
              "id": "26"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "212",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593053500,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "68",
          "responseTime": 199
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "nodegroup",
        "id": "13",
        "attributes": {
          "extensionAttributes": {},
          "name": "10.0.1.2"
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "system",
              "id": "9"
            }
          }
        }
      },
      {
        "type": "clazzcommunication",
        "id": "174",
        "attributes": {
          "extensionAttributes": {},
          "operationName": "getMethod28()",
          "totalRequests": 8200,
          "averageResponseTime": 375
        },
        "relationships": {
          "sourceClazz": {
            "data": {
              "type": "clazz",
              "id": "109"
            }
          },
          "targetClazz": {
            "data": {
              "type": "clazz",
              "id": "80"
            }
          },
          "tracesteps": {
            "data": [
              {
                "type": "tracestep",
                "id": "175"
              }
            ]
          }
        }
      },
      {
        "type": "databasequery",
        "id": "210",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593050400,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 936
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "system",
        "id": "23",
        "attributes": {
          "extensionAttributes": {},
          "name": "OceanRep"
        },
        "relationships": {
          "nodegroups": {
            "data": [
              {
                "type": "nodegroup",
                "id": "24"
              },
              {
                "type": "nodegroup",
                "id": "28"
              }
            ]
          },
          "parent": {
            "data": {
              "type": "landscape",
              "id": "3"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "260",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593124400,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "32",
          "responseTime": 528
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "application",
        "id": "66",
        "attributes": {
          "extensionAttributes": {},
          "name": "Workflow",
          "programmingLanguage": "JAVA",
          "lastUsage": 1547561492149
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "node",
              "id": "65"
            }
          },
          "components": {
            "data": []
          },
          "databaseQueries": {
            "data": []
          },
          "applicationCommunications": {
            "data": [
              {
                "type": "applicationcommunication",
                "id": "362"
              },
              {
                "type": "applicationcommunication",
                "id": "366"
              },
              {
                "type": "applicationcommunication",
                "id": "362"
              },
              {
                "type": "applicationcommunication",
                "id": "366"
              }
            ]
          },
          "aggregatedClazzCommunications": {
            "data": []
          },
          "traces": {
            "data": []
          }
        }
      },
      {
        "type": "databasequery",
        "id": "313",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593832100,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 284
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "system",
        "id": "16",
        "attributes": {
          "extensionAttributes": {},
          "name": "OCN Database"
        },
        "relationships": {
          "nodegroups": {
            "data": [
              {
                "type": "nodegroup",
                "id": "17"
              },
              {
                "type": "nodegroup",
                "id": "20"
              }
            ]
          },
          "parent": {
            "data": {
              "type": "landscape",
              "id": "3"
            }
          }
        }
      },
      {
        "type": "component",
        "id": "187",
        "attributes": {
          "extensionAttributes": {},
          "name": "database",
          "fullQualifiedName": "org.database"
        },
        "relationships": {
          "children": {
            "data": [
              {
                "type": "component",
                "id": "188"
              }
            ]
          },
          "clazzes": {
            "data": []
          },
          "parentComponent": {
            "data": {
              "type": "component",
              "id": "186"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "235",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593083500,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 806
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "clazzcommunication",
        "id": "140",
        "attributes": {
          "extensionAttributes": {},
          "operationName": "getMethod2()",
          "totalRequests": 1000,
          "averageResponseTime": 842
        },
        "relationships": {
          "sourceClazz": {
            "data": {
              "type": "clazz",
              "id": "109"
            }
          },
          "targetClazz": {
            "data": {
              "type": "clazz",
              "id": "125"
            }
          },
          "tracesteps": {
            "data": [
              {
                "type": "tracestep",
                "id": "141"
              }
            ]
          }
        }
      },
      {
        "type": "databasequery",
        "id": "311",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593829800,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 286
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "233",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593081000,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 913
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "200",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593037300,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "57",
          "responseTime": 478
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "218",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593061400,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "80",
          "responseTime": 605
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "clazzcommunication",
        "id": "167",
        "attributes": {
          "extensionAttributes": {},
          "operationName": "getMethod22()",
          "totalRequests": 2100,
          "averageResponseTime": 234
        },
        "relationships": {
          "sourceClazz": {
            "data": {
              "type": "clazz",
              "id": "80"
            }
          },
          "targetClazz": {
            "data": {
              "type": "clazz",
              "id": "109"
            }
          },
          "tracesteps": {
            "data": [
              {
                "type": "tracestep",
                "id": "168"
              }
            ]
          }
        }
      },
      {
        "type": "applicationcommunication",
        "id": "351",
        "attributes": {
          "extensionAttributes": {},
          "requests": 100,
          "averageResponseTime": 0
        },
        "relationships": {
          "sourceApplication": {
            "data": {
              "type": "application",
              "id": "57"
            }
          },
          "targetApplication": {
            "data": {
              "type": "application",
              "id": "34"
            }
          }
        }
      },
      {
        "type": "clazz",
        "id": "81",
        "attributes": {
          "extensionAttributes": {},
          "name": "ProductHelper",
          "fullQualifiedName": "org.webshop.helpers.ProductHelper",
          "instanceCount": 40
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "component",
              "id": "79"
            }
          },
          "clazzCommunications": {
            "data": []
          }
        }
      },
      {
        "type": "databasequery",
        "id": "272",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593150100,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "14",
          "responseTime": 800
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "node",
        "id": "59",
        "attributes": {
          "extensionAttributes": {},
          "ipAddress": "10.0.0.5",
          "cpuUtilization": 0.76,
          "freeRAM": 2147483648,
          "usedRAM": 3221225472
        },
        "relationships": {
          "applications": {
            "data": [
              {
                "type": "application",
                "id": "60"
              },
              {
                "type": "application",
                "id": "61"
              }
            ]
          },
          "parent": {
            "data": {
              "type": "nodegroup",
              "id": "55"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "208",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593047900,
          "statementType": "Statement",
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 669
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "tracestep",
        "id": "132",
        "attributes": {
          "extensionAttributes": {},
          "tracePosition": 2,
          "requests": 800,
          "currentTraceDuration": 2538,
          "averageResponseTime": 581
        },
        "relationships": {
          "parentTrace": {
            "data": {
              "type": "trace",
              "id": "128"
            }
          },
          "clazzCommunication": {
            "data": {
              "type": "clazzcommunication",
              "id": "131"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "206",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593045500,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "27",
          "responseTime": 851
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "clazz",
        "id": "87",
        "attributes": {
          "extensionAttributes": {},
          "name": "BaseSqlMapDao",
          "fullQualifiedName": "org.webshop.tooling.BaseSqlMapDao",
          "instanceCount": 20
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "component",
              "id": "85"
            }
          },
          "clazzCommunications": {
            "data": []
          }
        }
      },
      {
        "type": "databasequery",
        "id": "257",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593120000,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 716
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "tracestep",
        "id": "129",
        "attributes": {
          "extensionAttributes": {},
          "tracePosition": 1,
          "requests": 40,
          "currentTraceDuration": 1800,
          "averageResponseTime": 813
        },
        "relationships": {
          "parentTrace": {
            "data": {
              "type": "trace",
              "id": "128"
            }
          },
          "clazzCommunication": {
            "data": {
              "type": "clazzcommunication",
              "id": "127"
            }
          }
        }
      },
      {
        "type": "applicationcommunication",
        "id": "362",
        "attributes": {
          "extensionAttributes": {},
          "requests": 200,
          "averageResponseTime": 0
        },
        "relationships": {
          "sourceApplication": {
            "data": {
              "type": "application",
              "id": "66"
            }
          },
          "targetApplication": {
            "data": {
              "type": "application",
              "id": "67"
            }
          }
        }
      },
      {
        "type": "aggregatedclazzcommunication",
        "id": "142",
        "attributes": {
          "extensionAttributes": {},
          "totalRequests": 14000,
          "averageResponseTime": 512.75
        },
        "relationships": {
          "sourceClazz": {
            "data": {
              "type": "clazz",
              "id": "109"
            }
          },
          "targetClazz": {
            "data": {
              "type": "clazz",
              "id": "125"
            }
          },
          "clazzCommunications": {
            "data": [
              {
                "type": "clazzcommunication",
                "id": "140"
              },
              {
                "type": "clazzcommunication",
                "id": "155"
              },
              {
                "type": "clazzcommunication",
                "id": "169"
              }
            ]
          }
        }
      },
      {
        "type": "component",
        "id": "85",
        "attributes": {
          "extensionAttributes": {},
          "name": "tooling",
          "fullQualifiedName": "org.webshop.tooling"
        },
        "relationships": {
          "children": {
            "data": []
          },
          "clazzes": {
            "data": [
              {
                "type": "clazz",
                "id": "86"
              },
              {
                "type": "clazz",
                "id": "87"
              },
              {
                "type": "clazz",
                "id": "88"
              },
              {
                "type": "clazz",
                "id": "89"
              },
              {
                "type": "clazz",
                "id": "90"
              },
              {
                "type": "clazz",
                "id": "91"
              }
            ]
          },
          "parentComponent": {
            "data": {
              "type": "component",
              "id": "72"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "301",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593816700,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 654
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "nodegroup",
        "id": "35",
        "attributes": {
          "extensionAttributes": {},
          "name": "10.0.4.2"
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "system",
              "id": "31"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "319",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593845000,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 702
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "259",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593122600,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 974
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "clazz",
        "id": "90",
        "attributes": {
          "extensionAttributes": {},
          "name": "ProductSqlMapDao",
          "fullQualifiedName": "org.webshop.tooling.ProductSqlMapDao",
          "instanceCount": 20
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "component",
              "id": "85"
            }
          },
          "clazzCommunications": {
            "data": []
          }
        }
      },
      {
        "type": "databasequery",
        "id": "309",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593827800,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "46",
          "responseTime": 648
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "clazzcommunication",
        "id": "169",
        "attributes": {
          "extensionAttributes": {},
          "operationName": "getMethod46()",
          "totalRequests": 2500,
          "averageResponseTime": 361
        },
        "relationships": {
          "sourceClazz": {
            "data": {
              "type": "clazz",
              "id": "109"
            }
          },
          "targetClazz": {
            "data": {
              "type": "clazz",
              "id": "125"
            }
          },
          "tracesteps": {
            "data": [
              {
                "type": "tracestep",
                "id": "171"
              }
            ]
          }
        }
      },
      {
        "type": "clazzcommunication",
        "id": "172",
        "attributes": {
          "extensionAttributes": {},
          "operationName": "getMethod8()",
          "totalRequests": 900,
          "averageResponseTime": 777
        },
        "relationships": {
          "sourceClazz": {
            "data": {
              "type": "clazz",
              "id": "125"
            }
          },
          "targetClazz": {
            "data": {
              "type": "clazz",
              "id": "109"
            }
          },
          "tracesteps": {
            "data": [
              {
                "type": "tracestep",
                "id": "173"
              }
            ]
          }
        }
      },
      {
        "type": "databasequery",
        "id": "296",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593806600,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "9",
          "responseTime": 299
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "component",
        "id": "116",
        "attributes": {
          "extensionAttributes": {},
          "name": "persistence",
          "fullQualifiedName": "org.webshop.kernel.impl.persistence"
        },
        "relationships": {
          "children": {
            "data": []
          },
          "clazzes": {
            "data": [
              {
                "type": "clazz",
                "id": "117"
              }
            ]
          },
          "parentComponent": {
            "data": {
              "type": "component",
              "id": "108"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "307",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593825000,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 836
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "aggregatedclazzcommunication",
        "id": "136",
        "attributes": {
          "extensionAttributes": {},
          "totalRequests": 31520,
          "averageResponseTime": 688.6875
        },
        "relationships": {
          "sourceClazz": {
            "data": {
              "type": "clazz",
              "id": "109"
            }
          },
          "targetClazz": {
            "data": {
              "type": "clazz",
              "id": "80"
            }
          },
          "clazzCommunications": {
            "data": [
              {
                "type": "clazzcommunication",
                "id": "134"
              },
              {
                "type": "clazzcommunication",
                "id": "160"
              },
              {
                "type": "clazzcommunication",
                "id": "165"
              },
              {
                "type": "clazzcommunication",
                "id": "174"
              },
              {
                "type": "clazzcommunication",
                "id": "178"
              }
            ]
          }
        }
      },
      {
        "type": "databasequery",
        "id": "247",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593099300,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 687
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "245",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593096800,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 67
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "applicationcommunication",
        "id": "367",
        "attributes": {
          "extensionAttributes": {},
          "requests": 600,
          "averageResponseTime": 0
        },
        "relationships": {
          "sourceApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          },
          "targetApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "application",
        "id": "57",
        "attributes": {
          "extensionAttributes": {},
          "name": "Workflow",
          "programmingLanguage": "JAVA",
          "lastUsage": 1547561492149
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "node",
              "id": "56"
            }
          },
          "components": {
            "data": []
          },
          "databaseQueries": {
            "data": []
          },
          "applicationCommunications": {
            "data": [
              {
                "type": "applicationcommunication",
                "id": "347"
              },
              {
                "type": "applicationcommunication",
                "id": "348"
              },
              {
                "type": "applicationcommunication",
                "id": "351"
              },
              {
                "type": "applicationcommunication",
                "id": "359"
              },
              {
                "type": "applicationcommunication",
                "id": "363"
              },
              {
                "type": "applicationcommunication",
                "id": "347"
              },
              {
                "type": "applicationcommunication",
                "id": "348"
              },
              {
                "type": "applicationcommunication",
                "id": "351"
              },
              {
                "type": "applicationcommunication",
                "id": "359"
              },
              {
                "type": "applicationcommunication",
                "id": "363"
              }
            ]
          },
          "aggregatedClazzCommunications": {
            "data": []
          },
          "traces": {
            "data": []
          }
        }
      },
      {
        "type": "system",
        "id": "38",
        "attributes": {
          "extensionAttributes": {},
          "name": "WDC-Mare"
        },
        "relationships": {
          "nodegroups": {
            "data": [
              {
                "type": "nodegroup",
                "id": "39"
              },
              {
                "type": "nodegroup",
                "id": "42"
              }
            ]
          },
          "parent": {
            "data": {
              "type": "landscape",
              "id": "3"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "267",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593143700,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "50",
          "responseTime": 418
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "clazz",
        "id": "125",
        "attributes": {
          "extensionAttributes": {},
          "name": "AccountSqlMapDao",
          "fullQualifiedName": "org.webshop.kernel.logging.AccountSqlMapDao",
          "instanceCount": 25
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "component",
              "id": "124"
            }
          },
          "clazzCommunications": {
            "data": [
              {
                "type": "clazzcommunication",
                "id": "157"
              },
              {
                "type": "clazzcommunication",
                "id": "172"
              }
            ]
          }
        }
      },
      {
        "type": "node",
        "id": "7",
        "attributes": {
          "extensionAttributes": {},
          "ipAddress": "10.0.99.1",
          "cpuUtilization": 0.31,
          "freeRAM": 4294967296,
          "usedRAM": 4294967296
        },
        "relationships": {
          "applications": {
            "data": [
              {
                "type": "application",
                "id": "8"
              }
            ]
          },
          "parent": {
            "data": {
              "type": "nodegroup",
              "id": "6"
            }
          }
        }
      },
      {
        "type": "application",
        "id": "37",
        "attributes": {
          "extensionAttributes": {},
          "name": "Artifacts",
          "programmingLanguage": "JAVA",
          "lastUsage": 1547561492149
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "node",
              "id": "36"
            }
          },
          "components": {
            "data": []
          },
          "databaseQueries": {
            "data": []
          },
          "applicationCommunications": {
            "data": []
          },
          "aggregatedClazzCommunications": {
            "data": []
          },
          "traces": {
            "data": []
          }
        }
      },
      {
        "type": "application",
        "id": "44",
        "attributes": {
          "extensionAttributes": {},
          "name": "Jira",
          "programmingLanguage": "JAVA",
          "lastUsage": 1547561492149
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "node",
              "id": "43"
            }
          },
          "components": {
            "data": []
          },
          "databaseQueries": {
            "data": []
          },
          "applicationCommunications": {
            "data": [
              {
                "type": "applicationcommunication",
                "id": "342"
              },
              {
                "type": "applicationcommunication",
                "id": "342"
              }
            ]
          },
          "aggregatedClazzCommunications": {
            "data": []
          },
          "traces": {
            "data": []
          }
        }
      },
      {
        "type": "clazz",
        "id": "111",
        "attributes": {
          "extensionAttributes": {},
          "name": "AnnotationHandler",
          "fullQualifiedName": "org.webshop.kernel.impl.annotations.AnnotationHandler",
          "instanceCount": 35
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "component",
              "id": "110"
            }
          },
          "clazzCommunications": {
            "data": []
          }
        }
      },
      {
        "type": "databasequery",
        "id": "310",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593828600,
          "statementType": "Statement",
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 419
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "clazz",
        "id": "80",
        "attributes": {
          "extensionAttributes": {},
          "name": "BaseHelper",
          "fullQualifiedName": "org.webshop.helpers.BaseHelper",
          "instanceCount": 30
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "component",
              "id": "79"
            }
          },
          "clazzCommunications": {
            "data": [
              {
                "type": "clazzcommunication",
                "id": "162"
              },
              {
                "type": "clazzcommunication",
                "id": "167"
              },
              {
                "type": "clazzcommunication",
                "id": "176"
              },
              {
                "type": "clazzcommunication",
                "id": "180"
              }
            ]
          }
        }
      },
      {
        "type": "databasequery",
        "id": "286",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593178300,
          "statementType": "Statement",
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 390
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "232",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593079800,
          "statementType": "Statement",
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 788
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "clazz",
        "id": "77",
        "attributes": {
          "extensionAttributes": {},
          "name": "ItemLabeler",
          "fullQualifiedName": "org.webshop.labeling.ItemLabeler",
          "instanceCount": 55
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "component",
              "id": "73"
            }
          },
          "clazzCommunications": {
            "data": []
          }
        }
      },
      {
        "type": "application",
        "id": "64",
        "attributes": {
          "extensionAttributes": {},
          "name": "Provenance",
          "programmingLanguage": "JAVA",
          "lastUsage": 1547561492149
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "node",
              "id": "62"
            }
          },
          "components": {
            "data": []
          },
          "databaseQueries": {
            "data": []
          },
          "applicationCommunications": {
            "data": [
              {
                "type": "applicationcommunication",
                "id": "370"
              },
              {
                "type": "applicationcommunication",
                "id": "370"
              }
            ]
          },
          "aggregatedClazzCommunications": {
            "data": []
          },
          "traces": {
            "data": []
          }
        }
      },
      {
        "type": "databasequery",
        "id": "236",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593085000,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "38",
          "responseTime": 565
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "294",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593802400,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 369
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "nodegroup",
        "id": "17",
        "attributes": {
          "extensionAttributes": {},
          "name": "10.0.2.1"
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "system",
              "id": "16"
            }
          }
        }
      },
      {
        "type": "application",
        "id": "8",
        "attributes": {
          "extensionAttributes": {},
          "name": "Requests",
          "programmingLanguage": "JAVA",
          "lastUsage": 1547561492145
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "node",
              "id": "7"
            }
          },
          "components": {
            "data": []
          },
          "databaseQueries": {
            "data": []
          },
          "applicationCommunications": {
            "data": [
              {
                "type": "applicationcommunication",
                "id": "340"
              },
              {
                "type": "applicationcommunication",
                "id": "340"
              }
            ]
          },
          "aggregatedClazzCommunications": {
            "data": []
          },
          "traces": {
            "data": []
          }
        }
      },
      {
        "type": "clazz",
        "id": "76",
        "attributes": {
          "extensionAttributes": {},
          "name": "CategoryLabeler",
          "fullQualifiedName": "org.webshop.labeling.CategoryLabeler",
          "instanceCount": 10
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "component",
              "id": "73"
            }
          },
          "clazzCommunications": {
            "data": []
          }
        }
      },
      {
        "type": "databasequery",
        "id": "201",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593038900,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "28",
          "responseTime": 424
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "nodegroup",
        "id": "20",
        "attributes": {
          "extensionAttributes": {},
          "name": "10.0.2.2"
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "system",
              "id": "16"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "290",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593773600,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "40",
          "responseTime": 937
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "clazz",
        "id": "126",
        "attributes": {
          "extensionAttributes": {},
          "name": "AccountSqlMapDao2",
          "fullQualifiedName": "org.webshop.kernel.logging.AccountSqlMapDao2",
          "instanceCount": 5
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "component",
              "id": "124"
            }
          },
          "clazzCommunications": {
            "data": []
          }
        }
      },
      {
        "type": "databasequery",
        "id": "314",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593833500,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "39",
          "responseTime": 757
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "338",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593868000,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "93",
          "responseTime": 981
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "clazz",
        "id": "107",
        "attributes": {
          "extensionAttributes": {},
          "name": "GuardHandler",
          "fullQualifiedName": "org.webshop.kernel.guard.GuardHandler",
          "instanceCount": 25
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "component",
              "id": "105"
            }
          },
          "clazzCommunications": {
            "data": []
          }
        }
      },
      {
        "type": "databasequery",
        "id": "221",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593065200,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 358
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "component",
        "id": "108",
        "attributes": {
          "extensionAttributes": {},
          "name": "impl",
          "fullQualifiedName": "org.webshop.kernel.impl"
        },
        "relationships": {
          "children": {
            "data": [
              {
                "type": "component",
                "id": "110"
              },
              {
                "type": "component",
                "id": "112"
              },
              {
                "type": "component",
                "id": "114"
              },
              {
                "type": "component",
                "id": "116"
              }
            ]
          },
          "clazzes": {
            "data": [
              {
                "type": "clazz",
                "id": "109"
              }
            ]
          },
          "parentComponent": {
            "data": {
              "type": "component",
              "id": "95"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "334",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593862900,
          "statementType": "Statement",
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 462
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "node",
        "id": "62",
        "attributes": {
          "extensionAttributes": {},
          "ipAddress": "10.0.0.6",
          "cpuUtilization": 0.3,
          "freeRAM": 2147483648,
          "usedRAM": 3221225472
        },
        "relationships": {
          "applications": {
            "data": [
              {
                "type": "application",
                "id": "63"
              },
              {
                "type": "application",
                "id": "64"
              }
            ]
          },
          "parent": {
            "data": {
              "type": "nodegroup",
              "id": "55"
            }
          }
        }
      },
      {
        "type": "applicationcommunication",
        "id": "371",
        "attributes": {
          "extensionAttributes": {},
          "requests": 100,
          "averageResponseTime": 0
        },
        "relationships": {
          "sourceApplication": {
            "data": {
              "type": "application",
              "id": "67"
            }
          },
          "targetApplication": {
            "data": {
              "type": "application",
              "id": "70"
            }
          }
        }
      },
      {
        "type": "tracestep",
        "id": "179",
        "attributes": {
          "extensionAttributes": {},
          "tracePosition": 5,
          "requests": 1200,
          "currentTraceDuration": 3435,
          "averageResponseTime": 914
        },
        "relationships": {
          "parentTrace": {
            "data": {
              "type": "trace",
              "id": "170"
            }
          },
          "clazzCommunication": {
            "data": {
              "type": "clazzcommunication",
              "id": "178"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "321",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593848000,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "35",
          "responseTime": 930
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "229",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593075700,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 847
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "applicationcommunication",
        "id": "363",
        "attributes": {
          "extensionAttributes": {},
          "requests": 100,
          "averageResponseTime": 0
        },
        "relationships": {
          "sourceApplication": {
            "data": {
              "type": "application",
              "id": "57"
            }
          },
          "targetApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "325",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593852300,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 530
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "tracestep",
        "id": "181",
        "attributes": {
          "extensionAttributes": {},
          "tracePosition": 6,
          "requests": 390,
          "currentTraceDuration": 4341,
          "averageResponseTime": 173
        },
        "relationships": {
          "parentTrace": {
            "data": {
              "type": "trace",
              "id": "170"
            }
          },
          "clazzCommunication": {
            "data": {
              "type": "clazzcommunication",
              "id": "180"
            }
          }
        }
      },
      {
        "type": "clazz",
        "id": "75",
        "attributes": {
          "extensionAttributes": {},
          "name": "ProcuctLabeler",
          "fullQualifiedName": "org.webshop.labeling.ProcuctLabeler",
          "instanceCount": 30
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "component",
              "id": "73"
            }
          },
          "clazzCommunications": {
            "data": []
          }
        }
      },
      {
        "type": "databasequery",
        "id": "225",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593071000,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "31",
          "responseTime": 804
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "nodegroup",
        "id": "68",
        "attributes": {
          "extensionAttributes": {},
          "name": "10.0.0.9"
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "system",
              "id": "46"
            }
          }
        }
      },
      {
        "type": "clazzcommunication",
        "id": "165",
        "attributes": {
          "extensionAttributes": {},
          "operationName": "getMethod20()",
          "totalRequests": 2100,
          "averageResponseTime": 643
        },
        "relationships": {
          "sourceClazz": {
            "data": {
              "type": "clazz",
              "id": "109"
            }
          },
          "targetClazz": {
            "data": {
              "type": "clazz",
              "id": "80"
            }
          },
          "tracesteps": {
            "data": [
              {
                "type": "tracestep",
                "id": "166"
              }
            ]
          }
        }
      },
      {
        "type": "clazz",
        "id": "94",
        "attributes": {
          "extensionAttributes": {},
          "name": "CartBean",
          "fullQualifiedName": "org.webshop.unsafe.CartBean",
          "instanceCount": 40
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "component",
              "id": "92"
            }
          },
          "clazzCommunications": {
            "data": []
          }
        }
      },
      {
        "type": "tracestep",
        "id": "163",
        "attributes": {
          "extensionAttributes": {},
          "tracePosition": 13,
          "requests": 4200,
          "currentTraceDuration": 9590,
          "averageResponseTime": 553
        },
        "relationships": {
          "parentTrace": {
            "data": {
              "type": "trace",
              "id": "128"
            }
          },
          "clazzCommunication": {
            "data": {
              "type": "clazzcommunication",
              "id": "162"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "262",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593126900,
          "statementType": "Statement",
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 426
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "node",
        "id": "56",
        "attributes": {
          "extensionAttributes": {},
          "ipAddress": "10.0.0.4",
          "cpuUtilization": 0.42,
          "freeRAM": 4294967296,
          "usedRAM": 3221225472
        },
        "relationships": {
          "applications": {
            "data": [
              {
                "type": "application",
                "id": "57"
              },
              {
                "type": "application",
                "id": "58"
              }
            ]
          },
          "parent": {
            "data": {
              "type": "nodegroup",
              "id": "55"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "263",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593137500,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 243
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "266",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593142100,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "17",
          "responseTime": 378
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "application",
        "id": "60",
        "attributes": {
          "extensionAttributes": {},
          "name": "Workflow",
          "programmingLanguage": "JAVA",
          "lastUsage": 1547561492149
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "node",
              "id": "59"
            }
          },
          "components": {
            "data": []
          },
          "databaseQueries": {
            "data": []
          },
          "applicationCommunications": {
            "data": [
              {
                "type": "applicationcommunication",
                "id": "360"
              },
              {
                "type": "applicationcommunication",
                "id": "364"
              },
              {
                "type": "applicationcommunication",
                "id": "360"
              },
              {
                "type": "applicationcommunication",
                "id": "364"
              }
            ]
          },
          "aggregatedClazzCommunications": {
            "data": []
          },
          "traces": {
            "data": []
          }
        }
      },
      {
        "type": "applicationcommunication",
        "id": "360",
        "attributes": {
          "extensionAttributes": {},
          "requests": 300,
          "averageResponseTime": 0
        },
        "relationships": {
          "sourceApplication": {
            "data": {
              "type": "application",
              "id": "60"
            }
          },
          "targetApplication": {
            "data": {
              "type": "application",
              "id": "61"
            }
          }
        }
      },
      {
        "type": "nodegroup",
        "id": "10",
        "attributes": {
          "extensionAttributes": {},
          "name": "10.0.1.1"
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "system",
              "id": "9"
            }
          }
        }
      },
      {
        "type": "applicationcommunication",
        "id": "354",
        "attributes": {
          "extensionAttributes": {},
          "requests": 200,
          "averageResponseTime": 0
        },
        "relationships": {
          "sourceApplication": {
            "data": {
              "type": "application",
              "id": "51"
            }
          },
          "targetApplication": {
            "data": {
              "type": "application",
              "id": "54"
            }
          }
        }
      },
      {
        "type": "clazz",
        "id": "189",
        "attributes": {
          "extensionAttributes": {},
          "name": "Connection",
          "fullQualifiedName": "org.database.connector.Connection",
          "instanceCount": 80
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "component",
              "id": "188"
            }
          },
          "clazzCommunications": {
            "data": []
          }
        }
      },
      {
        "type": "applicationcommunication",
        "id": "340",
        "attributes": {
          "extensionAttributes": {},
          "requests": 100,
          "averageResponseTime": 0
        },
        "relationships": {
          "sourceApplication": {
            "data": {
              "type": "application",
              "id": "8"
            }
          },
          "targetApplication": {
            "data": {
              "type": "application",
              "id": "12"
            }
          }
        }
      },
      {
        "type": "applicationcommunication",
        "id": "345",
        "attributes": {
          "extensionAttributes": {},
          "requests": 100,
          "averageResponseTime": 0
        },
        "relationships": {
          "sourceApplication": {
            "data": {
              "type": "application",
              "id": "12"
            }
          },
          "targetApplication": {
            "data": {
              "type": "application",
              "id": "15"
            }
          }
        }
      },
      {
        "type": "component",
        "id": "95",
        "attributes": {
          "extensionAttributes": {},
          "name": "kernel",
          "fullQualifiedName": "org.webshop.kernel"
        },
        "relationships": {
          "children": {
            "data": [
              {
                "type": "component",
                "id": "96"
              },
              {
                "type": "component",
                "id": "99"
              },
              {
                "type": "component",
                "id": "102"
              },
              {
                "type": "component",
                "id": "105"
              },
              {
                "type": "component",
                "id": "108"
              },
              {
                "type": "component",
                "id": "118"
              },
              {
                "type": "component",
                "id": "121"
              },
              {
                "type": "component",
                "id": "124"
              }
            ]
          },
          "clazzes": {
            "data": []
          },
          "parentComponent": {
            "data": {
              "type": "component",
              "id": "72"
            }
          }
        }
      },
      {
        "type": "clazz",
        "id": "106",
        "attributes": {
          "extensionAttributes": {},
          "name": "GuardHandler",
          "fullQualifiedName": "org.webshop.kernel.guard.GuardHandler",
          "instanceCount": 35
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "component",
              "id": "105"
            }
          },
          "clazzCommunications": {
            "data": [
              {
                "type": "clazzcommunication",
                "id": "143"
              },
              {
                "type": "clazzcommunication",
                "id": "152"
              }
            ]
          }
        }
      },
      {
        "type": "databasequery",
        "id": "293",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593800200,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 10
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "287",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593180100,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 508
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "application",
        "id": "15",
        "attributes": {
          "extensionAttributes": {},
          "name": "Database",
          "programmingLanguage": "JAVA",
          "lastUsage": 1547561492149
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "node",
              "id": "14"
            }
          },
          "components": {
            "data": []
          },
          "databaseQueries": {
            "data": []
          },
          "applicationCommunications": {
            "data": []
          },
          "aggregatedClazzCommunications": {
            "data": []
          },
          "traces": {
            "data": []
          }
        }
      },
      {
        "type": "clazz",
        "id": "100",
        "attributes": {
          "extensionAttributes": {},
          "name": "ConfigurationHandler",
          "fullQualifiedName": "org.webshop.kernel.configuration.ConfigurationHandler",
          "instanceCount": 35
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "component",
              "id": "99"
            }
          },
          "clazzCommunications": {
            "data": []
          }
        }
      },
      {
        "type": "tracestep",
        "id": "153",
        "attributes": {
          "extensionAttributes": {},
          "tracePosition": 9,
          "requests": 12000,
          "currentTraceDuration": 2646,
          "averageResponseTime": 648
        },
        "relationships": {
          "parentTrace": {
            "data": {
              "type": "trace",
              "id": "128"
            }
          },
          "clazzCommunication": {
            "data": {
              "type": "clazzcommunication",
              "id": "152"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "252",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593105900,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 145
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "applicationcommunication",
        "id": "359",
        "attributes": {
          "extensionAttributes": {},
          "requests": 400,
          "averageResponseTime": 0
        },
        "relationships": {
          "sourceApplication": {
            "data": {
              "type": "application",
              "id": "57"
            }
          },
          "targetApplication": {
            "data": {
              "type": "application",
              "id": "58"
            }
          }
        }
      },
      {
        "type": "component",
        "id": "92",
        "attributes": {
          "extensionAttributes": {},
          "name": "unsafe",
          "fullQualifiedName": "org.webshop.unsafe"
        },
        "relationships": {
          "children": {
            "data": []
          },
          "clazzes": {
            "data": [
              {
                "type": "clazz",
                "id": "93"
              },
              {
                "type": "clazz",
                "id": "94"
              }
            ]
          },
          "parentComponent": {
            "data": {
              "type": "component",
              "id": "72"
            }
          }
        }
      },
      {
        "type": "tracestep",
        "id": "144",
        "attributes": {
          "extensionAttributes": {},
          "tracePosition": 6,
          "requests": 100,
          "currentTraceDuration": 3028,
          "averageResponseTime": 843
        },
        "relationships": {
          "parentTrace": {
            "data": {
              "type": "trace",
              "id": "128"
            }
          },
          "clazzCommunication": {
            "data": {
              "type": "clazzcommunication",
              "id": "143"
            }
          }
        }
      },
      {
        "type": "applicationcommunication",
        "id": "365",
        "attributes": {
          "extensionAttributes": {},
          "requests": 300,
          "averageResponseTime": 0
        },
        "relationships": {
          "sourceApplication": {
            "data": {
              "type": "application",
              "id": "63"
            }
          },
          "targetApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          }
        }
      },
      {
        "type": "nodegroup",
        "id": "55",
        "attributes": {
          "extensionAttributes": {},
          "name": "10.0.0.4 - 10.0.0.7"
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "system",
              "id": "46"
            }
          }
        }
      },
      {
        "type": "tracestep",
        "id": "150",
        "attributes": {
          "extensionAttributes": {},
          "tracePosition": 8,
          "requests": 150,
          "currentTraceDuration": 8085,
          "averageResponseTime": 165
        },
        "relationships": {
          "parentTrace": {
            "data": {
              "type": "trace",
              "id": "128"
            }
          },
          "clazzCommunication": {
            "data": {
              "type": "clazzcommunication",
              "id": "149"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "194",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593027200,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "26",
          "responseTime": 514
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "256",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593118400,
          "statementType": "Statement",
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 174
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "clazzcommunication",
        "id": "178",
        "attributes": {
          "extensionAttributes": {},
          "operationName": "getMethod29()",
          "totalRequests": 1200,
          "averageResponseTime": 914
        },
        "relationships": {
          "sourceClazz": {
            "data": {
              "type": "clazz",
              "id": "109"
            }
          },
          "targetClazz": {
            "data": {
              "type": "clazz",
              "id": "80"
            }
          },
          "tracesteps": {
            "data": [
              {
                "type": "tracestep",
                "id": "179"
              }
            ]
          }
        }
      },
      {
        "type": "aggregatedclazzcommunication",
        "id": "133",
        "attributes": {
          "extensionAttributes": {},
          "totalRequests": 1600,
          "averageResponseTime": 581
        },
        "relationships": {
          "sourceClazz": {
            "data": {
              "type": "clazz",
              "id": "86"
            }
          },
          "targetClazz": {
            "data": {
              "type": "clazz",
              "id": "109"
            }
          },
          "clazzCommunications": {
            "data": [
              {
                "type": "clazzcommunication",
                "id": "131"
              }
            ]
          }
        }
      },
      {
        "type": "node",
        "id": "40",
        "attributes": {
          "extensionAttributes": {},
          "ipAddress": "10.0.5.1",
          "cpuUtilization": 0.11,
          "freeRAM": 2147483648,
          "usedRAM": 4294967296
        },
        "relationships": {
          "applications": {
            "data": [
              {
                "type": "application",
                "id": "41"
              }
            ]
          },
          "parent": {
            "data": {
              "type": "nodegroup",
              "id": "39"
            }
          }
        }
      },
      {
        "type": "tracestep",
        "id": "147",
        "attributes": {
          "extensionAttributes": {},
          "tracePosition": 7,
          "requests": 1000,
          "currentTraceDuration": 1983,
          "averageResponseTime": 146
        },
        "relationships": {
          "parentTrace": {
            "data": {
              "type": "trace",
              "id": "128"
            }
          },
          "clazzCommunication": {
            "data": {
              "type": "clazzcommunication",
              "id": "146"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "198",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593034400,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 692
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "318",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593843900,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 446
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "205",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593043800,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 745
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "300",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593814900,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 295
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "242",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593093000,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "40",
          "responseTime": 764
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "308",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593826500,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "67",
          "responseTime": 122
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "application",
        "id": "51",
        "attributes": {
          "extensionAttributes": {},
          "name": "Jira",
          "programmingLanguage": "JAVA",
          "lastUsage": 1547561492149
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "node",
              "id": "50"
            }
          },
          "components": {
            "data": []
          },
          "databaseQueries": {
            "data": []
          },
          "applicationCommunications": {
            "data": [
              {
                "type": "applicationcommunication",
                "id": "354"
              },
              {
                "type": "applicationcommunication",
                "id": "358"
              },
              {
                "type": "applicationcommunication",
                "id": "354"
              },
              {
                "type": "applicationcommunication",
                "id": "358"
              }
            ]
          },
          "aggregatedClazzCommunications": {
            "data": []
          },
          "traces": {
            "data": []
          }
        }
      },
      {
        "type": "component",
        "id": "73",
        "attributes": {
          "extensionAttributes": {},
          "name": "labeling",
          "fullQualifiedName": "org.webshop.labeling"
        },
        "relationships": {
          "children": {
            "data": []
          },
          "clazzes": {
            "data": [
              {
                "type": "clazz",
                "id": "74"
              },
              {
                "type": "clazz",
                "id": "75"
              },
              {
                "type": "clazz",
                "id": "76"
              },
              {
                "type": "clazz",
                "id": "77"
              },
              {
                "type": "clazz",
                "id": "78"
              }
            ]
          },
          "parentComponent": {
            "data": {
              "type": "component",
              "id": "72"
            }
          }
        }
      },
      {
        "type": "tracestep",
        "id": "166",
        "attributes": {
          "extensionAttributes": {},
          "tracePosition": 14,
          "requests": 2100,
          "currentTraceDuration": 1778,
          "averageResponseTime": 643
        },
        "relationships": {
          "parentTrace": {
            "data": {
              "type": "trace",
              "id": "128"
            }
          },
          "clazzCommunication": {
            "data": {
              "type": "clazzcommunication",
              "id": "165"
            }
          }
        }
      },
      {
        "type": "component",
        "id": "110",
        "attributes": {
          "extensionAttributes": {},
          "name": "annotations",
          "fullQualifiedName": "org.webshop.kernel.impl.annotations"
        },
        "relationships": {
          "children": {
            "data": []
          },
          "clazzes": {
            "data": [
              {
                "type": "clazz",
                "id": "111"
              }
            ]
          },
          "parentComponent": {
            "data": {
              "type": "component",
              "id": "108"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "297",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593808300,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "95",
          "responseTime": 251
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "nodegroup",
        "id": "6",
        "attributes": {
          "extensionAttributes": {},
          "name": "10.0.99.1"
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "system",
              "id": "5"
            }
          }
        }
      },
      {
        "type": "system",
        "id": "9",
        "attributes": {
          "extensionAttributes": {},
          "name": "OCN Editor"
        },
        "relationships": {
          "nodegroups": {
            "data": [
              {
                "type": "nodegroup",
                "id": "10"
              },
              {
                "type": "nodegroup",
                "id": "13"
              }
            ]
          },
          "parent": {
            "data": {
              "type": "landscape",
              "id": "3"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "283",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593173900,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 128
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "component",
        "id": "186",
        "attributes": {
          "extensionAttributes": {},
          "name": "org",
          "fullQualifiedName": "org"
        },
        "relationships": {
          "children": {
            "data": [
              {
                "type": "component",
                "id": "187"
              }
            ]
          },
          "clazzes": {
            "data": []
          }
        }
      },
      {
        "type": "databasequery",
        "id": "304",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593821000,
          "statementType": "Statement",
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 10
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "246",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593098000,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 27
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "209",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 102768593049200,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 491
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "application",
        "id": "22",
        "attributes": {
          "extensionAttributes": {},
          "name": "Database",
          "programmingLanguage": "JAVA",
          "lastUsage": 1547561492149
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "node",
              "id": "21"
            }
          },
          "components": {
            "data": []
          },
          "databaseQueries": {
            "data": []
          },
          "applicationCommunications": {
            "data": []
          },
          "aggregatedClazzCommunications": {
            "data": []
          },
          "traces": {
            "data": []
          }
        }
      },
      {
        "type": "aggregatedclazzcommunication",
        "id": "145",
        "attributes": {
          "extensionAttributes": {},
          "totalRequests": 200,
          "averageResponseTime": 843
        },
        "relationships": {
          "sourceClazz": {
            "data": {
              "type": "clazz",
              "id": "106"
            }
          },
          "targetClazz": {
            "data": {
              "type": "clazz",
              "id": "93"
            }
          },
          "clazzCommunications": {
            "data": [
              {
                "type": "clazzcommunication",
                "id": "143"
              }
            ]
          }
        }
      },
      {
        "type": "nodegroup",
        "id": "42",
        "attributes": {
          "extensionAttributes": {},
          "name": "10.0.5.2"
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "system",
              "id": "38"
            }
          }
        }
      }
    ]
  }
  landscapeRouter.get('/broadcast', sse.init);

  landscapeRouter.get('/latest-landscape', function (req, res) {
    res.send(landscapeObject);
  });

  landscapeRouter.post('/', function (req, res) {
    res.status(201).end();
  });

  landscapeRouter.get('/:id', function (req, res) {
    res.send({
      'landscape': {
        id: req.params.id
      }
    });
  });

  landscapeRouter.put('/:id', function (req, res) {
    res.send({
      'landscape': {
        id: req.params.id
      }
    });
  });

  landscapeRouter.delete('/:id', function (req, res) {
    res.status(204).end();
  });

  // The POST and PUT call will not contain a request body
  // because the body-parser is not included by default.
  // To use req.body, run:

  //    npm install --save-dev body-parser

  // After installing, you need to `use` the body-parser for
  // this mock uncommenting the following line:
  //
  //app.use('/api/landscape', require('body-parser').json());
  app.use('/api/v1/landscapes', landscapeRouter);

  function sendSSE() {
    setTimeout(function () {
      sse.send(landscapeObject, "message");
      sendSSE();
    }, 10000);
  }

  sendSSE();
};
