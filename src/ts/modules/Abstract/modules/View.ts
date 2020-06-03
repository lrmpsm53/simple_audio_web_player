import { DOMElement, TContainer as TC, ClassesDOMStream, AttributesDOMStream } from './DOMElement';
import { Component } from './Component';
import { StoreForArrays } from './Store';
import { ITreeNode, Tree } from './Ttree';

abstract class AbstractView<T extends TC> extends Component {
    abstract DOMElement: DOMElement<T>;
    slot?: AbstractView<TC>;
    ViewTree?: ViewTree;
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

export type TView = View<TC>;

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
    createSimpleView<T extends TC>(container: string) {
        return new SimpleView<T>(container);
    }
    bindEvents(...events: TEvent[]) {
        return new ViewEvents(this, ...events);
    }
    build() {
        this.ViewTree?.buildTree();
    }
}

export type TEvent = {
    readonly name: string;
    readonly block: TC | Document | Window;
    readonly callback: Function;
    readonly capture?: boolean;
}

export class ViewEvents<T extends object> extends StoreForArrays<TEvent> {
    Context: T;
    constructor(Context: T, ...events: TEvent[]) {
        super(...events);
        this.Context = Context;
        this.fields.forEach(event => this.addEvent(event));
    }
    private addEvent(event: TEvent) {
        event.block.addEventListener(
            event.name,
            event.callback.bind(this.Context),
            event.capture
        );
    }
    private removeEvent(event: TEvent) {
        event.block.removeEventListener(
            event.name, 
            event.callback.bind(this.Context), 
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

interface  IHook {
    context: object;
    hook: () => void;
}

export class ViewTree extends Tree<AbstractView<TC>> {
    hooks: IHook[] = [];
    buildTree(node = this.tree) {
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
        else if (!!node.element.ViewTree) {
            this.buildTree(node.element.ViewTree.tree);
        }
    }
    hookMounted(node: TViewTreeNode) {
        const element = node.element;
        if (!!element.mounted) {
            const hook = {
                hook: element.mounted,
                context: element
            }
            this.hooks.push(hook);
        }
    }
    runMountedHooks() {
        setTimeout(() => {
            this.hooks.forEach(hook => {
                hook.hook.call(hook.context);
            });
        }, 0);
    }
    constructor(tree: TViewTreeNode) {
        super(tree);
    }
}