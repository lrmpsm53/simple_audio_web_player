import { StoreForArrays } from './Store';

export type TContainer = HTMLElement | HTMLAudioElement | HTMLImageElement;

type TAttribute = {
    readonly name: string;
    readonly value: string;
}

type TDOMElement = DOMElement<TContainer>;

export class DOMElement<T extends TContainer> {
    readonly container: T;
    readonly classes: ClassesDOMStream<T>;
    readonly attributes: AttributesDOMStream<T>;
    append(container: TContainer) {
        this.container.append(container);
    }
    constructor(container: string) {
        this.container = document.createElement(container) as T;
        this.classes = new ClassesDOMStream(this);
        this.attributes = new AttributesDOMStream(this);
    }
}

abstract class DOMStream<T> extends StoreForArrays<T> {
    abstract append(...args: any[]): void;
    abstract readonly DOMElement: TDOMElement;
}

export class ClassesDOMStream<T extends TContainer> extends DOMStream<string> {
    readonly DOMElement: DOMElement<T>;
    private classList: DOMTokenList;
    constructor(DOMElment: DOMElement<T>) {
        super();
        this.DOMElement = DOMElment;
        this.classList = this.DOMElement.container.classList;
    }
    private addClass(_class: string) {
        this.classList.add(_class);
    }
    private removeClass(_class: string) {
        this.classList.remove(_class);
    }
    push(_class: string) {
        this.addClass(_class);
        super.push(_class);
        return this.DOMElement;
    }
    append(...classes: string[]) {
        classes.forEach(_class => this.push(_class));
        return this.DOMElement;
    }
    pop() {
        this.removeClass(this.classList[this.classList.length - 1]);
        super.pop();
        return this.DOMElement;
    }
}

export class AttributesDOMStream<T extends TContainer> extends DOMStream<TAttribute> {
    DOMElement: DOMElement<T>;
    container: T;
    constructor(DOMElement: DOMElement<T>) {
        super();
        this.DOMElement = DOMElement;
        this.container = this.DOMElement.container;
    }
    private addAttribute(attribute: TAttribute) {
        this.container.setAttribute(attribute.name, attribute.value);
    }
    private removeAttribute(attribute: TAttribute) {
        this.container.removeAttribute(attribute.value);
    }
    push(attribute: TAttribute) {
        this.addAttribute(attribute);
        super.push(attribute);
        return this.DOMElement;
    }
    pop() {
        this.removeAttribute(this.fields.slice(-1)[0]);
        super.pop();
        return this.DOMElement;
    }
    append(...attrs: TAttribute[]) {
        attrs.forEach(attr => this.push(attr));
        return this.DOMElement;
    }
}