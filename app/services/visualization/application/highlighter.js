import Service from '@ember/service';
import { inject as service } from "@ember/service";

export default Service.extend({

  highlightedEntity: null,
  isTrace: false,
  traceId: null,
  application: null,
  store: service(),
  renderingService: service(),

  highlight(entity) {

    const isHighlighted = entity.get('highlighted');
    
    if (!isHighlighted) {
      this.unhighlightAll();
      entity.highlight();
      this.set('highlightedEntity', entity);
    }
    else {
      this.unhighlightAll();
    }
  },

  highlightTrace(traceId){

    // precondition: part of trace communication is highlighted
    if( !this.get('highlightedEntity.highlighted') ||
     this.get('highlightedEntity.constructor.modelName') !== 'drawableclazzcommunication'){
         this.set('isTrace', false);
         this.set('traceId', null);
    } else {
      this.set('isTrace', true);
      this.set('traceId', traceId);
    }
  },

  unhighlightAll() {

    if(this.get('highlightedEntity')) {

      this.set('highlightedEntity', null);
      this.set('isTrace', false);
      this.set('traceId', null);

      if (this.get('application') !== null) {
        this.get('application').unhighlight();
      }
    }
  },

  applyHighlighting() {
    const self = this;

    const highlightedEntity = this.get('highlightedEntity');

    if (highlightedEntity === null) {
      return;
    }

    const emberModelName = highlightedEntity.constructor.modelName; // e.g. "clazz" or "component"

    // unhighlight entity if it is not visible
    if ((emberModelName === "clazz" || emberModelName === "component" || emberModelName === "drawableclazzcommunication") &&
      !highlightedEntity.isVisible()) {
        this.unhighlightAll();
        this.get('renderingService').redrawScene();
        return;
    }

    // shall contain all clazzes which the user directly or indirectly highlighted
    let selectedClazzes = new Set();
    computeSelectedClazzes(highlightedEntity, selectedClazzes);

    // shall contain all clazzes which the user highlighted or which communicate with a highlighted clazz
    let communicatingClazzes = new Set(selectedClazzes);

    // set states (either "NORMAL" or "TRANSPARENT") of communcation for highlighting
    if (emberModelName === "component" || emberModelName === "clazz"){
      this.applyCommunicationHighlighting(selectedClazzes, communicatingClazzes);
    } else if (emberModelName === "drawableclazzcommunication"){ 
      // highlight communication lines
      this.get('application.drawableClazzCommunications').forEach((communication) => {
        if (communicatingClazzes.has(communication.get('sourceClazz')) && 
            communicatingClazzes.has(communication.get('targetClazz'))){
              communication.highlight()

              // every clazz which is part of trace should be visible
              if(this.get('isTrace')) {
                communication.belongsTo('sourceClazz').value().openParents();
                communication.belongsTo('targetClazz').value().openParents();
              }
        }        
        else {
          communication.unhighlight();
        }
      });
    }


    // iterate recursively over all application entities and update states
    this.get('application.components').forEach((component) => {
      this.updateEntityStates(component, communicatingClazzes);
    });

    function computeSelectedClazzes(highlightedEntity, selectedClazzes) {
      // add only clazz itself if clazz is highlighted
      if (emberModelName === "clazz") {
        selectedClazzes.add(highlightedEntity);
        // add all clazzes of component if component is highlighted
      } else if (emberModelName === "component") {
        highlightedEntity.getContainedClazzes(selectedClazzes);
        // add the two adjacent clazzes if drawable communication is highlighted
      } else if (emberModelName === "drawableclazzcommunication" && !self.get('isTrace')) { 
        selectedClazzes.add(highlightedEntity.get('sourceClazz'));
        selectedClazzes.add(highlightedEntity.get('targetClazz'));
        // add all adjacent clazzes if trace is highlighted
      } else if (emberModelName === "drawableclazzcommunication" && self.get('isTrace')) {
        self.get('application.drawableClazzCommunications').forEach((communication) => {
          let communicationTraces = communication.getContainedTraces();
          let communicationTraceIds = Array.from(communicationTraces).map(trace => trace.get('traceId'));
          if (communicationTraceIds.includes(self.get('traceId'))) {
            selectedClazzes.add(communication.get('sourceClazz'));
            selectedClazzes.add(communication.get('targetClazz'));
          }
        });
      }
    }
  },

  /**
   * Marks communication between clazzes as NORMAL or TRANSPARENT for highlighting, only used if a component or clazz is highlighted
   * @param {*} selectedClazzes      Clazzes which are (indirectly) highlighted
   * @param {*} communicatingClazzes Clazzes which communicate with selectedClazzes (including selectedClazzes itself)
   */
  applyCommunicationHighlighting(selectedClazzes, communicatingClazzes){

    const clazzCommunications =
    this.get('application').get('drawableClazzCommunications');

    clazzCommunications.forEach((clazzCommunication) => {
      let toBeHighlighted = false;

      // highlight all communication lines which have a selected clazz as an endpoint
      selectedClazzes.forEach((clazz) => {
        if (clazzCommunication.sourceClazz != null && clazzCommunication.get('sourceClazz').get('fullQualifiedName') === clazz.get('fullQualifiedName')){
          communicatingClazzes.add(clazzCommunication.get('targetClazz'));
          toBeHighlighted = true;
        } else if(clazzCommunication.targetClazz != null && clazzCommunication.get('targetClazz').get('fullQualifiedName') === clazz.get('fullQualifiedName')){
          communicatingClazzes.add(clazzCommunication.get('sourceClazz'));
          toBeHighlighted = true;
        }
      });

      // mark clazzes as transparent which do not communicate with a highlighted entity
      if (toBeHighlighted){
        clazzCommunication.set("state", "NORMAL");
      } else {
        clazzCommunication.set("state", "TRANSPARENT");
      }
    });
  },

    /**
   * Sets all (nested) entities (components & clazzes) of a component either to TRANSPARENT or NORMAL for highlighting
   * @param {component} component             Component which entities shall be updated
   * @param {Set}       communicatingClazzes  Contains all clazzes which are involved in communication with highlighted entity
   * 
   */
  updateEntityStates(component, communicatingClazzes){

    let isPartOfHighlighting = false;
    let componentClazzes = new Set();

    component.getContainedClazzes(componentClazzes);

    // check if component contains a class which is part of highlighting
    communicatingClazzes.forEach((clazz) => {
      componentClazzes.forEach((componentClazz) => {
        if (clazz.get('fullQualifiedName') === componentClazz.get('fullQualifiedName')){
          isPartOfHighlighting = true;
        }
      });
    });

    // mark component as transparent if no contained clazz communicates with a highlighted clazz
    if (isPartOfHighlighting){
      component.set('state', 'NORMAL');
    } else {
      component.set('state', 'TRANSPARENT');
    }

    // mark clazzes as transparent if they are not involved in communication with highlighted clazzes
    component.get('clazzes').forEach((clazz) => {
      let isCommunicatingClazz = false;
      communicatingClazzes.forEach((componentClazz) => {
        if (clazz.get('fullQualifiedName') === componentClazz.get('fullQualifiedName')){
          isCommunicatingClazz = true;
        }
      });
      if (isCommunicatingClazz){
        clazz.set('state', "NORMAL");
      } else {
        clazz.set('state', "TRANSPARENT");
      }
    });

    // check state also for underlying components (and clazzes)
    component.get('children').forEach((child) => {
      this.updateEntityStates(child, communicatingClazzes);
    });
  },

});
