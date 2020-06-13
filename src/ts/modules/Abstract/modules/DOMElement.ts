import { StoreForArrays } from './Store';

export interface ITemplate {
    readonly tag: string;
    readonly classes?: string[];
    readonly attributes?: TAttribute[];
}

export type TContainer = HTMLElement | HTMLAudioElement | HTMLImageElement;

type TAttribute = {
    readonly name: string;
    readonly value: string;
}

type TDOMElement = DOMElement<TContainer>;

export class DOMElement<T extends TContainer> {
    readonly container: T;
    readonly classes: ClassesDOMStream;
    readonly attributes: AttributesDOMStream;
    append(container: TContainer) {
        this.container.append(container);
    }
    private parseTemplate(classes?: string[], attrs?: TAttribute[]) {
        classes && classes.forEach(_class => this.classes.push(_class));
        attrs && attrs.forEach(attr => this.attributes.push(attr));
    }
    constructor(template: ITemplate) {
        const { tag, classes, attributes } = template;
        this.container = document.createElement(tag) as T;
        this.classes = new ClassesDOMStream(this);
        this.attributes = new AttributesDOMStream(this);
        this.parseTemplate(classes, attributes);
    }
}

abstract class DOMStream<T> extends StoreForArrays<T> {
    abstract readonly DOMElement: TDOMElement;
}

export class ClassesDOMStream extends DOMStream<string> {
    readonly DOMElement: DOMElement<TContainer>;
    private classList: DOMTokenList;
    constructor(DOMElment: DOMElement<TContainer>) {
        super();
        this.DOMElement = DOMElment;
        this.classList = this.DOMElement.container.classList;
    }
    push(_class: string) {
        this.classList.add(_class);
        super.push(_class);
    }
    pop() {
        const _class = this.fields.slice(-1)[0];
        this.classList.remove(_class);
        super.pop();
    }
}

export class AttributesDOMStream extends DOMStream<TAttribute> {
    readonly DOMElement: DOMElement<TContainer>;
    readonly container: TContainer;
    constructor(DOMElement: DOMElement<TContainer>) {
        super();
        this.DOMElement = DOMElement;
        this.container = this.DOMElement.container;
    }
    push(attribute: TAttribute) {
        const { name, value } = attribute;
        this.container.setAttribute(name, value);
        super.push(attribute);
    }
    pop() {
        const { value } = this.fields.slice(-1)[0];
        this.container.removeAttribute(value);
        super.pop();
    }
}