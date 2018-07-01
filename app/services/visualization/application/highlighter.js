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

      outgoingClazzCommunications.forEach((clazzCommunication) => {
        if ((clazzCommunication.sourceClazz != null && clazzCommunication.get('sourceClazz').get('fullQualifiedName') === highlightedNode.get('fullQualifiedName')) ||
          (clazzCommunication.targetClazz != null && clazzCommunication.get('targetClazz').get('fullQualifiedName') === highlightedNode.get('fullQualifiedName'))) {
            clazzCommunication.set("state", "NORMAL");
        } else {
          clazzCommunication.set("state", "TRANSPARENT");
        }
      });

    }
  }

});
