import {
    DOMElement,
    TContainer as TC,
    ClassesDOMStream,
    AttributesDOMStream
} from './DOMElement';
import { StateEnviron } from './StateEnviron';
import { StreamForArrays } from './Stream';
import { ITreeNode, Tree } from './Ttree';

abstract class AbstractView<T extends TC> extends StateEnviron {
    abstract DOMElement: DOMElement<T>;
    slot?: AbstractView<TC>;
    protected createDOMElement(container: string) {
        return new DOMElement<T>(container);
    }
    modify(callback: (_this: this) => void) {
        callback(this);
        return this;
    }
}

class SimpleView<T extends TC> extends AbstractView<T> {
    DOMElement: DOMElement<T>;
    classes: ClassesDOMStream<T>;
    attributes: AttributesDOMStream<T>;
    constructor(container: string) {
        super();
        this.DOMElement = this.createDOMElement(container);
        this.classes = this.DOMElement.classes;
        this.attributes = this.DOMElement.attributes;
    }
}

export abstract class View<T extends TC> extends AbstractView<T> {
    ViewTree?: ViewTree;
    events?: ViewEvents<this>;
    createViewTree(input: IViewTreeNode[]) {
        return new ViewTree({
            name: 'Root',
            element: this,
            children: input
        });
    }
    bindEvents(...events: TEvent[]): ViewEvents<this> {
        return new ViewEvents(this, ...events);
    }
    createSimpleView<T extends TC>(container: string) {
        return new SimpleView<T>(container);
    }
}

export type TView = View<TC>;

type TEvent = {
    readonly name: string;
    readonly block: TC | Document | Window;
    readonly callback: Function;
    readonly capture?: boolean;
}

export class ViewEvents<T extends TView> extends StreamForArrays<TEvent> {
    View: TView;
    constructor(View: T, ...events: TEvent[]) {
        super(...events);
        this.View = View;
        this.fields.forEach(event => this.addEvent(event));
    }
    private addEvent(event: TEvent) {
        event.block.addEventListener(
            event.name,
            event.callback.bind(this.View),
            event.capture
        );
    }
    private removeEvent(event: TEvent) {
        event.block.removeEventListener(
            event.name, 
            event.callback.bind(this.View), 
            event.capture
        );
    }
    push(event: TEvent) {
        this.addEvent(event);
        super.push(event);
    }
    pop() {
        this.removeEvent(this.fields.slice(-1)[0]);
        super.pop();
    }
}

interface IViewTreeNode extends ITreeNode<AbstractView<TC>> {
    slot?: AbstractView<TC>;
}

export class ViewTree extends Tree<AbstractView<TC>> {
    buildTree(node: IViewTreeNode) {
        if (!!node.children) {
            node.children.forEach(child => {
                if (node.children && node.element.slot)
                node.element.slot.DOMElement.append(this.buildTree(child))
                else
                node.element.DOMElement.append(this.buildTree(child));
            });
        }
        return node.element.DOMElement.container;
    }
    constructor(tree: IViewTreeNode) {
        super(tree);
        this.buildTree(tree);
    }
}