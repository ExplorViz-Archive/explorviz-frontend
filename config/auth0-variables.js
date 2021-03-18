module.exports = {
  clientId: 'Um81o8aATzAiL7I2CWax9ezLMP3R6gYq',
  domain: 'dev-0kw21a7w.auth0.com',
  logoUrl: 'http://localhost:4200/images/explorviz-logo.png',
  callbackUrl: 'http://localhost:4200/callback',
  logoutReturnUrl: 'http://localhost:4200/',
  routeAfterLogin: 'landscapes',

  // iff started with environment "noauth", this token and profile will be applied
  accessToken: 'SPECIAL_TOKEN',
  profile: {
    name: 'John Doe',
    nickname: 'Johnny',
    sub: '9000',
  },
};
