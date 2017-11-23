import Service from '@ember/service';
import { inject as service } from "@ember/service";


export default Service.extend({

  landscapeRepo: service('repos/landscape-repository'),
  highlightedEntity: null,

  highlight(entity) {

    const isHighlighted = entity.get('highlighted');   

    if (!isHighlighted) {
      this.get('landscapeRepo.latestApplication').unhighlight();
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
      
      if (this.get('landscapeRepo.latestApplication') !== null) {
        this.get('landscapeRepo.latestApplication').unhighlight();
      }
    }
  },


  applyHighlighting() {

    const highlightedNode = this.get('highlightedEntity');

    if (highlightedNode != null) {

      const communicationsAccumulated = 
        this.get('landscapeRepo.latestApplication')
          .get('communicationsAccumulated');

      communicationsAccumulated.forEach((commu) => {
      
        if ((commu.source != null && commu.source.get('fullQualifiedName') === 
          highlightedNode.get('fullQualifiedName')) ||
          (commu.target != null && commu.target.get('fullQualifiedName') === 
            highlightedNode.get('fullQualifiedName'))) {

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
