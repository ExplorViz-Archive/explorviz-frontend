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
            "id": "441"
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
              "id": "338"
            },
            {
              "type": "applicationcommunication",
              "id": "339"
            },
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
          "timestamp": 360505056789400,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "33",
          "responseTime": 352
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
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
          "averageResponseTime": 832
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
          "timestamp": 360505056711500,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 187
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
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
          "cpuUtilization": 0.34,
          "freeRAM": 1073741824,
          "usedRAM": 2147483648
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
          "operationName": "getMethod37()",
          "totalRequests": 800,
          "averageResponseTime": 329
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
          "timestamp": 360505056730300,
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 380
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
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
          "cpuUtilization": 1,
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
        "type": "databasequery",
        "id": "328",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056876300,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 218
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
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
              "id": "441"
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
                "id": "338"
              },
              {
                "type": "applicationcommunication",
                "id": "339"
              },
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
          "timestamp": 360505056740300,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 50
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
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
              "id": "63"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "292",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056825700,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 593
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "316",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056861300,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 206
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "288",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056821000,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "47",
          "responseTime": 398
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
            }
          }
        }
      },
      {
        "type": "applicationcommunication",
        "id": "361",
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
              "id": "182"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "331",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056880400,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "23",
          "responseTime": 928
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
            }
          }
        }
      },
      {
        "type": "tracestep",
        "id": "176",
        "attributes": {
          "extensionAttributes": {},
          "tracePosition": 4,
          "requests": 11200,
          "currentTraceDuration": 8583,
          "averageResponseTime": 465
        },
        "relationships": {
          "parentTrace": {
            "data": {
              "type": "trace",
              "id": "169"
            }
          },
          "clazzCommunication": {
            "data": {
              "type": "clazzcommunication",
              "id": "175"
            }
          }
        }
      },
      {
        "type": "clazzcommunication",
        "id": "157",
        "attributes": {
          "extensionAttributes": {},
          "operationName": "getMethod20()",
          "totalRequests": 500,
          "averageResponseTime": 681
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
          "timestamp": 360505056759100,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "39",
          "responseTime": 504
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
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
          "currentTraceDuration": 1140,
          "averageResponseTime": 674
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
          "timestamp": 360505056667900,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 92
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
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
        "type": "clazzcommunication",
        "id": "160",
        "attributes": {
          "extensionAttributes": {},
          "operationName": "getMethod45()",
          "totalRequests": 6300,
          "averageResponseTime": 576.5
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
              },
              {
                "type": "tracestep",
                "id": "165"
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
          "timestamp": 360505056803000,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "23",
          "responseTime": 424
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
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
        "type": "databasequery",
        "id": "190",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056665100,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 375
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
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
          "currentTraceDuration": 9974,
          "averageResponseTime": 160
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
          "timestamp": 360505056804400,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "71",
          "responseTime": 194
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "320",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056866400,
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 22
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
            }
          }
        }
      },
      {
        "type": "component",
        "id": "184",
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
                "id": "185"
              }
            ]
          },
          "clazzes": {
            "data": []
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
        "type": "applicationcommunication",
        "id": "338",
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
        "type": "node",
        "id": "69",
        "attributes": {
          "extensionAttributes": {},
          "ipAddress": "10.0.0.9",
          "cpuUtilization": 0.75,
          "freeRAM": 1073741824,
          "usedRAM": 1073741824
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
          "operationName": "getMethod21()",
          "totalRequests": 3500,
          "averageResponseTime": 160
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
          "timestamp": 360505056725300,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 698
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "227",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056726500,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 999
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
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
          "timestamp": 360505056713000,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "87",
          "responseTime": 928
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "327",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056875100,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 555
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "329",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056877500,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 759
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "249",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056753800,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 676
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "231",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056731500,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 759
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "214",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056710300,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 72
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
            }
          }
        }
      },
      {
        "type": "applicationcommunication",
        "id": "368",
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
        "type": "node",
        "id": "18",
        "attributes": {
          "extensionAttributes": {},
          "ipAddress": "10.0.2.1",
          "cpuUtilization": 0.51,
          "freeRAM": 2147483648,
          "usedRAM": 1073741824
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
          "operationName": "getMethod16()",
          "totalRequests": 40,
          "averageResponseTime": 880
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
          "timestamp": 360505056858400,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 745
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "237",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056739100,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 169
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "317",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056862500,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 788
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
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
          "cpuUtilization": 0.6,
          "freeRAM": 3221225472,
          "usedRAM": 3221225472
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
          "totalTraceDuration": 1513,
          "averageResponseTime": 163
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
                "id": "165"
              },
              {
                "type": "tracestep",
                "id": "167"
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
          "operationName": "getMethod20()",
          "totalRequests": 60,
          "averageResponseTime": 544
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
          "timestamp": 360505056741500,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 855
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
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
        "id": "332",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056881300,
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 176
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "330",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056879000,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "88",
          "responseTime": 20
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
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
                "id": "180"
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
          "currentTraceDuration": 2714,
          "averageResponseTime": 493
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
          "currentTraceDuration": 4599,
          "averageResponseTime": 544
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
          "cpuUtilization": 0.64,
          "freeRAM": 3221225472,
          "usedRAM": 1073741824
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
          "timestamp": 360505056795400,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "27",
          "responseTime": 528
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
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
          "lastUsage": 1544623821772
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
                "id": "351"
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
                "id": "351"
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
          "timestamp": 360505056695000,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 930
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "197",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056688400,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 939
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "199",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056691500,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "17",
          "responseTime": 435
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
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
          "cpuUtilization": 0.52,
          "freeRAM": 2147483648,
          "usedRAM": 1073741824
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
          "lastUsage": 1544623821772
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
                "id": "366"
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
        "id": "204",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056697700,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "15",
          "responseTime": 366
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
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
        "type": "application",
        "id": "19",
        "attributes": {
          "extensionAttributes": {},
          "name": "Interface",
          "programmingLanguage": "JAVA",
          "lastUsage": 1544623821768
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
                "id": "342"
              },
              {
                "type": "applicationcommunication",
                "id": "344"
              },
              {
                "type": "applicationcommunication",
                "id": "342"
              },
              {
                "type": "applicationcommunication",
                "id": "344"
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
                "id": "171"
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
        "type": "applicationcommunication",
        "id": "357",
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
        "type": "databasequery",
        "id": "241",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056744300,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "52",
          "responseTime": 269
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
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
          "operationName": "getMethod31()",
          "totalRequests": 4200,
          "averageResponseTime": 909
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
          "averageResponseTime": 307
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
          "timestamp": 360505056833800,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 396
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "243",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056746400,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 460
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
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
          "timestamp": 360505056840000,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 365
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
            }
          }
        }
      },
      {
        "type": "clazzcommunication",
        "id": "152",
        "attributes": {
          "extensionAttributes": {},
          "operationName": "getMethod13()",
          "totalRequests": 12000,
          "averageResponseTime": 307
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
          "timestamp": 360505056811200,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "44",
          "responseTime": 485
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "280",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056807800,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 219
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "305",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056842400,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 878
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "213",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056709000,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 560
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "189",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056661500,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 250
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
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
          "cpuUtilization": 0.56,
          "freeRAM": 1073741824,
          "usedRAM": 1073741824
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
              "id": "66"
            }
          },
          "targetApplication": {
            "data": {
              "type": "application",
              "id": "182"
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
        "type": "databasequery",
        "id": "248",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056752600,
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 21
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
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
          "lastUsage": 1544623821772
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
          "operationName": "getMethod13()",
          "totalRequests": 150,
          "averageResponseTime": 718
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
          "timestamp": 360505056873800,
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 979
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
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
          "lastUsage": 1544623821768
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
                "id": "348"
              },
              {
                "type": "applicationcommunication",
                "id": "348"
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
          "operationName": "getMethod42()",
          "totalRequests": 600,
          "averageResponseTime": 674
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
        "type": "databasequery",
        "id": "251",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056756200,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 446
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
            }
          }
        }
      },
      {
        "type": "applicationcommunication",
        "id": "369",
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
        "type": "databasequery",
        "id": "255",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056761200,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 721
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "217",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056714400,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "82",
          "responseTime": 450
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
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
        "id": "333",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056882500,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 288
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
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
          "lastUsage": 1544623821768
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
        "type": "application",
        "id": "67",
        "attributes": {
          "extensionAttributes": {},
          "name": "Provenance",
          "programmingLanguage": "JAVA",
          "lastUsage": 1544623821772
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
        "type": "aggregatedclazzcommunication",
        "id": "130",
        "attributes": {
          "extensionAttributes": {},
          "totalRequests": 80,
          "averageResponseTime": 880
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
        "type": "clazz",
        "id": "187",
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
              "id": "186"
            }
          },
          "clazzCommunications": {
            "data": []
          }
        }
      },
      {
        "type": "databasequery",
        "id": "193",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056683100,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "27",
          "responseTime": 612
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
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
          "cpuUtilization": 0.19,
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
          "timestamp": 360505056800300,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 416
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "275",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056801500,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 523
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "220",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056717700,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 863
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "192",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056680100,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "98",
          "responseTime": 270
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "278",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056805400,
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 80
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "224",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056722800,
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 432
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
            }
          }
        }
      },
      {
        "type": "clazzcommunication",
        "id": "166",
        "attributes": {
          "extensionAttributes": {},
          "operationName": "getMethod37()",
          "totalRequests": 2100,
          "averageResponseTime": 163
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
                "id": "167"
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
          "timestamp": 360505056892300,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "77",
          "responseTime": 593
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
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
                "id": "168"
              },
              {
                "type": "clazzcommunication",
                "id": "173"
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
          "timestamp": 360505056868800,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 565
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
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
          "cpuUtilization": 0.61,
          "freeRAM": 3221225472,
          "usedRAM": 1073741824
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
        "type": "databasequery",
        "id": "279",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056806600,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 604
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
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
          "timestamp": 360505056728000,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "54",
          "responseTime": 338
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
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
              "id": "57"
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
          "cpuUtilization": 0.63,
          "freeRAM": 2147483648,
          "usedRAM": 1073741824
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
          "timestamp": 360505056787900,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "35",
          "responseTime": 416
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
            }
          }
        }
      },
      {
        "type": "tracestep",
        "id": "177",
        "attributes": {
          "extensionAttributes": {},
          "tracePosition": 5,
          "requests": 1200,
          "currentTraceDuration": 7524,
          "averageResponseTime": 429
        },
        "relationships": {
          "parentTrace": {
            "data": {
              "type": "trace",
              "id": "169"
            }
          },
          "clazzCommunication": {
            "data": {
              "type": "clazzcommunication",
              "id": "173"
            }
          }
        }
      },
      {
        "type": "tracestep",
        "id": "174",
        "attributes": {
          "extensionAttributes": {},
          "tracePosition": 3,
          "requests": 8200,
          "currentTraceDuration": 1920,
          "averageResponseTime": 33
        },
        "relationships": {
          "parentTrace": {
            "data": {
              "type": "trace",
              "id": "169"
            }
          },
          "clazzCommunication": {
            "data": {
              "type": "clazzcommunication",
              "id": "173"
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
          "averageResponseTime": 674
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
          "timestamp": 360505056815200,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 680
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
            }
          }
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
          "operationName": "getMethod34()",
          "totalRequests": 1000,
          "averageResponseTime": 832
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
          "lastUsage": 1544623821772
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
                "id": "169"
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
          "timestamp": 360505056792700,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 663
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "289",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056822400,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "52",
          "responseTime": 219
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
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
          "cpuUtilization": 0.12,
          "freeRAM": 4294967296,
          "usedRAM": 2147483648
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
          "cpuUtilization": 0.41,
          "freeRAM": 2147483648,
          "usedRAM": 4294967296
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
          "timestamp": 360505056760000,
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 421
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
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
          "lastUsage": 1544623821772
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
                "id": "359"
              },
              {
                "type": "applicationcommunication",
                "id": "363"
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
          "currentTraceDuration": 5615,
          "averageResponseTime": 681
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
          "timestamp": 360505056824600,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 40
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
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
          "lastUsage": 1544623821768
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
          "timestamp": 360505056796800,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "57",
          "responseTime": 265
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "207",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056701500,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 445
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
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
          "currentTraceDuration": 6334,
          "averageResponseTime": 583
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
          "timestamp": 360505056773200,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "65",
          "responseTime": 471
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "196",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056687100,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 34
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "203",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056696200,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 68
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
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
          "lastUsage": 1544623821768
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
                "id": "341"
              },
              {
                "type": "applicationcommunication",
                "id": "343"
              },
              {
                "type": "applicationcommunication",
                "id": "341"
              },
              {
                "type": "applicationcommunication",
                "id": "343"
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
          "averageResponseTime": 718
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
          "timestamp": 360505056838800,
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 324
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "240",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056742900,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "75",
          "responseTime": 41
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
            }
          }
        }
      },
      {
        "type": "clazzcommunication",
        "id": "173",
        "attributes": {
          "extensionAttributes": {},
          "operationName": "getMethod36()",
          "totalRequests": 9400,
          "averageResponseTime": 231
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
                "id": "174"
              },
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
        "id": "295",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056829700,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "94",
          "responseTime": 91
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
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
          "lastUsage": 1544623821772
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
                "id": "339"
              },
              {
                "type": "applicationcommunication",
                "id": "339"
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
          "timestamp": 360505056747700,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 660
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
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
        "type": "application",
        "id": "182",
        "attributes": {
          "extensionAttributes": {},
          "name": "Cache",
          "programmingLanguage": "JAVA",
          "lastUsage": 1544623821773
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "node",
              "id": "181"
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
                "id": "365"
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
              "id": "57"
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
          "cpuUtilization": 0.39,
          "freeRAM": 2147483648,
          "usedRAM": 3221225472
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
        "type": "databasequery",
        "id": "306",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056843900,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "22",
          "responseTime": 294
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
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
          "lastUsage": 1544623821772
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
        "id": "299",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056835000,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 218
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "281",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056809800,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 509
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
            }
          }
        }
      },
      {
        "type": "component",
        "id": "185",
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
                "id": "186"
              }
            ]
          },
          "clazzes": {
            "data": []
          },
          "parentComponent": {
            "data": {
              "type": "component",
              "id": "184"
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
        "type": "clazzcommunication",
        "id": "171",
        "attributes": {
          "extensionAttributes": {},
          "operationName": "getMethod7()",
          "totalRequests": 900,
          "averageResponseTime": 720
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
                "id": "172"
              }
            ]
          }
        }
      },
      {
        "type": "databasequery",
        "id": "261",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056783800,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 950
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "211",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056706800,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "10",
          "responseTime": 614
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "284",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056813500,
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 744
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
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
          "timestamp": 360505056793900,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 591
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
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
          "operationName": "getMethod44()",
          "totalRequests": 100,
          "averageResponseTime": 948
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
          "timestamp": 360505056851300,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "100",
          "responseTime": 675
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
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
          "timestamp": 360505056735500,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "87",
          "responseTime": 800
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "219",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056716500,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 756
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "195",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056685800,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 265
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
            }
          }
        }
      },
      {
        "type": "tracestep",
        "id": "167",
        "attributes": {
          "extensionAttributes": {},
          "tracePosition": 15,
          "requests": 2100,
          "currentTraceDuration": 1513,
          "averageResponseTime": 163
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
              "id": "166"
            }
          }
        }
      },
      {
        "type": "applicationcommunication",
        "id": "356",
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
          "timestamp": 360505056799100,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 66
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "335",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056889300,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 93
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
            }
          }
        }
      },
      {
        "type": "tracestep",
        "id": "170",
        "attributes": {
          "extensionAttributes": {},
          "tracePosition": 1,
          "requests": 2500,
          "currentTraceDuration": 9806,
          "averageResponseTime": 469
        },
        "relationships": {
          "parentTrace": {
            "data": {
              "type": "trace",
              "id": "169"
            }
          },
          "clazzCommunication": {
            "data": {
              "type": "clazzcommunication",
              "id": "168"
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
          "averageResponseTime": 622.25
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
                "id": "166"
              },
              {
                "type": "clazzcommunication",
                "id": "175"
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
        "type": "application",
        "id": "45",
        "attributes": {
          "extensionAttributes": {},
          "name": "PostgreSQL",
          "programmingLanguage": "JAVA",
          "lastUsage": 1544623821772
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
              "id": "15"
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
          "timestamp": 360505056721900,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "96",
          "responseTime": 383
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "250",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056755000,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 405
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "336",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056890800,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "35",
          "responseTime": 126
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "222",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056720500,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "12",
          "responseTime": 178
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
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
          "lastUsage": 1544623821768
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
                "id": "347"
              },
              {
                "type": "applicationcommunication",
                "id": "347"
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
          "timestamp": 360505056871400,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "9",
          "responseTime": 892
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "323",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056870000,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 936
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
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
        "type": "databasequery",
        "id": "212",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056707800,
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 276
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
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
        "type": "databasequery",
        "id": "210",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056705400,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "47",
          "responseTime": 643
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
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
          "timestamp": 360505056775600,
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 767
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
            }
          }
        }
      },
      {
        "type": "tracestep",
        "id": "165",
        "attributes": {
          "extensionAttributes": {},
          "tracePosition": 14,
          "requests": 2100,
          "currentTraceDuration": 9301,
          "averageResponseTime": 570
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
        "type": "application",
        "id": "66",
        "attributes": {
          "extensionAttributes": {},
          "name": "Workflow",
          "programmingLanguage": "JAVA",
          "lastUsage": 1544623821772
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
        "type": "databasequery",
        "id": "313",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056852700,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "87",
          "responseTime": 848
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
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
        "type": "databasequery",
        "id": "235",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056736900,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "13",
          "responseTime": 983
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
            }
          }
        }
      },
      {
        "type": "clazzcommunication",
        "id": "140",
        "attributes": {
          "extensionAttributes": {},
          "operationName": "getMethod32()",
          "totalRequests": 1000,
          "averageResponseTime": 493
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
          "timestamp": 360505056849700,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 572
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "233",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056734000,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 810
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "200",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056692400,
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 161
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "218",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056715300,
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 262
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
            }
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
          "timestamp": 360505056797700,
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 192
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
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
          "cpuUtilization": 0.11,
          "freeRAM": 4294967296,
          "usedRAM": 1073741824
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
          "timestamp": 360505056702700,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 823
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
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
          "currentTraceDuration": 4974,
          "averageResponseTime": 329
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
          "timestamp": 360505056700300,
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 39
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
            }
          }
        }
      },
      {
        "type": "timestamp",
        "id": "441",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 1544624261766,
          "totalRequests": 120704
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
          "timestamp": 360505056771600,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 107
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
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
          "currentTraceDuration": 5063,
          "averageResponseTime": 880
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
              "id": "182"
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
          "averageResponseTime": 397.75
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
                "id": "168"
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
        "type": "node",
        "id": "181",
        "attributes": {
          "extensionAttributes": {},
          "ipAddress": "10.0.0.8",
          "cpuUtilization": 0.74,
          "freeRAM": 3221225472,
          "usedRAM": 3221225472
        },
        "relationships": {
          "applications": {
            "data": [
              {
                "type": "application",
                "id": "182"
              },
              {
                "type": "application",
                "id": "183"
              }
            ]
          },
          "parent": {
            "data": {
              "type": "nodegroup",
              "id": "180"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "301",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056837800,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "40",
          "responseTime": 97
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
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
          "timestamp": 360505056865500,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "88",
          "responseTime": 520
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "259",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056774600,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "57",
          "responseTime": 165
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
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
          "timestamp": 360505056847400,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 142
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "296",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056830600,
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 72
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
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
          "timestamp": 360505056845200,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "53",
          "responseTime": 633
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
            }
          }
        }
      },
      {
        "type": "aggregatedclazzcommunication",
        "id": "136",
        "attributes": {
          "extensionAttributes": {},
          "totalRequests": 24920,
          "averageResponseTime": 298.25
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
                "id": "173"
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
          "timestamp": 360505056751700,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "76",
          "responseTime": 302
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "245",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056748800,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 552
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
            }
          }
        }
      },
      {
        "type": "applicationcommunication",
        "id": "367",
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
        "type": "application",
        "id": "57",
        "attributes": {
          "extensionAttributes": {},
          "name": "Workflow",
          "programmingLanguage": "JAVA",
          "lastUsage": 1544623821772
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
                "id": "345"
              },
              {
                "type": "applicationcommunication",
                "id": "346"
              },
              {
                "type": "applicationcommunication",
                "id": "349"
              },
              {
                "type": "applicationcommunication",
                "id": "357"
              },
              {
                "type": "applicationcommunication",
                "id": "361"
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
                "id": "349"
              },
              {
                "type": "applicationcommunication",
                "id": "357"
              },
              {
                "type": "applicationcommunication",
                "id": "361"
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
          "timestamp": 360505056791500,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 234
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
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
                "id": "171"
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
          "cpuUtilization": 0.35,
          "freeRAM": 3221225472,
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
          "lastUsage": 1544623821772
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
          "lastUsage": 1544623821772
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
          "timestamp": 360505056848600,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 534
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
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
                "id": "166"
              },
              {
                "type": "clazzcommunication",
                "id": "175"
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
        "id": "286",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056816700,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 949
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "232",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056732800,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 335
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
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
          "lastUsage": 1544623821772
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
        "id": "236",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056737900,
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 554
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "294",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056828300,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "79",
          "responseTime": 994
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
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
        "type": "trace",
        "id": "169",
        "attributes": {
          "extensionAttributes": {},
          "traceId": 2,
          "totalRequests": 24390,
          "totalTraceDuration": 5033,
          "averageResponseTime": 744
        },
        "relationships": {
          "traceSteps": {
            "data": [
              {
                "type": "tracestep",
                "id": "170"
              },
              {
                "type": "tracestep",
                "id": "172"
              },
              {
                "type": "tracestep",
                "id": "174"
              },
              {
                "type": "tracestep",
                "id": "176"
              },
              {
                "type": "tracestep",
                "id": "177"
              },
              {
                "type": "tracestep",
                "id": "179"
              }
            ]
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
          "lastUsage": 1544623821768
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
                "id": "338"
              },
              {
                "type": "applicationcommunication",
                "id": "338"
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
          "timestamp": 360505056693800,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 418
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
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
          "timestamp": 360505056823300,
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 762
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
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
          "timestamp": 360505056855200,
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 479
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
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
          "timestamp": 360505056719000,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 427
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
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
          "timestamp": 360505056888000,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 229
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
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
          "cpuUtilization": 0.92,
          "freeRAM": 4294967296,
          "usedRAM": 1073741824
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
        "type": "tracestep",
        "id": "179",
        "attributes": {
          "extensionAttributes": {},
          "tracePosition": 6,
          "requests": 390,
          "currentTraceDuration": 5033,
          "averageResponseTime": 744
        },
        "relationships": {
          "parentTrace": {
            "data": {
              "type": "trace",
              "id": "169"
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
          "timestamp": 360505056867600,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 492
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "229",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056729400,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "38",
          "responseTime": 632
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
            }
          }
        }
      },
      {
        "type": "clazzcommunication",
        "id": "175",
        "attributes": {
          "extensionAttributes": {},
          "operationName": "getMethod8()",
          "totalRequests": 11200,
          "averageResponseTime": 465
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
                "id": "176"
              }
            ]
          }
        }
      },
      {
        "type": "applicationcommunication",
        "id": "363",
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
              "id": "182"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "325",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056872800,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "67",
          "responseTime": 771
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
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
          "timestamp": 360505056724000,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 642
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
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
          "currentTraceDuration": 5116,
          "averageResponseTime": 909
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
          "timestamp": 360505056785200,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 952
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
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
          "cpuUtilization": 0.37,
          "freeRAM": 4294967296,
          "usedRAM": 1073741824
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
          "timestamp": 360505056786400,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 47
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
            }
          }
        }
      },
      {
        "type": "application",
        "id": "183",
        "attributes": {
          "extensionAttributes": {},
          "name": "Database Connector",
          "programmingLanguage": "JAVA",
          "lastUsage": 1544623821773
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "node",
              "id": "181"
            }
          },
          "components": {
            "data": [
              {
                "type": "component",
                "id": "184"
              }
            ]
          },
          "databaseQueries": {
            "data": [
              {
                "type": "databasequery",
                "id": "188"
              },
              {
                "type": "databasequery",
                "id": "189"
              },
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
        "id": "266",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056790300,
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 842
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
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
          "lastUsage": 1544623821772
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
                "id": "358"
              },
              {
                "type": "applicationcommunication",
                "id": "362"
              },
              {
                "type": "applicationcommunication",
                "id": "358"
              },
              {
                "type": "applicationcommunication",
                "id": "362"
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
        "type": "databasequery",
        "id": "188",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056631900,
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 951
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
            }
          }
        }
      },
      {
        "type": "applicationcommunication",
        "id": "339",
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
          "timestamp": 360505056826900,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 390
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "287",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056818000,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 69
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
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
          "lastUsage": 1544623821768
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
          "currentTraceDuration": 3899,
          "averageResponseTime": 307
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
          "timestamp": 360505056757600,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "27",
          "responseTime": 138
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
            }
          }
        }
      },
      {
        "type": "applicationcommunication",
        "id": "359",
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
          "currentTraceDuration": 9008,
          "averageResponseTime": 948
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
          "requests": 600,
          "averageResponseTime": 0
        },
        "relationships": {
          "sourceApplication": {
            "data": {
              "type": "application",
              "id": "182"
            }
          },
          "targetApplication": {
            "data": {
              "type": "application",
              "id": "183"
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
          "currentTraceDuration": 5079,
          "averageResponseTime": 718
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
          "timestamp": 360505056684200,
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 579
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "256",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056770200,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 738
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
            }
          }
        }
      },
      {
        "type": "clazzcommunication",
        "id": "168",
        "attributes": {
          "extensionAttributes": {},
          "operationName": "getMethod45()",
          "totalRequests": 2500,
          "averageResponseTime": 469
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
                "id": "170"
              }
            ]
          }
        }
      },
      {
        "type": "clazzcommunication",
        "id": "178",
        "attributes": {
          "extensionAttributes": {},
          "operationName": "getMethod11()",
          "totalRequests": 390,
          "averageResponseTime": 744
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
          "averageResponseTime": 329
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
          "cpuUtilization": 0.97,
          "freeRAM": 4294967296,
          "usedRAM": 3221225472
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
          "currentTraceDuration": 4927,
          "averageResponseTime": 832
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
          "timestamp": 360505056690000,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "11",
          "responseTime": 186
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "318",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056864100,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "9",
          "responseTime": 970
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "205",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056699300,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "8",
          "responseTime": 660
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "300",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056836400,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "69",
          "responseTime": 99
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "242",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056745200,
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 109
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
            }
          }
        }
      },
      {
        "type": "tracestep",
        "id": "172",
        "attributes": {
          "extensionAttributes": {},
          "tracePosition": 2,
          "requests": 900,
          "currentTraceDuration": 6712,
          "averageResponseTime": 720
        },
        "relationships": {
          "parentTrace": {
            "data": {
              "type": "trace",
              "id": "169"
            }
          },
          "clazzCommunication": {
            "data": {
              "type": "clazzcommunication",
              "id": "171"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "308",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056846200,
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 40
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
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
          "lastUsage": 1544623821772
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
                "id": "352"
              },
              {
                "type": "applicationcommunication",
                "id": "356"
              },
              {
                "type": "applicationcommunication",
                "id": "352"
              },
              {
                "type": "applicationcommunication",
                "id": "356"
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
        "type": "nodegroup",
        "id": "180",
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
          "timestamp": 360505056832600,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 994
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
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
          "timestamp": 360505056812600,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "50",
          "responseTime": 829
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
            }
          }
        }
      },
      {
        "type": "component",
        "id": "186",
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
                "id": "187"
              }
            ]
          },
          "parentComponent": {
            "data": {
              "type": "component",
              "id": "185"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "304",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056841200,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 819
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "246",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056750300,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "13",
          "responseTime": 176
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "209",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 360505056703900,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 98
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "183"
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
          "lastUsage": 1544623821768
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
          "averageResponseTime": 948
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
