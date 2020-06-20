import { DOMElement, TContainer as TC, ClassesDOMStream, AttributesDOMStream, ITemplate } from './DOMElement';
import { Component } from './Component';
import { StoreForArrays } from './Store';

type TViewNode = AbstractView<TC>;

interface ISimpleViewTemplate extends ITemplate {
    readonly name?: string;
};

abstract class AbstractView<T extends TC> extends Component {
    name?: string;
    readonly abstract element: DOMElement<T>;
    children?: TViewNode[];
    protected createDOMElement(template: ITemplate) {
        return new DOMElement<T>(template);
    }
    containerProp<K extends keyof T>(prop: K, value?: T[K]) {
        if (value) this.element.container[prop] = value;
        return this.element.container[prop];
    }
    get container() {
        return this.element.container;
    }
    mounted?(): void;
}

class SimpleView<T extends TC> extends AbstractView<T> {
    readonly element: DOMElement<T>;
    readonly classes: ClassesDOMStream;
    readonly attributes: AttributesDOMStream;
    constructor(template: ISimpleViewTemplate) {
        super();
        this.name = template.name;
        this.element = this.createDOMElement(template);
        this.classes = this.element.classes;
        this.attributes = this.element.attributes;
    }
}

export abstract class View<T extends TC> extends AbstractView<T> {
    readonly events?: ViewEvents;
    setName(newName: string) {
        this.name = newName;
        return this;
    }
    createSimpleView<T extends TC>(template: ISimpleViewTemplate) {
        return new SimpleView<T>(template);
    }
    bindEvents(...events: TEvent[]) {
        return new ViewEvents(this, ...events);
    }
    getChild(name: string) {
        let value: TViewNode|undefined;
        const handler = (node: TViewNode) => {
            if (node.name === name) value = node;
        }
        this.treeTrevesal(handler, this);
        return value;
    }
    protected treeTrevesal(handler: (node: TViewNode) => void, tree: View<TC>) {
		const callback = (node: TViewNode) => {
			handler(node);
			if (node.children) {
				node.children.forEach(child => callback(child));
			}
		}
		callback(tree);
    }
}

export type TEvent = {
    readonly name: string;
    readonly block: TC | Document | Window;
    readonly callback: Function;
    readonly capture?: boolean;
}

export class ViewEvents extends StoreForArrays<TEvent> {
    readonly Context: object;
    constructor(Context: object, ...events: TEvent[]) {
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

export type TRootView = RootView<TC>;

export abstract class RootView<T extends TC> extends View<T> {
    private hooks: Array<() => void> = [];
    buildView() {
        const handler = (node: TViewNode) => {
            this.appendChild(node);
            if (node.mounted) {
                this.hooks.push(node.mounted.bind(node));
            }
        }
        this.treeTrevesal(handler, this);
    }
    private appendChild(node: TViewNode) {
        const container = node.container;
        if (!!node.children) {
            node.children.forEach(child => {
                container.append(child.container);
            });
        }
    }
    runMountedHooks() {
        setTimeout(() => {
            this.hooks.forEach(hook => hook());
        }, 500);
    }
}