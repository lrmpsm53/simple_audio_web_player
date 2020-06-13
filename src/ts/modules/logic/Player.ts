import { Main } from '../Abstract/Abstract';
import { PlayerContainer } from '../views/PlayerContainer';
import type { Audio } from '../views/Audio';
import { SwitchTrack } from './SwitchTrack';
import { TrackParams } from './TrackParams'
import { ChangeProgress } from './ChangeProgress';

export interface ISong {
    readonly name: string;
    readonly source: string;
}

export class Player extends Main<PlayerContainer> {
    readonly View = this.insertView(new PlayerContainer);
    readonly Audio = this.View.getChild('Audio') as Audio;
    readonly states = this.setStates({Songs: { value: [] as ISong[] } });
    readonly sender = this.setSender();
    readonly Switchtrack = new SwitchTrack(this);
    readonly TrackParams = new TrackParams(this);
    readonly ChangeProgress = new ChangeProgress(this);
    addSongs(...songs: ISong[]) {
        this.states.get('Songs').value(songs);
        this.sender.sendMessage('addSongs');
    }
}