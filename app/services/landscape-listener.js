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
  highlighter: service('visualization/application/highlighter'),
  additionalData: service('additional-data'),
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
        Authorization: `Bearer ${access_token}`
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
        self.addDrawableCommunication();
        self.set('landscapeRepo.latestLandscape', landscapeRecord);
        self.get('landscapeRepo').triggerLatestLandscapeUpdate();
        self.get('timestampRepo').addTimestampToList(landscapeRecord.get('timestamp'));
        self.get('timestampRepo').triggerUpdated();
      }     
    }
  },

  // Computes the (possibly) bidirectional communication and saves 
  // it as a model. Later used to draw communication between clazzes
  addDrawableCommunication() {
    let store = this.get('store');

    let highlightedEntity = this.get('highlighter.highlightedEntity');

    // Reset communication highlighting due to new communication
    if (highlightedEntity && highlightedEntity.constructor.modelName === "drawableclazzcommunication"){
      this.get('highlighter').unhighlightAll();
       this.get('additionalData').removeComponent("visualization/page-setup/trace-selection");
    }

    let applications = store.peekAll('application');
    applications.forEach((application) => {
      // Reset relationship in application
      application.set('drawableClazzCommunications', []);

      let aggregatedComms = application.get('aggregatedClazzCommunications');
      aggregatedComms.forEach((aggregatedComm) => {

        let possibleExistingComm = checkForExistingComm(application, aggregatedComm);

        if (possibleExistingComm.isExisting) {
          updateExistingDrawableComm(possibleExistingComm.communication, aggregatedComm);
        } else {
          addNewDrawableCommunication(application, aggregatedComm);
        }
      });
    });

    function addNewDrawableCommunication(application, aggregatedComm){
      let drawableComm = store.createRecord('drawableclazzcommunication', {});
      drawableComm.set('requests', aggregatedComm.get('totalRequests'));
      drawableComm.set('averageResponseTime', aggregatedComm.get('averageResponseTime'));
      drawableComm.set('isBidirectional', false);

      // Set relationships
      drawableComm.set('sourceClazz', aggregatedComm.get('sourceClazz'));
      drawableComm.set('targetClazz', aggregatedComm.get('targetClazz'));
      drawableComm.get('aggregatedClazzCommunications').addObject(aggregatedComm);
      application.get('drawableClazzCommunications').addObject(drawableComm);
    }

    function updateExistingDrawableComm(existingCommunication, aggregatedComm){
      let existingRequests = existingCommunication.get('requests');
      let averageResponseTime =
        (existingCommunication.get('averageResponseTime') + aggregatedComm.get('averageResponseTime')) / 2;
      existingCommunication.set('requests', existingRequests + aggregatedComm.get('totalRequests'));
      existingCommunication.set('averageResponseTime', averageResponseTime);
      existingCommunication.set('isBidirectional', true);

      // Set relationship which does not yet exist
      existingCommunication.get('aggregatedClazzCommunications').addObject(aggregatedComm);
    }

    // Check for a given aggregated communication is there already exists a corresponding
    // drawable communication which would imply bidirectionality
    function checkForExistingComm(application, aggregatedComm){
      let drawableComms = application.get('drawableClazzCommunications');
      let possibleCommunication = {isExisting: false, communication: null};
      drawableComms.forEach( (drawableComm) => {
        // check if drawableCommunication with reversed communication is already created
        if (aggregatedComm.get('sourceClazz.id') == drawableComm.get('targetClazz.id') &&
            aggregatedComm.get('targetClazz.id') == drawableComm.get('sourceClazz.id')){
              possibleCommunication = {isExisting: true, communication: drawableComm};
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
