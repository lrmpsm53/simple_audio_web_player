import { Main } from '../Abstract/Abstract';
import { PlayerContainer } from '../views/PlayerContainer';
import type { Audio } from '../views/Audio';
import type { Controls } from '../views/Controls';
import { SwitchTrack } from './SwitchTrack';
import { TrackParams } from './TrackParams'
import { ChangeProgress } from './ChangeProgress';

export interface ISong {
    name: string;
    source: string;
}

export class Player extends Main<PlayerContainer> {
    View = this.insertView(new PlayerContainer);
    Audio = this.View.ViewTree.get('Audio') as Audio;
    Controls = this.View.ViewTree.get('Controls') as Controls;
    states = this.setStates({
        Songs: this.createState([] as ISong[])
    });
    sender = this.setSender();
    Switchtrack = new SwitchTrack(this);
    TrackParams = new TrackParams(this);
    ChangeProgress = new ChangeProgress(this);
    addSongs(...songs: ISong[]) {
        this.states.get('Songs').value(songs);
        this.sender.sendMessage('addSongs');
    }
}