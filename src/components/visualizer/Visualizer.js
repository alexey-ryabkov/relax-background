import { isUndefined } from 'lodash';
import Component from '../../app/Component';
import { cssAnimation } from '../../app/utils';

export default class Visualizer extends Component {
  /**
   * @param {HTMLElement} element
   */
  constructor(element) {
    super(element, 'visualizer');
  }

  get _footage() {
    return /** @type HTMLVideoElement */ (
      this._getElement('footage', 'current')
    );
  }

  get _nextFootage() {
    return /** @type HTMLVideoElement */ (this._getElement('footage', 'next'));
  }

  get _currentCls() {
    return this._getElemModificationCls('footage', 'current');
  }

  get _nextCls() {
    return this._getElemModificationCls('footage', 'next');
  }

  /**
   * @param {string} src
   */
  set nextFootage(src) {
    this._nextFootage.addEventListener(
      'canplay',
      () => this._emit('footage-loaded'),
      { once: true },
    );
    this._nextFootage.src = src;
    this._nextFootage.setAttribute('preload', 'auto');
    this._nextFootage.load();
  }

  /**
   * @param {boolean} [flag]
   */
  async togglePlaying(flag) {
    if (flag === this.isPlaying()) return;
    if (isUndefined(flag)) {
      flag = !this.isPlaying();
    }
    this._footage[flag ? 'play' : 'pause']();
    this._emit('playing:toggle', { flag });
  }

  async replaceFootage() {
    if (this._nextFootage.src && this._nextFootage.src !== this._footage.src) {
      const currentFootage = this._footage;
      const nextFootage = this._nextFootage;
      const replaceAnimation = Promise.all([
        cssAnimation(currentFootage, 'transition'),
        cssAnimation(nextFootage, 'transition'),
      ]).then(() => {
        this._emit('footage-replaced');
      });
      currentFootage.classList.replace(this._currentCls, this._nextCls);
      nextFootage.classList.replace(this._nextCls, this._currentCls);
      return replaceAnimation;
    }
  }

  isPlaying() {
    return (
      !this._footage.paused &&
      !this._footage.ended &&
      this._footage.readyState > 2
    );
  }

  _init() {
    // nothing to do...
  }
}
