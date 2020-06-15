import { Logic } from '../Abstract/Abstract';
import type { Player } from './Player';
import type { TrackName } from '../views/TrackName';
import type { SwitchBack, SwitchForward, LoopToggle } from '../views/Controls';

export class SwitchTrack extends Logic<Player> {
    readonly Songs = this.Main.states.get('Songs');
    readonly TrackName = this.Main.View.getChild('TrackName') as TrackName;
    readonly SwitchBack = this.Main.View.getChild('SwitchBack') as SwitchBack;
    readonly SwitchForward = this.Main.View.getChild('SwitchForward') as SwitchForward;
    readonly LoopToggle = this.Main.View.getChild('LoopToggle') as LoopToggle;
    readonly states = this.setStates({
        currentSong: {
            value: 0,
            callbacks: [ this.updateViews ]
        }
    });
    readonly recipient = this.setRecipient(
        {
            back: () => this.switchTrack(-1),
            forward: () => this.switchTrack(1),
            ended: () => {
                if(this.LoopToggle.isLooped()) {
                    this.switchTrack(1);
                    this.Main.Audio.states.get('isPlay').value(true);
                }
                else this.sender.sendMessage('switchIcon');
            },
            addSongs: () => this.updateViews(0)
        },
        [
            this.SwitchBack.sender,
            this.SwitchForward.sender,
            this.Main.Audio.sender,
            this.Main.sender
        ]
    );
    readonly sender = this.setSender();
    updateViews(index: number) {
        const track = this.Songs.value()[index];
        this.TrackName.states.get('Name').value(track.name);
        this.Main.Audio.states.get('src').value(track.source);
    }
    private isPlaying() {
        return this.Main.Audio.states.get('isPlay').value();
    }
    updateParamms() {
        if (this.isPlaying())
        this.Main.Audio.states.get('isPlay').value(true, 'forcibly')
        else
        this.sender.sendMessage('timeupdate');
    }
    switchTrack(k: 1|-1) {
        const index = this.states.get('currentSong');
        let indexValue = index.value();
        const tracksSum = this.Songs.value().length - 1;
        indexValue += k;
        if (0 <= indexValue && indexValue <= tracksSum) {
            index.value(indexValue, 'forcibly');
        }
        else {
            if (k === 1 && indexValue > tracksSum) {
                index.value(0);
            }
            if (k === -1 && indexValue < 0) {
                index.value(tracksSum, 'forcibly');
            }
        }
        this.updateParamms();
    }
}