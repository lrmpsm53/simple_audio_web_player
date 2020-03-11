export interface interfaceIcons {
    back: string;
    forward: string;
    playAndPause: {
        play: string;
        pause: string;
    }
}

const iconsPack: Map<string, interfaceIcons> = new Map (
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

export class Icons implements interfaceIcons {
    [property:string]: string|object;
    back:string;
    forward:string;
    playAndPause: {play: string; pause: string};
    constructor(iconsThemeName: string) {
        let thisIconTheme: interfaceIcons = iconsPack.get(iconsThemeName) as interfaceIcons;
        this.back = thisIconTheme.back;
        this.forward = thisIconTheme.forward;
        this.playAndPause = thisIconTheme.playAndPause;
    }
}