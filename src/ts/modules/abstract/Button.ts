import {BlockWithComputingData, Addons} from './Abstract';

type t_iconSource<other = {[index: string]: string|object}> = {[index: string]: string|object} | other;

export type ButtonComputed = Addons.WithAttributes;

export abstract class Button 
    extends BlockWithComputingData<HTMLImageElement, ButtonComputed> 
    implements Addons.WithClasses, Addons.WithAttributes
{
    readonly classes = ['sc---button'];
    attributes = [];
    protected iconStates: Map<string, string> = new Map;
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
        let fields: Addons.WithAttributes;
        switch (typeof this.constructorData <t_iconSource<string>> ('iconSource')) {
            case 'string': fields = {
                    attributes: [{
                        name: 'src', 
                        value: this.constructorData <string> ('iconSource')
                    }] 
                }
                fields.attributes.push(alt);
                break;
                case 'object': fields = {attributes: [alt]};
                    this
                    .initIconStates(this.constructorData <{[index: string]: string}> ('iconSource'))
                    .forEach (state => this.iconStates.set(state[0], state[1]));
                break;
        }
        return fields;
    }
    protected initIconStates(icons: {[index: string]: string}): [string, string][] {
        const  keys = Object.keys(icons);
        return keys.map(key => [key, icons[key]]);
    }
    protected changeIcon (iconId: string) {
        this.container.src = this.iconStates.get(iconId) as string;
    }
}