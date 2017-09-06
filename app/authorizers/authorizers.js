import OAuth2Bearer from 'ember-simple-auth/authorizers/oauth2-bearer';

/**
* This predefined (by Simple-Auth) authorizer injects the token, that is given 
* by the backend and acquired by the authenticator after successful 
* authentication, in every future request. This token is necessary, since all 
* backend-resources (except the AuthenticationEndpoint) are secured by a 
* token-based authorization mechanism. 
* 
* @class Authorizer
* @extends OAuth2Bearer
*/



export default OAuth2Bearer.extend();