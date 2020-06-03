import { View } from '../Abstract/Abstract';
const borderImg = require('../../../icons/border.svg');

export class Border extends View<HTMLImageElement> {
    DOMElement = this.createDOMElement('img')
        .classes.push('sc---border')
        .attributes.push({
            name: 'src',
            value: borderImg
        });
}