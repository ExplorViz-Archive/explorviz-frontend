import Ember from 'ember';
import { calculateColorBrightness } from '../helpers/threejs-helpers';

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

    newHoverEntity.material.color = calculateColorBrightness(oldColor, 1.1);

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
        this.get('application').get('outgoingClazzCommunicationsAccumulated');

      communicationsAccumulated.forEach((commu) => {

        if ((commu.sourceClazz != null && commu.sourceClazz.get('fullQualifiedName') === highlightedNode.get('fullQualifiedName')) ||
          (commu.targetClazz != null && commu.targetClazz.get('fullQualifiedName') === highlightedNode.get('fullQualifiedName'))) {

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
