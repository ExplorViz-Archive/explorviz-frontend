/* eslint-env node */
const mergeTrees = require('broccoli-merge-trees');
const Funnel = require('broccoli-funnel');

module.exports = {
  name: 'virtual-reality',

  isDevelopingAddon() {
    return true;
  },

  treeForPublic(tree) {
    const assetsTree = new Funnel('public');
    return mergeTrees([tree, assetsTree], {
      overwrite: true,
    });
  },

  included(app) {
    // eslint-disable-next-line
    this._super.included.apply(this, arguments);

    app.import('vendor/virtual-reality/VRButton.js');
  },
};
