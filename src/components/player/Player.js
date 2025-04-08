import { find, first, includes, isUndefined, last } from 'lodash';
import Component from '../../app/Component';
import EventEmitter from '../../app/EventEmitter';
import { rotateElement, wait4animated } from '../../app/utils';

export default class Player extends Component {
  /** @type EventEmitter|undefined **/
  _environment;
  _changeRecordRotateAngle = 0;

  /**
   * @param {HTMLElement} element
   * @param {EventEmitter} [environment]
   */
  constructor(element, environment) {
    super(element, 'player');
    this._environment = environment;
  }

  get _currentTrack() {
    return this._getTrack(this._currentRecordElem);
  }

  get _currentRecordElem() {
    return this._getElement('record', 'settled');
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

  /**
   * @param {boolean} [flag]
   */
  async togglePlaying(flag) {
    if (flag === this.isPlaying()) return;
    if (isUndefined(flag)) {
      flag = !this.isPlaying();
    }

    this._toggleCtrl
      .querySelector('i')
      ?.classList.replace(
        flag ? 'fa-play' : 'fa-pause',
        flag ? 'fa-pause' : 'fa-play',
      );
    // this._setElemActivity(this._toggleCtrl, 'button', false);
    this._toggleCtrlsActivity(false, this._toggleCtrl);

    this._toggleModificator('playing', flag);
    await wait4animated(this._getElement('tonearm'), 'transition');

    this._currentTrack[flag ? 'play' : 'pause']();

    // this._setElemActivity(this._toggleCtrl, 'button', true);
    this._toggleCtrlsActivity(true, this._toggleCtrl);
  }

  // _tonearmAnimation() {
  //   return wait4animated(this._getElement('tonearm'), 'transition');
  // }

  /**
   * @param {'previous'|'next'} dir
   * @param {boolean} [resume]
   */
  async changeRecord(dir, resume) {
    this._emit('change-record:inited');
    this._toggleCtrlsActivity(false);

    const changingRecord = async () => {
      await this._toggleRecordEjectedAnimation(true);
      await this._changeRecordAnimation();
      this._replaceCurrentRecordElem(dir);
      // TODO сборос положения пластинки
      // await wait4animated(this._currentRecordElem, 'transition');
      await this._toggleRecordEjectedAnimation(false);
      if (resume) {
        await this.togglePlaying(true);
      }
      this._toggleCtrlsActivity(false);
      this._emit('change-record:end');
    };

    const recordElemChange2 = this._getRecordElemChange2(dir);
    Promise.all([
      this.togglePlaying(false),
      this._loadTrack(recordElemChange2),
    ]).then(() => {
      this._emit('change-record:start');
      if (this._environment) {
        this._environment?.once('ready2change-record', changingRecord);
      } else changingRecord();
    });
  }

  isPlaying() {
    return this._hasModification('playing');
  }

  _init() {
    this._changeRecordRotateAngle = 360 / this._getElements('record').length;
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
    this._currentRecordElem.classList.remove(
      this._getElemModificationCls('record', 'settled'),
    );
    // const newRecordElem = this._getNewRecordElem(dir);
    // newRecordElem?.classList.add(this._getElemModifCssCls('record', 'settled'));
    this._getRecordElemChange2(dir).classList.add(
      this._getElemModificationCls('record', 'settled'),
    );
  }

  /**
   * @param {'previous'|'next'} dir
   * @returns {HTMLElement}
   */
  _getRecordElemChange2(dir) {
    let recordElem = /** @type {HTMLElement|undefined} */ (
      this._currentRecordElem[`${dir}ElementSibling`]
    );
    recordElem ??= /** @type {HTMLElement} */ (
      dir == 'previous'
        ? last(this._getElements('record'))
        : first(this._getElements('record'))
    );
    return recordElem;
  }

  /**
   * @param {HTMLElement} recordElem
   * @returns {Promise<void>}
   */
  _loadTrack(recordElem) {
    const track = this._getTrack(recordElem);
    track.setAttribute('preload', 'auto');
    track.load();
    return new Promise((resolve) => {
      track.addEventListener(
        'canplay',
        () => {
          this._emit('change-record:track-loaded');
          resolve();
        },
        { once: true },
      );
    });
  }

  /**
   * @param {HTMLElement} recordElem
   * @returns {HTMLAudioElement}
   */
  _getTrack(recordElem) {
    return /** @type HTMLAudioElement */ (recordElem.querySelector('audio'));
  }

  /**
   * @param {boolean} flag
   */
  async _toggleRecordEjectedAnimation(flag) {
    this._toggleModificator('changing-record', flag);
    await wait4animated(this._currentRecordElem, 'transition');
  }

  async _changeRecordAnimation() {
    this._emit('change-record:start-animation');
    await rotateElement(
      this._getElement('playlist'),
      this._changeRecordRotateAngle,
    );
    this._emit('change-record:end-animation');
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
}
