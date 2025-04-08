import './player.scss';
import Player from './Player';

/** @type HTMLElement|null */
const playerElement = document.querySelector('.player');
const player = playerElement ? new Player(playerElement) : null;

export default player;
