import { View } from '../Abstract/Abstract';
const borderImg = require('../../../icons/border.svg');

export class Border extends View<HTMLImageElement> {
    readonly element = this.createDOMElement({
        tag: 'img',
        classes: [ 'sc---border' ],
        attributes: [ { name: 'src', value: borderImg } ]
    });
}