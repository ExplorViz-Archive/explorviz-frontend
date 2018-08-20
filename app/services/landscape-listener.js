import Service from '@ember/service';
import config from 'explorviz-frontend/config/environment';
import { inject as service } from "@ember/service";

/* global EventSourcePolyfill */
export default Service.extend({

  // https://github.com/segmentio/sse/blob/master/index.js

  content: null,
  session: service(),

  initSSE() {

    this.set('content', []);

    const self = this;

    const url = config.APP.API_ROOT;
    const { access_token } = this.get('session.data.authenticated');

    // ATTENTION: This is a polyfill (see vendor folder)
    // Replace if original EventSource API allows HTTP-Headers
    const es = new EventSourcePolyfill(`${url}/v1/landscapes/broadcast/`, {
      headers: {
        Authorization: `Bearer ${access_token.token}`
      }
    });

    es.onmessage = function(e) {
      self.debug(e);
    }
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
