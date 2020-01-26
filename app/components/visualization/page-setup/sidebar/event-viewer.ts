import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import DS from 'ember-data';
import Event from 'explorviz-frontend/models/event';
import AdditionalData from 'explorviz-frontend/services/additional-data';
import LandscapeRepository from 'explorviz-frontend/services/repos/landscape-repository';

export default class EventViewer extends Component {
  @service('repos/landscape-repository')
  landscapeRepo!: LandscapeRepository;

  @service('additional-data')
  additionalData!: AdditionalData;

  @service('store')
  store!: DS.Store;

  @action
  eventClicked(event: Event) {
    // allow deselection of event
    if (event.get('isSelected')) {
      event.set('isSelected', false);
      return;
    }
    // deselect potentially selected event
    const eventsInStore = this.store.peekAll('event');
    eventsInStore.forEach((eventRecord) => {
      eventRecord.set('isSelected', false);
    });
    // mark new event as selected
    event.set('isSelected', true);
  }

  @action
  close() {
    this.additionalData.removeComponent('visualization/page-setup/sidebar/event-viewer');
  }
}
