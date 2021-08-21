import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

// Default CSS Classes (Need to be updated with class 'show' to make the banner visible)
const DEFAULT_CSS = "alert text-center cookiealert"

export default class CookieBanner extends Component {
    // Cookie Banner Functionality based on "Bootstrap Cookie Alert" by Wruczek (https://github.com/Wruczek/Bootstrap-Cookie-Alert)
    @tracked classList = DEFAULT_CSS + " show";
    consent;

    // Sets visibility on first loading
    constructor(owner, args) {
        super(owner, args);
        this.consent = this.getCookie("cookieConsent");
        
        if (this.consent) {
            this.classList = DEFAULT_CSS;
        }
    }

    @action
    acceptCookies() {   // Set cookie for cookie banner and hides it after it
        this.setCookie("cookieConsent", true, 365);
        this.consent = this.getCookie("cookieConsent");
        this.classList = DEFAULT_CSS;
    }

    // Default w3school : setCookie & getCookie
    setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
    log(consent);
}