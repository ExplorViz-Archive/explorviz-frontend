import Service from '@ember/service';
import Evented from '@ember/object/evented';

export default class AdditionalData extends Service.extend(Evented) {

  showWindow:boolean = false;
  shownComponents:string[] = [];
  popupContent:any = null;

  addComponent(path:string) {
    if (!this.get('shownComponents').includes(path)) {
      this.get('shownComponents').unshift(path);
      this.notifyPropertyChange('shownComponents');
    }
  }

  removeComponent(path: string) {
    if (!this.get('shownComponents'))
      return;

    let index = this.get('shownComponents').indexOf(path);
    // Remove existing sidebar component
    if (index !== -1) {
      this.get('shownComponents').splice(index, 1);
      this.notifyPropertyChange('shownComponents');
    }

    // Close sidebar if it would be empty otherwise
    if (this.get('shownComponents').length === 0)
      this.emptyAndClose()
  }

  emptyAndClose() {
    this.close();
    if (this.get('shownComponents')) {
      this.get('shownComponents').length = 0;
    }
  }

  close() {
    this.set('showWindow', false);
    this.trigger('showWindow');
  }

  openAdditionalData() {
    this.set('showWindow', true);
    this.trigger('showWindow');
  }

  setPopupContent(content: any) {
    this.set('popupContent', content);
  }

  removePopup() {
    this.set('popupContent', null);
  }

}

declare module "@ember/service" {
  interface Registry {
    "additional-data": AdditionalData;
  }
}
