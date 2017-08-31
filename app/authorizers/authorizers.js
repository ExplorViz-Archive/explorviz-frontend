/**
This predefined (by Simple-Auth) authorizer injects the token, that is given 
by the backend and acquired by the authenticator after successful 
authentication, in every future request. This token is necessary, since all 
backend-resources (except the AuthenticationEndpoint) are secured by a 
token-based authorization mechanism. 

@class Authenticator
@extends ember-simple-auth/authenticators/base
*/

import OAuth2Bearer from 'ember-simple-auth/authorizers/oauth2-bearer';

export default OAuth2Bearer.extend();