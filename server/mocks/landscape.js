/* eslint-env node */
'use strict';

module.exports = function(app) {
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
            "id": "444"
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
              "id": "326"
            },
            {
              "type": "applicationcommunication",
              "id": "327"
            },
            {
              "type": "applicationcommunication",
              "id": "328"
            },
            {
              "type": "applicationcommunication",
              "id": "329"
            },
            {
              "type": "applicationcommunication",
              "id": "330"
            },
            {
              "type": "applicationcommunication",
              "id": "331"
            },
            {
              "type": "applicationcommunication",
              "id": "332"
            },
            {
              "type": "applicationcommunication",
              "id": "333"
            },
            {
              "type": "applicationcommunication",
              "id": "334"
            },
            {
              "type": "applicationcommunication",
              "id": "335"
            },
            {
              "type": "applicationcommunication",
              "id": "336"
            },
            {
              "type": "applicationcommunication",
              "id": "337"
            },
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
            }
          ]
        }
      }
    },
    "included": [
      {
        "type": "databasequery",
        "id": "187",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355448816,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "17",
          "responseTime": 305
        }
      },
      {
        "type": "databasequery",
        "id": "265",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355717926,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "71",
          "responseTime": 549
        }
      },
      {
        "type": "runtimeinformation",
        "id": "160",
        "attributes": {
          "extensionAttributes": {},
          "traceId": 0,
          "overallTraceDuration": 2510,
          "requests": 12000,
          "averageResponseTime": 329,
          "orderIndexes": [
            1
          ],
          "averageResponseTimeInNanoSec": 329
        }
      },
      {
        "type": "databasequery",
        "id": "215",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355550536,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 439
        }
      },
      {
        "type": "node",
        "id": "65",
        "attributes": {
          "extensionAttributes": {},
          "ipAddress": "10.0.0.7",
          "cpuUtilization": 0.67,
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
          "requests": 800,
          "operationName": "getMethod10()"
        },
        "relationships": {
          "runtimeInformations": {
            "data": [
              {
                "type": "runtimeinformation",
                "id": "132"
              }
            ]
          },
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
        "type": "runtimeinformation",
        "id": "132",
        "attributes": {
          "extensionAttributes": {},
          "traceId": 2,
          "overallTraceDuration": 8228,
          "requests": 800,
          "averageResponseTime": 282,
          "orderIndexes": [
            1
          ],
          "averageResponseTimeInNanoSec": 282
        }
      },
      {
        "type": "databasequery",
        "id": "230",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355599855,
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 343
        }
      },
      {
        "type": "node",
        "id": "14",
        "attributes": {
          "extensionAttributes": {},
          "ipAddress": "10.0.1.2",
          "cpuUtilization": 0.43,
          "freeRAM": 2147483648,
          "usedRAM": 4294967296
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
              "id": "60"
            }
          },
          "targetApplication": {
            "data": {
              "type": "application",
              "id": "170"
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
              "id": "170"
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
              "id": "444"
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
                "id": "326"
              },
              {
                "type": "applicationcommunication",
                "id": "327"
              },
              {
                "type": "applicationcommunication",
                "id": "328"
              },
              {
                "type": "applicationcommunication",
                "id": "329"
              },
              {
                "type": "applicationcommunication",
                "id": "330"
              },
              {
                "type": "applicationcommunication",
                "id": "331"
              },
              {
                "type": "applicationcommunication",
                "id": "332"
              },
              {
                "type": "applicationcommunication",
                "id": "333"
              },
              {
                "type": "applicationcommunication",
                "id": "334"
              },
              {
                "type": "applicationcommunication",
                "id": "335"
              },
              {
                "type": "applicationcommunication",
                "id": "336"
              },
              {
                "type": "applicationcommunication",
                "id": "337"
              },
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
          "timestamp": 19118355624998,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 369
        }
      },
      {
        "type": "applicationcommunication",
        "id": "355",
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
        "type": "databasequery",
        "id": "292",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355806713,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 832
        }
      },
      {
        "type": "databasequery",
        "id": "288",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355794573,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "51",
          "responseTime": 663
        }
      },
      {
        "type": "databasequery",
        "id": "316",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355902384,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 304
        }
      },
      {
        "type": "databasequery",
        "id": "253",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355676225,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "38",
          "responseTime": 849
        }
      },
      {
        "type": "databasequery",
        "id": "191",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355460958,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 721
        }
      },
      {
        "type": "cumulatedclazzcommunication",
        "id": "154",
        "attributes": {
          "extensionAttributes": {},
          "requests": 4000
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
          "aggregatedClazzCommunications": {
            "data": [
              {
                "type": "aggregatedclazzcommunication",
                "id": "153"
              }
            ]
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
          "instanceCount": 5,
          "objectIds": []
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
        "type": "aggregatedclazzcommunication",
        "id": "137",
        "attributes": {
          "extensionAttributes": {},
          "requests": 120
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
                "id": "135"
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
          "timestamp": 19118355755291,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "83",
          "responseTime": 235
        }
      },
      {
        "type": "databasequery",
        "id": "190",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355457850,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 631
        }
      },
      {
        "type": "applicationcommunication",
        "id": "333",
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
        "type": "databasequery",
        "id": "277",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355759194,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "55",
          "responseTime": 651
        }
      },
      {
        "type": "databasequery",
        "id": "320",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355916636,
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 737
        }
      },
      {
        "type": "cumulatedclazzcommunication",
        "id": "162",
        "attributes": {
          "extensionAttributes": {},
          "requests": 48000
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
          "aggregatedClazzCommunications": {
            "data": [
              {
                "type": "aggregatedclazzcommunication",
                "id": "161"
              }
            ]
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
          "instanceCount": 5,
          "objectIds": []
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
        "type": "node",
        "id": "69",
        "attributes": {
          "extensionAttributes": {},
          "ipAddress": "10.0.0.9",
          "cpuUtilization": 0.37,
          "freeRAM": 2147483648,
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
          "requests": 150,
          "operationName": "getMethod49()"
        },
        "relationships": {
          "runtimeInformations": {
            "data": [
              {
                "type": "runtimeinformation",
                "id": "156"
              }
            ]
          },
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
          }
        }
      },
      {
        "type": "databasequery",
        "id": "226",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355586781,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 137
        }
      },
      {
        "type": "databasequery",
        "id": "227",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355589958,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 643
        }
      },
      {
        "type": "applicationcommunication",
        "id": "331",
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
        "type": "clazz",
        "id": "74",
        "attributes": {
          "extensionAttributes": {},
          "name": "BaseLabeler",
          "fullQualifiedName": "org.webshop.labeling.BaseLabeler",
          "instanceCount": 20,
          "objectIds": []
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
          "timestamp": 19118355554491,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "100",
          "responseTime": 757
        }
      },
      {
        "type": "databasequery",
        "id": "249",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355661989,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 959
        }
      },
      {
        "type": "clazzcommunication",
        "id": "159",
        "attributes": {
          "extensionAttributes": {},
          "requests": 12000,
          "operationName": "getMethod46()"
        },
        "relationships": {
          "runtimeInformations": {
            "data": [
              {
                "type": "runtimeinformation",
                "id": "160"
              }
            ]
          },
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
          }
        }
      },
      {
        "type": "databasequery",
        "id": "214",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355547444,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 954
        }
      },
      {
        "type": "databasequery",
        "id": "231",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355602790,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 843
        }
      },
      {
        "type": "node",
        "id": "18",
        "attributes": {
          "extensionAttributes": {},
          "ipAddress": "10.0.2.1",
          "cpuUtilization": 0.87,
          "freeRAM": 1073741824,
          "usedRAM": 4294967296
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
          "requests": 40,
          "operationName": "getMethod28()"
        },
        "relationships": {
          "runtimeInformations": {
            "data": [
              {
                "type": "runtimeinformation",
                "id": "128"
              }
            ]
          },
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
          }
        }
      },
      {
        "type": "databasequery",
        "id": "315",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355899399,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 825
        }
      },
      {
        "type": "databasequery",
        "id": "237",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355621957,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 72
        }
      },
      {
        "type": "applicationcommunication",
        "id": "336",
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
        "id": "317",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355905497,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 820
        }
      },
      {
        "type": "node",
        "id": "50",
        "attributes": {
          "extensionAttributes": {},
          "ipAddress": "10.0.0.2",
          "cpuUtilization": 0.75,
          "freeRAM": 3221225472,
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
        "type": "cumulatedclazzcommunication",
        "id": "138",
        "attributes": {
          "extensionAttributes": {},
          "requests": 240
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
          "aggregatedClazzCommunications": {
            "data": [
              {
                "type": "aggregatedclazzcommunication",
                "id": "137"
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
          "timestamp": 19118355628215,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 952
        }
      },
      {
        "type": "applicationcommunication",
        "id": "342",
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
                "id": "168"
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
        "type": "node",
        "id": "29",
        "attributes": {
          "extensionAttributes": {},
          "ipAddress": "10.0.3.2",
          "cpuUtilization": 0.52,
          "freeRAM": 1073741824,
          "usedRAM": 3221225472
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
          "timestamp": 19118355734335,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "42",
          "responseTime": 220
        }
      },
      {
        "type": "applicationcommunication",
        "id": "327",
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
          "instanceCount": 35,
          "objectIds": []
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
        "type": "cumulatedclazzcommunication",
        "id": "150",
        "attributes": {
          "extensionAttributes": {},
          "requests": 400
        },
        "relationships": {
          "sourceClazz": {
            "data": {
              "type": "clazz",
              "id": "93"
            }
          },
          "targetClazz": {
            "data": {
              "type": "clazz",
              "id": "106"
            }
          },
          "aggregatedClazzCommunications": {
            "data": [
              {
                "type": "aggregatedclazzcommunication",
                "id": "149"
              }
            ]
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
          "lastUsage": 1536152927556
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
          "totalApplicationCommunications": {
            "data": [
              {
                "type": "applicationcommunication",
                "id": "339"
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
                "id": "339"
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
              }
            ]
          },
          "aggregatedclazzCommunications": {
            "data": []
          },
          "cumulatedClazzCommunications": {
            "data": []
          }
        }
      },
      {
        "type": "databasequery",
        "id": "202",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355507679,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 50
        }
      },
      {
        "type": "databasequery",
        "id": "197",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355480214,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 165
        }
      },
      {
        "type": "databasequery",
        "id": "199",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355489436,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "74",
          "responseTime": 774
        }
      },
      {
        "type": "node",
        "id": "33",
        "attributes": {
          "extensionAttributes": {},
          "ipAddress": "10.0.4.1",
          "cpuUtilization": 0.85,
          "freeRAM": 4294967296,
          "usedRAM": 4294967296
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
          "lastUsage": 1536152927556
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
          "totalApplicationCommunications": {
            "data": [
              {
                "type": "applicationcommunication",
                "id": "354"
              },
              {
                "type": "applicationcommunication",
                "id": "354"
              }
            ]
          },
          "aggregatedclazzCommunications": {
            "data": []
          },
          "cumulatedClazzCommunications": {
            "data": []
          }
        }
      },
      {
        "type": "databasequery",
        "id": "204",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355514994,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "49",
          "responseTime": 356
        }
      },
      {
        "type": "applicationcommunication",
        "id": "347",
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
        "type": "application",
        "id": "19",
        "attributes": {
          "extensionAttributes": {},
          "name": "Interface",
          "programmingLanguage": "JAVA",
          "lastUsage": 1536152927556
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
          "totalApplicationCommunications": {
            "data": [
              {
                "type": "applicationcommunication",
                "id": "330"
              },
              {
                "type": "applicationcommunication",
                "id": "332"
              },
              {
                "type": "applicationcommunication",
                "id": "330"
              },
              {
                "type": "applicationcommunication",
                "id": "332"
              }
            ]
          },
          "aggregatedclazzCommunications": {
            "data": []
          },
          "cumulatedClazzCommunications": {
            "data": []
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
              "id": "66"
            }
          },
          "targetApplication": {
            "data": {
              "type": "application",
              "id": "170"
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
        "type": "databasequery",
        "id": "241",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355636100,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "87",
          "responseTime": 620
        }
      },
      {
        "type": "component",
        "id": "174",
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
                "id": "175"
              }
            ]
          },
          "parentComponent": {
            "data": {
              "type": "component",
              "id": "173"
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
        "type": "databasequery",
        "id": "298",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355831289,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 254
        }
      },
      {
        "type": "databasequery",
        "id": "243",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355641983,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 100
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
          "timestamp": 19118355855707,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 227
        }
      },
      {
        "type": "databasequery",
        "id": "282",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355774811,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "86",
          "responseTime": 631
        }
      },
      {
        "type": "databasequery",
        "id": "280",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355767961,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 945
        }
      },
      {
        "type": "databasequery",
        "id": "185",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355441059,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 59
        }
      },
      {
        "type": "databasequery",
        "id": "305",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355865324,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 404
        }
      },
      {
        "type": "databasequery",
        "id": "213",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355544451,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 611
        }
      },
      {
        "type": "databasequery",
        "id": "189",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355454593,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 35
        }
      },
      {
        "type": "node",
        "id": "48",
        "attributes": {
          "extensionAttributes": {},
          "ipAddress": "10.0.0.1",
          "cpuUtilization": 0.73,
          "freeRAM": 4294967296,
          "usedRAM": 2147483648
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
        "type": "cumulatedclazzcommunication",
        "id": "134",
        "attributes": {
          "extensionAttributes": {},
          "requests": 3200
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
          "aggregatedClazzCommunications": {
            "data": [
              {
                "type": "aggregatedclazzcommunication",
                "id": "133"
              }
            ]
          }
        }
      },
      {
        "type": "databasequery",
        "id": "248",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355658722,
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 75
        }
      },
      {
        "type": "application",
        "id": "54",
        "attributes": {
          "extensionAttributes": {},
          "name": "PostgreSQL",
          "programmingLanguage": "JAVA",
          "lastUsage": 1536152927556
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
          "totalApplicationCommunications": {
            "data": []
          },
          "aggregatedclazzCommunications": {
            "data": []
          },
          "cumulatedClazzCommunications": {
            "data": []
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
        "type": "aggregatedclazzcommunication",
        "id": "161",
        "attributes": {
          "extensionAttributes": {},
          "requests": 24000
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
                "id": "159"
              }
            ]
          }
        }
      },
      {
        "type": "applicationcommunication",
        "id": "335",
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
        "type": "clazz",
        "id": "93",
        "attributes": {
          "extensionAttributes": {},
          "name": "AbstractBean",
          "fullQualifiedName": "org.webshop.unsafe.AbstractBean",
          "instanceCount": 20,
          "objectIds": []
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
          "lastUsage": 1536152927556
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
          "totalApplicationCommunications": {
            "data": [
              {
                "type": "applicationcommunication",
                "id": "336"
              },
              {
                "type": "applicationcommunication",
                "id": "336"
              }
            ]
          },
          "aggregatedclazzCommunications": {
            "data": []
          },
          "cumulatedClazzCommunications": {
            "data": []
          }
        }
      },
      {
        "type": "runtimeinformation",
        "id": "152",
        "attributes": {
          "extensionAttributes": {},
          "traceId": 4,
          "overallTraceDuration": 8673,
          "requests": 1000,
          "averageResponseTime": 299,
          "orderIndexes": [
            1
          ],
          "averageResponseTimeInNanoSec": 299
        }
      },
      {
        "type": "databasequery",
        "id": "251",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355668173,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 60
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
        "id": "217",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355558284,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "90",
          "responseTime": 706
        }
      },
      {
        "type": "databasequery",
        "id": "255",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355681758,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 380
        }
      },
      {
        "type": "applicationcommunication",
        "id": "346",
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
        "type": "application",
        "id": "171",
        "attributes": {
          "extensionAttributes": {},
          "name": "Database Connector",
          "programmingLanguage": "JAVA",
          "lastUsage": 1536152927558
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "node",
              "id": "169"
            }
          },
          "components": {
            "data": [
              {
                "type": "component",
                "id": "172"
              }
            ]
          },
          "databaseQueries": {
            "data": [
              {
                "type": "databasequery",
                "id": "176"
              },
              {
                "type": "databasequery",
                "id": "177"
              },
              {
                "type": "databasequery",
                "id": "178"
              },
              {
                "type": "databasequery",
                "id": "179"
              },
              {
                "type": "databasequery",
                "id": "180"
              },
              {
                "type": "databasequery",
                "id": "181"
              },
              {
                "type": "databasequery",
                "id": "182"
              },
              {
                "type": "databasequery",
                "id": "183"
              },
              {
                "type": "databasequery",
                "id": "184"
              },
              {
                "type": "databasequery",
                "id": "185"
              },
              {
                "type": "databasequery",
                "id": "186"
              },
              {
                "type": "databasequery",
                "id": "187"
              },
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
              }
            ]
          },
          "totalApplicationCommunications": {
            "data": []
          },
          "aggregatedclazzCommunications": {
            "data": []
          },
          "cumulatedClazzCommunications": {
            "data": []
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
          "lastUsage": 1536152927556
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
          "totalApplicationCommunications": {
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
          "aggregatedclazzCommunications": {
            "data": []
          },
          "cumulatedClazzCommunications": {
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
          "lastUsage": 1536152927556
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
          "totalApplicationCommunications": {
            "data": [
              {
                "type": "applicationcommunication",
                "id": "357"
              },
              {
                "type": "applicationcommunication",
                "id": "357"
              }
            ]
          },
          "aggregatedclazzCommunications": {
            "data": []
          },
          "cumulatedClazzCommunications": {
            "data": []
          }
        }
      },
      {
        "type": "databasequery",
        "id": "193",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355468562,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "10",
          "responseTime": 43
        }
      },
      {
        "type": "node",
        "id": "11",
        "attributes": {
          "extensionAttributes": {},
          "ipAddress": "10.0.1.1",
          "cpuUtilization": 0.22,
          "freeRAM": 4294967296,
          "usedRAM": 4294967296
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
          "timestamp": 19118355747957,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 998
        }
      },
      {
        "type": "databasequery",
        "id": "275",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355751162,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 866
        }
      },
      {
        "type": "databasequery",
        "id": "192",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355464730,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "66",
          "responseTime": 480
        }
      },
      {
        "type": "databasequery",
        "id": "220",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355567460,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 743
        }
      },
      {
        "type": "databasequery",
        "id": "224",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355580528,
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 759
        }
      },
      {
        "type": "databasequery",
        "id": "278",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355761599,
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 34
        }
      },
      {
        "type": "clazz",
        "id": "109",
        "attributes": {
          "extensionAttributes": {},
          "name": "ImplementationHandler",
          "fullQualifiedName": "org.webshop.kernel.impl.ImplementationHandler",
          "instanceCount": 45,
          "objectIds": []
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
                "id": "135"
              },
              {
                "type": "clazzcommunication",
                "id": "139"
              },
              {
                "type": "clazzcommunication",
                "id": "143"
              },
              {
                "type": "clazzcommunication",
                "id": "163"
              }
            ]
          }
        }
      },
      {
        "type": "applicationcommunication",
        "id": "330",
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
        "type": "clazz",
        "id": "89",
        "attributes": {
          "extensionAttributes": {},
          "name": "ItemSqlMapDao",
          "fullQualifiedName": "org.webshop.tooling.ItemSqlMapDao",
          "instanceCount": 45,
          "objectIds": []
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
          "timestamp": 19118355923149,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 554
        }
      },
      {
        "type": "node",
        "id": "25",
        "attributes": {
          "extensionAttributes": {},
          "ipAddress": "10.0.3.1",
          "cpuUtilization": 0.71,
          "freeRAM": 3221225472,
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
        "type": "databasequery",
        "id": "279",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355764761,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 229
        }
      },
      {
        "type": "aggregatedclazzcommunication",
        "id": "141",
        "attributes": {
          "extensionAttributes": {},
          "requests": 1200
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
                "id": "139"
              }
            ]
          }
        }
      },
      {
        "type": "component",
        "id": "172",
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
                "id": "173"
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
        "id": "78",
        "attributes": {
          "extensionAttributes": {},
          "name": "DescriptionLabeler",
          "fullQualifiedName": "org.webshop.labeling.DescriptionLabeler",
          "instanceCount": 5,
          "objectIds": []
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
          "timestamp": 19118355593860,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "93",
          "responseTime": 768
        }
      },
      {
        "type": "applicationcommunication",
        "id": "353",
        "attributes": {
          "extensionAttributes": {},
          "requests": 600,
          "averageResponseTime": 0
        },
        "relationships": {
          "sourceApplication": {
            "data": {
              "type": "application",
              "id": "170"
            }
          },
          "targetApplication": {
            "data": {
              "type": "application",
              "id": "171"
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
          "cpuUtilization": 0.7,
          "freeRAM": 1073741824,
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
        "id": "186",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355444978,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "95",
          "responseTime": 985
        }
      },
      {
        "type": "databasequery",
        "id": "264",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355714300,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "60",
          "responseTime": 769
        }
      },
      {
        "type": "clazz",
        "id": "91",
        "attributes": {
          "extensionAttributes": {},
          "name": "SequenceSqlMapDao",
          "fullQualifiedName": "org.webshop.tooling.SequenceSqlMapDao",
          "instanceCount": 15,
          "objectIds": []
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
        "type": "cumulatedclazzcommunication",
        "id": "146",
        "attributes": {
          "extensionAttributes": {},
          "requests": 5000
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
          "aggregatedClazzCommunications": {
            "data": [
              {
                "type": "aggregatedclazzcommunication",
                "id": "145"
              },
              {
                "type": "aggregatedclazzcommunication",
                "id": "167"
              }
            ]
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
          "instanceCount": 30,
          "objectIds": []
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
          "instanceCount": 35,
          "objectIds": []
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
        "id": "182",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355431286,
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 314
        }
      },
      {
        "type": "databasequery",
        "id": "285",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355784489,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 76
        }
      },
      {
        "type": "clazz",
        "id": "119",
        "attributes": {
          "extensionAttributes": {},
          "name": "AccountSqlMapDao",
          "fullQualifiedName": "org.webshop.kernel.info.AccountSqlMapDao",
          "instanceCount": 5,
          "objectIds": []
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
        "type": "clazz",
        "id": "122",
        "attributes": {
          "extensionAttributes": {},
          "name": "AccountSqlMapDao",
          "fullQualifiedName": "org.webshop.kernel.lifecycle.AccountSqlMapDao",
          "instanceCount": 25,
          "objectIds": []
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
                "id": "155"
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
          "lastUsage": 1536152927556
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
          "totalApplicationCommunications": {
            "data": []
          },
          "aggregatedclazzCommunications": {
            "data": [
              {
                "type": "aggregatedclazzcommunication",
                "id": "129"
              },
              {
                "type": "aggregatedclazzcommunication",
                "id": "133"
              },
              {
                "type": "aggregatedclazzcommunication",
                "id": "137"
              },
              {
                "type": "aggregatedclazzcommunication",
                "id": "141"
              },
              {
                "type": "aggregatedclazzcommunication",
                "id": "145"
              },
              {
                "type": "aggregatedclazzcommunication",
                "id": "149"
              },
              {
                "type": "aggregatedclazzcommunication",
                "id": "153"
              },
              {
                "type": "aggregatedclazzcommunication",
                "id": "157"
              },
              {
                "type": "aggregatedclazzcommunication",
                "id": "161"
              },
              {
                "type": "aggregatedclazzcommunication",
                "id": "167"
              }
            ]
          },
          "cumulatedClazzCommunications": {
            "data": [
              {
                "type": "cumulatedclazzcommunication",
                "id": "130"
              },
              {
                "type": "cumulatedclazzcommunication",
                "id": "134"
              },
              {
                "type": "cumulatedclazzcommunication",
                "id": "138"
              },
              {
                "type": "cumulatedclazzcommunication",
                "id": "142"
              },
              {
                "type": "cumulatedclazzcommunication",
                "id": "146"
              },
              {
                "type": "cumulatedclazzcommunication",
                "id": "150"
              },
              {
                "type": "cumulatedclazzcommunication",
                "id": "154"
              },
              {
                "type": "cumulatedclazzcommunication",
                "id": "158"
              },
              {
                "type": "cumulatedclazzcommunication",
                "id": "162"
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
          "timestamp": 19118355727098,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 883
        }
      },
      {
        "type": "databasequery",
        "id": "289",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355798230,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "81",
          "responseTime": 172
        }
      },
      {
        "type": "node",
        "id": "53",
        "attributes": {
          "extensionAttributes": {},
          "ipAddress": "10.0.0.3",
          "cpuUtilization": 0.51,
          "freeRAM": 4294967296,
          "usedRAM": 1073741824
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
          "cpuUtilization": 0.39,
          "freeRAM": 3221225472,
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
          "timestamp": 19118355678736,
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 450
        }
      },
      {
        "type": "application",
        "id": "63",
        "attributes": {
          "extensionAttributes": {},
          "name": "Workflow",
          "programmingLanguage": "JAVA",
          "lastUsage": 1536152927556
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
          "totalApplicationCommunications": {
            "data": [
              {
                "type": "applicationcommunication",
                "id": "347"
              },
              {
                "type": "applicationcommunication",
                "id": "351"
              },
              {
                "type": "applicationcommunication",
                "id": "347"
              },
              {
                "type": "applicationcommunication",
                "id": "351"
              }
            ]
          },
          "aggregatedclazzCommunications": {
            "data": []
          },
          "cumulatedClazzCommunications": {
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
        "type": "databasequery",
        "id": "176",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355353846,
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 807
        }
      },
      {
        "type": "clazz",
        "id": "123",
        "attributes": {
          "extensionAttributes": {},
          "name": "AccountSqlMapDao",
          "fullQualifiedName": "org.webshop.kernel.lifecycle.AccountSqlMapDao",
          "instanceCount": 15,
          "objectIds": []
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
          "timestamp": 19118355803675,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 312
        }
      },
      {
        "type": "application",
        "id": "30",
        "attributes": {
          "extensionAttributes": {},
          "name": "Database",
          "programmingLanguage": "JAVA",
          "lastUsage": 1536152927556
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
          "totalApplicationCommunications": {
            "data": []
          },
          "aggregatedclazzCommunications": {
            "data": []
          },
          "cumulatedClazzCommunications": {
            "data": []
          }
        }
      },
      {
        "type": "databasequery",
        "id": "207",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355524493,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 94
        }
      },
      {
        "type": "databasequery",
        "id": "271",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355738018,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "79",
          "responseTime": 679
        }
      },
      {
        "type": "clazz",
        "id": "98",
        "attributes": {
          "extensionAttributes": {},
          "name": "APIHandler",
          "fullQualifiedName": "org.webshop.kernel.api.APIHandler",
          "instanceCount": 25,
          "objectIds": []
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
        "type": "databasequery",
        "id": "258",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355694269,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "86",
          "responseTime": 932
        }
      },
      {
        "type": "databasequery",
        "id": "196",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355477189,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 793
        }
      },
      {
        "type": "databasequery",
        "id": "203",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355510964,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 571
        }
      },
      {
        "type": "application",
        "id": "12",
        "attributes": {
          "extensionAttributes": {},
          "name": "Frontend",
          "programmingLanguage": "JAVA",
          "lastUsage": 1536152927556
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
          "totalApplicationCommunications": {
            "data": [
              {
                "type": "applicationcommunication",
                "id": "329"
              },
              {
                "type": "applicationcommunication",
                "id": "331"
              },
              {
                "type": "applicationcommunication",
                "id": "329"
              },
              {
                "type": "applicationcommunication",
                "id": "331"
              }
            ]
          },
          "aggregatedclazzCommunications": {
            "data": []
          },
          "cumulatedClazzCommunications": {
            "data": []
          }
        }
      },
      {
        "type": "databasequery",
        "id": "302",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355848526,
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 924
        }
      },
      {
        "type": "clazzcommunication",
        "id": "163",
        "attributes": {
          "extensionAttributes": {},
          "requests": 3500,
          "operationName": "getMethod1()"
        },
        "relationships": {
          "runtimeInformations": {
            "data": [
              {
                "type": "runtimeinformation",
                "id": "164"
              }
            ]
          },
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
          }
        }
      },
      {
        "type": "databasequery",
        "id": "240",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355632160,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "74",
          "responseTime": 673
        }
      },
      {
        "type": "databasequery",
        "id": "295",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355818607,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "39",
          "responseTime": 634
        }
      },
      {
        "type": "clazz",
        "id": "113",
        "attributes": {
          "extensionAttributes": {},
          "name": "APIImpl",
          "fullQualifiedName": "org.webshop.kernel.impl.api.APIImpl",
          "instanceCount": 25,
          "objectIds": []
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
          "lastUsage": 1536152927556
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
          "totalApplicationCommunications": {
            "data": [
              {
                "type": "applicationcommunication",
                "id": "327"
              },
              {
                "type": "applicationcommunication",
                "id": "327"
              }
            ]
          },
          "aggregatedclazzCommunications": {
            "data": []
          },
          "cumulatedClazzCommunications": {
            "data": []
          }
        }
      },
      {
        "type": "databasequery",
        "id": "244",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355645099,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 752
        }
      },
      {
        "type": "cumulatedclazzcommunication",
        "id": "158",
        "attributes": {
          "extensionAttributes": {},
          "requests": 600
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
          "aggregatedClazzCommunications": {
            "data": [
              {
                "type": "aggregatedclazzcommunication",
                "id": "157"
              }
            ]
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
        "type": "applicationcommunication",
        "id": "344",
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
        "type": "node",
        "id": "21",
        "attributes": {
          "extensionAttributes": {},
          "ipAddress": "10.0.2.2",
          "cpuUtilization": 0.86,
          "freeRAM": 1073741824,
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
        "type": "databasequery",
        "id": "306",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355869344,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "44",
          "responseTime": 800
        }
      },
      {
        "type": "application",
        "id": "61",
        "attributes": {
          "extensionAttributes": {},
          "name": "Provenance",
          "programmingLanguage": "JAVA",
          "lastUsage": 1536152927556
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
          "totalApplicationCommunications": {
            "data": [
              {
                "type": "applicationcommunication",
                "id": "355"
              },
              {
                "type": "applicationcommunication",
                "id": "355"
              }
            ]
          },
          "aggregatedclazzCommunications": {
            "data": []
          },
          "cumulatedClazzCommunications": {
            "data": []
          }
        }
      },
      {
        "type": "databasequery",
        "id": "299",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355834681,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 24
        }
      },
      {
        "type": "runtimeinformation",
        "id": "166",
        "attributes": {
          "extensionAttributes": {},
          "traceId": 3,
          "overallTraceDuration": 2705,
          "requests": 500,
          "averageResponseTime": 418,
          "orderIndexes": [
            1
          ],
          "averageResponseTimeInNanoSec": 418
        }
      },
      {
        "type": "runtimeinformation",
        "id": "136",
        "attributes": {
          "extensionAttributes": {},
          "traceId": 1,
          "overallTraceDuration": 6835,
          "requests": 60,
          "averageResponseTime": 49,
          "orderIndexes": [
            1
          ],
          "averageResponseTimeInNanoSec": 49
        }
      },
      {
        "type": "databasequery",
        "id": "281",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355770807,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 472
        }
      },
      {
        "type": "runtimeinformation",
        "id": "156",
        "attributes": {
          "extensionAttributes": {},
          "traceId": 3,
          "overallTraceDuration": 1903,
          "requests": 150,
          "averageResponseTime": 895,
          "orderIndexes": [
            1
          ],
          "averageResponseTimeInNanoSec": 895
        }
      },
      {
        "type": "applicationcommunication",
        "id": "329",
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
          "timestamp": 19118355704367,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 789
        }
      },
      {
        "type": "databasequery",
        "id": "183",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355434681,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 894
        }
      },
      {
        "type": "databasequery",
        "id": "211",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355538836,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "94",
          "responseTime": 717
        }
      },
      {
        "type": "databasequery",
        "id": "284",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355781353,
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 501
        }
      },
      {
        "type": "clazz",
        "id": "117",
        "attributes": {
          "extensionAttributes": {},
          "name": "AccountSqlMapDao",
          "fullQualifiedName": "org.webshop.kernel.impl.persistence.AccountSqlMapDao",
          "instanceCount": 45,
          "objectIds": []
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
        "type": "aggregatedclazzcommunication",
        "id": "153",
        "attributes": {
          "extensionAttributes": {},
          "requests": 2000
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
                "id": "151"
              }
            ]
          }
        }
      },
      {
        "type": "databasequery",
        "id": "269",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355730263,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 868
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
          "requests": 1000,
          "operationName": "getMethod18()"
        },
        "relationships": {
          "runtimeInformations": {
            "data": [
              {
                "type": "runtimeinformation",
                "id": "144"
              }
            ]
          },
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
          }
        }
      },
      {
        "type": "applicationcommunication",
        "id": "326",
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
        "type": "clazz",
        "id": "103",
        "attributes": {
          "extensionAttributes": {},
          "name": "SingleExtensionHandler",
          "fullQualifiedName": "org.webshop.kernel.extension.SingleExtensionHandler",
          "instanceCount": 25,
          "objectIds": []
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
          "timestamp": 19118355889696,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "60",
          "responseTime": 167
        }
      },
      {
        "type": "clazz",
        "id": "120",
        "attributes": {
          "extensionAttributes": {},
          "name": "AccountSqlMapDao",
          "fullQualifiedName": "org.webshop.kernel.info.AccountSqlMapDao",
          "instanceCount": 25,
          "objectIds": []
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
          "timestamp": 19118355612506,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "11",
          "responseTime": 137
        }
      },
      {
        "type": "databasequery",
        "id": "219",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355564129,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 810
        }
      },
      {
        "type": "databasequery",
        "id": "195",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355474162,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 734
        }
      },
      {
        "type": "applicationcommunication",
        "id": "332",
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
        "type": "applicationcommunication",
        "id": "356",
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
        "type": "clazz",
        "id": "101",
        "attributes": {
          "extensionAttributes": {},
          "name": "ConfigurationHandler",
          "fullQualifiedName": "org.webshop.kernel.configuration.ConfigurationHandler",
          "instanceCount": 5,
          "objectIds": []
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
          "instanceCount": 45,
          "objectIds": []
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
          "timestamp": 19118355743484,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 961
        }
      },
      {
        "type": "runtimeinformation",
        "id": "144",
        "attributes": {
          "extensionAttributes": {},
          "traceId": 1,
          "overallTraceDuration": 5087,
          "requests": 1000,
          "averageResponseTime": 16,
          "orderIndexes": [
            1
          ],
          "averageResponseTimeInNanoSec": 16
        }
      },
      {
        "type": "databasequery",
        "id": "179",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355411148,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 163
        }
      },
      {
        "type": "application",
        "id": "45",
        "attributes": {
          "extensionAttributes": {},
          "name": "PostgreSQL",
          "programmingLanguage": "JAVA",
          "lastUsage": 1536152927556
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
          "totalApplicationCommunications": {
            "data": []
          },
          "aggregatedclazzCommunications": {
            "data": []
          },
          "cumulatedClazzCommunications": {
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
          "timestamp": 19118355578005,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "16",
          "responseTime": 798
        }
      },
      {
        "type": "databasequery",
        "id": "250",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355665034,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 65
        }
      },
      {
        "type": "databasequery",
        "id": "222",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355574283,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "9",
          "responseTime": 77
        }
      },
      {
        "type": "aggregatedclazzcommunication",
        "id": "149",
        "attributes": {
          "extensionAttributes": {},
          "requests": 200
        },
        "relationships": {
          "sourceClazz": {
            "data": {
              "type": "clazz",
              "id": "93"
            }
          },
          "targetClazz": {
            "data": {
              "type": "clazz",
              "id": "106"
            }
          },
          "clazzCommunications": {
            "data": [
              {
                "type": "clazzcommunication",
                "id": "147"
              }
            ]
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
          "instanceCount": 35,
          "objectIds": []
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
          "lastUsage": 1536152927556
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
          "totalApplicationCommunications": {
            "data": [
              {
                "type": "applicationcommunication",
                "id": "335"
              },
              {
                "type": "applicationcommunication",
                "id": "335"
              }
            ]
          },
          "aggregatedclazzCommunications": {
            "data": []
          },
          "cumulatedClazzCommunications": {
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
          "instanceCount": 25,
          "objectIds": []
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
                "id": "151"
              }
            ]
          }
        }
      },
      {
        "type": "node",
        "id": "169",
        "attributes": {
          "extensionAttributes": {},
          "ipAddress": "10.0.0.8",
          "cpuUtilization": 0.57,
          "freeRAM": 3221225472,
          "usedRAM": 1073741824
        },
        "relationships": {
          "applications": {
            "data": [
              {
                "type": "application",
                "id": "170"
              },
              {
                "type": "application",
                "id": "171"
              }
            ]
          },
          "parent": {
            "data": {
              "type": "nodegroup",
              "id": "168"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "324",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355930246,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "13",
          "responseTime": 362
        }
      },
      {
        "type": "databasequery",
        "id": "323",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355926284,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 133
        }
      },
      {
        "type": "applicationcommunication",
        "id": "348",
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
        "type": "databasequery",
        "id": "212",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355541339,
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 11
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
          "timestamp": 19118355534975,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "9",
          "responseTime": 247
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
          "timestamp": 19118355700568,
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 231
        }
      },
      {
        "type": "aggregatedclazzcommunication",
        "id": "129",
        "attributes": {
          "extensionAttributes": {},
          "requests": 80
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
        "type": "clazzcommunication",
        "id": "139",
        "attributes": {
          "extensionAttributes": {},
          "requests": 600,
          "operationName": "getMethod7()"
        },
        "relationships": {
          "runtimeInformations": {
            "data": [
              {
                "type": "runtimeinformation",
                "id": "140"
              }
            ]
          },
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
          }
        }
      },
      {
        "type": "clazz",
        "id": "175",
        "attributes": {
          "extensionAttributes": {},
          "name": "Connection",
          "fullQualifiedName": "org.database.connector.Connection",
          "instanceCount": 80,
          "objectIds": []
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "component",
              "id": "174"
            }
          },
          "clazzCommunications": {
            "data": []
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
          "lastUsage": 1536152927556
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
          "totalApplicationCommunications": {
            "data": [
              {
                "type": "applicationcommunication",
                "id": "348"
              },
              {
                "type": "applicationcommunication",
                "id": "352"
              },
              {
                "type": "applicationcommunication",
                "id": "348"
              },
              {
                "type": "applicationcommunication",
                "id": "352"
              }
            ]
          },
          "aggregatedclazzCommunications": {
            "data": []
          },
          "cumulatedClazzCommunications": {
            "data": []
          }
        }
      },
      {
        "type": "databasequery",
        "id": "313",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355893631,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "17",
          "responseTime": 965
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
          "timestamp": 19118355616394,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "88",
          "responseTime": 785
        }
      },
      {
        "type": "databasequery",
        "id": "233",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355608681,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 376
        }
      },
      {
        "type": "databasequery",
        "id": "311",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355885458,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 512
        }
      },
      {
        "type": "databasequery",
        "id": "200",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355492945,
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 387
        }
      },
      {
        "type": "databasequery",
        "id": "218",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355560840,
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 814
        }
      },
      {
        "type": "clazzcommunication",
        "id": "147",
        "attributes": {
          "extensionAttributes": {},
          "requests": 100,
          "operationName": "getMethod32()"
        },
        "relationships": {
          "runtimeInformations": {
            "data": [
              {
                "type": "runtimeinformation",
                "id": "148"
              }
            ]
          },
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
          }
        }
      },
      {
        "type": "timestamp",
        "id": "444",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 1536153517554,
          "calls": 168059
        }
      },
      {
        "type": "applicationcommunication",
        "id": "351",
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
              "id": "170"
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
          "instanceCount": 40,
          "objectIds": []
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
          "timestamp": 19118355740463,
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 206
        }
      },
      {
        "type": "node",
        "id": "59",
        "attributes": {
          "extensionAttributes": {},
          "ipAddress": "10.0.0.5",
          "cpuUtilization": 0.83,
          "freeRAM": 3221225472,
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
          "timestamp": 19118355527727,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 511
        }
      },
      {
        "type": "databasequery",
        "id": "206",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355521298,
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 131
        }
      },
      {
        "type": "clazz",
        "id": "87",
        "attributes": {
          "extensionAttributes": {},
          "name": "BaseSqlMapDao",
          "fullQualifiedName": "org.webshop.tooling.BaseSqlMapDao",
          "instanceCount": 20,
          "objectIds": []
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
          "timestamp": 19118355689611,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 441
        }
      },
      {
        "type": "applicationcommunication",
        "id": "337",
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
          "timestamp": 19118355842331,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "92",
          "responseTime": 198
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
        "id": "259",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355698048,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "42",
          "responseTime": 30
        }
      },
      {
        "type": "databasequery",
        "id": "319",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355913820,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "92",
          "responseTime": 68
        }
      },
      {
        "type": "clazz",
        "id": "90",
        "attributes": {
          "extensionAttributes": {},
          "name": "ProductSqlMapDao",
          "fullQualifiedName": "org.webshop.tooling.ProductSqlMapDao",
          "instanceCount": 20,
          "objectIds": []
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
          "timestamp": 19118355879090,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 121
        }
      },
      {
        "type": "databasequery",
        "id": "296",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355821945,
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 379
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
          "timestamp": 19118355873240,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "49",
          "responseTime": 127
        }
      },
      {
        "type": "runtimeinformation",
        "id": "140",
        "attributes": {
          "extensionAttributes": {},
          "traceId": 0,
          "overallTraceDuration": 1064,
          "requests": 600,
          "averageResponseTime": 761,
          "orderIndexes": [
            1
          ],
          "averageResponseTimeInNanoSec": 761
        }
      },
      {
        "type": "databasequery",
        "id": "247",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355656195,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "70",
          "responseTime": 206
        }
      },
      {
        "type": "databasequery",
        "id": "245",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355648239,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 612
        }
      },
      {
        "type": "clazzcommunication",
        "id": "151",
        "attributes": {
          "extensionAttributes": {},
          "requests": 1000,
          "operationName": "getMethod1()"
        },
        "relationships": {
          "runtimeInformations": {
            "data": [
              {
                "type": "runtimeinformation",
                "id": "152"
              }
            ]
          },
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
          "lastUsage": 1536152927556
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
          "totalApplicationCommunications": {
            "data": [
              {
                "type": "applicationcommunication",
                "id": "333"
              },
              {
                "type": "applicationcommunication",
                "id": "334"
              },
              {
                "type": "applicationcommunication",
                "id": "337"
              },
              {
                "type": "applicationcommunication",
                "id": "345"
              },
              {
                "type": "applicationcommunication",
                "id": "349"
              },
              {
                "type": "applicationcommunication",
                "id": "333"
              },
              {
                "type": "applicationcommunication",
                "id": "334"
              },
              {
                "type": "applicationcommunication",
                "id": "337"
              },
              {
                "type": "applicationcommunication",
                "id": "345"
              },
              {
                "type": "applicationcommunication",
                "id": "349"
              }
            ]
          },
          "aggregatedclazzCommunications": {
            "data": []
          },
          "cumulatedClazzCommunications": {
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
          "timestamp": 19118355724010,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 742
        }
      },
      {
        "type": "clazz",
        "id": "125",
        "attributes": {
          "extensionAttributes": {},
          "name": "AccountSqlMapDao",
          "fullQualifiedName": "org.webshop.kernel.logging.AccountSqlMapDao",
          "instanceCount": 25,
          "objectIds": []
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
                "id": "165"
              }
            ]
          }
        }
      },
      {
        "type": "component",
        "id": "173",
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
                "id": "174"
              }
            ]
          },
          "clazzes": {
            "data": []
          },
          "parentComponent": {
            "data": {
              "type": "component",
              "id": "172"
            }
          }
        }
      },
      {
        "type": "node",
        "id": "7",
        "attributes": {
          "extensionAttributes": {},
          "ipAddress": "10.0.99.1",
          "cpuUtilization": 0.21,
          "freeRAM": 1073741824,
          "usedRAM": 2147483648
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
          "lastUsage": 1536152927556
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
          "totalApplicationCommunications": {
            "data": []
          },
          "aggregatedclazzCommunications": {
            "data": []
          },
          "cumulatedClazzCommunications": {
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
          "lastUsage": 1536152927556
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
          "totalApplicationCommunications": {
            "data": [
              {
                "type": "applicationcommunication",
                "id": "328"
              },
              {
                "type": "applicationcommunication",
                "id": "328"
              }
            ]
          },
          "aggregatedclazzCommunications": {
            "data": []
          },
          "cumulatedClazzCommunications": {
            "data": []
          }
        }
      },
      {
        "type": "databasequery",
        "id": "181",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355428397,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "8",
          "responseTime": 510
        }
      },
      {
        "type": "clazz",
        "id": "111",
        "attributes": {
          "extensionAttributes": {},
          "name": "AnnotationHandler",
          "fullQualifiedName": "org.webshop.kernel.impl.annotations.AnnotationHandler",
          "instanceCount": 35,
          "objectIds": []
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
          "timestamp": 19118355882215,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 498
        }
      },
      {
        "type": "clazz",
        "id": "80",
        "attributes": {
          "extensionAttributes": {},
          "name": "BaseHelper",
          "fullQualifiedName": "org.webshop.helpers.BaseHelper",
          "instanceCount": 30,
          "objectIds": []
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
        "id": "286",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355787531,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 845
        }
      },
      {
        "type": "databasequery",
        "id": "232",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355605695,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 891
        }
      },
      {
        "type": "clazz",
        "id": "77",
        "attributes": {
          "extensionAttributes": {},
          "name": "ItemLabeler",
          "fullQualifiedName": "org.webshop.labeling.ItemLabeler",
          "instanceCount": 55,
          "objectIds": []
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
          "lastUsage": 1536152927556
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
          "totalApplicationCommunications": {
            "data": [
              {
                "type": "applicationcommunication",
                "id": "356"
              },
              {
                "type": "applicationcommunication",
                "id": "356"
              }
            ]
          },
          "aggregatedclazzCommunications": {
            "data": []
          },
          "cumulatedClazzCommunications": {
            "data": []
          }
        }
      },
      {
        "type": "databasequery",
        "id": "236",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355618846,
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 108
        }
      },
      {
        "type": "databasequery",
        "id": "294",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355813730,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "38",
          "responseTime": 644
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
        "type": "cumulatedclazzcommunication",
        "id": "142",
        "attributes": {
          "extensionAttributes": {},
          "requests": 2400
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
          "aggregatedClazzCommunications": {
            "data": [
              {
                "type": "aggregatedclazzcommunication",
                "id": "141"
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
          "lastUsage": 1536152927556
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
          "totalApplicationCommunications": {
            "data": [
              {
                "type": "applicationcommunication",
                "id": "326"
              },
              {
                "type": "applicationcommunication",
                "id": "326"
              }
            ]
          },
          "aggregatedclazzCommunications": {
            "data": []
          },
          "cumulatedClazzCommunications": {
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
          "instanceCount": 10,
          "objectIds": []
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
          "timestamp": 19118355496519,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 938
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
        "id": "177",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355398303,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 598
        }
      },
      {
        "type": "databasequery",
        "id": "290",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355800630,
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 907
        }
      },
      {
        "type": "clazz",
        "id": "126",
        "attributes": {
          "extensionAttributes": {},
          "name": "AccountSqlMapDao2",
          "fullQualifiedName": "org.webshop.kernel.logging.AccountSqlMapDao2",
          "instanceCount": 5,
          "objectIds": []
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
          "timestamp": 19118355896256,
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 235
        }
      },
      {
        "type": "clazzcommunication",
        "id": "135",
        "attributes": {
          "extensionAttributes": {},
          "requests": 60,
          "operationName": "getMethod26()"
        },
        "relationships": {
          "runtimeInformations": {
            "data": [
              {
                "type": "runtimeinformation",
                "id": "136"
              }
            ]
          },
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
          "instanceCount": 25,
          "objectIds": []
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
          "timestamp": 19118355570459,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 763
        }
      },
      {
        "type": "runtimeinformation",
        "id": "164",
        "attributes": {
          "extensionAttributes": {},
          "traceId": 2,
          "overallTraceDuration": 1047,
          "requests": 3500,
          "averageResponseTime": 596,
          "orderIndexes": [
            1
          ],
          "averageResponseTimeInNanoSec": 596
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
        "type": "node",
        "id": "62",
        "attributes": {
          "extensionAttributes": {},
          "ipAddress": "10.0.0.6",
          "cpuUtilization": 0.51,
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
        "type": "applicationcommunication",
        "id": "328",
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
        "type": "aggregatedclazzcommunication",
        "id": "167",
        "attributes": {
          "extensionAttributes": {},
          "requests": 1000
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
                "id": "165"
              }
            ]
          }
        }
      },
      {
        "type": "databasequery",
        "id": "321",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355919872,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 850
        }
      },
      {
        "type": "databasequery",
        "id": "229",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355597581,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "20",
          "responseTime": 894
        }
      },
      {
        "type": "databasequery",
        "id": "325",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355934054,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "65",
          "responseTime": 479
        }
      },
      {
        "type": "clazz",
        "id": "75",
        "attributes": {
          "extensionAttributes": {},
          "name": "ProcuctLabeler",
          "fullQualifiedName": "org.webshop.labeling.ProcuctLabeler",
          "instanceCount": 30,
          "objectIds": []
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
          "timestamp": 19118355583576,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 41
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
          "requests": 500,
          "operationName": "getMethod6()"
        },
        "relationships": {
          "runtimeInformations": {
            "data": [
              {
                "type": "runtimeinformation",
                "id": "166"
              }
            ]
          },
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
          "instanceCount": 40,
          "objectIds": []
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
        "type": "databasequery",
        "id": "262",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355707403,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 286
        }
      },
      {
        "type": "node",
        "id": "56",
        "attributes": {
          "extensionAttributes": {},
          "ipAddress": "10.0.0.4",
          "cpuUtilization": 0.4,
          "freeRAM": 1073741824,
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
          "timestamp": 19118355710436,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 315
        }
      },
      {
        "type": "databasequery",
        "id": "266",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355720409,
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 831
        }
      },
      {
        "type": "application",
        "id": "60",
        "attributes": {
          "extensionAttributes": {},
          "name": "Workflow",
          "programmingLanguage": "JAVA",
          "lastUsage": 1536152927556
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
          "totalApplicationCommunications": {
            "data": [
              {
                "type": "applicationcommunication",
                "id": "346"
              },
              {
                "type": "applicationcommunication",
                "id": "350"
              },
              {
                "type": "applicationcommunication",
                "id": "346"
              },
              {
                "type": "applicationcommunication",
                "id": "350"
              }
            ]
          },
          "aggregatedclazzCommunications": {
            "data": []
          },
          "cumulatedClazzCommunications": {
            "data": []
          }
        }
      },
      {
        "type": "aggregatedclazzcommunication",
        "id": "157",
        "attributes": {
          "extensionAttributes": {},
          "requests": 300
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
                "id": "155"
              }
            ]
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
        "type": "runtimeinformation",
        "id": "128",
        "attributes": {
          "extensionAttributes": {},
          "traceId": 1,
          "overallTraceDuration": 4531,
          "requests": 40,
          "averageResponseTime": 721,
          "orderIndexes": [
            1
          ],
          "averageResponseTimeInNanoSec": 721
        }
      },
      {
        "type": "applicationcommunication",
        "id": "354",
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
        "id": "184",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355437728,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 967
        }
      },
      {
        "type": "runtimeinformation",
        "id": "148",
        "attributes": {
          "extensionAttributes": {},
          "traceId": 0,
          "overallTraceDuration": 9400,
          "requests": 100,
          "averageResponseTime": 72,
          "orderIndexes": [
            1
          ],
          "averageResponseTimeInNanoSec": 72
        }
      },
      {
        "type": "cumulatedclazzcommunication",
        "id": "130",
        "attributes": {
          "extensionAttributes": {},
          "requests": 160
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
          "aggregatedClazzCommunications": {
            "data": [
              {
                "type": "aggregatedclazzcommunication",
                "id": "129"
              }
            ]
          }
        }
      },
      {
        "type": "databasequery",
        "id": "188",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355451249,
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 435
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
        "type": "databasequery",
        "id": "180",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355422668,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "79",
          "responseTime": 513
        }
      },
      {
        "type": "applicationcommunication",
        "id": "340",
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
        "type": "application",
        "id": "170",
        "attributes": {
          "extensionAttributes": {},
          "name": "Cache",
          "programmingLanguage": "JAVA",
          "lastUsage": 1536152927558
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "node",
              "id": "169"
            }
          },
          "components": {
            "data": []
          },
          "databaseQueries": {
            "data": []
          },
          "totalApplicationCommunications": {
            "data": [
              {
                "type": "applicationcommunication",
                "id": "353"
              },
              {
                "type": "applicationcommunication",
                "id": "353"
              }
            ]
          },
          "aggregatedclazzCommunications": {
            "data": []
          },
          "cumulatedClazzCommunications": {
            "data": []
          }
        }
      },
      {
        "type": "applicationcommunication",
        "id": "345",
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
          "instanceCount": 35,
          "objectIds": []
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
                "id": "147"
              },
              {
                "type": "clazzcommunication",
                "id": "159"
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
          "timestamp": 19118355809899,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 161
        }
      },
      {
        "type": "databasequery",
        "id": "287",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355790719,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 530
        }
      },
      {
        "type": "application",
        "id": "15",
        "attributes": {
          "extensionAttributes": {},
          "name": "Database",
          "programmingLanguage": "JAVA",
          "lastUsage": 1536152927556
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
          "totalApplicationCommunications": {
            "data": []
          },
          "aggregatedclazzCommunications": {
            "data": []
          },
          "cumulatedClazzCommunications": {
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
          "instanceCount": 35,
          "objectIds": []
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
        "type": "databasequery",
        "id": "252",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355672098,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "15",
          "responseTime": 424
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
        "type": "databasequery",
        "id": "178",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355405320,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 419
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
        "type": "databasequery",
        "id": "194",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355471017,
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 480
        }
      },
      {
        "type": "databasequery",
        "id": "256",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355686595,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 434
        }
      },
      {
        "type": "nodegroup",
        "id": "168",
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
        "type": "aggregatedclazzcommunication",
        "id": "133",
        "attributes": {
          "extensionAttributes": {},
          "requests": 1600
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
          "cpuUtilization": 0.91,
          "freeRAM": 4294967296,
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
        "type": "databasequery",
        "id": "198",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355484096,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "6",
          "responseTime": 784
        }
      },
      {
        "type": "databasequery",
        "id": "318",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355909646,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "77",
          "responseTime": 909
        }
      },
      {
        "type": "databasequery",
        "id": "205",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355518903,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "29",
          "responseTime": 562
        }
      },
      {
        "type": "databasequery",
        "id": "300",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355838558,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "71",
          "responseTime": 693
        }
      },
      {
        "type": "databasequery",
        "id": "242",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355638747,
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 709
        }
      },
      {
        "type": "databasequery",
        "id": "308",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355875856,
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 424
        }
      },
      {
        "type": "application",
        "id": "51",
        "attributes": {
          "extensionAttributes": {},
          "name": "Jira",
          "programmingLanguage": "JAVA",
          "lastUsage": 1536152927556
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
          "totalApplicationCommunications": {
            "data": [
              {
                "type": "applicationcommunication",
                "id": "340"
              },
              {
                "type": "applicationcommunication",
                "id": "344"
              },
              {
                "type": "applicationcommunication",
                "id": "340"
              },
              {
                "type": "applicationcommunication",
                "id": "344"
              }
            ]
          },
          "aggregatedclazzCommunications": {
            "data": []
          },
          "cumulatedClazzCommunications": {
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
          "timestamp": 19118355825114,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 944
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
          "timestamp": 19118355778699,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "75",
          "responseTime": 349
        }
      },
      {
        "type": "databasequery",
        "id": "304",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355862226,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 534
        }
      },
      {
        "type": "databasequery",
        "id": "209",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355530990,
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 113
        }
      },
      {
        "type": "databasequery",
        "id": "246",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 19118355652233,
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "7",
          "responseTime": 17
        }
      },
      {
        "type": "applicationcommunication",
        "id": "334",
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
        "type": "application",
        "id": "22",
        "attributes": {
          "extensionAttributes": {},
          "name": "Database",
          "programmingLanguage": "JAVA",
          "lastUsage": 1536152927556
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
          "totalApplicationCommunications": {
            "data": []
          },
          "aggregatedclazzCommunications": {
            "data": []
          },
          "cumulatedClazzCommunications": {
            "data": []
          }
        }
      },
      {
        "type": "aggregatedclazzcommunication",
        "id": "145",
        "attributes": {
          "extensionAttributes": {},
          "requests": 5500
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
                "id": "143"
              },
              {
                "type": "clazzcommunication",
                "id": "163"
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
  };

  landscapeRouter.get('/broadcast', sse.init);

  landscapeRouter.get('/latest-landscape', function(req, res) {
    res.send(landscapeObject);
  });

  landscapeRouter.post('/', function(req, res) {
    res.status(201).end();
  });

  landscapeRouter.get('/:id', function(req, res) {
    res.send({
      'landscape': {
        id: req.params.id
      }
    });
  });

  landscapeRouter.put('/:id', function(req, res) {
    res.send({
      'landscape': {
        id: req.params.id
      }
    });
  });

  landscapeRouter.delete('/:id', function(req, res) {
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
