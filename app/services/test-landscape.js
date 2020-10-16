/* eslint-disable */

const landscape = {
  landscapeToken: 'fibonacci-sample-landscape',
  nodes: [{
    ipAddress: '172.29.240.1',
    hostName: 'lab-vr-rift',
    applications: [{
      name: 'fibonacci',
      language: 'java',
      pid: '10512@lab-vr-rift',
      packages: [{
        name: 'net',
        subPackages: [{
          name: 'explorviz',
          subPackages: [{
            name: 'sampleApplication',
            subPackages: [{
              name: 'application',
              subPackages: [{
                name: 'math',
                subPackages: [],
                classes: [{
                  name: 'Fibonacci',
                  methods: [{
                    name: 'calculate',
                    hashCode: 'f9a7f3499bdde1f5e9c6b0bf2f72d0b88876ae8a1db386b490537d8d4222faac',
                  }],
                }],
              }],
              classes: [{
                name: 'JavaExample',
                methods: [{
                  name: 'start',
                  hashCode: '4693bb8ab1d19fce13f85d7bd1f3970a97dc632a6138de669569c753aa33d9d5',
                }],
              }],
            }, {
              name: 'database',
              subPackages: [{
                name: 'helper',
                subPackages: [],
                classes: [{
                  name: 'SQLConnectionHandler',
                  methods: [{
                    name: 'createDatabase',
                    hashCode: '4e4ac7126b4bf6ed950fec5e49394e596a1112de8f6ad0fbc0a841cc460c6b29',
                  }, {
                    name: 'connect',
                    hashCode: '5a79e74c96739bfcaf7cc59366c55e4efa3e872db1ecea4c71188cc03879c361',
                  }, {
                    name: 'disconnect',
                    hashCode: 'e706261249644c75b552cca5accc6b76f6482355cf3c137b98206cdf9d024d98',
                  }],
                }, {
                  name: 'SQLStatementHandler',
                  methods: [{
                    name: 'executeStatementHandler',
                    hashCode: 'c8137cc86472f7e8a97c5b1f86a3b382528b94cf3d08e0c9d505d3c9247ca87d',
                  }],
                }],
              }],
              classes: [{
                name: 'JDBCExample',
                methods: [{
                  name: 'start',
                  hashCode: '346b1e3cd92a694744ef29dd2460d164884fe43dedcf606d3e2b00848d2ab247',
                }, {
                  name: 'runQueries',
                  hashCode: 'ed44aeeb51d7dbfd5aae6213266cd8c509748c098053c89115fada53625da313',
                }],
              }],
            }, {
              name: 'util',
              subPackages: [],
              classes: [{
                name: 'RandomNumberGenerator',
                methods: [{
                  name: 'getRandomNumber',
                  hashCode: 'c453374c08683a7f72d921dae3e65f24cac7ed5368b2634c91f3573933f12925',
                }],
              }],
            }],
            classes: [{
              name: 'Main$DatabaseTask',
              methods: [{
                name: 'run',
                hashCode: '2bbf30536b1828d1caa1e06d043943e4a44145652d709135c034cb21157f2bb3',
              }],
            }, {
              name: 'Main$ApplicationTask',
              methods: [{
                name: 'run',
                hashCode: 'ae2e6e50aca6dde4f408ea046772d3e42f4a747283d4616b879912f1ade07e66',
              }],
            }],
          }],
          classes: [],
        }],
        classes: [],
      }],
    }],
  }, {
    ipAddress: '100.100.100.100',
    hostName: 'test',
    applications: [{
      name: 'test',
      language: 'java',
      pid: '1337',
      packages: [{
        name: 'net1',
        subPackages: [{
          name: 'explorviz1',
          subPackages: [{
            name: 'sampleApplication1',
            subPackages: [],
            classes: [{
              name: 'test_class',
              methods: [{
                name: 'run',
                hashCode: 'test_trace_hash',
              }],
            }],
          }],
          classes: [],
        }],
        classes: [],
      }],
    }],
  }],
};

export default landscape;
