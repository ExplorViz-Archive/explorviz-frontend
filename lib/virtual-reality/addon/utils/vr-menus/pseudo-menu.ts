import BaseMenu from './base-menu';

/**
 * A menu that does not have a user interface but overwrites the button
 * bindings only.
 */
export default class PseudoMenu extends BaseMenu {
    initBackground() {
        // A pseudo menu does not have a background.
    }
}