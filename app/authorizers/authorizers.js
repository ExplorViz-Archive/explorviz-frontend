import { isEmpty } from '@ember/utils';
import Base from 'ember-simple-auth/authorizers/base';

/**
* Custom authoriziers that injects the token, that is given 
* by the backend and acquired by the authenticator after successful 
* authentication, in every future request. This token is necessary, since all 
* backend-resources (except the AuthenticationEndpoint) are secured by a 
* token-based authorization mechanism. 
* 
* @class Authorizer
* @extends OAuth2Bearer
*
* @module explorviz
* @submodule security
*/
export default Base.extend({

  authorize(data, block) {
    const accessToken = data['access_token'];

    if (!isEmpty(accessToken)) {
     
      block('Authorization', `Basic ${accessToken}`);
    }
  }

});