type container = HTMLElement| HTMLAudioElement| HTMLImageElement;

namespace BaseInterfaces {
    export interface attribute {
        readonly name: string;
        readonly value: string;
    }
    export interface event {
        readonly name: string;
        readonly block: container | Document | Window;
        readonly callback: Function;
        readonly capture?: boolean;
    }
    export interface Instance {
        readonly container: container;
    }
    export interface Handler<T> {
        fix(fields: T, target: T): void;
        render(instance: Instance & T): void;
    }
    export interface Indexable<T> extends ThisType<T> {
        [index: string]: any;
    }
}

export namespace Addons {
    export interface WithClasses {
        classes: string[]|Streams.Classes;
    }

    export interface WithChildren<T extends object = {[index: string]: Block<container>}> {
        children: T;
    }
    export interface WithEvents {
        events: BaseInterfaces.event[];
    }
    export interface WithAttributes {
        attributes: BaseInterfaces.attribute[];
    }
}

export namespace Handlers {
    export const Attributes: BaseInterfaces.Handler<Addons.WithAttributes> = {
        fix(fields, target) {
            fields.attributes.forEach(data => target.attributes.push(data));
            delete fields.attributes;
        },
        render(instance) {
            instance.attributes.forEach(attr => instance.container.setAttribute(attr.name, attr.value))
        }
    }
    export const Classes: BaseInterfaces.Handler<Addons.WithClasses> = {
        fix(fields, target) {
            fields.classes.forEach(data => target.classes.push(data));
            delete fields.classes;
        },
        render(instance) {
            const classesString = instance.classes.reduce((total, _class) => `${total} ${_class}`);
            instance.container.className = classesString;
        }
    }
    export const Children: BaseInterfaces.Handler<Addons.WithChildren> = {
        fix(fields, target) {
            for (let child in fields.children) {
                target.children[child] = fields.children[child];
            }
            delete fields.children;
        },
        render(instance) {
            for (let child in instance.children) {
                const renderRusult = instance.children[child].render();
                instance.container.append(renderRusult.container);
                setTimeout(() => renderRusult.mounted(), 0);
            }
        }
    }
    export const Events: BaseInterfaces.Handler<Addons.WithEvents> = {
        fix(fields, target) {
            fields.events.forEach(data => target.events.push(data));
            delete fields.events;
        },
        render(instance) {
            instance.events.forEach (event => event.block.addEventListener(
                event.name,
                event.callback.bind(instance),
                event.capture
            ));
        }
    }
}

export namespace Streams {
    export class Classes extends Array<string> {
        private classList: DOMTokenList
        constructor(classes: string[], container: container) {
            super(...classes);
            this.classList = container.classList;
        }
        push = (_class: string) => {
            this.classList.add(_class);
            return super.push(_class);
        }
        pop = () => {
            this.classList.remove(this.classList[this.classList.length-1]);
            return super.pop();
        }
    }
}

export abstract class Block <containerType extends container> {
    readonly container: containerType;
    protected renders: Function[] = [];
    mounted?(): void;
    constructor (container: containerType | string) {
        typeof container == 'string'
        ? this.container = document.createElement(container as string) as containerType
        : this.container = container as containerType;
    }
    render() {
        this.renders.forEach(render => render(this));
        return {
            container: this.container,
            mounted: this.mounted ? this.mounted.bind(this) : new Function
        }
    }
}

export abstract class BlockWithComputingData<T extends container, K> extends Block<T> {
    protected abstract computedFields(): K;
    protected readonly constructor_data: Map<string,any> = new Map;
    protected constructorData <type> (propertyName: string, propertyValue?: type): type {
        propertyValue && this.constructor_data.set(propertyName, propertyValue)
        return this.constructor_data.get(propertyName);
    }
    fixData(...fixers: Function[]) {
        const computed = this.computedFields() as BaseInterfaces.Indexable<K>;
        fixers.forEach(fixer => fixer(computed, this));
        const _this = this as unknown as BaseInterfaces.Indexable<this>;
        for (let field in computed) {
            for (let thisField in _this) {
                if (field == thisField) {
                    _this[thisField] = computed[field];
                    delete computed[field];
                }
            }
        }
        for (let field in computed) _this[field] = computed[field];
    }
}