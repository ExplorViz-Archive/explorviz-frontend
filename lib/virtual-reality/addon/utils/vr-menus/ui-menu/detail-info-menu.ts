import VRControllerButtonBinding from '../../vr-controller/vr-controller-button-binding';
import composeContent, { EntityMesh, getIdOfEntity, getTypeOfEntity } from '../../vr-helpers/detail-info-composer';
import { EntityType } from '../../vr-message/util/entity_type';
import { DetachableMenu } from '../detachable-menu';
import RectangleItem from '../items/rectangle-item';
import TextItem from '../items/text-item';
import UiMenu, { DEFAULT_MENU_RESOLUTION, UiMenuArgs } from '../ui-menu';

export type DetailInfoMenuArgs = UiMenuArgs & {
  object: EntityMesh
};

export default class DetailInfoMenu extends UiMenu implements DetachableMenu {
  private object: EntityMesh;
  private entryItems: Map<string, TextItem>;

  constructor({
    object,
    resolution = { width: 1.5 * DEFAULT_MENU_RESOLUTION, height: DEFAULT_MENU_RESOLUTION },
    ...args
  }: DetailInfoMenuArgs) {
    super({ resolution, ...args });
    this.object = object;
    this.entryItems = new Map<string, TextItem>();
  }

  getDetachId(): string {
    return getIdOfEntity(this.object);
  }

  getEntityType(): EntityType {
    return getTypeOfEntity(this.object);
  }

  onOpenMenu() {
    super.onOpenMenu();

    let content = composeContent(this.object);
    if (!content) {
      this.closeMenu();
      return;
    }

    const titleBackground = new RectangleItem({
      position: { x: 0, y: 0 },
      width: this.resolution.width,
      height: 66,
      color: '#777777'
    });
    this.items.push(titleBackground);

    const title = new TextItem({
      text: content.title,
      color: '#ffffff',
      fontSize: 30,
      alignment: 'center',
      position: { x: this.resolution.width / 2, y: 20 },
    });
    this.items.push(title);

    let offset = 100;
    content.entries.forEach(({ key, value }) => {
      const keyTextItem = new TextItem({
        text: key,
        color: '#ffffff',
        fontSize: 26,
        position: { x: 20, y: offset },
      });
      this.items.push(keyTextItem);

      const valueTextItem = new TextItem({
        text: value,
        color: '#ffffff',
        fontSize: 26,
        alignment: 'right',
        position: { x: 768 - 20, y: offset },
      });
      this.items.push(valueTextItem);
      this.entryItems.set(key, valueTextItem);

      offset += 70;
    });

    this.redrawMenu();
  }

  onUpdateMenu(delta: number) {
    super.onUpdateMenu(delta);

    let content = composeContent(this.object)
    if (content) {
      content.entries.forEach(({ key, value }) => {
        this.entryItems.get(key)?.setText(value);
      });
      this.redrawMenu();
    } else {
      this.closeMenu();
    }
  }

  makeTriggerButtonBinding() {
    return new VRControllerButtonBinding('Detach', {
      onButtonDown: () => {
        this.detachMenu();
      }
    })
  }
}
