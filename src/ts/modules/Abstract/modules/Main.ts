import type { TView } from './View';
import type { TContainer } from './DOMElement';
import { StateEnviron } from './StateEnviron';

export abstract class Main<T extends TView> extends StateEnviron {
    abstract View: T;
    insertView(View: T) {
        return View;
    }
    mountTree(mountPoint: TContainer) {
        mountPoint.append(this.View.DOMElement.container);
    }
}