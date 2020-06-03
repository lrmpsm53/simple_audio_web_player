import { View } from '../Abstract/Abstract';

export class Button extends View<HTMLImageElement> {
    DOMElement = this.createDOMElement('img')
        .classes.push('sc---button');
    states = this.setStates({
        iconsSet: this.createState([] as string[])
            .addCallbacks(() => this.updateCurrentIcon(0)),
        currentIcon: this.createState(-1)
            .addCallbacks(this.changeIcon)
    });
    protected updateCurrentIcon(value: number) {
        this.states.get('currentIcon').value(value);
    }
    switchCurrentIcon() {
        const iconsSet = this.states.get('iconsSet').value();
        const currentIcon = this.states.get('currentIcon');
        if (currentIcon.value() < iconsSet.length-1)
        currentIcon.value(currentIcon.value() + 1)
        else
        currentIcon.value(0);
    }
    protected changeIcon(index: number) {
        const container = this.DOMElement.container;
        const otherIcon = this.states.get('iconsSet').value()[index];
        container.src = otherIcon;
    }
}