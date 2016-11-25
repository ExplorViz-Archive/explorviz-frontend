import Ember from 'ember';

import Base from 'ember-simple-auth/authorizers/base';

// DataAdapterMixin in Adapters !

export default Base.extend({

  session: Ember.inject.service(),

  authorize: function(sessionData, block) {
    if (!Ember.isEmpty(sessionData.token)) {
      block('X-Authorization', 'Token: ' + sessionData.token);
    }
  }
});