interface i_attribute {
    name: string;
    value: string;
}

interface i_event {
    name: string;
    block: HTMLElement|HTMLAudioElement|HTMLImageElement|Document;
    callback: Function;
    capture?: boolean;
}

export interface i_children {
    [index: string]: Block<HTMLElement | HTMLImageElement | HTMLAudioElement>;
}

interface i_childrenInstance<T> extends i_children {}

interface i_computedData<K> {
    [index: string]: any;
    attributes?: i_attribute[];
    classes?: string[];
    events?: i_event[];
    children?: i_childrenInstance<K>
}

export interface i_computedDataInstance<T={}, K = {}> extends i_computedData<K>  {}

export abstract class Block <containerType extends HTMLElement> {
    protected readonly constructor_data: Map<string,any> = new Map;
    readonly container: containerType;
    protected classes: string[] = [];
    children?: i_children;
    protected attributes?: i_attribute[]|undefined;
    protected events?: i_event[];
    protected contextFields: any = {};
    protected computedContextFields? (): i_computedDataInstance;
    protected computedFields? (): i_computedDataInstance;
    protected mounted ? (): void;
    protected constructorData <type> (propertyName: string, propertyValue?: type): type {
        if (propertyValue) this.constructor_data.set(propertyName, propertyValue as type)
        return this.constructor_data.get(propertyName);
    }
    fixData() {
        const fieldsQuality = (fields: i_computedDataInstance, target: {[index: string]: any}) => {
            const updateField = <T extends Array<any>|undefined> (fieldPropertyName: string, fieldProperty: T, targetProperty: T) => {
                    if (fieldProperty && targetProperty) {
                        fieldProperty.forEach(_class => targetProperty.push(_class));
                        delete fields[fieldPropertyName];
                    }
                }
            updateField <string[]|undefined> ('classes', fields.classes, target.classes);
            updateField <i_attribute[]|undefined> ('attributes', fields.attributes, target.attributes);
            updateField <i_event[]|undefined> ('events', fields.events, target.events);
            for (let mainField in target) {
                for (let field in fields) {
                    if (mainField == field) {
                        target[mainField] = fields[mainField];
                        delete fields[mainField];
                    }       
                }
            }
            for (let field in fields) target[field] = fields[field];
        }
        this.computedFields && fieldsQuality(this.computedFields(), this);
        this.computedContextFields && fieldsQuality(this.computedContextFields(), this.contextFields);
    }
    render() {
        this.attributes && this.attributes.forEach(attr => this.container.setAttribute(attr.name, attr.value));
        this.classes.forEach (_class => this.container.classList.add(_class));
        if (this.children) { 
            for (let child in this.children) {
                const renderRusult = this.children[child].render();
                this.container.append(renderRusult.container);
                setTimeout(() => renderRusult.mounted(), 0);
            }
        }
        this.events && this.events.forEach (
            (event: i_event) =>
                event.block.addEventListener(event.name, event.callback.bind(this.contextFields), event.capture)
        );
        return {
            container: this.container,
            mounted: this.mounted ? this.mounted.bind(this) : new Function
        }
    }
    constructor (container: containerType | string) {
        typeof container == 'string'
        ? this.container = document.createElement(container as string) as containerType
        : this.container = container as containerType;
    }
}