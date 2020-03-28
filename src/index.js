import './index.html';
import Player from './ts/index.ts';

const playlist = [
    {
        name: 'We Are The Champions',
        source: '../audio/audio1.mp3'
    },
    {
        name: 'I Want To Break Free',
        source: '../audio/audio2.mp3'
    }
];

Player (
    document.getElementsByClassName('container'),
    playlist
)