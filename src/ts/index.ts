import './modules/styles/styles.ts';
import { Player, ISong } from './modules/logic/Player';

console.info (
    `
    Thank you for using my product.
    if you find a mistake or have any 
    wishes - contact me
    orlov.dmitriy2303@outlook.com
    `
);

function PlayerInit(containers: HTMLCollectionOf<Element>, playlist: ISong[]) {
    const containersArr = Array.from(containers);
    containersArr.map(container => {
        const player = new Player;
        player.mountTree(container as HTMLElement);
        player.addSongs(...playlist);
    })
}

module.exports = PlayerInit;