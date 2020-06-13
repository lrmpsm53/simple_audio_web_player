const Player = require('./src/ts/index');

const playlist = [
    {
        name: 'We Are The Champions',
        source: './audio/audio1.mp3'
    },
    {
        name: 'I Want To Break Free',
        source: './audio/audio2.mp3'
    }
];

const container = document.createElement('div');
container.classList.add('container')
document.body.append(container);

const containers = document.getElementsByClassName('container');
Player(containers, playlist);