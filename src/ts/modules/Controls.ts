import Button from './abstract/Button';
import Bar from './abstract/Bar';
import {Block, Streams, IBlock} from './abstract/Abstract';
import type {IIcons} from './Icons';
import type {PlayerContainer, PlayerContainer__AudioBlock as AudioBlock} from './PlayerContainer';

class Controls__VolumeBar extends Bar implements IBlock {
    AudioBlock: AudioBlock;
    classes = new Streams.Classes(this, 'sc---controls__volume-bar');
    constructor(AudioBlock: AudioBlock) {
        super();
        this.AudioBlock = AudioBlock;
    }
    protected getNewMousemovePosition (event: MouseEvent) {
        const newVolume = super.getNewMousemovePosition(event);
        if (newVolume) this.AudioBlock.volume = newVolume;
    }
    hook() {
        this.changeValues(0.5);
        this.AudioBlock.volume = 0.5;
    }
}

abstract class PausePlayData extends Button {
    isPlay = false;
    AudioBlock: AudioBlock;
    constructor(icons: {pause: string; play: string}, AudioBlock: AudioBlock) {
        super(icons);
        this.AudioBlock = AudioBlock;
    }
}

class Controls__PausePlay extends PausePlayData implements IBlock {
    events = new Streams.Events(this,
        {
            name: 'click',
            block: this.container,
            callback: this.changeIcon
        },
        {
            name: 'ended',
            block: this.AudioBlock.container,
            callback: this.changeIconWhenEndedTrack
        }
    );
    classes = new Streams.Classes(this, 'sc---controls-pause-play');
    constructor(icons: {pause: string; play: string}, AudioBlock: AudioBlock) {
        super(icons, AudioBlock);
        super.changeIcon('play');
    }
    private changeIconWhenEndedTrack() {
        super.changeIcon('play');
        this.isPlay = false;
    }
    changeIcon () {
        if (this.isPlay) {
            super.changeIcon('play');
            this.AudioBlock.pause();
            this.isPlay = false;
        }
        else {
            super.changeIcon('pause');
            this.AudioBlock.play();
            this.isPlay = true;
        }
    }
}

class Controls__SwichTrack extends Button implements IBlock {
    k: 1|-1;
    root: PlayerContainer;
    parent: Controls;
    events = new Streams.Events(this, {
        name: 'click',
        block: this.container,
        callback: this.swichTrack
    });
    constructor(icon: string, k: 1|-1, alt: string, root: PlayerContainer, parent: Controls) {
        super(icon, alt);
        this.root = root;
        this.k = k;
        this.parent = parent;
    }
    swichTrack() {
        this.root.swichTrack(this.k);
        const PausePlay = this.parent.children.get('Controls__PausePlay');
        PausePlay.isPlay = !PausePlay.isPlay;
        PausePlay.changeIcon.call(PausePlay);   
    }
}

class Controls__Border extends Block<HTMLImageElement> implements IBlock {
    attributes = new Streams.Attributes(this, {
        name: 'src',
        value: require('../../../icons/border.svg')
    });
    classes = new Streams.Classes(this, 'sc---controls__border');
    constructor() {
        super('img');
    }
}

abstract class ControlsData extends Block<HTMLElement> {
    icons: IIcons;
    root: PlayerContainer;
    AudioBlock: AudioBlock;
    constructor(icons: IIcons, root: PlayerContainer, AudioBlock: AudioBlock) {
        super('div');
        this.icons = icons;
        this.root = root;
        this.AudioBlock = AudioBlock;
    }
}

export default class Controls extends ControlsData implements IBlock {
    children = new Streams.Children(this, {
        Controls__Border1: new Controls__Border,
        Controls__Back: new Controls__SwichTrack(this.icons.back, -1, 'button back', this.root, this),
        Controls__Border2: new Controls__Border,
        Controls__PausePlay: new Controls__PausePlay(this.icons.playAndPause, this.AudioBlock),
        Controls__Border3: new Controls__Border,
        Controls__Forward: new Controls__SwichTrack(this.icons.forward, 1, 'button forward', this.root, this),
        Controls__Border4: new Controls__Border,
        Controls__VolumeBar: new Controls__VolumeBar(this.AudioBlock),
        Controls__Border5: new Controls__Border
    });
    classes = new Streams.Classes(this, 'sc---controls', 'sc---row', 'sc---row_middle-children');
    constructor(icons: IIcons, AudioBlock: AudioBlock, root: PlayerContainer) {
        super(icons, root, AudioBlock);
    }
}