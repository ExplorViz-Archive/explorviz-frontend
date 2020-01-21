import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import LandscapeRepository from 'explorviz-frontend/services/repos/landscape-repository';
import AdditionalData from 'explorviz-frontend/services/additional-data';
import DS from 'ember-data';
import { action } from '@ember/object';
import Event from 'explorviz-frontend/models/event';

export default class EventViewer extends Component {

  @service('repos/landscape-repository')
  landscapeRepo!: LandscapeRepository;

  @service('additional-data')
  additionalData!: AdditionalData;

  @service('store')
  store!: DS.Store;

  @action
  eventClicked(event:Event){
    // allow deselection of event
    if (event.get('isSelected')){
      event.set('isSelected', false);
      return;
    }
    // deselect potentially selected event
    let events = this.store.peekAll('event');
    events.forEach((event) => {
      event.set('isSelected', false);
    });
    // mark new event as selected
    event.set('isSelected', true);
  }

  @action
  close() {
    this.additionalData.removeComponent('visualization/page-setup/sidebar/event-viewer');
  }

}

