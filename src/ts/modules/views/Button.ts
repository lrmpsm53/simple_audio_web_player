import { View } from '../Abstract/Abstract';

export class Button extends View<HTMLImageElement> {
    readonly element = this.createDOMElement({
        tag: 'img',
        classes: [ 'sc---button' ]
    });
    readonly states = this.setStates({
        iconsSet: {
            value: [] as string[],
            callbacks: [ () => this.updateCurrentIcon(0) ]
        },
        currentIcon: {
            value: -1,
            callbacks: [ this.changeIcon ]
        }
    });
    protected updateCurrentIcon(value: number) {
        this.states.get('currentIcon').value(value);
    }
    protected switchCurrentIcon() {
        const iconsSet = this.states.get('iconsSet').value();
        const currentIcon = this.states.get('currentIcon');
        if (currentIcon.value() < iconsSet.length-1)
        currentIcon.value(currentIcon.value() + 1)
        else
        currentIcon.value(0);
    }
     protected changeIcon(index: number) {
        const otherIcon = this.states.get('iconsSet').value()[index];
        this.containerProp('src', otherIcon);
    }
}