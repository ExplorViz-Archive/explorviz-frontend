/* eslint-env node */

module.exports = {
  name: 'virtual-reality',

  isDevelopingAddon() {
    return true;
  },

  included(app) {
    this._super.included.apply(this, arguments);

    app.import('vendor/virtual-reality/VRButton.js');
  },
};
