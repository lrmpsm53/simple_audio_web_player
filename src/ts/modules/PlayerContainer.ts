import {Icons, interfaceIcons} from './Icons';
import {Block, i_children, i_computedDataInstance} from './abstract/Block';
import {Controls} from './Controls';
import {TrackName} from './TrackName';
import Time from './Time';
import {Bar} from './abstract/Bar';

interface i_ProgressBar extends PlayerContainer__ProgressBar {
    AudioBlock: HTMLAudioElement;
}

class PlayerContainer__ProgressBar extends Bar {
    constructor(AudioBlock: HTMLAudioElement) {
        super(AudioBlock);
        this.constructorData <HTMLAudioElement> ('AudioBlock', AudioBlock);
        this.fixData();
    }
    computedFields() {
        return {
            classes: ['sc---progress-bar'],
            events: [{
                name: 'timeupdate',
                block: this.constructorData <HTMLElement> ('AudioBlock'),
                callback: this.updateProgress
            }]
        }
    } 
    getNewMousemovePosition (event: MouseEvent = new MouseEvent('mousemove')) {
        const context = super.getNewMousemovePosition (event);
        if (context) {
            const {value: value, _this: _this} = context;
            const duration = _this.AudioBlock.duration;
            _this.AudioBlock.currentTime = value * duration;
        }
    }
    updateProgress(event: AudioNode = new AudioNode, _this = this as unknown as i_ProgressBar) {
        const duration = _this.AudioBlock.duration;
        const currentTime = _this.AudioBlock.currentTime;
        super.calculateValue(currentTime / duration);
    }

}

export interface i_track {
    name: string;
    source: string;
}

class PlayerContainer__AudioBlock extends Block <HTMLAudioElement> {
    constructor () {
        super ('audio');
        this.fixData ();
    }
    attributes = [
        {name: 'preload', value: 'auto'},
        {name: 'type', value: 'audio/mp3'}
    ];
    updateSource (source: string) {
        this.container.src = source;
    }
}

interface i_PlayerChildren extends i_children {
    TrackName: TrackName;
    PLayer__AudioBlock: PlayerContainer__AudioBlock;
    Controls: Controls;
    Player__TimeCurrent: Time;
    Player__ProgressBar: PlayerContainer__ProgressBar;
    Player__TimeLeft: Time;
}

export class PlayerContainer extends Block <HTMLElement> {
    private trackNumer: number = 0;
    private playlist: i_track[] = [];
    classes = ['sc---row', 'sc---row_middle-children', 'sc---player'];
    children?: i_PlayerChildren;
    constructor(root: HTMLElement, iconsThemeName: string, tracks: i_track[]) {
        super(root);
        this.constructorData <interfaceIcons> ('icons', new Icons(iconsThemeName));
        this.constructorData <i_track[]>('tracks', tracks);
        this.fixData();
        this.swichTrack(0);
    }
    computedFields(): i_computedDataInstance<i_PlayerChildren> {
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
    swichTrack(trackNumerK: number) {
        this.trackNumer = this.trackNumer + trackNumerK;
        switch(this.trackNumer) {
            case -1: this.trackNumer = this.playlist.length - 1
            break;
            case this.playlist.length: this.trackNumer = 0
            break;
        }
        const root = (this.children as i_PlayerChildren);
        root.TrackName.updateName(this.playlist[this.trackNumer].name);
        root.PLayer__AudioBlock.updateSource(this.playlist[this.trackNumer].source);
    }
}