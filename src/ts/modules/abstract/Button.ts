import {Block, i_computedDataInstance} from './Block';

interface inputContext <T> {};
export interface i_ButtonContext<T=Button> extends inputContext<T> {
    iconStates: Map<string, string>;
    container: HTMLImageElement;
    [property: string]: any;
};

type t_iconSource<other = {[index: string]: string|object}> = {[index: string]: string|object} | other;

export abstract class Button extends Block<HTMLImageElement> {
    protected classes = ['sc---button'];
    constructor(iconSource: t_iconSource<string>, alt: string = '') {
        super('img');
        this.constructorData <t_iconSource<string>> ('iconSource', iconSource);
        this.constructorData <t_iconSource<string>> ('alt', alt);
    }
    computedFields() {
        const alt = {
            name: 'alt',
            value: this.constructorData <string> ('alt')   
        }
        const fields: i_computedDataInstance = (() => {
            switch (typeof this.constructorData <t_iconSource<string>> ('iconSource')) {
                case 'string': return {
                    attributes: [{
                        name: 'src', 
                        value: this.constructorData <string> ('iconSource')
                    }]
                }
                default: return new Object;
            }
        })();
        if (fields.attributes) fields.attributes.push(alt)
        else fields.attributes = [alt];
        return fields;
    }
    computedContextFields(): i_ButtonContext {
        const iconStates = () => {
            switch (typeof this.constructorData <t_iconSource> ('iconSource')) {
                case 'object': 
                    return {
                        iconStates: new Map(this.initIconStates(this.constructorData <{[index: string]: string}> ('iconSource')))
                }
                default: return new Object;
            }
        }
        return Object.assign (iconStates(), {container: this.container}) as i_ButtonContext;
    }
    protected initIconStates(icons: {[index: string]: string}): Iterable<[string, string]> {
        const  keys = Object.keys(icons);
        return keys.map(key => [key, icons[key]])
    }
    protected changeIcon (iconId: string, _this = this as unknown as i_ButtonContext) {
        _this.container.src = _this.iconStates.get(iconId) as string;
    }
}