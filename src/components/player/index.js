import './player.scss';
import Player from './Player';

export default new Player(
  /** @type HTMLElement */ (document.querySelector('.player')),
);
