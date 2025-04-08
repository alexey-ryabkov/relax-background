// /**
//  * @param {number} angle
//  * @returns
//  */
// export function rotateElement(angle) {
//   /** @type HTMLElement|null **/
//   const element = document.querySelector('.element');
//   if (!element) return;
//   const currentRotation = getRotation(element);
//   const newRotation = currentRotation + angle;
//   element.style.transform = `rotate(${newRotation}deg)`;
// }
//  * @param {number} [duration] in seconds, if transition not defined in css

import { delay } from 'lodash';

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
    element.style.rotate = `${angle}deg`;
    return wait4animated(element, 'transition');
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
export const wait4animated = (element, type = 'animation') => {
  return new Promise((resolve) => {
    element.addEventListener(`${type}end`, () => resolve(), { once: true });
  });
};

// /**
//  * @param {HTMLElement} element
//  * @returns {number}
//  */
// function getRotation(element) {
//   const transform = window.getComputedStyle(element).transform;
//   if (transform === 'none') return 0;

//   const matrix = transform.match(/^matrix\((.+)\)$/);
//   if (!matrix) return 0;

//   const values = matrix[1].split(', ');
//   const a = parseFloat(values[0]);
//   const b = parseFloat(values[1]);

//   return Math.round(Math.atan2(b, a) * (180 / Math.PI));
// }
