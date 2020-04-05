type TContainer = HTMLElement| HTMLAudioElement| HTMLImageElement;

export namespace Streams {
    export class Classes extends Array<string> {
        private classList: DOMTokenList
        constructor(context: Block<TContainer>, ...classes: string[]) {
            super(...classes);
            this.classList = context.container.classList;
            classes.forEach(_class => this.addClass(_class))
        }
        private addClass = (_class: string) => this.classList.add(_class);
        private removeClass = (_class: string) => this.classList.remove(_class);
        push = (_class: string) => {
            this.addClass(_class);
            return super.push(_class);
        }
        pop = () => {
            this.removeClass(this.classList[this.classList.length-1]);
            return super.pop();
        }
    }

    type TEvent = {
        readonly name: string;
        readonly block: TContainer | Document | Window;
        readonly callback: Function;
        readonly capture?: boolean;
    }

    export class Events<T> extends Array<TEvent> {
        private _this: T;
        constructor(_this: T, ...events: TEvent[]) {
            super(...events);
            this._this = _this;
            events.forEach (event => this.addEvent.call(_this, event));
        }
        private addEvent = (event: TEvent) => {
            event.block.addEventListener(event.name, event.callback.bind(this._this), event.capture);
        }
        private removeEvent(event: TEvent) {
            event.block.removeEventListener(event.name, event.callback.bind(this._this), event.capture);
        }
        push = (event: TEvent) => {
            this.addEvent(event);
            return super.push(event);
        }
        pop = () => {
            this.removeEvent(this[this.length-1]);
            return super.pop();
        }
    }

    type TAttribute = {
        readonly name: string;
        readonly value: string;
    }

    export class Attributes extends Array<TAttribute> {
        private container: TContainer;
        constructor(context: Block<TContainer>, ...attributes: TAttribute[]) {
            super(...attributes);
            this.container = context.container;
            attributes.forEach(attribute => this.addAttribute(attribute));
        }
        private addAttribute = (attribute: TAttribute) => {
            this.container.setAttribute(attribute.name, attribute.value);
        }
        private removeAttribute = (attribute: TAttribute) => {
            this.container.removeAttribute(attribute.value);
        }
        push = (attribute: TAttribute) => {
            this.addAttribute(attribute);
            return super.push(attribute);
        }
        pop = () => {
            this.removeAttribute(this[this.length-1]);
            return super.pop();
        }
    }

    export class Children<T extends {[index: string]: Block<TContainer> & {children?: Streams.Children}} = {}> {
        private blocks: T;
        private container: TContainer;
        private context: Block<TContainer> & {children?: Streams.Children};
        constructor(context: Block<TContainer>, blocks: T) {
            this.blocks = blocks;
            this.container = context.container;
            this.context = context;
            for (let block in this.blocks) this.append(this.blocks[block].container);
        }
        private append(container: TContainer) {
            this.container.append(container);
        }
        runHooks(hooks: Array<() => void> = []) {
            this.context.hook && hooks.push(this.context.hook.bind(this.context));
            this.forEach(child => child.children && child.children.runHooks(hooks));
            this.context.isRoot && hooks.forEach(hook => setTimeout(hook, 0));
        }
        get = <K extends keyof T ,M extends K>(key: M) => this.blocks[key];
        forEach<K extends keyof T, M extends K>(callback: (arg: T[M], key: string) => void) {
            Object.keys(this.blocks).forEach(key => callback(this.blocks[key as M], key));
        }
    }
}

export interface IBlock {
    readonly container: TContainer;
    readonly isRoot?: boolean;
    readonly classes?: Streams.Classes;
    readonly attributes?: Streams.Attributes;
    readonly children?: Streams.Children;
    hook?(): void;
}

export abstract class Block <T extends TContainer> implements IBlock {
    readonly container: T;
    hook?(): void;
    readonly isRoot?: boolean;
    constructor (container: T|string) {
        typeof container == 'string'
        ? this.container = document.createElement(container as string) as T
        : this.container = container as T;
    }
}