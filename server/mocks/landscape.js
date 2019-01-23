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
            "id": "406"
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
            },
            {
              "type": "applicationcommunication",
              "id": "370"
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
          "timestamp": 799883477913400,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "42",
          "responseTime": 361
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
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
          "averageResponseTime": 525
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
          "timestamp": 799883477827200,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 197
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
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
          "cpuUtilization": 0.81,
          "freeRAM": 3221225472,
          "usedRAM": 3221225472
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
          "operationName": "getMethod9()",
          "totalRequests": 800,
          "averageResponseTime": 896
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
          "traceSteps": {
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
          "fullQualifiedName": "org.webshop.kernel.configuration",
          "belongingApplication": "4c973ab9-ad30-4f96-a1d9-2123be11c476"
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
          "timestamp": 799883477847500,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "23",
          "responseTime": 213
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
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
          "cpuUtilization": 0.13,
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
          "nodes": {
            "data": [
              {
                "type": "node",
                "id": "40"
              }
            ]
          },
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
        "id": "328",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 799883478013900,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 444
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
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
              "id": "406"
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
              },
              {
                "type": "applicationcommunication",
                "id": "370"
              }
            ]
          }
        }
      },
      {
        "type": "clazzcommunication",
        "id": "156",
        "attributes": {
          "extensionAttributes": {},
          "operationName": "getMethod2()",
          "totalRequests": 500,
          "averageResponseTime": 409
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
          "traceSteps": {
            "data": [
              {
                "type": "tracestep",
                "id": "157"
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
          "timestamp": 799883477857800,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 270
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          }
        }
      },
      {
        "type": "applicationcommunication",
        "id": "355",
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
        "id": "292",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 799883477958600,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 661
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "316",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 799883477996000,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 613
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "288",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 799883477951000,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 652
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          }
        }
      },
      {
        "type": "applicationcommunication",
        "id": "361",
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
        "id": "331",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 799883478018100,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "49",
          "responseTime": 630
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
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
          "currentTraceDuration": 2868,
          "averageResponseTime": 812
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
        "type": "databasequery",
        "id": "253",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 799883477877400,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "17",
          "responseTime": 515
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
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
          "currentTraceDuration": 5241,
          "averageResponseTime": 91
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
          "timestamp": 799883477780800,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 366
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
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
          "nodes": {
            "data": [
              {
                "type": "node",
                "id": "53"
              }
            ]
          },
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
          "nodes": {
            "data": [
              {
                "type": "node",
                "id": "33"
              }
            ]
          },
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
        "id": "276",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 799883477928400,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 181
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "190",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 799883477776700,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 766
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          }
        }
      },
      {
        "type": "applicationcommunication",
        "id": "366",
        "attributes": {
          "extensionAttributes": {},
          "requests": 600,
          "averageResponseTime": 0
        },
        "relationships": {
          "sourceApplication": {
            "data": {
              "type": "application",
              "id": "183"
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
        "id": "277",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 799883477930000,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "97",
          "responseTime": 925
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "320",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 799883478003600,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "96",
          "responseTime": 959
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
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
          "cpuUtilization": 1,
          "freeRAM": 4294967296,
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
        "type": "databasequery",
        "id": "226",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 799883477841800,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 140
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "227",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 799883477843000,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 153
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
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
          "timestamp": 799883477828500,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 754
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "327",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 799883478012600,
          "statementType": "Statement",
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 687
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "329",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 799883478015200,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 254
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "249",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 799883477872000,
          "statementType": "Statement",
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 964
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          }
        }
      },
      {
        "type": "clazzcommunication",
        "id": "159",
        "attributes": {
          "extensionAttributes": {},
          "operationName": "getMethod27()",
          "totalRequests": 4200,
          "averageResponseTime": 19
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
          "traceSteps": {
            "data": [
              {
                "type": "tracestep",
                "id": "160"
              }
            ]
          }
        }
      },
      {
        "type": "databasequery",
        "id": "231",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 799883477848500,
          "statementType": "Statement",
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 705
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "214",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 799883477826000,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 701
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          }
        }
      },
      {
        "type": "applicationcommunication",
        "id": "368",
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
        "type": "node",
        "id": "18",
        "attributes": {
          "extensionAttributes": {},
          "ipAddress": "10.0.2.1",
          "cpuUtilization": 0.48,
          "freeRAM": 4294967296,
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
          "fullQualifiedName": "org.webshop.helpers",
          "belongingApplication": "e412848e-7231-4c1b-824a-122690a0d237"
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
          "operationName": "getMethod2()",
          "totalRequests": 40,
          "averageResponseTime": 723
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
          "traceSteps": {
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
          "timestamp": 799883477992400,
          "statementType": "Statement",
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 789
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "237",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 799883477856500,
          "statementType": "Statement",
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 876
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "317",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 799883477999000,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 234
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
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
          "cpuUtilization": 0.54,
          "freeRAM": 2147483648,
          "usedRAM": 1073741824
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
          "traceId": "1",
          "totalRequests": 32350,
          "totalTraceDuration": 2639,
          "averageResponseTime": 630
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
                "id": "155"
              },
              {
                "type": "tracestep",
                "id": "157"
              },
              {
                "type": "tracestep",
                "id": "160"
              },
              {
                "type": "tracestep",
                "id": "162"
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
          "operationName": "getMethod24()",
          "totalRequests": 60,
          "averageResponseTime": 737
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
          "traceSteps": {
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
          "timestamp": 799883477859000,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 533
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
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
        "id": "332",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 799883478019600,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "49",
          "responseTime": 675
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "330",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 799883478016500,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 584
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
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
                "id": "181"
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
          "currentTraceDuration": 6897,
          "averageResponseTime": 220
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
          "currentTraceDuration": 9979,
          "averageResponseTime": 737
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
          "cpuUtilization": 0.4,
          "freeRAM": 3221225472,
          "usedRAM": 4294967296
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
          "timestamp": 799883477920000,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 211
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
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
          "fullQualifiedName": "org.webshop.kernel.guard",
          "belongingApplication": "818e398e-dfaf-4468-b928-c9c99fe339e8"
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
          "lastUsage": 1548258587484
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
                "id": "352"
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
                "id": "352"
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
          "timestamp": 799883477809800,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 871
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "197",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 799883477802800,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 884
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "199",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 799883477805900,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "45",
          "responseTime": 863
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
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
          "cpuUtilization": 0.9,
          "freeRAM": 2147483648,
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
          "lastUsage": 1548258587484
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
        "id": "204",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 799883477812400,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 261
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
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
              "id": "26"
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
          "lastUsage": 1548258587484
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
        "type": "applicationcommunication",
        "id": "357",
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
        "id": "241",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 799883477861800,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "19",
          "responseTime": 117
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
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
          "nodes": {
            "data": [
              {
                "type": "node",
                "id": "25"
              }
            ]
          },
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
        "id": "179",
        "attributes": {
          "extensionAttributes": {},
          "operationName": "getMethod21()",
          "totalRequests": 390,
          "averageResponseTime": 749
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
          "traceSteps": {
            "data": [
              {
                "type": "tracestep",
                "id": "180"
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
          "averageResponseTime": 97
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
          "timestamp": 799883477967400,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 19
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "243",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 799883477864300,
          "statementType": "Statement",
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 107
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
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
          "fullQualifiedName": "org.webshop.kernel.api",
          "belongingApplication": "b0f491f6-db0a-4629-85fc-8ea499ff175d"
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
          "timestamp": 799883477974300,
          "statementType": "Statement",
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 240
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          }
        }
      },
      {
        "type": "clazzcommunication",
        "id": "152",
        "attributes": {
          "extensionAttributes": {},
          "operationName": "getMethod44()",
          "totalRequests": 12000,
          "averageResponseTime": 97
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
          "traceSteps": {
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
          "timestamp": 799883477941900,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 319
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "280",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 799883477933900,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 687
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "305",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 799883477977000,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 365
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "213",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 799883477824600,
          "statementType": "Statement",
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 963
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          }
        }
      },
      {
        "type": "clazzcommunication",
        "id": "177",
        "attributes": {
          "extensionAttributes": {},
          "operationName": "getMethod3()",
          "totalRequests": 1200,
          "averageResponseTime": 382
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
          "traceSteps": {
            "data": [
              {
                "type": "tracestep",
                "id": "178"
              }
            ]
          }
        }
      },
      {
        "type": "databasequery",
        "id": "189",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 799883477749800,
          "statementType": "Statement",
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 768
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
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
          "cpuUtilization": 0.72,
          "freeRAM": 3221225472,
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
          "fullQualifiedName": "org.webshop.kernel.info",
          "belongingApplication": "2dd05c10-1c32-4dd3-83ae-196baadea2c1"
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
          "fullQualifiedName": "org.webshop.kernel.lifecycle",
          "belongingApplication": "bc7e84f4-e430-46ba-adfc-b5ff65e9f686"
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
              "id": "183"
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
          "fullQualifiedName": "org.webshop.kernel.impl.api",
          "belongingApplication": "7a210ef9-868a-4daa-9f43-96e7bb71c09f"
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
        "id": "248",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 799883477871100,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "59",
          "responseTime": 670
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
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
          "lastUsage": 1548258587484
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
          "operationName": "getMethod8()",
          "totalRequests": 150,
          "averageResponseTime": 858
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
          "traceSteps": {
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
          "timestamp": 799883478011700,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "26",
          "responseTime": 411
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
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
          "fullQualifiedName": "org.webshop",
          "belongingApplication": "a26d431b-6c55-45e2-9c96-5510b3eee9f7"
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
          "lastUsage": 1548258587484
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
        "type": "clazzcommunication",
        "id": "137",
        "attributes": {
          "extensionAttributes": {},
          "operationName": "getMethod20()",
          "totalRequests": 600,
          "averageResponseTime": 91
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
          "traceSteps": {
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
          "name": "Database Connector",
          "programmingLanguage": "JAVA",
          "lastUsage": 1548258587485
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "node",
              "id": "182"
            }
          },
          "components": {
            "data": [
              {
                "type": "component",
                "id": "185"
              }
            ]
          },
          "databaseQueries": {
            "data": [
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
              },
              {
                "type": "databasequery",
                "id": "338"
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
        "id": "251",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 799883477874600,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 766
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          }
        }
      },
      {
        "type": "applicationcommunication",
        "id": "369",
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
        "id": "370",
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
        "id": "255",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 799883477879800,
          "statementType": "Statement",
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 620
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "217",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 799883477830000,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "50",
          "responseTime": 832
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
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
              "id": "41"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "333",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 799883478020500,
          "statementType": "Statement",
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 489
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
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
          "lastUsage": 1548258587484
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
                "id": "351"
              },
              {
                "type": "applicationcommunication",
                "id": "351"
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
          "lastUsage": 1548258587484
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
        "type": "aggregatedclazzcommunication",
        "id": "130",
        "attributes": {
          "extensionAttributes": {},
          "totalRequests": 80,
          "averageResponseTime": 723
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
          "timestamp": 799883477795600,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "37",
          "responseTime": 45
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
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
          "cpuUtilization": 0.77,
          "freeRAM": 3221225472,
          "usedRAM": 3221225472
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
        "type": "timestamp",
        "id": "406",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 1548258607469,
          "totalRequests": 118080
        }
      },
      {
        "type": "component",
        "id": "71",
        "attributes": {
          "extensionAttributes": {},
          "name": "org",
          "fullQualifiedName": "org",
          "belongingApplication": "5c662cab-6c75-4d1d-9785-8d68736f5fc1"
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
          "fullQualifiedName": "org.webshop.kernel.extension",
          "belongingApplication": "d6657367-29ac-4fae-a9f1-f2f888019900"
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
          "timestamp": 799883477925800,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 939
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "275",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 799883477927100,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 202
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "220",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 799883477833800,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 521
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "192",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 799883477784100,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 40
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "278",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 799883477931600,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "47",
          "responseTime": 768
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "224",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 799883477839500,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "67",
          "responseTime": 24
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          }
        }
      },
      {
        "type": "clazzcommunication",
        "id": "166",
        "attributes": {
          "extensionAttributes": {},
          "operationName": "getMethod18()",
          "totalRequests": 2100,
          "averageResponseTime": 630
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
          "traceSteps": {
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
          "timestamp": 799883478026100,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "60",
          "responseTime": 69
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
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
                "id": "159"
              },
              {
                "type": "clazzcommunication",
                "id": "164"
              },
              {
                "type": "clazzcommunication",
                "id": "168"
              },
              {
                "type": "clazzcommunication",
                "id": "173"
              },
              {
                "type": "clazzcommunication",
                "id": "177"
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
          "timestamp": 799883478006000,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 573
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
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
          "cpuUtilization": 0.63,
          "freeRAM": 4294967296,
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
          "timestamp": 799883477932600,
          "statementType": "Statement",
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 260
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
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
          "timestamp": 799883477844300,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 880
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          }
        }
      },
      {
        "type": "applicationcommunication",
        "id": "353",
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
        "type": "node",
        "id": "43",
        "attributes": {
          "extensionAttributes": {},
          "ipAddress": "10.0.5.2",
          "cpuUtilization": 0.3,
          "freeRAM": 4294967296,
          "usedRAM": 4294967296
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
          "timestamp": 799883477911800,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 243
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
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
          "currentTraceDuration": 1794,
          "averageResponseTime": 545
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
          "averageResponseTime": 91
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
          "timestamp": 799883477946200,
          "statementType": "Statement",
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 851
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
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
          "averageResponseTime": 525
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
          "traceSteps": {
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
        "type": "tracestep",
        "id": "180",
        "attributes": {
          "extensionAttributes": {},
          "tracePosition": 6,
          "requests": 390,
          "currentTraceDuration": 4841,
          "averageResponseTime": 749
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
              "id": "179"
            }
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
          "lastUsage": 1548258587484
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
                "id": "158"
              },
              {
                "type": "aggregatedclazzcommunication",
                "id": "163"
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
          "timestamp": 799883477917300,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 637
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "289",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 799883477954600,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "45",
          "responseTime": 248
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
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
          "cpuUtilization": 0.19,
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
          "cpuUtilization": 0.35,
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
          "timestamp": 799883477878800,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "72",
          "responseTime": 729
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
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
          "lastUsage": 1548258587484
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
        "type": "nodegroup",
        "id": "28",
        "attributes": {
          "extensionAttributes": {},
          "name": "10.0.3.2"
        },
        "relationships": {
          "nodes": {
            "data": [
              {
                "type": "node",
                "id": "29"
              }
            ]
          },
          "parent": {
            "data": {
              "type": "system",
              "id": "23"
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
          "timestamp": 799883477957200,
          "statementType": "Statement",
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 948
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
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
          "lastUsage": 1548258587484
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
          "timestamp": 799883477921500,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "17",
          "responseTime": 313
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "207",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 799883477816700,
          "statementType": "Statement",
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 10
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
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
        "type": "databasequery",
        "id": "258",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 799883477895700,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 154
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "196",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 799883477801400,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 304
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "203",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 799883477811100,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 879
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
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
          "lastUsage": 1548258587484
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
        "type": "tracestep",
        "id": "155",
        "attributes": {
          "extensionAttributes": {},
          "tracePosition": 10,
          "requests": 3500,
          "currentTraceDuration": 5920,
          "averageResponseTime": 848
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
        "type": "aggregatedclazzcommunication",
        "id": "151",
        "attributes": {
          "extensionAttributes": {},
          "totalRequests": 300,
          "averageResponseTime": 858
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
          "timestamp": 799883477973300,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "91",
          "responseTime": 974
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "240",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 799883477860300,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 64
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          }
        }
      },
      {
        "type": "clazzcommunication",
        "id": "173",
        "attributes": {
          "extensionAttributes": {},
          "operationName": "getMethod44()",
          "totalRequests": 8200,
          "averageResponseTime": 545
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
          "traceSteps": {
            "data": [
              {
                "type": "tracestep",
                "id": "174"
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
          "timestamp": 799883477962900,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "99",
          "responseTime": 768
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
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
          "lastUsage": 1548258587484
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
        "type": "databasequery",
        "id": "244",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 799883477865500,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 905
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          }
        }
      },
      {
        "type": "aggregatedclazzcommunication",
        "id": "163",
        "attributes": {
          "extensionAttributes": {},
          "totalRequests": 35780,
          "averageResponseTime": 684.375
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
                "id": "161"
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
                "id": "179"
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
          "nodes": {
            "data": [
              {
                "type": "node",
                "id": "48"
              },
              {
                "type": "node",
                "id": "50"
              }
            ]
          },
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
        "type": "node",
        "id": "21",
        "attributes": {
          "extensionAttributes": {},
          "ipAddress": "10.0.2.2",
          "cpuUtilization": 0.98,
          "freeRAM": 4294967296,
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
          "timestamp": 799883477978300,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 493
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
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
          "lastUsage": 1548258587484
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
        "id": "299",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 799883477968800,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 424
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "281",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 799883477940300,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 470
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          }
        }
      },
      {
        "type": "tracestep",
        "id": "157",
        "attributes": {
          "extensionAttributes": {},
          "tracePosition": 11,
          "requests": 500,
          "currentTraceDuration": 9976,
          "averageResponseTime": 409
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
              "id": "156"
            }
          }
        }
      },
      {
        "type": "component",
        "id": "185",
        "attributes": {
          "extensionAttributes": {},
          "name": "org",
          "fullQualifiedName": "org",
          "belongingApplication": "1fcaf4ff-95de-4058-8c31-1da576428523"
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
          "averageResponseTime": 361
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
          "traceSteps": {
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
          "timestamp": 799883477907800,
          "statementType": "Statement",
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 764
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "211",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 799883477822100,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "75",
          "responseTime": 891
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "284",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 799883477945100,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "68",
          "responseTime": 532
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
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
          "timestamp": 799883477918600,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 243
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
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
          "fullQualifiedName": "org.webshop.kernel.logging",
          "belongingApplication": "f9d5f3da-822a-419c-b122-1da685f4fed2"
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
          "operationName": "getMethod47()",
          "totalRequests": 100,
          "averageResponseTime": 615
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
          "traceSteps": {
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
          "timestamp": 799883477986500,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 722
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
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
          "timestamp": 799883477852500,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 941
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "219",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 799883477832500,
          "statementType": "Statement",
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 337
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "195",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 799883477799700,
          "statementType": "Statement",
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 778
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
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
          "currentTraceDuration": 2639,
          "averageResponseTime": 630
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
          "timestamp": 799883477924500,
          "statementType": "Statement",
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 847
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "335",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 799883478023200,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 500
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
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
          "currentTraceDuration": 3312,
          "averageResponseTime": 583
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
        "type": "application",
        "id": "45",
        "attributes": {
          "extensionAttributes": {},
          "name": "PostgreSQL",
          "programmingLanguage": "JAVA",
          "lastUsage": 1548258587484
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
        "type": "component",
        "id": "114",
        "attributes": {
          "extensionAttributes": {},
          "name": "cache",
          "fullQualifiedName": "org.webshop.kernel.impl.cache",
          "belongingApplication": "64000377-4dab-4fbd-8c6f-681cab3e69d3"
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
          "timestamp": 799883477838000,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "100",
          "responseTime": 283
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "250",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 799883477873300,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 88
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "336",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 799883478024400,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 886
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "222",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 799883477836300,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 382
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          }
        }
      },
      {
        "type": "aggregatedclazzcommunication",
        "id": "158",
        "attributes": {
          "extensionAttributes": {},
          "totalRequests": 2800,
          "averageResponseTime": 385
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
                "id": "156"
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
          "lastUsage": 1548258587484
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
          "timestamp": 799883478008600,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 850
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "323",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 799883478007300,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 790
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
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
        "id": "212",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 799883477823600,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "73",
          "responseTime": 972
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
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
          "nodes": {
            "data": [
              {
                "type": "node",
                "id": "14"
              }
            ]
          },
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
          "timestamp": 799883477820500,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 425
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
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
          "timestamp": 799883477906500,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "94",
          "responseTime": 310
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
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
          "currentTraceDuration": 4188,
          "averageResponseTime": 826
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
              "id": "164"
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
          "lastUsage": 1548258587484
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
        "type": "databasequery",
        "id": "313",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 799883477988100,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "29",
          "responseTime": 528
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
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
          "name": "connector",
          "fullQualifiedName": "org.database.connector",
          "belongingApplication": "a32c1fa0-28ca-46d3-ba8c-39a19d0a6f9d"
        },
        "relationships": {
          "children": {
            "data": []
          },
          "clazzes": {
            "data": [
              {
                "type": "clazz",
                "id": "188"
              }
            ]
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
          "timestamp": 799883477854000,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "14",
          "responseTime": 827
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          }
        }
      },
      {
        "type": "tracestep",
        "id": "162",
        "attributes": {
          "extensionAttributes": {},
          "tracePosition": 13,
          "requests": 4200,
          "currentTraceDuration": 4130,
          "averageResponseTime": 225
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
              "id": "161"
            }
          }
        }
      },
      {
        "type": "clazzcommunication",
        "id": "140",
        "attributes": {
          "extensionAttributes": {},
          "operationName": "getMethod35()",
          "totalRequests": 4500,
          "averageResponseTime": 534
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
          "traceSteps": {
            "data": [
              {
                "type": "tracestep",
                "id": "141"
              },
              {
                "type": "tracestep",
                "id": "155"
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
          "timestamp": 799883477985200,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 896
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "233",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 799883477851200,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 457
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "200",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 799883477807500,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "19",
          "responseTime": 13
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          }
        }
      },
      {
        "type": "nodegroup",
        "id": "181",
        "attributes": {
          "extensionAttributes": {},
          "name": "10.0.0.8"
        },
        "relationships": {
          "nodes": {
            "data": [
              {
                "type": "node",
                "id": "182"
              }
            ]
          },
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
        "id": "218",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 799883477831500,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "99",
          "responseTime": 433
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
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
          "timestamp": 799883477923400,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "45",
          "responseTime": 693
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
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
          "cpuUtilization": 0.24,
          "freeRAM": 4294967296,
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
          "timestamp": 799883477818000,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 570
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
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
          "currentTraceDuration": 6865,
          "averageResponseTime": 896
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
          "timestamp": 799883477815600,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "65",
          "responseTime": 404
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
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
          "timestamp": 799883477894300,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 161
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
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
          "currentTraceDuration": 2994,
          "averageResponseTime": 723
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
              "id": "57"
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
        "type": "aggregatedclazzcommunication",
        "id": "142",
        "attributes": {
          "extensionAttributes": {},
          "totalRequests": 7000,
          "averageResponseTime": 401.5
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
          "fullQualifiedName": "org.webshop.tooling",
          "belongingApplication": "d0b7bbbb-825d-4b13-adf9-218908c1c152"
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
          "timestamp": 799883477971600,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "56",
          "responseTime": 245
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
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
          "nodes": {
            "data": [
              {
                "type": "node",
                "id": "36"
              }
            ]
          },
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
          "timestamp": 799883478002000,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "59",
          "responseTime": 401
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "259",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 799883477897400,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "93",
          "responseTime": 531
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
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
          "timestamp": 799883477982700,
          "statementType": "Statement",
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 383
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "296",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 799883477964400,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "76",
          "responseTime": 476
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
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
          "fullQualifiedName": "org.webshop.kernel.impl.persistence",
          "belongingApplication": "31f8b6bc-b2d9-402f-8637-f528c362f007"
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
          "timestamp": 799883477980100,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "69",
          "responseTime": 927
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
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
          "averageResponseTime": 477.75
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
                "id": "159"
              },
              {
                "type": "clazzcommunication",
                "id": "164"
              },
              {
                "type": "clazzcommunication",
                "id": "173"
              },
              {
                "type": "clazzcommunication",
                "id": "177"
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
          "timestamp": 799883477869600,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "68",
          "responseTime": 592
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          }
        }
      },
      {
        "type": "tracestep",
        "id": "160",
        "attributes": {
          "extensionAttributes": {},
          "tracePosition": 12,
          "requests": 4200,
          "currentTraceDuration": 2847,
          "averageResponseTime": 19
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
              "id": "159"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "245",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 799883477866900,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 368
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          }
        }
      },
      {
        "type": "applicationcommunication",
        "id": "367",
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
        "type": "application",
        "id": "57",
        "attributes": {
          "extensionAttributes": {},
          "name": "Workflow",
          "programmingLanguage": "JAVA",
          "lastUsage": 1548258587484
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
                "id": "346"
              },
              {
                "type": "applicationcommunication",
                "id": "347"
              },
              {
                "type": "applicationcommunication",
                "id": "350"
              },
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
                "id": "346"
              },
              {
                "type": "applicationcommunication",
                "id": "347"
              },
              {
                "type": "applicationcommunication",
                "id": "350"
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
        "type": "clazzcommunication",
        "id": "164",
        "attributes": {
          "extensionAttributes": {},
          "operationName": "getMethod16()",
          "totalRequests": 2100,
          "averageResponseTime": 826
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
          "traceSteps": {
            "data": [
              {
                "type": "tracestep",
                "id": "165"
              }
            ]
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
          "timestamp": 799883477916000,
          "statementType": "Statement",
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 158
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
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
                "id": "156"
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
          "cpuUtilization": 0.43,
          "freeRAM": 2147483648,
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
          "lastUsage": 1548258587484
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
          "lastUsage": 1548258587484
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
          "timestamp": 799883477983900,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 936
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
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
                "id": "161"
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
                "id": "179"
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
          "timestamp": 799883477947500,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 897
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "232",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 799883477849900,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 42
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
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
          "lastUsage": 1548258587484
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
        "id": "236",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 799883477855500,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "75",
          "responseTime": 587
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "294",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 799883477961300,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 562
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          }
        }
      },
      {
        "type": "tracestep",
        "id": "178",
        "attributes": {
          "extensionAttributes": {},
          "tracePosition": 5,
          "requests": 1200,
          "currentTraceDuration": 2082,
          "averageResponseTime": 382
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
              "id": "177"
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
          "nodes": {
            "data": [
              {
                "type": "node",
                "id": "18"
              }
            ]
          },
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
          "traceId": "2",
          "totalRequests": 24390,
          "totalTraceDuration": 4841,
          "averageResponseTime": 749
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
                "id": "178"
              },
              {
                "type": "tracestep",
                "id": "180"
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
          "lastUsage": 1548258587479
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
          "timestamp": 799883477808500,
          "statementType": "Statement",
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 886
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
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
          "nodes": {
            "data": [
              {
                "type": "node",
                "id": "21"
              }
            ]
          },
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
          "timestamp": 799883477956200,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "99",
          "responseTime": 905
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
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
          "timestamp": 799883477989600,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "30",
          "responseTime": 414
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "338",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 799883478027700,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "31",
          "responseTime": 371
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
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
          "timestamp": 799883477835000,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 861
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
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
          "fullQualifiedName": "org.webshop.kernel.impl",
          "belongingApplication": "5b0c244e-2bd2-4696-846f-1d8a84d0d2e3"
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
          "timestamp": 799883478021900,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 447
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
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
          "cpuUtilization": 0.73,
          "freeRAM": 2147483648,
          "usedRAM": 2147483648
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
        "type": "clazz",
        "id": "188",
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
              "id": "187"
            }
          },
          "clazzCommunications": {
            "data": []
          }
        }
      },
      {
        "type": "databasequery",
        "id": "321",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 799883478004600,
          "statementType": "Statement",
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 16
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "229",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 799883477846000,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "9",
          "responseTime": 11
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          }
        }
      },
      {
        "type": "clazzcommunication",
        "id": "175",
        "attributes": {
          "extensionAttributes": {},
          "operationName": "getMethod27()",
          "totalRequests": 11200,
          "averageResponseTime": 812
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
          "traceSteps": {
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
              "id": "183"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "325",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 799883478010200,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "82",
          "responseTime": 160
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
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
          "timestamp": 799883477840500,
          "statementType": "Statement",
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 615
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
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
          "nodes": {
            "data": [
              {
                "type": "node",
                "id": "69"
              }
            ]
          },
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
        "type": "databasequery",
        "id": "262",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 799883477909200,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 408
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
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
          "cpuUtilization": 0.78,
          "freeRAM": 1073741824,
          "usedRAM": 4294967296
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
          "timestamp": 799883477910500,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 352
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          }
        }
      },
      {
        "type": "application",
        "id": "183",
        "attributes": {
          "extensionAttributes": {},
          "name": "Cache",
          "programmingLanguage": "JAVA",
          "lastUsage": 1548258587485
        },
        "relationships": {
          "parent": {
            "data": {
              "type": "node",
              "id": "182"
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
        "id": "266",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 799883477915000,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "31",
          "responseTime": 48
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
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
          "lastUsage": 1548258587484
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
        "type": "applicationcommunication",
        "id": "360",
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
        "type": "nodegroup",
        "id": "10",
        "attributes": {
          "extensionAttributes": {},
          "name": "10.0.1.1"
        },
        "relationships": {
          "nodes": {
            "data": [
              {
                "type": "node",
                "id": "11"
              }
            ]
          },
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
        "type": "clazzcommunication",
        "id": "161",
        "attributes": {
          "extensionAttributes": {},
          "operationName": "getMethod45()",
          "totalRequests": 4200,
          "averageResponseTime": 225
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
          "traceSteps": {
            "data": [
              {
                "type": "tracestep",
                "id": "162"
              }
            ]
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
        "type": "component",
        "id": "95",
        "attributes": {
          "extensionAttributes": {},
          "name": "kernel",
          "fullQualifiedName": "org.webshop.kernel",
          "belongingApplication": "a5342d68-7680-4008-be27-85ddcc8c2f0f"
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
          "timestamp": 799883477960000,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 531
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "287",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 799883477949300,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 134
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
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
          "lastUsage": 1548258587484
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
          "currentTraceDuration": 4803,
          "averageResponseTime": 97
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
          "timestamp": 799883477875800,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 445
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          }
        }
      },
      {
        "type": "applicationcommunication",
        "id": "359",
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
        "type": "component",
        "id": "92",
        "attributes": {
          "extensionAttributes": {},
          "name": "unsafe",
          "fullQualifiedName": "org.webshop.unsafe",
          "belongingApplication": "fa648538-0739-4cb8-a282-61eeb36b5494"
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
          "currentTraceDuration": 8122,
          "averageResponseTime": 615
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
          "nodes": {
            "data": [
              {
                "type": "node",
                "id": "56"
              },
              {
                "type": "node",
                "id": "59"
              },
              {
                "type": "node",
                "id": "62"
              },
              {
                "type": "node",
                "id": "65"
              }
            ]
          },
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
          "currentTraceDuration": 5369,
          "averageResponseTime": 858
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
          "timestamp": 799883477798500,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "40",
          "responseTime": 229
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "256",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 799883477892800,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 63
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          }
        }
      },
      {
        "type": "clazzcommunication",
        "id": "168",
        "attributes": {
          "extensionAttributes": {},
          "operationName": "getMethod17()",
          "totalRequests": 2500,
          "averageResponseTime": 583
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
          "traceSteps": {
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
        "type": "aggregatedclazzcommunication",
        "id": "133",
        "attributes": {
          "extensionAttributes": {},
          "totalRequests": 1600,
          "averageResponseTime": 896
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
          "cpuUtilization": 0.38,
          "freeRAM": 3221225472,
          "usedRAM": 2147483648
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
          "currentTraceDuration": 7104,
          "averageResponseTime": 525
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
          "timestamp": 799883477804200,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 591
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "318",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 799883478000400,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 462
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "205",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 799883477814000,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "46",
          "responseTime": 164
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "300",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 799883477970100,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 621
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "242",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 799883477863300,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "24",
          "responseTime": 287
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
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
          "currentTraceDuration": 7536,
          "averageResponseTime": 361
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
          "timestamp": 799883477981700,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Tom B. Erichsen",
          "returnValue": "63",
          "responseTime": 172
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
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
          "lastUsage": 1548258587484
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
                "id": "353"
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
        "type": "component",
        "id": "73",
        "attributes": {
          "extensionAttributes": {},
          "name": "labeling",
          "fullQualifiedName": "org.webshop.labeling",
          "belongingApplication": "69e04bb0-26dd-4f6f-aa56-d992aff891da"
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
          "fullQualifiedName": "org.webshop.kernel.impl.annotations",
          "belongingApplication": "afac09ae-33e0-403d-a88a-4310e086d7be"
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
          "timestamp": 799883477965400,
          "statementType": "Statement",
          "sqlStatement": "CREATE TABLE IF NOT EXISTS `order` (oid integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, odate text NOT NULL, itemid integer NOT NULL);",
          "returnValue": "null",
          "responseTime": 643
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
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
          "nodes": {
            "data": [
              {
                "type": "node",
                "id": "7"
              }
            ]
          },
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
          "timestamp": 799883477943500,
          "statementType": "Statement",
          "sqlStatement": "SELECT * FROM `order` WHERE name = Carol K. Durham",
          "returnValue": "22",
          "responseTime": 88
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          }
        }
      },
      {
        "type": "node",
        "id": "182",
        "attributes": {
          "extensionAttributes": {},
          "ipAddress": "10.0.0.8",
          "cpuUtilization": 0.26,
          "freeRAM": 2147483648,
          "usedRAM": 2147483648
        },
        "relationships": {
          "applications": {
            "data": [
              {
                "type": "application",
                "id": "183"
              },
              {
                "type": "application",
                "id": "184"
              }
            ]
          },
          "parent": {
            "data": {
              "type": "nodegroup",
              "id": "181"
            }
          }
        }
      },
      {
        "type": "component",
        "id": "186",
        "attributes": {
          "extensionAttributes": {},
          "name": "database",
          "fullQualifiedName": "org.database",
          "belongingApplication": "86207c5c-e243-432a-b399-6def5c19e49d"
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
          "timestamp": 799883477975600,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 929
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "246",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 799883477868100,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0', 'Carol K. Durham', 'durham@uni-kiel.de', '2017-10-08', '1');",
          "returnValue": "null",
          "responseTime": 782
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
            }
          }
        }
      },
      {
        "type": "databasequery",
        "id": "209",
        "attributes": {
          "extensionAttributes": {},
          "timestamp": 799883477819300,
          "statementType": "Statement",
          "sqlStatement": "INSERT INTO `order` (oid, name, email, odate, itemid) VALUES('0'Tom B. Erichsen', 'erichsen@uni-kiel.de', '2017-11-16', '1');",
          "returnValue": "null",
          "responseTime": 640
        },
        "relationships": {
          "parentApplication": {
            "data": {
              "type": "application",
              "id": "184"
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
          "lastUsage": 1548258587484
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
          "averageResponseTime": 615
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
          "nodes": {
            "data": [
              {
                "type": "node",
                "id": "43"
              }
            ]
          },
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
