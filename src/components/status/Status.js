import Component from '../../app/Component';

export default class Status extends Component {
  /**
   * @readonly
   * @protected
   */
  static _DEFAULT_STATUS = 'Трек не установлен';
  /**
   * @readonly
   * @protected
   */
  static _TRACK_SETTLED_STATUS = 'Установлен трек';
  /**
   * @readonly
   * @protected
   */
  static _TRACK_LOADING_STATUS = 'Загружается трек';
  /**
   * @readonly
   * @protected
   */
  static _TRACK_LOADED_STATUS = 'Загружен трек';
  /**
   * @readonly
   * @protected
   */
  static _TRACK_PLAYING_STATUS = 'Проигрывается трек';
  /**
   * @type Track|null
   */
  _currentTrack = null;
  // /** @type Eventful|undefined **/
  // _environment;

  // /**
  //  * @param {HTMLElement} element
  //  * @param {Eventful} [environment]
  //  */
  // constructor(element, environment) {
  //   super(element, 'status');
  //   if (environment) {
  //     this.environment = environment;
  //   }
  // }
  /**
   * @param {HTMLElement} element
   */
  constructor(element) {
    super(element, 'status');
  }

  get _title() {
    return /** @type HTMLVideoElement */ (this._getElement('title'));
  }

  get _titleText() {
    return /** @type HTMLVideoElement */ (this._getElement('title-text'));
  }

  get _trackTitle() {
    return /** @type HTMLVideoElement */ (this._getElement('track-title'));
  }

  get _trackLicence() {
    return /** @type HTMLVideoElement */ (this._getElement('track-licence'));
  }

  /**
   * @param {Track|null} track
   */
  set track(track) {
    this._currentTrack = track;
    const { title = '', licence = '' } = track ?? {};
    this._trackTitle.textContent = title;
    this._trackLicence.textContent = licence;
    this._titleText.textContent = track
      ? Status._TRACK_SETTLED_STATUS
      : Status._DEFAULT_STATUS;
  }

  /**
   * @param {boolean} flag
   */
  togglePlaying(flag) {
    if (this._currentTrack) {
      this._titleText.textContent = flag
        ? Status._TRACK_PLAYING_STATUS
        : Status._TRACK_LOADED_STATUS;
    }
  }

  /**
   * @param {boolean} flag
   */
  toggleLoading(flag) {
    this._title.classList.toggle(
      this._getElemModificationCls('title-text', 'loading'),
      flag,
    );
    this._titleText.textContent = flag
      ? Status._TRACK_LOADING_STATUS
      : Status._TRACK_LOADED_STATUS;
  }

  _init() {
    this._titleText.textContent = Status._DEFAULT_STATUS;
  }
}
