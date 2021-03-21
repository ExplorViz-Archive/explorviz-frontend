import VRControllerButtonBinding from '../../vr-controller/vr-controller-button-binding';
import composeContent, { EntityMesh, getIdOfEntity, getTypeOfEntity } from '../../vr-helpers/detail-info-composer';
import { EntityType } from '../../vr-message/util/entity_type';
import { DetachableMenu } from '../detachable-menu';
import RectangleItem from '../items/rectangle-item';
import TextItem from '../items/text-item';
import UiMenu, { UiMenuArgs } from '../ui-menu';

export type DetailInfoMenuArgs = UiMenuArgs & {
  object: EntityMesh
};

export default class DetailInfoMenu extends UiMenu implements DetachableMenu {
  private object: EntityMesh;
  private entryItems: Map<string, TextItem>;

  constructor({
    object,
    resolution = { width: 768, height: 512 },
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

    const titleBackground = new RectangleItem('title_background', { x: 0, y: 0 }, 768, 66, '#777777');
    this.items.push(titleBackground);

    const title = new TextItem(content.title, 'detailTitle', '#ffffff', { x: 768 / 2, y: 20 }, 30, 'center');
    this.items.push(title);

    let offset = 100;
    content.entries.forEach(({ key, value }) => {
      const keyTextItem = new TextItem(key, key, '#ffffff', { x: 20, y: offset }, 26, 'left');
      this.items.push(keyTextItem);

      const valueTextItem = new TextItem(value, `${key}_${value}`, '#ffffff', { x: 768 - 20, y: offset }, 26, 'right');
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
