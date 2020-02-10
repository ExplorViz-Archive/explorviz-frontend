import { action, set } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import debugLogger from 'ember-debug-logger';

interface IUser {
  identification: string;
  password: string;
}

/**
 * TODO
 *
 * @class Login-Form-Component
 * @extends Ember.Component
 *
 * @module explorviz
 * @submodule page
 */
export default class LoginForm extends Component {
  debug = debugLogger('LoginForm');

  @service('session') session!: any;

  @service('store') store!: any;

  @tracked
  identification: string = '';

  @tracked
  password: string = '';

  /**
   * TODO
   *
   * @method authenticate
   */
  @action
  authenticate(event: MouseEvent) {
    event.preventDefault();

    const self = this;

    const user: IUser = {
      identification: this.identification,
      password: this.password,
    };

    // reset (possible) old lables
    try {
      set(this.session.session.content, 'message', '');
      set(this.session.session.content, 'errorMessage', '');
    } catch (exception) {
      this.debug('Error when resetting login page labels', exception);
    }


    if (!LoginForm.checkForValidInput(user)) {
      const errorMessage = 'Enter valid credentials.';
      set(this.session.session.content, 'errorMessage', errorMessage);
      return;
    }

    function failure(reason: any) {
      let errorMessage = 'No connection to backend';

      // NULL if no connection to backend
      if (reason.payload) {
        if (reason.payload.errors && reason.payload.errors[0]) {
          const errorPayload = reason.payload.errors[0];

          if (errorPayload && errorPayload.status && errorPayload.title && errorPayload.detail) {
            self.debug(errorPayload.detail);

            errorMessage = `${errorPayload.status}: ${errorPayload.title} / ${errorPayload.detail}`;
          }
        }
      }
      set(self.session.session.content, 'errorMessage', errorMessage);
    }

    this.session.authenticate('authenticator:authenticator', user).then(undefined, failure);
  }

  static checkForValidInput(user: IUser) {
    const { identification: username, password } = user;

    const usernameValid = username !== '' && username !== null
      && username !== undefined;

    const passwordValid = password !== '' && password !== null
      && password !== undefined;

    return usernameValid && passwordValid;
  }
}
