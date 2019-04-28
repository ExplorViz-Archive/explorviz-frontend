import Object from '@ember/object';

/**
 * The foundation is the grey all-encompassing tile. It shows
 * the name of the previously clicked application and presents
 * data on mouse hovering. It simply is a container for actual
 * application data.
 * 
 * @class foundation-builder
 */
export default Object.extend({

  foundationObj: null,

  createFoundation(emberApplication : any, store : any) {
    // Use big random ID to avoid conflicts with IDs of regular components
    const idRandom = Math.round(Math.random() * 10000 + 10000);
    const foundation = store.createRecord('component', {
      id: idRandom,
      synthetic: false,
      foundation: true,
      children: emberApplication.get('components'),
      clazzes: [],
      belongingApplication: emberApplication,
      opened: true,
      name: emberApplication.get('name'),
      fullQualifiedName: emberApplication.get('name'),
      positionX: 0,
      positionY: 0,
      positionZ: 0,
      width: 0,
      height: 0,
      depth: 0
    });

    emberApplication.get('components').forEach((component : any) => {
      component.set('parentComponent', foundation);
    });

    emberApplication.set('components', [foundation]);

    this.set('foundationObj', foundation);

    return foundation;
  },

  removeFoundation(store : any) : boolean{
    const foundation : any = this.get('foundationObj');
    if(!foundation) {
      return false;
    }

    const emberApplication = foundation.get('belongingApplication');

    emberApplication.set('components', foundation.get('children'));
    emberApplication.get('components').forEach((component : any) => {
      component.set('parentComponent', null);
    });

    store.unloadRecord(foundation);

    this.set('foundationObj', null);

    return true;
   }

});
