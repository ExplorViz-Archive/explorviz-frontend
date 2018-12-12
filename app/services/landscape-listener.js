import Service from '@ember/service';
import config from 'explorviz-frontend/config/environment';
import { inject as service } from "@ember/service";

/* global EventSourcePolyfill */
export default Service.extend({

  // https://github.com/segmentio/sse/blob/master/index.js

  content: null,
  session: service(),
  store: service(),
  timestampRepo: service("repos/timestamp-repository"),
  landscapeRepo: service("repos/landscape-repository"),
  latestJsonLandscape: null,

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
      const jsonLandscape = JSON.parse(e.data);

      if (jsonLandscape && jsonLandscape.hasOwnProperty("data") &&
        JSON.stringify(jsonLandscape) !== JSON.stringify(self.get('latestJsonLandscape'))) {
        // console.log("JSON: " + JSON.stringify(jsonLandscape));

        // ATTENTION: Mind the push operation, push != pushPayload in terms of 
        // serializer usage
        // https://github.com/emberjs/data/issues/3455
        self.set('latestJsonLandscape', jsonLandscape);
        const landscapeRecord = self.get('store').push(jsonLandscape);
        self.addCumulatedCommunication();
        self.set('landscapeRepo.latestLandscape', landscapeRecord);
        self.get('landscapeRepo').triggerLatestLandscapeUpdate();
        self.get('timestampRepo').addTimestampToList(landscapeRecord.get('timestamp'));
        self.get('timestampRepo').triggerUpdated();
      }     
    }
  },

  // Computes the (possibly) bidirectional communication and saves 
  // it as a model. Later used to draw communication between clazzes
  addCumulatedCommunication() {
    let store = this.get('store');

    // Remove outdated communication
    // TODO: Reuse old data to persist models for drawing
    store.unloadAll('cumulatedclazzcommunication');

    let applications = store.peekAll('application');
    applications.forEach((application) => {
      // Reset relationship in application
      application.set('cumulatedClazzCommunications', []);


      let aggregatedComms = application.get('aggregatedClazzCommunications');
      aggregatedComms.forEach((aggregatedComm) => {

        let possibleExistingComm = checkBidirectionality(application, aggregatedComm);

        if (possibleExistingComm.isBidirectional) {
          let existingCommunication = possibleExistingComm.communication;
          let existingRequests = existingCommunication.get('requests');
          let averageResponseTime =
            (existingCommunication.get('averageResponseTime') + aggregatedComm.get('averageResponseTime')) / 2;
          existingCommunication.set('requests', existingRequests + aggregatedComm.get('totalRequests'));
          existingCommunication.set('averageResponseTime', averageResponseTime);
          existingCommunication.set('isBidirectional', true);

          // Set relationship which does not yet exist
          existingCommunication.get('aggregatedClazzCommunications').addObject(aggregatedComm);
        } else {
          let cumulatedComm = store.createRecord('cumulatedclazzcommunication', {});
          cumulatedComm.set('requests', aggregatedComm.get('totalRequests'));
          cumulatedComm.set('averageResponseTime', aggregatedComm.get('averageResponseTime'));
          cumulatedComm.set('isBidirectional', false);

          // Set relationships
          cumulatedComm.set('sourceClazz', aggregatedComm.get('sourceClazz'));
          cumulatedComm.set('targetClazz', aggregatedComm.get('targetClazz'));
          cumulatedComm.get('aggregatedClazzCommunications').addObject(aggregatedComm);
          application.get('cumulatedClazzCommunications').addObject(cumulatedComm);
        }
      });
    });

    // Check for a given aggregated communication is there already exists a corresponding
    // cumulated communication which would imply bidirectionality
    function checkBidirectionality(application, aggregatedComm){
      let cumulatedComms = application.get('cumulatedClazzCommunications');
      let possibleCommunication = {isBidirectional: false, communication: null};
      cumulatedComms.forEach( (cumulatedComm) => {
        // check if cumulatedCommunication with reversed communication is already created
        if (aggregatedComm.get('sourceClazz.id') == cumulatedComm.get('targetClazz.id') &&
            aggregatedComm.get('targetClazz.id') == cumulatedComm.get('sourceClazz.id')){
              possibleCommunication = {isBidirectional: true, communication: cumulatedComm};
        }
      });
      return possibleCommunication;
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
