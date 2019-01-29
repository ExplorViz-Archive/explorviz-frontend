import Object from '@ember/object';
import { inject as service } from "@ember/service";

export default Object.extend({

  store: service(),
  highlighter: service('visualization/application/highlighter'),
  additionalData: service('additional-data'),
  renderingService: service(),

  init() {
  },

  /**
   *  Computes (possibly) bidirectional communication and saves 
   *  it as a model. Later used to draw communication between clazzes
   * 
   * @method addDrawableCommunication
   */
  addDrawableCommunication() {
    let store = this.get('store');

    let highlightedEntity = this.get('highlighter.highlightedEntity');

    // Reset communication highlighting due to new communication
    // TODO: persist highlighting if drawableCommunication is still present in new landscape
    if (highlightedEntity &&
      (highlightedEntity.constructor.modelName === "drawableclazzcommunication" || this.get('highlighter.isTrace'))) {
      this.get('highlighter').unhighlightAll();
      this.get('renderingService').redrawScene();
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

    function addNewDrawableCommunication(application, aggregatedComm) {
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

    function updateExistingDrawableComm(existingCommunication, aggregatedComm) {
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
    function checkForExistingComm(application, aggregatedComm) {
      let drawableComms = application.get('drawableClazzCommunications');
      let possibleCommunication = { isExisting: false, communication: null };
      drawableComms.forEach((drawableComm) => {
        // check if drawableCommunication with reversed communication is already created
        if (aggregatedComm.get('sourceClazz.id') == drawableComm.get('targetClazz.id') &&
          aggregatedComm.get('targetClazz.id') == drawableComm.get('sourceClazz.id')) {
          possibleCommunication = { isExisting: true, communication: drawableComm };
        }
      });
      return possibleCommunication;
    }
  },

});
