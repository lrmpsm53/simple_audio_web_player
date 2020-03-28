import {Icons, interfaceIcons} from './Icons';
import {BlockWithComputingData, Block, Addons, Handlers, Streams} from './abstract/Abstract';
import {Controls} from './Controls';
import {TrackName} from './TrackName';
import Time from './Time';
import Bar from './abstract/Bar';

class PlayerContainer__ProgressBar extends Bar<Addons.WithClasses & Addons.WithEvents> {
    constructor(AudioBlock: HTMLAudioElement) {
        super(AudioBlock);
        this.constructorData <HTMLAudioElement> ('AudioBlock', AudioBlock);
        this.fixData(Handlers.Classes.fix, Handlers.Events.fix);
    }
    computedFields() {
        return Object.assign(
            super.computedFields(),
            {
                classes: ['sc---progress-bar'],
                events: [{
                    name: 'timeupdate',
                    block: this.constructorData <HTMLElement> ('AudioBlock'),
                    callback: this.updateProgress
                }]
            }
        )
    }
    getNewMousemovePosition(event: MouseEvent) {
        const context = super.getNewMousemovePosition(event);
        if (context) {
            const {value: value, this: _this} = context;
            const duration = _this.AudioBlock.duration;
            _this.AudioBlock.currentTime = value * duration;
        }
    }
    updateProgress() {
        const duration = this.AudioBlock.duration;
        const currentTime = this.AudioBlock.currentTime;
        this.calculateValue(currentTime / duration);
    }
}

export interface i_track {
    name: string;
    source: string;
}

class PlayerContainer__AudioBlock extends Block <HTMLAudioElement> implements Addons.WithAttributes {
    renders = [Handlers.Attributes.render];
    constructor () {
        super ('audio');
    }
    attributes = [
        {name: 'preload', value: 'auto'},
        {name: 'type', value: 'audio/mp3'}
    ];
    updateSource (source: string) {
        this.container.src = source;
    }
}

interface PlayerChildren {
    TrackName: TrackName;
    PLayer__AudioBlock: PlayerContainer__AudioBlock;
    Controls: Controls;
    Player__TimeCurrent: Time;
    Player__ProgressBar: PlayerContainer__ProgressBar;
    Player__TimeLeft: Time;
}

type PlayerComputed = Addons.WithChildren<PlayerChildren>

export class PlayerContainer 
    extends BlockWithComputingData <HTMLElement, PlayerComputed> 
    implements Addons.WithClasses 
{
    private trackNumer: number = 0;
    private playlist: i_track[] = [];
    classes = new Streams.Classes(
        ['sc---row', 'sc---row_middle-children', 'sc---player'], 
        this.container
    );
    private currentSizesSum = 0;
    private sizes = [375, 600, 800, 1024, 1280, 1440, 1680, 1920];
    children = {};
    events = [{
        name: 'resize',
        block: window,
        callback: this.updateSize
    }]
    renders = [Handlers.Children.render, Handlers.Classes.render, Handlers.Events.render];
    constructor(root: HTMLElement, iconsThemeName: string, tracks: i_track[]) {
        super(root);
        this.constructorData <interfaceIcons> ('icons', new Icons(iconsThemeName));
        this.constructorData <i_track[]>('tracks', tracks);
        this.fixData(Handlers.Children.fix);
        this.updateSize();
        this.swichTrack(0);
    }
    computedFields() {
        const cache = new PlayerContainer__AudioBlock;
        return {
            playlist: this.constructorData <i_track[]> ('tracks'),
            children: {
                TrackName: new TrackName,
                PLayer__AudioBlock: cache,
                Controls: new Controls (this.constructorData('icons') , cache, this),
                Player__TimeCurrent: new Time ('current', cache.container),
                Player__ProgressBar: new PlayerContainer__ProgressBar (cache.container),
                Player__TimeLeft: new Time ('left', cache.container),
            }
        }
    }
    updateSize() {
        if (this.currentSizesSum != 0) {
            for (let i = 1; i <= this.currentSizesSum; i++) this.classes.pop();
        }
        const currentSize = this.container.offsetWidth;
        const result = this.sizes.reduce((total, elem) => {
            if (elem >= currentSize) {
                total.push(elem);
                return total;
            } else return total;
        }, new Array);
        if(result.length == 0) {
            this.currentSizesSum = 1;
            this.classes.push(`_${this.sizes[this.sizes.length-1]}px`);
        }
        else {
            this.currentSizesSum = result.length;
            result.forEach(elem => this.classes.push(`_${elem}px`));
        }
    }
    swichTrack(trackNumerKey: number) {
        this.trackNumer = this.trackNumer + trackNumerKey;
        switch(this.trackNumer) {
            case -1: this.trackNumer = this.playlist.length - 1
            break;
            case this.playlist.length: this.trackNumer = 0;
        }
        const root = (this.children as PlayerChildren);
        root.TrackName.updateName(this.playlist[this.trackNumer].name);
        root.PLayer__AudioBlock.updateSource(this.playlist[this.trackNumer].source);
    }
}