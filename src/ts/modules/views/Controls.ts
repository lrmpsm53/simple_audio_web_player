import { View } from '../Abstract/Abstract';
import { Button } from './Button';
import { Border } from './Border';
import { Bar } from './Bar';

export class SwitchBack extends Button {
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
    readonly events = this.bindEvents({
        name: 'click',
        block: this.container,
        callback: this.switchCurrentIcon
    });
    switchCurrentIcon() {
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

export class LoopToggle extends Button {
    readonly events = this.bindEvents({
        name: 'click',
        block: this.container,
        callback: this.switchCurrentIcon
    });
    private looped: boolean = true;
    isLooped() {
        return this.looped;
    }
    protected switchCurrentIcon() {
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
        this.states.push({  });
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
        this.sender.sendMessage('mounted');
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