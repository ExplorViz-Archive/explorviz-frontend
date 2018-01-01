import Ember from 'ember';

export default Ember.Object.extend({

  highlightedEntity: null,
  application: null,
  hoveredEntityColorObj: null,

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


  resetHoverEffect() {
    if(this.get('hoveredEntityColorObj')) {

      this.get('hoveredEntityColorObj').entity.material.color = 
        this.get('hoveredEntityColorObj').color;

      this.set('hoveredEntityColorObj', null);

    }
  },


  handleHoverEffect(raycastTarget) {

    // no raycastTarget, do nothing and return
    if(!raycastTarget) {
      this.resetHoverEffect();
        return;
    }

    const newHoverEntity = raycastTarget.object;

    // same object, do nothing and return
    if(this.get('hoveredEntityColorObj') && 
      this.get('hoveredEntityColorObj').entity === newHoverEntity) {
        return;
    }

    this.resetHoverEffect();

    const oldColor = newHoverEntity.material.color;

    this.set('hoveredEntityColorObj', {
      entity: newHoverEntity,
      color: new THREE.Color().copy(oldColor)
    });

    newHoverEntity.material.color = this.calculateLighterColor(oldColor);
    
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
  },


  /*
   *  The method is used to calculate a 35 percent 
   *  lighter threeJS color
   */
  calculateLighterColor(threeColor){

    const r = Math.floor(threeColor.r * 1.12 * 255);
    const g = Math.floor(threeColor.g * 1.12 * 255);
    const b = Math.floor(threeColor.b * 1.12 * 255);

    return new THREE.Color("rgb("+r+", "+g+", "+b+")");
  }

});