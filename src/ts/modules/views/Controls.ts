import { View } from '../Abstract/Abstract';
import { Button } from './Button';
import { Border } from './Border';
import { Bar } from './Bar';

export class SwitchBack extends Button {
    readonly name = 'SwitchBack';
    readonly sender = this.setSender();
    events = this.bindEvents({
        name: 'click',
        block: this.container,
        callback: () => this.sender.sendMessage('back')
    });
    constructor() {
        super();
        this.states.get('iconsSet').value([
            require('../../../icons/back.svg')
        ]);
        this.element.attributes.push({
            name: 'alt',
            value: 'button forward'
        });
    }
}

export class SwitchForward extends Button {
    readonly name = 'SwitchForward';
    readonly sender = this.setSender();
    readonly events = this.bindEvents({
        name: 'click',
        block: this.container,
        callback: () => this.sender.sendMessage('forward')
    });
    constructor() {
        super();
        this.states.get('iconsSet').value([
            require('../../../icons/forward.svg')
        ]);
        this.element.attributes.push({
            name: 'alt',
            value: 'button forward'
        });
    }
}

export class PlayPause extends Button {
    readonly name = 'PlayPause';
    readonly events = this.bindEvents({
        name: 'click',
        block: this.container,
        callback: this.switchCurrentIcon
    });
    protected switchCurrentIcon() {
        this.sender.sendMessage('toggle');
        super.switchCurrentIcon();
    }
    readonly sender = this.setSender();
    constructor() {
        super();
        this.states.get('iconsSet').value([
            require('../../../icons/play.svg'),
            require('../../../icons/pause.svg')
        ]);
        this.element.attributes.push({
            name: 'alt',
            value: 'button play/pause'
        });
    }
}

export class VolumeBar extends Bar {
    readonly name = 'VolumeBar';
    readonly sender = this.setSender();
    constructor() {
        super();
        const element = this.element;
        element.classes.push('sc---controls__volume-bar');
    }
    mounted() {
        this.sender.sendMessage('mounted');
    }
}

export class Controls extends View<HTMLElement> {
    readonly name = 'Controls';
    readonly element = this.createDOMElement({
        tag: 'div',
        classes: [
            'sc---controls',
            'sc---row',
            'sc---row_middle-children'
        ]
    });
    readonly children = [
        new Border,
        new SwitchBack,
        new Border,
        new PlayPause,
        new Border,
        new SwitchForward,
        new Border,
        new VolumeBar,
        new Border
    ];
}