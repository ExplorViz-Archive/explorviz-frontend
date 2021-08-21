import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

// Default CSS Classes (Need to be updated with class 'show' to make the banner visible)
const DEFAULT_CSS = 'alert text-center cookiealert';

// Default w3school : setCookie & getCookie
function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  const expires = `expires=${d.toUTCString()}`;
  document.cookie = `${cname}=${cvalue};${expires};path=/`;
}

function getCookie(cname) {
  let c;
  let i;
  const name = `${cname}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (i = 0; i < ca.length; i++) {
    c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}

export default class CookieBanner extends Component {
  // Cookie Banner Functionality based on 'Bootstrap Cookie Alert' by Wruczek (https://github.com/Wruczek/Bootstrap-Cookie-Alert)
  @tracked classList = DEFAULT_CSS;

  // Sets visibility on first loading
  constructor(owner, args) {
    super(owner, args);
    this.consent = getCookie('cookieConsent');

    if (!this.consent) {
      this.classList += ' show'; // Add visibility
    }
  }

  @action
  acceptCookies() { // Set cookie for cookie banner and hides it after it
    setCookie('cookieConsent', true, 365);
    this.consent = getCookie('cookieConsent');
    this.classList = DEFAULT_CSS;
  }
}
