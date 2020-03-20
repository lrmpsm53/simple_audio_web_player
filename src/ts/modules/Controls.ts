import {Button, ButtonComputed} from './abstract/Button';
import Bar from './abstract/Bar';
import {Block, Addons, Handlers, BlockWithComputingData} from './abstract/Block';
import {interfaceIcons} from './Icons';
import type {PlayerContainer} from './PlayerContainer';

class Controls__VolumeBar extends Bar<Addons.WithClasses> {
    constructor(AudioBlock: Block<HTMLAudioElement>) {
        super(AudioBlock.container);
        this.fixData(Handlers.Classes.fix);
    }
    computedFields(): Addons.WithClasses {
        return {
            classes: ['sc---controls__volume-bar']
        }
    }
    protected getNewMousemovePosition (event: MouseEvent = new MouseEvent('mousemove')) {
        const context = super.getNewMousemovePosition (event);
        if (context) {
            const {value: value, this: _this} = context;
            _this.AudioBlock.volume = value;
        }
    }
    mounted () {
        super.calculateValue(0.5);
        this.AudioBlock.volume = 0.5;
    }
}

class Controls__PausePlay extends Button {
    isPlay = false;
    AudioBlock: Block<HTMLAudioElement>;
    renders = [Handlers.Attributes.render, Handlers.Classes.render, Handlers.Events.render];
    constructor(icons: {pause: string; play: string}, AudioBlock: Block<HTMLAudioElement>) {
        super(icons);
        this.AudioBlock = AudioBlock;
        this.fixData(Handlers.Classes.fix);
        super.changeIcon ('play');
    }
    computedFields(): ButtonComputed & Addons.WithEvents & Addons.WithClasses {
        const _super = super.computedFields();
        return Object.assign(
            _super, 
            {
                events: [
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
                ],
                classes: ['sc---controls-pause-play']
            }
        )
    }
    private changeIconWhenEndedTrack() {
        super.changeIcon('play');
        this.isPlay = false;
    }
    public changeIcon () {
        if (this.isPlay) {
            super.changeIcon('play');
            this.AudioBlock.container.pause();
            this.isPlay = false;
        }
        else {
            super.changeIcon('pause');
            this.AudioBlock.container.play();
            this.isPlay = true;
        }
    }
}

class Controls__SwichTrack extends Button implements Addons.WithEvents {
    k: 1|-1;
    root: PlayerContainer;
    parent: Controls;
    events = [{
            name: 'click',
            block: this.container,
            callback: this.swichTrack
    }]
    renders = [Handlers.Attributes.render, Handlers.Classes.render, Handlers.Events.render];
    constructor(icon: string, k: 1|-1, alt: string, root: PlayerContainer, parent: Controls) {
        super(icon, alt);
        this.root = root;
        this.k = k;
        this.parent = parent;
        this.fixData(Handlers.Attributes.fix);
    }
    swichTrack() {
        this.root.swichTrack(this.k);
        const PausePlay = ((this.parent.children as i_ControlsChildren).Controls__PausePlay as Controls__PausePlay)
        PausePlay.isPlay = !PausePlay.isPlay;
        PausePlay.changeIcon.call(PausePlay);   
    }
}

class Controls__Border extends Block<HTMLImageElement> {
    attributes = [{
        name: 'src',
        value: require('../../../icons/border.svg')
    }]
    classes = ['sc---classes__border'];
    renders = [Handlers.Classes.render, Handlers.Attributes.render];
    constructor() {
        super('img');
    }
}

interface i_ControlsChildren {
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

export class Controls 
    extends BlockWithComputingData<HTMLElement, Addons.WithChildren<i_ControlsChildren>> 
    implements Addons.WithChildren, Addons.WithClasses {
    children = {};
    classes = ['sc---controls', 'sc---row', 'sc---row_middle-children'];
    renders = [Handlers.Classes.render, Handlers.Children.render];
    constructor(icons: interfaceIcons, AudioBlock: Block<HTMLAudioElement>, root: PlayerContainer) {
        super('div');
        this.constructorData <interfaceIcons> ('iconsTheme', icons);
        this.constructorData <Block<HTMLAudioElement>> ('AudioBlock', AudioBlock);
        this.constructorData <PlayerContainer> ('root', root);
        this.fixData(Handlers.Children.fix);
    }
    computedFields() {
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