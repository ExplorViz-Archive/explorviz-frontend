import Ember from 'ember';
const {Service, observer, Evented} = Ember;

export default Service.extend(Evented, {

  latestLandscape: null,

  latestApplication: null,

  observer: observer("latestLandscape.timestamp", function(){
    this.trigger("updated", this.get("latestLandscape"));
  })  

});
