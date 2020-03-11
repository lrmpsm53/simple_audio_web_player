import './modules/styles';
import {PlayerContainer, i_track} from './modules/PlayerContainer';

console.info (
    `
    Thank you for using my product.
    if you find a mistake or have any 
    wishes - contact me
    orlov.dmitriy2303@outlook.com
    `
);

module.exports = (
    containers: HTMLCollectionOf<HTMLElement>,
    playlist: i_track[]
    ) => 
    Array.from(containers).map (
        container => new PlayerContainer(container, 'orange', playlist).render()
    );