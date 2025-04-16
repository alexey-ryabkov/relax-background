import { first, indexOf, isUndefined, last } from 'lodash';
import Component from '../../app/Component';
import {
  delayer,
  rotateElement,
  cssAnimation,
  parseAnimationTime,
} from '../../app/utils';

export default class Player extends Component {
  /** @type Eventful|undefined **/
  environment;

  /**
   * @param {HTMLElement} element
   * @param {Eventful} [environment]
   */
  constructor(element, environment) {
    super(element, 'player');
    this._environment = environment;
  }

  /**
   * @param {boolean} [flag]
   * @param {boolean} [independently] toggling not within other process (change record, ...)
   */
  async togglePlaying(flag, independently = true) {
    if (flag === this.isPlaying()) return;
    if (isUndefined(flag)) {
      flag = !this.isPlaying();
    }

    independently && this._toggleCtrlsActivity(false, this._toggleCtrl);

    const trackNum = this._defineTrackNum();

    await (flag && this._toggleTonearmAnimation(true));
    this._currentTrack[flag ? 'play' : 'pause']();
    this._toggleVinylAnimation(flag);
    this._emit('playing:toggle', { trackNum, flag });
    await (!flag && this._toggleTonearmAnimation(false));

    if (independently) {
      this._toggleCtrlsActivity(true, this._toggleCtrl);
      this._toggleCtrl
        .querySelector('i')
        ?.classList.replace(
          flag ? 'fa-play' : 'fa-pause',
          flag ? 'fa-pause' : 'fa-play',
        );
    }
  }

  /**
   * @param {'previous'|'next'} dir
   * @param {boolean} [resume]
   */
  async changeRecord(dir, resume) {
    const recordElemChange2 = this._getRecordElemChange2(dir);
    this._emit('change-record:init', {
      trackNum: this._defineTrackNum(recordElemChange2),
    });

    this._toggleCtrlsActivity(false);
    Promise.all([
      this.togglePlaying(false, false),
      this._loadTrack(recordElemChange2),
      this._wait4envReady2changeRecord(),
    ]).then(async () => {
      this._emit('change-record:start');
      await this._toggleRecordEjectedAnimation(true);
      await this._changeRecordAnimation(dir);
      // HACK cause previuos await doesnt work(
      await delayer(2_000);
      // debugger;
      this._replaceCurrentRecordElem(dir);
      // XXX сброс разворота пластинки?
      // await wait4animated(this._currentRecordElem, 'transition');
      await this._toggleRecordEjectedAnimation(false);
      if (resume) {
        await this.togglePlaying(true);
      }
      this._toggleCtrlsActivity(true);
      this._emit('change-record:end');
    });
  }

  isPlaying() {
    return this._hasModification('playing');
  }

  _init() {
    this._changeRecordRotateAngle = 360 / this._records.length;
    this._container.addEventListener('click', (event) => {
      const element = /** @type {HTMLElement|undefined} */ (
        event.target
      )?.closest(`.${this._getElementCls('button')}`);
      if (!element) return;
      if (element === this._toggleCtrl) {
        this.togglePlaying();
      } else {
        this.changeRecord(
          element === this._nextCtrl ? 'next' : 'previous',
          this.isPlaying(),
        );
      }
    });
  }

  /**
   * @param {'previous'|'next'} dir
   */
  _replaceCurrentRecordElem(dir) {
    const currentElem = this._currentRecordElem;
    this._currentRecordElem.classList.remove(
      this._getElemModificationCls('record', 'settled'),
    );
    this._getRecordElemChange2(dir, currentElem).classList.add(
      this._getElemModificationCls('record', 'settled'),
    );
  }

  /**
   * @param {'previous'|'next'} dir
   * @param {HTMLElement} currentElem
   * @returns {HTMLElement}
   */
  _getRecordElemChange2(dir, currentElem = this._currentRecordElem) {
    let recordElem = /** @type {HTMLElement|undefined} */ (
      currentElem[`${dir}ElementSibling`]
    );
    recordElem ??= /** @type {HTMLElement} */ (
      dir == 'previous' ? last(this._records) : first(this._records)
    );
    return recordElem;
  }

