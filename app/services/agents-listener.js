import Service from '@ember/service';
import config from 'explorviz-frontend/config/environment';
import { inject as service } from "@ember/service";

/* global EventSourcePolyfill */
export default Service.extend({

  // https://github.com/segmentio/sse/blob/master/index.js

  content: null,
  session: service(),
  store: service(),
  agentRepo: service("repos/agent-repository"),
  es: null,

  initSSE() {

    this.set('content', []);

    const self = this;

    const url = config.APP.API_ROOT;
    const { access_token } = this.get('session.data.authenticated');

    // close former event source. Multiple (>= 6) instances cause the ember store to no longer work
    if(this.get('es')) {
      this.get('es').close();
    }

    // ATTENTION: This is a polyfill (see vendor folder)
    // Replace if original EventSource API allows HTTP-Headers
    this.set('es', new EventSourcePolyfill(`${url}/v1/agents/broadcast/`, {
      headers: {
        Authorization: `Bearer ${access_token.token}`
      }
    }));

    this.set('es.onmessage', function(e) {
      const agentListJson = JSON.parse(e.data);

      /*const stringTest = {
        "data": 
          { 
            "type": "agent",
            "id": "1",
            "attributes": {
              "ip": "127.0.0.1",
              "port": "8084",
              "last-discovery-time": 1539784755989,
              "is-hidden": false,
              "error-occured": false,
              "error-message": ""
            },
            "relationships": {
              "procezzes": {
                "data": [
                  {
                    "type": "procezz",
                    "id": "1-1"
                  }
                ]
              }
            }
          }
        ,
        "included": [
          {
            "type": "agent",
            "id": "1",
            "attributes": {
              "ip": "127.0.0.1",
              "port": "8084",
              "last-discovery-time": 1539784755989,
              "is-hidden": false,
              "error-occured": false,
              "error-message": ""
            },
            "relationships": {
              "procezzes": {
                "data": [
                  {
                    "type": "procezz",
                    "id": "1-1"
                  }
                ]
              }
            }
          },
          {
            "type": "procezz",
            "id": "1-1",
            "attributes": {
              "pid": 6649,
              "last-discovery-time": 1539784756164,
              "is-hidden": false,
              "error-occured": false,
              "error-message": "",
              "os-execution-command": "a"
            },
            "relationships": {
              "agent": {
                "data": {
                  "type": "agent",
                  "id": "1"
                }
              }
            }
          }
        ]
      };*/

      // ATTENTION: Mind the push operation, push != pushPayload in terms of 
      // serializer usage
      // https://github.com/emberjs/data/issues/3455
      self.get('store').pushPayload(agentListJson);

      const idArray = [];
      const agentRecordList = [];

      agentListJson["data"].forEach(function(agentJson) {
        idArray.push(agentJson["id"]);
      });

      idArray.forEach(function(id) {
        agentRecordList.push(self.get('store').peekRecord("agent", id));
      });

      self.set('agentRepo.agentList', agentRecordList);

      // TODO update similar to ... ?
      //self.get('agentRepo').triggerUpdated();
    });
  },

  subscribe(url, fn){

    const self = this;   

    let source = new EventSource(url);
    source.onmessage = function(e){
      fn(e.data);
    };
    source.onerror = function(e){
      if (source.readyState == EventSource.CLOSED) return;
      self.error(e);
    };
    return source.close.bind(source);
  }

});
