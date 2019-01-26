import Service from '@ember/service';
import Evented from '@ember/object/evented';

export default Service.extend(Evented, {

  showWindow: false,
  shownComponents: null,
  popupContent: null,

  addComponent(path) {
    if (this.get('shownComponents') == null) {
      this.set('shownComponents', []);
    }
    if (!this.get('shownComponents').includes(path)) {
      this.get('shownComponents').push(path);
      this.notifyPropertyChange('shownComponents');
    }
  },

  removeComponent(path) {
    if (!this.get('shownComponents'))
      return;

    var index = this.get('shownComponents').indexOf(path);
    if (index !== -1)
      this.get('shownComponents').splice(index, 1);

    // close everything when no components are left
    if (this.get('shownComponents.length') == 0)
      this.emptyAndClose()
  },

  emptyAndClose() {
    this.close();
    if (this.get('shownComponents')) {
      this.set('shownComponents.length', 0);
    }
  },

  close() {
    this.set('showWindow', false);
    this.trigger('showWindow');
  },

  openAdditionalData() {
    this.set('showWindow', true);
    this.trigger('showWindow');
  },

  setPopupContent(content) {
    this.set('popupContent', content);
  },

  removePopup() {
    this.set('popupContent', null);
  }

});
