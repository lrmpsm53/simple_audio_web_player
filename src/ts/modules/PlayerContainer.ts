import { Icons, IIcons } from './Icons';
import { Block, Streams } from './abstract/Abstract';
import Controls from './Controls';
import TrackName from './TrackName';
import Time from './Time';
import Bar from './abstract/Bar';

class PlayerContainer__ProgressBar extends Bar {
    AudioBlock: PlayerContainer__AudioBlock;
    classes = new Streams.Classes(this, 'sc---progress-bar');
    constructor(AudioBlock: PlayerContainer__AudioBlock) {
        super();
        this.AudioBlock = AudioBlock;
        this.events = new Streams.Events(this, {
            name: 'timeupdate',
            block: this.AudioBlock.container,
            callback: this.updateProgress
        })
    }
    getNewMousemovePosition(event: MouseEvent) {
        const newTime = super.getNewMousemovePosition(event);
        if (newTime) this.AudioBlock.currentTime = newTime * this.AudioBlock.duration;
    }
    updateProgress() {
        const duration = this.AudioBlock.duration;
        const currentTime = this.AudioBlock.currentTime;
        this.changeValues(currentTime / duration);
    }
}

export interface ISong {
    name: string;
    source: string;
}

export class PlayerContainer__AudioBlock extends Block<HTMLAudioElement> {
    constructor() {
        super('audio');
    }
    attributes = new Streams.Attributes(this,
        { name: 'preload', value: 'auto' },
        { name: 'type', value: 'audio/mp3' }
    )
    set src(source: string) {
        this.container.src = source;
    }
    get src() {
        return this.container.src;
    }
    get duration() {
        return this.container.duration;
    }
    get currentTime() {
        return this.container.currentTime;
    }
    set currentTime(value: number) {
        this.container.currentTime = value;
    }
    set volume(value: number) {
        this.container.volume = value;
    }
    get volume() {
        return this.container.volume;
    }
    pause = () => this.container.pause();
    play = () => this.container.play();
}

abstract class PlayerContainerData extends Block<HTMLElement> {
    isRoot = true;
    protected icons: IIcons;
    protected playlist: ISong[];
    protected songNumer: number = 0;
    protected AudioBlock = new PlayerContainer__AudioBlock;
    protected currentSizesSum = 0;
    protected sizes = [375, 600, 800, 1024, 1280, 1440, 1680, 1920];
    constructor(root: HTMLElement, iconsTheme: string, playlist: ISong[]) {
        super(root);
        this.icons = new Icons(iconsTheme);
        this.playlist = playlist;
    }
}

export class PlayerContainer extends PlayerContainerData {
    children = new Streams.Children(this, {
        TrackName: new TrackName,
        PLayer__AudioBlock: this.AudioBlock,
        Controls: new Controls(this.icons, this.AudioBlock, this),
        Player__TimeCurrent: new Time('current', this.AudioBlock),
        Player__ProgressBar: new PlayerContainer__ProgressBar(this.AudioBlock),
        Player__TimeLeft: new Time('left', this.AudioBlock),
    });
    events = new Streams.Events(this, { name: 'resize', block: window, callback: this.updateSize });
    classes = new Streams.Classes(this, 'sc---row', 'sc---row_middle-children', 'sc---player');
    constructor(root: HTMLElement, iconsTheme: string, playlist: ISong[]) {
        super(root, iconsTheme, playlist);
        this.updateSize();
        this.swichTrack(0);
    }
    swichTrack(trackNumerKey: number) {
        this.songNumer = this.songNumer + trackNumerKey;
        switch (this.songNumer) {
            case -1: this.songNumer = this.playlist.length - 1
                break;
            case this.playlist.length: this.songNumer = 0;
        }
        const root = this.children;
        root.get('TrackName').updateName(this.playlist[this.songNumer].name);
        root.get('PLayer__AudioBlock').src = this.playlist[this.songNumer].source;
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
        if (result.length == 0) {
            this.currentSizesSum = 1;
            this.classes.push(`_${this.sizes[this.sizes.length - 1]}px`);
        }
        else {
            this.currentSizesSum = result.length;
            result.forEach(elem => this.classes.push(`_${elem}px`));
        }
    }
}