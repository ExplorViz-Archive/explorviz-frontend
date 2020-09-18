import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

interface VrButtonArgs {
  renderer: THREE.WebGLRenderer;
  onSessionStartedCallback: (session: XRSession) => void;
  onSessionEndedCallback: () => void;
}

export default class VrButton extends Component<VrButtonArgs> {
  currentSession: XRSession | null = null;

  @tracked
  buttonText: string = 'Checking ...';

  /**
   * Checks the current status of WebXR in the browser and if compatible
   * devices are connected. Sets the tracked properties
   * 'buttonText' and 'vrSupported' accordingly.
   */
  @action
  toggleVR() {
    if ('xr' in navigator) {
      // @ts-ignore
      navigator.xr.isSessionSupported('immersive-vr').then((supported: boolean) => {
        if (this.currentSession) {
          this.currentSession.end();
        } else if (supported) {
          const sessionInit = { optionalFeatures: ['local-floor'] };
          // @ts-ignore
          navigator.xr.requestSession('immersive-vr', sessionInit)
            .then(this.onSessionStarted.bind(this))
            // If no session can be initiated here, it is likely that this error is temporary
            .catch(() => {
              this.buttonText = 'Enter VR';
            });
        } else if (window.isSecureContext === false) {
          this.buttonText = 'WEBXR NEEDS HTTPS';
        } else {
          this.buttonText = 'WEBXR NOT AVAILABLE';
        }
      });
    } else {
      this.buttonText = 'WEBXR NOT SUPPORTED';
    }
  }

  /**
   * Called whenever a WebXR session is started.
   * Adds the session to the renderer, sets button text and
   * registers listenders + callback functions.
   *
   * @param session
   */
  onSessionStarted(session: any) {
    session.addEventListener('end', this.onSessionEnded.bind(this));

    this.args.renderer.xr.setSession(session);
    this.buttonText = 'EXIT VR';

    this.currentSession = session;

    this.args.onSessionStartedCallback(session);
  }

  /**
   * Called whenever a WebXR session ends.
   * Removes listeners, updates button text and triggers
   * registered callback function.
   */
  onSessionEnded(/* event */) {
    if (!this.currentSession) return;

    this.currentSession.removeEventListener('end', this.onSessionEnded);
    this.currentSession = null;

    this.buttonText = 'ENTER VR';

    this.args.onSessionEndedCallback();
  }
}
