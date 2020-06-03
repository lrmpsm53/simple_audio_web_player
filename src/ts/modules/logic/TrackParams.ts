import { Logic } from '../Abstract/Abstract';
import type { Player } from './Player';
import type { PlayPause, VolumeBar } from '../views/Controls';

export class TrackParams extends Logic<Player> {
    TogglePlaying = new TogglePlaying(this.Main);
    ChngeVolume = new ChangeVolume(this.Main);
}

class TogglePlaying extends Logic<Player> {
    PlayPause = this.Main.Controls.ViewTree.get('PlayPause') as PlayPause;
    isPlay = this.Main.Audio.states.get('isPlay');
    recipient = this.setRecipient({
        toggle: this.togglePlaying
    })
    .addSender(this.PlayPause.sender);
    togglePlaying() {
        this.isPlay.value(!this.isPlay.value());
    }
}

class ChangeVolume extends Logic<Player> {
    VolumeBar = this.Main.Controls.ViewTree?.get('VolumeBar') as VolumeBar;
    VolumeBarStates = this.VolumeBar.states;
    states = this.setStates({
        current: this.createState(0)
            .setBind(this.Main.Audio.states.get('currentVolume'))
            .setReverseBind(this.VolumeBarStates.get('currentValue'))
    });
    recipient = this.setRecipient({
        mounted: this.mounted
    })
    .addSender(this.VolumeBar.sender);
    mounted() {
        setTimeout(
            () => this.VolumeBar.states.get('currentValue').value(0.5)
        , 0);
    }
}