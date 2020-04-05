import {Block, Streams, IBlock} from './Abstract';

export default abstract class Button extends Block<HTMLImageElement> implements IBlock {
    classes = new Streams.Classes(this, 'sc---button');
    attributes = new Streams.Attributes(this);
    protected iconStates: Map<string, string> = new Map;
    constructor(iconSource: {[index: string]: string|object} | string, alt: string = '') {
        super('img');
        const altAttr = {name: 'alt', value: alt};
        switch (typeof iconSource) {
            case 'string': 
                this.attributes.push({name: 'src', value: iconSource}) 
                this.attributes.push(altAttr);
            break;
            case 'object': 
                this.attributes.push(altAttr);
                const icons = this.initIconStates(iconSource as {[index: string]: string})
                icons.forEach(state => this.iconStates.set(state[0], state[1]));
            break;
        }
    }
    protected initIconStates(icons: {[index: string]: string}): [string, string][] {
        const  keys = Object.keys(icons);
        return keys.map(key => [key, icons[key]]);
    }
    protected changeIcon (iconId: string) {
        this.container.src = this.iconStates.get(iconId) as string;
    }
}