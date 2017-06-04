import Ember from 'ember';

export default Ember.Object.extend({

  highlightedEntity: null,
  application: null,

  highlight(entity) {

    const isHighlighted = entity.get('highlighted');   

    if (!isHighlighted) {
      this.get('application').unhighlight();
      entity.highlight();
      this.set('highlightedNode', entity);
      //TraceHighlighter::reset(false);
      //SceneDrawer::createObjectsFromApplication(app, true);
    } 
    else {
      this.unhighlight3DNodes();
    }

  },


  unhighlight3DNodes() {
    this.set('highlightedNode', null);
    
    
    if (this.get('application') !== null) {
      this.get('application').unhighlight();
      //SceneDrawer::createObjectsFromApplication(app, true)
    }
  }

});