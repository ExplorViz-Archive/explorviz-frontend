import VRControllerButtonBinding from '../vr-controller/vr-controller-button-binding';
import composeContent, { EntityMesh, getIdOfEntity, getTypeOfEntity } from '../vr-helpers/detail-info-composer';
import { EntityType } from '../vr-message/util/entity_type';
import BaseMenu from './base-menu';
import { DetachableMenu } from './detachable-menu';
import RectangleItem from './items/rectangle-item';
import TextItem from './items/text-item';

export default class DetailInfoMenu extends BaseMenu implements DetachableMenu {

  entryItems: Map <string, TextItem>; 

  object: EntityMesh;

  constructor(object: EntityMesh) {
    super({ width: 768, height: 512 });
    this.entryItems = new Map<string, TextItem>();
    this.object = object;

    let content = composeContent(object);

    if (content) {

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
      this.update();

    } else {

      this.closeMenu();
    }
  }
  getEntityType(): EntityType {
    return getTypeOfEntity(this.object);
  }

  onUpdateMenu() {
    let content = composeContent(this.object)
    if (content) {
      content.entries.forEach(({key, value}) => {
        this.entryItems.get(key)?.setText(value);
      });
      this.update();
    } else {
      this.closeMenu();
    }
  }

  getDetachId(): string {
    return getIdOfEntity(this.object);
  }

  makeTriggerButtonBinding() {
    return new VRControllerButtonBinding('Detach', {
      onButtonDown: () => {
        this.detachMenu();
      }
    })
  }
}
