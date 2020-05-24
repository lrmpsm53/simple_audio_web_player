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
    mounted?(): void;
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
    createViewTree(input: TViewTreeNode[]) {
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

type TViewTreeNode = ITreeNode<AbstractView<TC>>;

export class ViewTree extends Tree<AbstractView<TC>> {
    hooks: Function[] = []
    buildTree(node: TViewTreeNode) {
        const handler = (node: TViewTreeNode) => {
            this.appendChild(node);
            this.hookMounted(node);
        }
        this.treeTrevesal(handler, node);
    }
    appendChild(node: TViewTreeNode) {
        function nodeContainer(node: TViewTreeNode) {
            if (!!node.element.slot)
            return node.element.slot.DOMElement.container
            else return node.element.DOMElement.container;
        }
        const container = nodeContainer(node);
        if (!!node.children) {
            node.children.forEach(
                child => container.append(nodeContainer(child))
            );
        }
    }
    hookMounted(node: TViewTreeNode) {
        const element = node.element;
        if (element.mounted) {
            this.hooks.push(element.mounted.bind(element));
        }
    }
    runMountedHooks() {
        this.hooks.forEach(hook => setTimeout(() => hook()));
    }
    constructor(tree: TViewTreeNode) {
        super(tree);
        this.buildTree(tree);
    }
}