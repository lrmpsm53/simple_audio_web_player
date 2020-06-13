import { View } from '../Abstract/Abstract';

export class Time extends View<HTMLElement> {
    readonly element = this.createDOMElement({
        tag: 'div',
        classes: [ 'sc---time' ]
    })
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
        switch(referenceType) {
            case 'current': this.name = 'TimeCurrent'
            break
            case 'left': this.name = 'TimeLeft';
        }
    }
    mounted() {
        this.container.textContent = this.createTimeString(0);
    }
}