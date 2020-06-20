import { RootView } from '../Abstract/Abstract';
import { Audio } from './Audio';
import { TrackName } from './TrackName';
import { Controls } from './Controls';
import { Time } from './Time';
import { Bar } from './Bar';

export class ProgressBar extends Bar {
    constructor() {
        super();
        const element = this.element;
        element.classes.push('sc---progress-bar');
    }
}

export class PlayerContainer extends RootView<HTMLElement> {
    protected sizes = [500, 600, 800, 1024, 1280, 1440, 1680, 1920];
    protected currentSizesSum = 0;
    readonly element = this.createDOMElement({
        tag: 'div',
        classes: [
            'sc---row',
            'sc---row_middle-children',
            'sc---player'
        ]
    });
    readonly children = [
        new Audio().setName('Audio'),
        new TrackName().setName('TrackName'),
        new Controls,
        new Time('current').setName('TimeCurrent'),
        new ProgressBar().setName('ProgressBar'),
        new Time('left').setName('TimeLeft'),
    ];
    readonly events = this.bindEvents({
            name: 'resize',
            block: window, callback: 
            this.updateSize 
    });
    constructor() {
        super();
        this.container.style.visibility = 'hidden';
    }
    private updateSize() {
        const root = this.element;
        if (this.currentSizesSum != 0) {
            for (let i = 1; i <= this.currentSizesSum; i++) {
                root.classes.pop();
            }
        }
        const currentSize = root.container.offsetWidth;
        const result = this.sizes.reduce((total, elem) => {
            if (elem >= currentSize) {
                total.push(elem);
                return total;
            } else return total;
        }, new Array);
        if (result.length == 0) {
            this.currentSizesSum = 1;
            root.classes.push(`_${this.sizes[this.sizes.length - 1]}px`);
        }
        else {
            this.currentSizesSum = result.length;
            result.forEach(elem => root.classes.push(`_${elem}px`));
        }
    }
    mounted() {
        this.updateSize();
        this.container.style.visibility = 'visible';
    }
}