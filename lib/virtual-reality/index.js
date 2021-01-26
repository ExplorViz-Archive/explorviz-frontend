/* eslint-env node */
const mergeTrees = require('broccoli-merge-trees');
const Funnel = require('broccoli-funnel');

module.exports = {
  name: 'virtual-reality',

  isDevelopingAddon() {
    return true;
  },

  included() {
    return this._super.included.apply(this, arguments);
  },

  treeForPublic(tree) {
    const assetsTree = new Funnel('public');
    return mergeTrees([tree, assetsTree], {
      overwrite: true,
    });
  },
};
