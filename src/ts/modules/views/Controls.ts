import { View } from '../Abstract/Abstract';
import { Button } from './Button';
import { Border } from './Border';
import { Bar } from './Bar';

export class SwitchBack extends Button {
    sender = this.setSender();
    events = this.bindEvents({
        name: 'click',
        block: this.DOMElement.container,
        callback: () => this.sender.sendMessage('back')
    });
    constructor() {
        super();
        this.states.get('iconsSet').value([
            require('../../../icons/back.svg')
        ]);
        this.DOMElement.attributes.push({
            name: 'alt',
            value: 'button forward'
        });
    }
}

export class SwitchForward extends Button {
    sender = this.setSender();
    events = this.bindEvents({
        name: 'click',
        block: this.DOMElement.container,
        callback: () => this.sender.sendMessage('forward')
    });
    constructor() {
        super();
        this.states.get('iconsSet').value([
            require('../../../icons/forward.svg')
        ]);
        this.DOMElement.attributes.push({
            name: 'alt',
            value: 'button forward'
        });
    }
}

export class PlayPause extends Button {
    events = this.bindEvents({
        name: 'click',
        block: this.DOMElement.container,
        callback: this.switchCurrentIcon
    });
    switchCurrentIcon() {
        this.sender.sendMessage('toggle');
        super.switchCurrentIcon();
    }
    sender = this.setSender();
    constructor() {
        super();
        this.states.get('iconsSet').value([
            require('../../../icons/play.svg'),
            require('../../../icons/pause.svg')
        ]);
        this.DOMElement.attributes.push({
            name: 'alt',
            value: 'button play/pause'
        });
    }
}

export class VolumeBar extends Bar {
    sender = this.setSender();
    constructor() {
        super();
        const element = this.DOMElement;
        element.classes.push('sc---controls__volume-bar');
    }
    mounted() {
        this.sender.sendMessage('mounted');
    }
}

export class Controls extends View<HTMLElement> {
    DOMElement = this.createDOMElement('div')
        .classes.append(
            'sc---controls',
            'sc---row',
            'sc---row_middle-children'
        );
    ViewTree = this.createViewTree([
        {
            element: new Border
        },
        {
            name: 'SwitchBack',
            element: new SwitchBack
        },
        {
            element: new Border
        },
        {
            name: 'PlayPause',
            element: new PlayPause
        },
        {
            element: new Border
        },
        {
            name: 'SwitchForward',
            element: new SwitchForward
        },
        {
            element: new Border
        },
        {
            name: 'VolumeBar',
            element: new VolumeBar
        },
        {
            element: new Border
        }
    ]);
}