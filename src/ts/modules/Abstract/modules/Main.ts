import type { TRootView } from './View';
import type { TContainer } from './DOMElement';
import { Component } from './Component';

export abstract class Main<T extends TRootView> extends Component {
    abstract View: T;
    insertView(View: T) {
        return View;
    }
    mountTree(mountPoint: TContainer) {
        mountPoint.append(this.View.container);
        this.View.buildView();
        this.View.runMountedHooks();
    }
}