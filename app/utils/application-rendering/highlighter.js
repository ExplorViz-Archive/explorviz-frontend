import Ember from 'ember';

export default Ember.Object.extend({

  highlightedEntity: null,
  application: null,

  highlight(entity) {

    const isHighlighted = entity.get('highlighted');   

    if (!isHighlighted) {
      this.get('application').unhighlight();
      entity.highlight();
      this.set('highlightedEntity', entity);
      //TraceHighlighter::reset(false);
      //SceneDrawer::createObjectsFromApplication(app, true);
    } 
    else {
      this.unhighlight3DNodes();
    }

  },


  unhighlight3DNodes() {

    if(this.get('highlightedEntity')) {

      this.set('highlightedEntity', null);
      
      
      if (this.get('application') !== null) {
        this.get('application').unhighlight();
        //SceneDrawer::createObjectsFromApplication(app, true)
      }
    }
  },


  applyHighlighting() {

    const highlightedNode = this.get('highlightedEntity');

    if (highlightedNode != null) {

      const communicationsAccumulated = 
        this.get('application').get('communicationsAccumulated');

      communicationsAccumulated.forEach((commu) => {
      
        if ((commu.source != null && commu.source.get('fullQualifiedName') === highlightedNode.get('fullQualifiedName')) ||
          (commu.target != null && commu.target.get('fullQualifiedName') === highlightedNode.get('fullQualifiedName'))) {

          //let outgoing = determineOutgoing(commu);
          //let incoming = determineIncoming(commu);

          //if (incoming && outgoing) {
            commu.state = "SHOW_DIRECTION_IN_AND_OUT";
          //} else if (incoming) {
          //  commu.state = "SHOW_DIRECTION_IN"
          //} else if (outgoing) {
         //   commu.state = "SHOW_DIRECTION_OUT";
         // }
        } else {
          commu.state = "TRANSPARENT";
        }
      });

    }
  }

});