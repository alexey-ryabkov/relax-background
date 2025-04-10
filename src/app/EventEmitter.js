export default class EventEmitter {
  /** @type Events */
  _events = {};
  /** @type Events */
  _onceEvents = {};

  /** @type EventHandlerMethod */
  on(event, listener) {
    if (!this._events[event]) {
      this._events[event] = [];
    }
    this._events[event].push(listener);
    // return this;
  }

  /** @type EventHandlerMethod */
  once(event, listener) {
    if (!this._events[event]) {
      this._onceEvents[event] = [];
    }
    this._onceEvents[event].push(listener);
    // return this;
  }

  /**
   * @param {string} event
   * @param {...any} args
   */
  trigger(event, ...args) {
    if (this._events[event]) {
      this._events[event].forEach((listener) => {
        listener(...args);
      });
    }
    if (this._onceEvents[event]) {
      this._onceEvents[event].forEach((listener) => {
        listener(...args);
      });
      this._onceEvents[event] = [];
    }
  }

  /** @type EventHandlerMethod */
  off(event, listener) {
    if (this._events[event]) {
      this._events[event] = this._events[event].filter((l) => l !== listener);
    }
    if (this._onceEvents[event]) {
      this._onceEvents[event] = this._onceEvents[event].filter(
        (l) => l !== listener,
      );
    }
    // return this;
  }
}
