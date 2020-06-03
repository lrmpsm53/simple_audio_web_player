import { View } from '../Abstract/Abstract';
import { Audio } from './Audio';
import { TrackName } from './TrackName';
import { Controls } from './Controls';
import { Time } from './Time';
import { Bar } from './Bar';

export class PlayerContainer extends View<HTMLElement> {
    protected sizes = [375, 600, 800, 1024, 1280, 1440, 1680, 1920];
    protected currentSizesSum = 0;
    DOMElement = this.createDOMElement('div')
    .classes.append(
        'sc---row',
        'sc---row_middle-children', 
        'sc---player'
    );
    ViewTree = this.createViewTree([
        {
            name: 'Audio',
            element: new Audio
        },
        {
            name: 'TrackName',
            element: new TrackName
        },
        {
            name: 'Controls',
            element: new Controls
        },
        {
            name: 'TimeCurrent',
            element: new Time('current')
        },
        {
            name: 'ProgressBar',
            element: new Bar()
                .modify(_this => {
                    const element = _this.DOMElement;
                    element.classes.push('sc---progress-bar')
                })
        },
        {
            name: 'TimeLeft',
            element: new Time('left')
        },
    ]);
    events = this.bindEvents({
            name: 'resize',
            block: window, callback: 
            this.updateSize 
    });
    updateSize() {
        const root = this.DOMElement;
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
    }
}