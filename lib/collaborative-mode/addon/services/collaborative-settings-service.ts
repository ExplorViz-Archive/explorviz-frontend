import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { A } from '@ember/array';


export default class CollaborativeSettingsService extends Service.extend({
  // anything which *must* be merged to prototype here
}) {

  color: string = "green";

  users: String[] = A([]);

  @tracked
  username: string = "User" + Math.floor(Math.random() * Math.floor(100));

  @tracked
  sessionId: string = ""

  @tracked
  userInControl: string = ""

  @tracked
  enabled: boolean = false;

  @tracked
  perspective: boolean = true;

  @tracked
  mouseMove: boolean = true;

  @tracked
  mouseStop: boolean = true;

  @tracked
  mouseHover: boolean = true;

  @tracked
  singleClick: boolean = true;

  @tracked
  doubleClick: boolean = true;

  @tracked
  presentationMode: boolean = false;

  @tracked
  admin: boolean = true;

  get isSessionIdEmpty() {
    return !this.sessionId
  }

  get isInteractionAllowed(): boolean {
    return !this.enabled || !this.presentationMode || this.userInControl == this.username;
  }

  get canIOpen(): boolean {
    return !this.enabled || this.amIInControl
  }

  get amIInControl(): boolean {
    return this.username == this.userInControl;
  }

  get amIPresenter(): boolean {
    return this.presentationMode && this.amIInControl;
  }

  get amIViewer(): boolean {
    return this.presentationMode && !this.amIInControl;
  }

  get followSingleClick(): boolean {
    return this.singleClick || this.amIViewer;
  }

  get followDoubleClick(): boolean {
    return this.doubleClick || this.amIViewer;
  }

  get followMouseMove(): boolean {
    return this.mouseMove || this.amIViewer;
  }

  get followMouseStop(): boolean {
    return this.mouseStop || this.amIViewer;
  }

  get followMouseHover(): boolean {
    return this.mouseHover || this.amIViewer;
  }

  get followPerspective(): boolean {
    return this.perspective || this.amIViewer;
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your services.
declare module '@ember/service' {
  interface Registry {
    'collaborative-settings-service': CollaborativeSettingsService;
  }
}
