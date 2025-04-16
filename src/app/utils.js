import { delay, endsWith, flatMap, times, toNumber, trimEnd } from 'lodash';
import playlist from '../playlist.json';

const _FAKE_PLAYLIST_MULTIPLIER = 4;

/**
 * @param {number} time
 * @param {Callable} [cb]
 * @returns {Promise<void>}
 */
export function delayer(time, cb) {
  return new Promise((resolve) =>
    delay(() => {
      cb?.();
      resolve();
    }, time),
  );
}

/**
 * @param {HTMLElement} element
 * @param {number} angle in degrees
 * @param {number} [duration] in ms, if transition not defined in css
 * @param {string} [easing] easing func, if transition not defined in css
 * @returns
 */
export function rotateElement(
  element,
  angle,
  duration,
  easing = 'ease-in-out',
) {
  const currentAngle = getRotation(element);
  if (duration) {
    return element.animate(
      [
        { transform: `rotate(${currentAngle}deg)` },
        { transform: `rotate(${currentAngle + angle}deg)` },
      ],
      {
        duration,
        easing,
      },
    ).finished;
  } else {
    element.style.transform = `rotate(${currentAngle + angle}deg)`;
    return cssAnimation(element, 'transition');
  }
}

/**
 * @param {HTMLElement} element
 * @returns {number}
 */
export function getRotation(element) {
  const { transform } = window.getComputedStyle(element);
  if (transform === 'none') return 0;
  const matrix = transform
    .split('(')[1]
    .split(')')[0]
    .split(', ')
    .map((item) => +item);
  const angle = Math.atan2(matrix[1], matrix[0]) * (180 / Math.PI);
  return angle;
}

/**
 * @param {HTMLElement} element
 * @param {'animation'|'transition'} type
 * @returns {Promise<void>}
 */
export const cssAnimation = (element, type = 'animation') => {
  return new Promise((resolve) => {
    element.addEventListener(`${type}end`, () => resolve(), { once: true });
  });
};

/**
 * @returns {Playlist}
 */
export const getPlaylist = () =>
  flatMap(times(_FAKE_PLAYLIST_MULTIPLIER), () => playlist);

/**
 * @param {number} trackNum
 * @returns {Track|null}
 */
export const getTrack = (trackNum) => getPlaylist()[trackNum] ?? null;

/**
 * @param {string} str
 * @returns number
 */
export const parseAnimationTime = (str) => {
  if (endsWith(str, 'ms')) return toNumber(trimEnd(str, 'ms'));
  if (endsWith(str, 's')) return toNumber(trimEnd(str, 's')) * 1_000;
  return 0;
};
