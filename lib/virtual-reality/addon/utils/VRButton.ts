// Adapted from: https://github.com/mrdoob/three.js/blob/master/examples/jsm/webxr/VRButton.js
import THREE from 'three';

export default class VRButton {
  renderer: THREE.WebGLRenderer;

  currentSession: XRSession | null = null;

  button: HTMLButtonElement| null;

  onSessionStartedCallback: ((session: XRSession) => void) |null = null;

  onSessionEndedCallback: (() => void) |null = null;

  constructor(renderer: THREE.WebGLRenderer) {
    this.renderer = renderer;
    this.button = null;
  }

  createButton() {
    if ('xr' in navigator) {
      this.button = document.createElement('button');
      this.button.id = 'VRButton';
      this.button.style.display = 'none';

      VRButton.stylizeElement(this.button);

      // @ts-ignore
      navigator.xr.isSessionSupported('immersive-vr').then((supported: boolean) => {
        if (supported) {
          this.showEnterVR();
        } else {
          this.showWebXRNotFound();
        }
      });

      return this.button;
    }

    const message = document.createElement('a');

    if (window.isSecureContext === false) {
      message.href = document.location.href.replace(/^http:/, 'https:');
      message.innerHTML = 'WEBXR NEEDS HTTPS'; // TODO Improve message
    } else {
      message.href = 'https://immersiveweb.dev/';
      message.innerHTML = 'WEBXR NOT AVAILABLE';
    }

    message.style.left = 'calc(50% - 90px)';
    message.style.width = '180px';
    message.style.textDecoration = 'none';

    VRButton.stylizeElement(message);

    return message;
  }

  onSessionStarted(session: any) {
    if (!this.button) return;

    session.addEventListener('end', this.onSessionEnded.bind(this));

    this.renderer.xr.setSession(session);
    this.button.textContent = 'EXIT VR';

    this.currentSession = session;

    if (this.onSessionStartedCallback) {
      this.onSessionStartedCallback(session);
    }
  }

  onSessionEnded(/* event */) {
    if (!this.currentSession) return;

    this.currentSession.removeEventListener('end', this.onSessionEnded);
    this.currentSession = null;

    if (this.button) this.button.textContent = 'ENTER VR';

    if (this.onSessionEndedCallback) {
      this.onSessionEndedCallback();
    }
  }

  showEnterVR(/* device */) {
    const { button } = this;

    if (!button) return;

    button.style.display = '';

    button.style.cursor = 'pointer';
    button.style.left = 'calc(50% - 50px)';
    button.style.width = '100px';

    button.textContent = 'ENTER VR';

    button.onmouseenter = () => {
      button.style.opacity = '1.0';
    };

    button.onmouseleave = () => {
      button.style.opacity = '0.5';
    };

    button.onclick = () => {
      if (!this.currentSession) {
        // WebXR's requestReferenceSpace only works if the corresponding feature
        // was requested at session creation time. For simplicity, just ask for
        // the interesting ones as optional features, but be aware that the
        // requestReferenceSpace call will fail if it turns out to be unavailable.
        // ('local' is always available for immersive sessions and doesn't need to
        // be requested separately.)

        const sessionInit = { optionalFeatures: ['local-floor', 'bounded-floor', 'hand-tracking'] };
        // @ts-ignore
        navigator.xr.requestSession('immersive-vr', sessionInit).then(this.onSessionStarted.bind(this));
      } else {
        this.currentSession.end();
      }
    };
  }

  disableButton() {
    const { button } = this;
    if (!button) return;

    button.style.display = '';

    button.style.cursor = 'auto';
    button.style.left = 'calc(50% - 75px)';
    button.style.width = '150px';

    button.onmouseenter = null;
    button.onmouseleave = null;

    button.onclick = null;
  }

  showWebXRNotFound() {
    this.disableButton();

    if (this.button) this.button.textContent = 'VR NOT SUPPORTED';
  }

  static stylizeElement(element: HTMLElement) {
    element.style.position = 'absolute';
    element.style.bottom = '20px';
    element.style.padding = '12px 6px';
    element.style.border = '1px solid #fff';
    element.style.borderRadius = '4px';
    element.style.background = 'rgba(0,0,0,0.1)';
    element.style.color = '#fff';
    element.style.font = 'normal 13px sans-serif';
    element.style.textAlign = 'center';
    element.style.opacity = '0.5';
    element.style.outline = 'none';
    element.style.zIndex = '999';
  }
}
