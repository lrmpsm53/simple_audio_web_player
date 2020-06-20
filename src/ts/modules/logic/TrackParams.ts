import { Logic } from '../Abstract/Abstract';
import type { Player } from './Player';
import type { PlayPause, VolumeBar } from '../views/Controls';

export class TrackParams extends Logic<Player> {
    readonly TogglePlaying = new TogglePlaying(this.Main);
    readonly ChngeVolume = new ChangeVolume(this.Main);
}

class TogglePlaying extends Logic<Player> {
    readonly PlayPause = this.Main.View.getChild('PlayPause') as PlayPause;
    readonly isPlay = this.Main.Audio.states.get('isPlay');
    readonly recipient = this.setRecipient(
        {
            toggle: () => this.isPlay.value(!this.isPlay.value()),
            play: () => this.PlayPause.states.get('currentIcon').value(1),
            pause: () => this.PlayPause.states.get('currentIcon').value(0)
        },
        [
            this.PlayPause.sender,
            this.Main.Switchtrack.sender,
            this.Main.Audio.sender
        ]
    );
}

class ChangeVolume extends Logic<Player> {
    readonly VolumeBar = this.Main.View.getChild('VolumeBar') as VolumeBar;
    readonly VolumeBarStates = this.VolumeBar.states;
    readonly states = this.setStates({
        current: {
            value: 0,
            binds: [ this.Main.Audio.states.get('currentVolume') ],
            reverseBinds: [ this.VolumeBarStates.get('currentValue') ]
        }
    });
}