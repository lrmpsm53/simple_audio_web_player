export interface IIcons {
    back: string;
    forward: string;
    playAndPause: {
        play: string;
        pause: string;
    }
}

const iconsPack: Map<string, IIcons> = new Map (
    [
        [
            'orange', 
            {
                back: require('../../../icons/orange/back.svg'),
                forward: require('../../../icons/orange/forward.svg'),
                playAndPause: {
                    play: require('../../../icons/orange/play.svg'),
                    pause: require('../../../icons/orange/pause.svg')
                }
            }
        ]
    ]
)

export class Icons implements IIcons {
    [property:string]: string|object;
    back:string;
    forward:string;
    playAndPause: {play: string; pause: string};
    constructor(iconsThemeName: string) {
        let thisIconTheme: IIcons = iconsPack.get(iconsThemeName) as IIcons;
        this.back = thisIconTheme.back;
        this.forward = thisIconTheme.forward;
        this.playAndPause = thisIconTheme.playAndPause;
    }
}