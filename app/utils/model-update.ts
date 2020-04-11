import Application from 'explorviz-frontend/models/application';
import DS from 'ember-data';
import AggregatedClazzCommunication from 'explorviz-frontend/models/aggregatedclazzcommunication';
import DrawableClazzCommunication from 'explorviz-frontend/models/drawableclazzcommunication';

/**
 * Computes (possibly) bidirectional drawable communication from
 * aggregated communication and adds it to the store.
 *
 * @param store Used to access applications etc.
 */
export default function addDrawableCommunication(store: DS.Store) {
  /**
   * Generates a unique string ID
   */
  //  See: https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
  function uuidv4() {
    /* eslint-disable */
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    /* eslint-enable */
  }

  /**
   * Takes a aggregated communication and computes a new drawable communication using it.
   *
   * @param application Application to which the communication belongs
   * @param aggregatedComm Aggregated communication which is used to compute drawable communication
   */
  function addNewDrawableCommunication(application: Application,
    aggregatedComm: AggregatedClazzCommunication) {
    const UNIQUE_ID = uuidv4();

    // Create record of drawable communication
    const drawableComm = store.createRecord('drawableclazzcommunication', {
      id: UNIQUE_ID,
      requests: aggregatedComm.get('totalRequests'),
      averageResponseTime: aggregatedComm.get('averageResponseTime'),
      isBidirectional: false,
      sourceClazz: aggregatedComm.get('sourceClazz'),
      targetClazz: aggregatedComm.get('targetClazz'),
    });

    // Set relationships for new record
    drawableComm.set('sourceClazz', aggregatedComm.get('sourceClazz'));
    drawableComm.set('targetClazz', aggregatedComm.get('targetClazz'));
    drawableComm.get('aggregatedClazzCommunications').addObject(aggregatedComm);
    application.get('drawableClazzCommunications').addObject(drawableComm);
  }

  /**
   * Takes an existing unidirectional drawable communication and adds a aggregated communication
   * to it such that it becomes bidirectional.
   *
   * @param existingCommunication Drawable communication which is unidirectional up to now
   * @param aggregatedComm Newly discovered aggregated communication
   */
  function updateExistingDrawableComm(existingCommunication: DrawableClazzCommunication,
    aggregatedComm: AggregatedClazzCommunication) {
    const existingRequests = existingCommunication.get('requests');
    const newAverageResponseTime = (existingCommunication.get('averageResponseTime')
      + aggregatedComm.get('averageResponseTime')) / 2;

    // Adapt properties of existing drawable communication
    existingCommunication.set('requests', existingRequests + aggregatedComm.get('totalRequests'));
    existingCommunication.set('averageResponseTime', newAverageResponseTime);
    existingCommunication.set('isBidirectional', true);

    // Add new aggregated communication to drawable communication
    existingCommunication.get('aggregatedClazzCommunications').addObject(aggregatedComm);
  }

  /**
   * Checks for a given aggregated communication if there already exists a corresponding
   * drawable communication which would imply bidirectionality.
   *
   * @param application Application which is to be checked for communication
   * @param aggregatedComm
   */
  function checkForExistingComm(application: Application,
    aggregatedComm: AggregatedClazzCommunication) {
    const drawableComms = application.get('drawableClazzCommunications');
    let possibleCommunication: DrawableClazzCommunication | undefined;

    drawableComms.forEach((drawableComm) => {
      // Check if drawableCommunication (with reversed communication) is already created
      if (aggregatedComm.sourceClazz.get('id') === drawableComm.targetClazz.get('id')
        && aggregatedComm.targetClazz.get('id') === drawableComm.sourceClazz.get('id')) {
        possibleCommunication = drawableComm;
      }
    });

    return possibleCommunication;
  }

  // Remove outdated communication from store
  store.unloadAll('drawableclazzcommunication');

  const applications = store.peekAll('application');

  applications.forEach((application: Application) => {
    // Reset relationship in application
    application.set('drawableClazzCommunications', []);

    const aggregatedComms = application.get('aggregatedClazzCommunications');
    aggregatedComms.forEach((aggregatedComm) => {
      const possibleExistingComm = checkForExistingComm(application, aggregatedComm);

      if (possibleExistingComm) {
        updateExistingDrawableComm(possibleExistingComm, aggregatedComm);
      } else {
        addNewDrawableCommunication(application, aggregatedComm);
      }
    });
  });
}
