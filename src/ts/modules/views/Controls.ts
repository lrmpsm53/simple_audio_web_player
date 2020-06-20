import { View } from '../Abstract/Abstract';
import { Button } from './Button';
import { Border } from './Border';
import { Bar } from './Bar';

export class SwitchBack extends Button {
    readonly sender = this.setSender();
    events = this.bindEvents(
        {
            name: 'click',
            block: this.container,
            callback: this.back
        },
        {
            name: 'keyup',
            block: document,
            callback: this.setShortcut('B', this.back)
        }
    );
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
    back() {
        this.sender.sendMessage('back');
    }
}

export class SwitchForward extends Button {
    readonly sender = this.setSender();
    readonly events = this.bindEvents(
        {
            name: 'click',
            block: this.container,
            callback: this.forward
        },
        {
            name: 'keyup',
            block: document,
            callback: this.setShortcut('F', this.forward)
        }
    );
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
    forward() {
        this.sender.sendMessage('forward');
    }
}

export class PlayPause extends Button {
    readonly events = this.bindEvents(
        {
            name: 'click',
            block: this.container,
            callback: this.toggle
        },
        {
            name: 'keyup',
            block: document,
            callback: this.setShortcut('Space', this.toggle)
        }
    );
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
    toggle() {
        this.sender.sendMessage('toggle');
    }
}

export class LoopToggle extends Button {
    readonly events = this.bindEvents(
        {
            name: 'click',
            block: this.container,
            callback: this.switchCurrentIcon
        },
        {
            name: 'keyup',
            block: document,
            callback: this.setShortcut('L', this.switchCurrentIcon)
        }
    );
    private looped: boolean = true;
    isLooped() {
        return this.looped;
    }
    switchCurrentIcon() {
        this.looped = !this.looped;
        super.switchCurrentIcon();
    }
    readonly sender = this.setSender();
    constructor() {
        super();
        this.states.get('iconsSet').value([
            require('../../../icons/loop-on.svg'),
            require('../../../icons/loop-off.svg')
        ]);
        this.element.attributes.push({
            name: 'alt',
            value: 'button loop'
        });
    }
}

export class VolumeBar extends Bar {
    readonly sender = this.setSender();
    constructor() {
        super();
        const element = this.element;
        element.classes.push('sc---controls__volume-bar');
    }
    mounted() {
        this.states.get('currentValue').value(0.5);
    }
}

export class Controls extends View<HTMLElement> {
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
        new SwitchBack().setName('SwitchBack'),
        new Border(),
        new PlayPause().setName('PlayPause'),
        new Border,
        new SwitchForward().setName('SwitchForward'),
        new Border,
        new LoopToggle().setName('LoopToggle'),
        new Border,
        new VolumeBar().setName('VolumeBar'),
        new Border
    ];
}