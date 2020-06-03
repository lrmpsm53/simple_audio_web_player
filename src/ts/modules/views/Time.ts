import { View } from '../Abstract/Abstract';

export class Time extends View<HTMLElement> {
    DOMElement = this.createDOMElement('div')
        .classes.push('sc---time');
    createTimeString(seconds: number): string {
        let minutes = Math.floor(seconds/60);
        let only_seconds: number|string = Math.floor(seconds - minutes*60);
        if(only_seconds < 10) only_seconds = '0' + only_seconds.toString();
        return `${minutes}:${only_seconds}`;
    }
    readonly referenceType: 'current'|'left';
    constructor(referenceType: 'current'|'left') {
        super();
        this.referenceType = referenceType;
    }
    mounted() {
        this.DOMElement.container.textContent = this.createTimeString(0);
    }
}