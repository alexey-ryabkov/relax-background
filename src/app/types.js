/**
 * @callback EventHandler
 * @param {...any} args
 * @returns {void}
 */

/**
 * @typedef {(eventName: string, listener: EventHandler) => void} EventHandlerMethod
 */

/**
 * @typedef {Object.<string, EventHandler[]>} Events
 */

/**
 * @callback Callable
 * @param {...any} args
 * @returns {any}
 */

/**
 * @typedef {Object} TrackTheme
 * @property {string} color
 */

/**
 * @typedef {Object} Track
 * @property {string} title
 * @property {string} audio
 * @property {string} video
 * @property {string} [licence]
 * @property {string} [label]
 * @property {TrackTheme} [theme]
 */

/**
 * @typedef {Track[]} Playlist
 */

/**
 * @typedef {Object} Eventful
 * @property {EventHandlerMethod} on
 * @property {EventHandlerMethod} off
 * @property {EventHandlerMethod} once
 */

// /**
//  * @interface
//  */
// function Eventful() {}
// /**
//  * @function
//  * @name Eventful#on
//  * @param {string} event
//  * @param {EventHandlerMethod} handler
//  */
// /**
//  * @function
//  * @name Eventful#off
//  * @param {string} event
//  * @param {EventHandlerMethod} handler
//  */
// /**
//  * @function
//  * @name Eventful#once
//  * @param {string} event
//  * @param {EventHandlerMethod} handler
//  */

// /**
//  * @enum {string}
//  */
// export const Statuses = {
//   IDLE: 'idle',
//   PLAYING: 'playing',
//   SETTLED: 'paused',
//   LOADING: 'paused',
// };
