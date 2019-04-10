import Service from '@ember/service';
import config from 'explorviz-frontend/config/environment';
import { inject as service } from "@ember/service";

/* global EventSourcePolyfill */
export default Service.extend({

  // https://github.com/segmentio/sse/blob/master/index.js

  session: service(),
  store: service(),
  agentRepo: service("repos/agent-repository"),

  content: null,
  es: null,

  initSSE() {
    this.set('content', []);

    const url = config.APP.API_ROOT;
    const { access_token } = this.get('session.data.authenticated');

    // Close former event source. Multiple (>= 6) instances cause the ember store to break
    if (this.get('es')) {
      this.get('es').close();
    }

    // ATTENTION: This is a polyfill (see vendor folder)
    // Replace if original EventSource API allows HTTP-Headers
    this.set('es', new EventSourcePolyfill(`${url}/v1/agents/broadcast/`, {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    }));

    this.set('es.onmessage', (event) => {
      const agentListJson = JSON.parse(event.data);

      // ATTENTION: Mind the push operation, push != pushPayload in terms of 
      // serializer usage
      // https://github.com/emberjs/data/issues/3455
      this.get('store').pushPayload(agentListJson);

      const idArray = [];
      const agentRecordList = [];

      agentListJson["data"].forEach((agentJson) => {
        idArray.push(agentJson["id"]);
      });

      idArray.forEach((id) => {
        agentRecordList.push(this.get('store').peekRecord("agent", id));
      });

      this.set('agentRepo.agentList', agentRecordList);

      // TODO update similar to ... ?
      // this.get('agentRepo').triggerUpdated();
    });
  },

  subscribe(url, fn) {
    let source = new EventSource(url);

    source.onmessage = (event) => {
      fn(event.data);
    };

    source.onerror = (event) => {
      if (source.readyState == EventSource.CLOSED) return;
      this.error(event);
    };

    return source.close.bind(source);
  }

});
