import {Button, i_ButtonContext} from './abstract/Button';
import {Bar, i_BarContext} from './abstract/Bar';
import {Block, i_computedDataInstance, i_children} from './abstract/Block';
import {interfaceIcons} from './Icons';
import {PlayerContainer} from './PlayerContainer';

class Controls__VolumeBar extends Bar {
    constructor(AudioBlock: Block<HTMLAudioElement>) {
        super(AudioBlock.container);
        this.fixData();
    }
    computedFields() {
        return {
            classes: ['sc---controls__volume-bar']
        }
    }
    protected getNewMousemovePosition (event: MouseEvent = new MouseEvent('mousemove')) {
        const context = super.getNewMousemovePosition (event);
        if (context) {
            const {value: value, _this: _this} = context;
            _this.AudioBlock.volume = value;
        }
    }
    mounted () {
        super.calculateValue(0.5, this.contextFields as unknown as i_BarContext);
        this.contextFields.AudioBlock.volume = 0.5;
    }
}

interface i_PlayPauseContext {
    isPlay:boolean;
    AudioBlock: Block<HTMLAudioElement>;
    super_changeIcon: (icon: string) => void;
}

class Controls__PausePlay extends Button {
    contextFields = {} as i_ButtonContext<i_PlayPauseContext> | i_PlayPauseContext; 
    constructor(icons: {pause: string; play: string}, AudioBlock: Block<HTMLAudioElement>) {
        super(icons);
        this.constructorData <Block<HTMLAudioElement>> ('AudioBlock', AudioBlock);
        this.fixData();
        super.changeIcon ('play', this.contextFields as i_ButtonContext<i_PlayPauseContext>);
    }
    computedFields() {
        return Object.assign (
            super.computedFields(),
            {
                events: [
                    {
                        name: 'click',
                        block: this.container,
                        callback: this.changeIcon
                    },
                    {
                        name: 'ended',
                        block: this.constructorData <Block<HTMLAudioElement>> ('AudioBlock').container,
                        callback: this.changeIconWhenEndedTrack
                    }
                ],
                classes: ['sc---controls-pause-play']
            }
        )
    }
    computedContextFields() {
        return Object.assign (
            super.computedContextFields(),
            {
                isPlay: false,
                AudioBlock: this.constructorData <Block<HTMLAudioElement>> ('AudioBlock'),
                super_changeIcon: super.changeIcon
            }
        )
    }
    private changeIconWhenEndedTrack(this: i_PlayPauseContext) {
        this.super_changeIcon('play');
        this.isPlay = false;
    }
    public changeIcon (this: i_PlayPauseContext) {
        if (this.isPlay) {
            this.super_changeIcon('play');
            this.AudioBlock.container.pause();
            this.isPlay = false;
        }
        else {
            this.super_changeIcon('pause');
            this.AudioBlock.container.play();
            this.isPlay = true;
        }
    }
}

interface i_swichTrackContext {
    root: PlayerContainer;
    k: 1|-1;
    parent: Controls;
}

class Controls__SwichTrack extends Button {
    events = [{
            name: 'click',
            block: this.container,
            callback: this.swichTrack
    }]
    constructor(icon: string, k: 1|-1, alt: string, root: PlayerContainer, parent: Controls) {
        super(icon, alt);
        this.constructorData <PlayerContainer> ('root', root);
        this.constructorData <1|-1> ('k', k);
        this.constructorData <Controls> ('parent', parent);
        this.fixData();
    }
    computedContextFields () {
        return Object.assign (
            super.computedContextFields(),
            {
                root: this.constructorData <PlayerContainer> ('root'),
                k: this.constructorData <1|-1> ('k'),
                parent: this.constructorData <Controls> ('parent'),
            }
        )
    }
    swichTrack(this: i_swichTrackContext) {
        this.root.swichTrack(this.k);
        const PausePlay = (this.parent.children?.Controls__PausePlay as Controls__PausePlay)
        PausePlay.contextFields.isPlay = !PausePlay.contextFields.isPlay;
        PausePlay.changeIcon.call(PausePlay.contextFields as i_PlayPauseContext);   
    }
}

class Controls__Border extends Block<HTMLImageElement> {
    constructor() {
        super('img');
        this.fixData();
    }
    attributes = [{
            name: 'src',
            value: require('../../../icons/border.svg')
    }]
    classes = ['sc---classes__border'];
}

interface i_ControlsChildren extends i_children {
    Controls__Border1: Controls__Border;
    Controls__Back: Controls__SwichTrack;
    Controls__Border2: Controls__Border;
    Controls__PausePlay: Controls__PausePlay;
    Controls__Border3: Controls__Border;
    Controls__Forward: Controls__SwichTrack;
    Controls__Border4: Controls__Border;
    Controls__VolumeBar: Controls__VolumeBar;
    Controls__Border5: Controls__Border;
}

export class Controls extends Block<HTMLElement> {
    classes = ['sc---controls', 'sc---row', 'sc---row_middle-children'];
    constructor(icons: interfaceIcons, AudioBlock: Block<HTMLAudioElement>, root: PlayerContainer) {
        super('div');
        this.constructorData <interfaceIcons> ('iconsTheme', icons);
        this.constructorData <Block<HTMLAudioElement>> ('AudioBlock', AudioBlock);
        this.constructorData <PlayerContainer> ('root', root);
        this.fixData();
    }
    computedFields(): i_computedDataInstance<i_ControlsChildren> {
        return {
            children: {
                Controls__Border1: new Controls__Border,
                Controls__Back: new Controls__SwichTrack (
                    this.constructorData <interfaceIcons> ('iconsTheme').back,
                    -1,
                    'button back',
                    this.constructorData <PlayerContainer> ('root'),
                    this
                ),
                Controls__Border2: new Controls__Border,
                Controls__PausePlay: new Controls__PausePlay (
                    this.constructorData <interfaceIcons> ('iconsTheme').playAndPause,
                    this.constructorData <Block<HTMLAudioElement>> ('AudioBlock')
                ),
                Controls__Border3: new Controls__Border,
                Controls__Forward: new Controls__SwichTrack (
                    this.constructorData <interfaceIcons> ('iconsTheme').forward,
                    1,
                    'button forward',
                    this.constructorData <PlayerContainer> ('root'),
                    this
                ),
                Controls__Border4: new Controls__Border,
                Controls__VolumeBar: new Controls__VolumeBar (
                    this.constructorData <Block<HTMLAudioElement>> ('AudioBlock')
                ),
                Controls__Border5: new Controls__Border
            }
        }
    }
}