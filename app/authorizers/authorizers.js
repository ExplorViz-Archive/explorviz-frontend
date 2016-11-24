import Ember from 'ember';

import Base from 'ember-simple-auth/authorizers/base';

// DataAdapterMixin in Adapters !

export default Base.extend({
    authorize: function(jqXHR, requestOptions) {
        var accessToken = this.get('session.content.secure.token');
        if (this.get('session.isAuthenticated') && !Ember.isEmpty(accessToken)) {
            jqXHR.setRequestHeader('Authorization', 'Bearer ' + accessToken);
        }
    }
});