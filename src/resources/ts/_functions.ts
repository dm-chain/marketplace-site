import { siteUrl } from 'src/config/auth';

/**
 * @return {Boolean}
 */
export function isMobileDevice() {
  return typeof window.orientation !== 'undefined' || navigator.userAgent.indexOf('IEMobile') !== -1;
}

/**
 * @param {Element} element
 *
 * @return {Array}
 */
export function getSiblings(element: HTMLElement): HTMLElement[] | null {
  return element.parentNode ? Array.prototype.filter.call(element.parentNode.children, sibling => sibling !== element) : null;
}

/**
 * @param {Number} n
 *
 * @return {String}
 */
export function numberThousandSeparator(n: number) {
  return n.toString().replace(/(\d)(?=(\d{3})+([^\d]|$))/g, '$1 ');
}

/**
 * @param {Element} element
 *
 * @return {Boolean}
 */
export function isDomElement(element: Element | HTMLDocument) {
  return element instanceof Element || element instanceof HTMLDocument;
}
