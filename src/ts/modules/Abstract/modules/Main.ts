import type { TView } from './View';
import type { TContainer } from './DOMElement';
import { Component } from './Component';

export abstract class Main<T extends TView> extends Component {
    abstract View: T;
    insertView(View: T) {
        return View;
    }
    mountTree(mountPoint: TContainer) {
        mountPoint.append(this.View.DOMElement.container);
        this.View.build();
        this.View.ViewTree?.runMountedHooks();
    }
}