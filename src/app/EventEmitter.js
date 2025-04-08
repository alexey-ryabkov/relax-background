export default class EventEmitter {
  /** @type Events */
  events = {};
  /** @type Events */
  onceEvents = {};
  /** @type string[] */

  /**
   * @param {string} event
   * @param {EventHandler} listener
   */
  on(event, listener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }

  /**
   * @param {string} event
   * @param {EventHandler} listener
   */
  once(event, listener) {
    if (!this.events[event]) {
      this.onceEvents[event] = [];
    }
    this.onceEvents[event].push(listener);
  }

  /**
   * @param {string} event
   * @param {...any} args
   */
  trigger(event, ...args) {
    if (this.events[event]) {
      this.events[event].forEach((listener) => {
        listener(...args);
      });
    }
    if (this.onceEvents[event]) {
      this.onceEvents[event].forEach((listener) => {
        listener(...args);
      });
      this.onceEvents[event] = [];
    }
  }

  /**
   * @param {string} event
   * @param {EventHandler} listener
   */
  off(event, listener) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter((l) => l !== listener);
    }
    if (this.onceEvents[event]) {
      this.onceEvents[event] = this.onceEvents[event].filter(
        (l) => l !== listener,
      );
    }
  }
}
