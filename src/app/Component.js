import { castArray, isUndefined } from 'lodash';
import EventEmitter from './EventEmitter';

export default class Component {
  /** @type HTMLElement **/
  _container;
  /** @type string **/
  _name;
  _emitter = new EventEmitter();

  /**
   * @param {HTMLElement} element
   * @param {string} name
   */
  constructor(element, name) {
    this._container = element;
    this._name = name;
    this._init();
  }

  get name() {
    return this._name;
  }

  _init() {}

  /**
   * @param {HTMLElement|null} element
   * @param {string} elemName
   * @param {boolean} flag
   */
  _setElemActivity(element, elemName, flag) {
    if (element) {
      element.classList.toggle('inactive', !flag);
      element.classList.toggle(
        this._getElemModificationCls(elemName, 'inactive'),
        !flag,
      );

      if (
        element instanceof HTMLButtonElement ||
        element instanceof HTMLInputElement
      ) {
        element.disabled = flag;
      }
    }
  }

  /**
   * @param {string} eventName
   */
  _emit(eventName) {
    this._emitter.trigger(`${this.name}:${eventName}`);
  }

  /**
   * @param {string} name
   * @param {string} [modificator]
   * @returns {HTMLElement}
   */
  _getElement(name, modificator) {
    return this._getElements(name, modificator)[0];
  }

  /**
   * @param {string} name
   * @param {string} [modificator]
   * @returns {HTMLElement[]}
   */
  _getElements(name, modificator) {
    return Array.from(
      modificator
        ? this._container.querySelectorAll(
            `.${this._getElemModificationCls(name, modificator)}`,
          )
        : this._container.querySelectorAll(`.${this._getElementCls(name)}`),
    );
  }

  /**
   * @param {string} elemName
   * @returns {string}
   */
  _getElementCls(elemName) {
    return `${this.name}__${elemName}`;
  }

  /**
   * @param {string} name
   * @param {boolean} flag
   */
  _toggleModificator(name, flag) {
    this._container.classList.toggle(this._getModificationCls(name), flag);
  }

  /**
   * @param {string} modificator
   */
  _hasModification(modificator) {
    return this._container.classList.contains(
      this._getModificationCls(modificator),
    );
  }

  /**
   * @param {string} modificator
   * @returns {string}
   */
  _getModificationCls(modificator) {
    return `${this.name}_${modificator}`;
  }

  /**
   * @param {string} elemName
   * @param {string} modificator
   * @returns {string}
   */
  _getElemModificationCls(elemName, modificator) {
    return `${this._getElementCls(elemName)}_${modificator}`;
  }

  /**
   * @param {HTMLElement} element
   * @param {string} name
   */
  _isElementOf(element, name) {
    return element.classList.contains(this._getElementCls(name));
  }

  /**
   * @param {HTMLElement} element
   * @param {string} elemName
   * @param {string} modificator
   */
  _isElemModificationOf(element, elemName, modificator) {
    return element.classList.contains(
      this._getElemModificationCls(elemName, modificator),
    );
  }
}