  /**
   * @param {HTMLElement} recordElem
   * @returns
   */
  _loadTrack(recordElem) {
    const track = this._getTrack(recordElem);
    const loading = /** @type Promise<void> */ (
      new Promise((resolve, reject) => {
        track.addEventListener(
          'canplay',
          () => {
            this._emit('change-record:track-loaded');
            resolve();
          },
          { once: true },
        );
      })
    );
    track.setAttribute('preload', 'auto');
    track.load();
    return loading;
  }

  /**
   * @param {HTMLElement} recordElem
   * @returns {HTMLAudioElement}
   */
  _getTrack(recordElem) {
    return /** @type HTMLAudioElement */ (recordElem.querySelector('audio'));
  }

  /**
   * @returns {Promise<void>|null}
   */
  _wait4envReady2changeRecord() {
    return this.environment
      ? new Promise((resolve) => {
          this.environment?.once('ready2change-record', () => resolve());
        })
      : null;
  }

  /**
   * @param {boolean} flag
   */
  async _toggleTonearmAnimation(flag) {
    this._toggleModificator('prepared', flag);
    return cssAnimation(this._tonearm, 'transition');
  }

  /**
   * @param {boolean} flag
   */
  async _toggleVinylAnimation(flag) {
    this._toggleModificator('playing', flag);
  }

  /**
   * @param {boolean} flag
   */
  async _toggleRecordEjectedAnimation(flag) {
    this._toggleModificator('changing-record', flag);
    return cssAnimation(this._currentRecordElem, 'transition');
  }

  /**
   * @param {'previous'|'next'} dir
   */
  _changeRecordAnimation(dir) {
    this._emit('change-record:start-animation');
    const angle = /** @type number */ (this._changeRecordRotateAngle);
    const animation = rotateElement(
      this._getElement('playlist'),
      (dir == 'next' ? -1 : 1) * angle,
    );
    this._emit('change-record:end-animation');
    return animation;
  }

  /**
   * @param {boolean} flag
   * @param {HTMLElement} [control]
   */
  _toggleCtrlsActivity(flag, control) {
    if (control) {
      this._setElemActivity(control, 'button', flag);
    } else {
      this._setElemActivity(this._toggleCtrl, 'button', flag);
      this._setElemActivity(this._prevCtrl, 'button', flag);
      this._setElemActivity(this._nextCtrl, 'button', flag);
    }
  }

  /**
   * @param {HTMLElement} recordElem
   */
  _defineTrackNum(recordElem = this._currentRecordElem) {
    return indexOf(this._records, recordElem);
  }

  // get _tonearmTurnDuration() {
  //   const animationDelay = getComputedStyle(this._container)
  //     .getPropertyValue('--tonearm-turn-duration')
  //     .trim();
  //   return parseAnimationTime(animationDelay);
  // }

  // HACK
  // _reinitVinylAnimationDelay() {
  //   this._currentVinyl.classList.remove('rotatable');
  //   void this._currentVinyl.offsetWidth; // forced reflow
  //   this._currentVinyl.classList.add('rotatable');
  // }

  get _currentRecordElem() {
    return this._getElement('record', 'settled');
  }

  get _currentTrack() {
    return this._getTrack(this._currentRecordElem);
  }

  get _currentVinyl() {
    return /** @type HTMLElement */ (
      this._currentRecordElem.querySelector(
        `.${this._getElementCls('record-vinyl')}`,
      )
    );
  }

  get _tonearm() {
    return this._getElement('tonearm');
  }

  get _records() {
    return Array.from(this._getElements('record'));
  }

  get _toggleCtrl() {
    return this._getElement('button', 'ctrl_toggle');
  }

  get _prevCtrl() {
    return this._getElement('button', 'ctrl_prev');
  }

  get _nextCtrl() {
    return this._getElement('button', 'ctrl_next');
  }
}
