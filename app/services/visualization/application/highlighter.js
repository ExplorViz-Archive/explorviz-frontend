import Service from '@ember/service';

export default Service.extend({

  highlightedEntity: null,
  application: null,

  highlight(entity) {

    const isHighlighted = entity.get('highlighted');

    if (!isHighlighted) {
      this.get('application').unhighlight();
      entity.highlight();
      this.set('highlightedEntity', entity);
    }
    else {
      this.unhighlightAll();
    }
  },

  unhighlightAll() {

    if(this.get('highlightedEntity')) {

      this.set('highlightedEntity', null);

      if (this.get('application') !== null) {
        this.get('application').unhighlight();
      }
    }
  },


  applyHighlighting() {

    const highlightedNode = this.get('highlightedEntity');

    if (highlightedNode != null) {
      const outgoingClazzCommunications =
        this.get('application').get('cumulatedClazzCommunications');

      const emberModelName = highlightedNode.constructor.modelName;

      let selectedClazzes = new Set();

      if (emberModelName === "clazz"){
        selectedClazzes.add(highlightedNode);
      } else if (emberModelName === "component"){
        highlightedNode.getContainedClazzes(selectedClazzes); //add all clazzes of component
      }


      outgoingClazzCommunications.forEach((clazzCommunication) => {
        let toBeHighlighted = false;
        // highlight all communication lines which have a selected clazz as an endpoint
        selectedClazzes.forEach((clazz) => {
          if ((clazzCommunication.sourceClazz != null && clazzCommunication.get('sourceClazz').get('fullQualifiedName') === clazz.get('fullQualifiedName')) ||
            (clazzCommunication.targetClazz != null && clazzCommunication.get('targetClazz').get('fullQualifiedName') === clazz.get('fullQualifiedName'))) {
              toBeHighlighted = true;
          }
        });
        if (toBeHighlighted){
          clazzCommunication.set("state", "NORMAL");
        } else {
          clazzCommunication.set("state", "TRANSPARENT");
        }
      });
    }
  }

});
